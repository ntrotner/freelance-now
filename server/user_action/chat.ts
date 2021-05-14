import { Chat } from '../database/schemas/chat_schema';
import { Types } from 'mongoose';
import { error } from '../routes';
import { IChat } from '../database/interfaces/chat_interface';
import { isEMail, validMessage } from '../components/validator';
import { findUser } from '../user_authentication/user_control';
import { isAuthenticated } from '../user_authentication/session_manager';

/**
 * check and return if chat between two participants exists
 *
 * @param from
 * @param to
 */
export async function existsChat(from: string, to: string): Promise<IChat> {
  return Chat.findOne({
    participants: {$all: [Types.ObjectId(from), Types.ObjectId(to)]}
  });
}

/**
 * get all chats where user is participating
 *
 * @param from
 */
export async function allChats(from: string): Promise<IChat[]> {
  return Chat.find({
    participants: {$in: [Types.ObjectId(from)]}
  });
}

/**
 * send cleaned list of chats with other users, so only email and name is transfered
 *
 * @param req
 * @param res
 */
export async function sendActiveChats(req, res) {
  if (!isAuthenticated(req)) return error(req, res, 'Nicht Authentifiziert');

  // get all chats of current user
  const chats = await allChats(req.session._id);

  const allParticipants = {};
  for (const chat of chats) {
    for (const participant of chat.participants) {
      // skip own id
      if (String(participant) === String(req.session._id)) continue;

      // if user isn't listed in participant object then add them
      if (!allParticipants[String(participant)]) {
        const foundUser = await findUser({_id: participant});
        allParticipants[String(foundUser._id)] = {username: foundUser.username, email: foundUser.email};
      }
    }
  }

  res.status(200).json({chats: Object.values(allParticipants)});
}

/**
 * send whole chat log to requester
 *
 * @param req
 * @param res
 * @param chat - optional
 */
export async function sendWholeChat(req, res, chat?: IChat) {
  if (chat) {
    // send whole chat with a chat that has been passed before
    await sendChatUpdate(req, res, {chat, index: 0});
  } else {
    await sendChatUpdate(req, res);
  }
}

/**
 * send chat log which is chat.js friendly
 * this also includes from which index the messages are included
 *
 * @param req
 * @param res
 * @param options
 */
export async function sendChatUpdate(req, res, options?: { chat: IChat, index: number }) {
  let chat: IChat;
  let index: number;

  if (!options) {
    const toUser = await findUser({email: req.body.to});
    if (!toUser) return error(req, res, 'Empfänger existiert nicht');
    chat = await existsChat(req.session._id, toUser._id);

    // if index was passed through body then check for validity and set it
    index = (req.body.index && (chat.messages.length - 1) <= Number(req.body.index)) ? Number(req.body.index) : 0;
  } else {
    chat = options.chat;
    index = options.index;
  }

  const messages = chat.messages.splice(index).map((input) => {
    return {
      // check if message was sent by requester
      ownMessage: String(req.session._id) === String(input.from),
      date: input.date,
      message: input.message
    };
  });

  res.status(200).json({update: messages});
}

/**
 * add message to chat
 *
 * @param req
 * @param res
 */
export async function addMessage(req, res) {
  if (!validMessage(req.body) || !isAuthenticated(req)) return error(req, res, 'Anfrage ungültig');
  const foundUser = await findUser({email: req.body.to});
  if (!foundUser) return error(req, res, 'Nutzer nicht gefunden');

  const existiertChat = await existsChat(req.session._id, foundUser._id);
  if (!existiertChat) return error(req, res, 'Chat existiert nicht');

  // add message to array
  existiertChat.messages.push({from: req.session._id, date: new Date(), message: req.body.message});
  await existiertChat.save();

  // send update to client starting with the index of the local length
  await sendChatUpdate(req, res, {chat: existiertChat, index: req.body.index ? req.body.index : 0});
}

/**
 * create new chat object and send the chat to the requester
 *
 * @param req
 * @param res
 */
export async function startChat(req, res) {
  if (!isEMail(req.body.to) || (req.session.email === req.body.to)) return error(req, res, 'Empfänger ungültig');
  const toUser = await findUser({email: req.body.to});
  if (!toUser) return error(req, res, 'Nutzer nicht gefunden');

  // check if chat exists already and send it if it does
  const existiertChat = await existsChat(req.session._id, toUser._id);
  if (existiertChat) return sendWholeChat(req, res, existiertChat);

  // create new chat
  const newChat = new Chat({
    participants: [Types.ObjectId(req.session._id), Types.ObjectId(toUser._id)],
    messages: []
  });

  // save and send the new chat
  await newChat.populate('client').populate('developer').save();
  await sendWholeChat(req, res, newChat);
}

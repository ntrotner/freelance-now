import { Chat } from '../database/schemas/chat_schema';
import { Schema, Types } from 'mongoose';
import { error } from '../routes';
import { IChat } from '../database/interfaces/chat_interface';
import { isASCII, isEMail, validMessage } from '../components/validator';
import { findUser } from '../user_authentication/user_control';
import { isAuthenticated } from '../user_authentication/session_manager';

export async function existsChat(from: string, to: string): Promise<IChat> {
  return Chat.findOne({
    participants: {$all: [Types.ObjectId(from), Types.ObjectId(to)]}
  });
}

export async function allChats(from: string): Promise<IChat[]> {
  return Chat.find({
    participants: {$in: [Types.ObjectId(from)]}
  });
}

export async function sendActiveChats(req, res) {
  if (!isAuthenticated(req)) return error(req, res, 'Nicht Authentifiziert');

  const chats = await allChats(req.session._id);
  const allParticipants = {}
  for (let chat of chats) {
    for (let participant of chat.participants) {
      if (!allParticipants[String(participant)]) {
        const foundUser = await findUser({_id: participant});
        allParticipants[String(foundUser._id)] = {username: foundUser.username, email: foundUser.email}
      }
    }
  }
  delete allParticipants[req.session._id]

  res.status(200).json({chats: Object.values(allParticipants)})
}

export async function sendWholeChat(req, res, chat?: IChat) {
  if (chat) {
    sendChatUpdate(req, res, {chat, index: 0});
  } else {
    sendChatUpdate(req, res);
  }
}

export async function sendChatUpdate(req, res, options?: { chat: IChat, index: number }) {
  let chat: IChat;
  let index: number;
  if (!options) {
    const toUser = await findUser({email: req.body.to});
    if (!toUser) return error(req, res, 'Empfänger existiert nicht')
    chat = await existsChat(req.session._id, toUser._id);

    if (req.body.index) index = Number(req.body.index)
    else index = 0
  } else {
    chat = options.chat;
    index = options.index;
  }

  const messages = chat.messages.map((input) => {
    return {
      ownMessage: String(req.session._id) === String(input.from) ? true : false,
      date: input.date,
      message: input.message
    }
  });

  res.status(200).json({update: messages})
}

export async function addMessage(req, res) {
  if (!validMessage(req.body) || !isAuthenticated(req)) return error(req, res, 'Anfrage ungültig')
  const foundUser = await findUser({email: req.body.to})
  if (!foundUser) return error(req, res, 'Nutzer nicht gefunden');

  const existiertChat = await existsChat(req.session._id, foundUser._id);
  if (!existiertChat) return error(req, res, 'Chat existiert nicht')

  const newLength = existiertChat.messages.push({from: req.session._id, date: new Date(), message: req.body.message});
  await existiertChat.save();
  sendChatUpdate(req, res, {chat: existiertChat, index: 0})
}

export async function startChat(req, res) {
  if (!isEMail(req.body.to) || (req.session.email === req.body.to)) return error(req, res, 'Empfänger ungültig')
  const toUser = await findUser({email: req.body.to});
  if (!toUser) return error(req, res, 'Nutzer nicht gefunden');

  const existiertChat = await existsChat(req.session._id, toUser._id);
  if (existiertChat) return sendWholeChat(req, res, existiertChat);

  const newChat = new Chat({
    participants: [Types.ObjectId(req.session._id), Types.ObjectId(toUser._id)],
    messages: []
  });
  await newChat.populate('client').populate('developer').save();

  sendWholeChat(req, res, newChat);
}

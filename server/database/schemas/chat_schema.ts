import { model, Model, Schema } from 'mongoose';
import { Chat_Definitions, IChat } from '../interfaces/chat_interface';


const ChatSchema: Schema = new Schema({
  ...Chat_Definitions,
});

export const Chat: Model<IChat> = model('chat', ChatSchema);

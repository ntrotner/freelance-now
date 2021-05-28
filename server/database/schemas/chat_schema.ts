import { model, Model, Schema } from 'mongoose';
import { ChatDefinitions, IChat } from '../interfaces/chat_interface';

const ChatSchema: Schema = new Schema({
  ...ChatDefinitions
});

export const Chat: Model<IChat> = model('chat', ChatSchema);

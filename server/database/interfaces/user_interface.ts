import { Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  password_hash: string;
  about: string;
}

export const User_Definitions = {
  username: {type: String, required: true},
  email: {type: String, required: true},
  password_hash: {type: String, required: true},
  about: {type: String, required: false, default: 'Ich bin ein Platzhalter :)'}
};

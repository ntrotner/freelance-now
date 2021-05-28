import { Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  passwordHash: string;
  about: string;
}

export const UserDefinitions = {
  username: {type: String, required: true},
  email: {type: String, required: true},
  passwordHash: {type: String, required: true},
  about: {type: String, required: false, default: 'Ich bin ein Platzhalter :)'}
};

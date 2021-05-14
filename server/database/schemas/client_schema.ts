import { model, Model, Schema } from 'mongoose';
import { User_Definitions } from '../interfaces/user_interface';
import { IClient } from '../interfaces/client_interface';

const ClientSchema: Schema = new Schema({
  ...User_Definitions
});

export const Client: Model<IClient> = model('client', ClientSchema);

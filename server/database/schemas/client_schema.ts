import { model, Model, Schema } from 'mongoose';
import { UserDefinitions } from '../interfaces/user_interface';
import { IClient } from '../interfaces/client_interface';

const ClientSchema: Schema = new Schema({
  ...UserDefinitions
});

export const Client: Model<IClient> = model('client', ClientSchema);

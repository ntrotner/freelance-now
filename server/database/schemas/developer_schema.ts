import { model, Model, Schema } from 'mongoose';
import { UserDefinitions } from '../interfaces/user_interface';
import { IDeveloper } from '../interfaces/developer_interface';

const DeveloperSchema: Schema = new Schema({
  ...UserDefinitions,
  stack: {type: Array, required: false, default: []},
  git: {type: String, required: false, default: ''},
  merchant: {type: String, required: false, default: ''}
});

export const Developer: Model<IDeveloper> = model('developer', DeveloperSchema);

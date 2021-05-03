import { model, Model, Schema } from 'mongoose';
import { User_Definitions } from '../interfaces/user_interface';
import { IDeveloper } from '../interfaces/developer_interface';


const DeveloperSchema: Schema = new Schema({
  ...User_Definitions,
  stack: {type: Array, required: false, default: []},
  pastContracts: {type: Schema.Types.ObjectId, ref: 'contract'},
  git: {type: String, required: false, default: ''}
});

export const Developer: Model<IDeveloper> = model('developer', DeveloperSchema);

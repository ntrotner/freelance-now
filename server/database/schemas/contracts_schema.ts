import { model, Model, Schema } from 'mongoose';
import { Contract_Definitions, IContract } from '../interfaces/contract_interface';

const ContractSchema: Schema = new Schema({
  ...Contract_Definitions
});

export const Contract: Model<IContract> = model('contract', ContractSchema);

import { model, Model, Schema } from 'mongoose';
import { ContractDefinitions, IContract } from '../interfaces/contract_interface';

const ContractSchema: Schema = new Schema({
  ...ContractDefinitions
});

export const Contract: Model<IContract> = model('contract', ContractSchema);

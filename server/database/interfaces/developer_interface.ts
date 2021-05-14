import { IUser } from './user_interface';
import { IContract } from './contract_interface';

export interface IDeveloper extends IUser {
  stack: Array<string>,
  pastContracts: Array<IContract>,
  git: string,
  merchant: string
}

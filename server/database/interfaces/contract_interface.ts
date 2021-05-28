import { Document, Types, Schema } from 'mongoose';

export interface IContract extends Document {
  client: Types.ObjectId,
  developer: Types.ObjectId,
  name: string,
  reward: number,
  isDone: boolean,
  isPaid: boolean,
  details: {
    stack: Array<string>,
    description: string
  },
  startingDate: Date,
  endDate: Date,
  rating: {
    requirementsFulfilled: boolean,
    communication: number,
    speed: number,
    quality: number
  },
  potentialDevelopers: Array<{ email: string, reward: number }>
}

export const ContractDefinitions = {
  client: {type: Schema.Types.ObjectId, ref: 'client'},
  developer: {type: Schema.Types.ObjectId, ref: 'developer', required: false},
  name: {type: String, required: true},
  reward: {type: Number, required: true},
  isDone: {type: Boolean, required: false, default: false},
  isPaid: {type: Boolean, required: false, default: false},
  details: {
    type: {stack: Array, description: String},
    required: false,
    default: {stack: [], description: ''}
  },
  startingDate: {type: Date, required: true},
  endDate: {type: Date, required: true},
  rating: {
    type: {
      requirementsFulfilled: Boolean,
      communication: Number,
      speed: Number,
      quality: Number
    },
    required: false,
    default: {requirementsFulfilled: null, communication: null, speed: null, quality: null}
  },
  potentialDevelopers: {type: Array, required: false, default: []}
};

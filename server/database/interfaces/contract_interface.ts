import { Document, Types, Schema } from 'mongoose';


export interface IContract extends Document {
  client: Types.ObjectId,
  developer: Types.ObjectId,
  name: string,
  reward: number,
  isDone: boolean,
  details: {
    stack: Array<string>,
    description: string
  },
  starting_date: Date,
  end_date: Date,
  rating: {
    requirements_fulfilled: boolean,
    communication: number,
    speed: number,
    quality: number
  },
  potentialDevelopers: Array<{ email: string, reward: number }>
}

export const Contract_Definitions = {
  client: {type: Schema.Types.ObjectId, ref: 'client'},
  developer: {type: Schema.Types.ObjectId, ref: 'developer', required: false},
  name: {type: String, required: true},
  reward: {type: Number, required: true},
  isDone: {type: Boolean, required: false, default: false},
  details: {
    type: {stack: Array, description: String},
    required: false,
    default: {stack: [], description: ''}
  },
  starting_date: {type: Date, required: true},
  end_date: {type: Date, required: true},
  rating: {
    type: {
      requirements_fulfilled: Boolean,
      communication: Number,
      speed: Number,
      quality: Number
    },
    required: false,
    default: {requirements_fulfilled: null, communication: null, speed: null, quality: null}
  },
  potentialDevelopers: {type: Array, required: false, default: []}
}

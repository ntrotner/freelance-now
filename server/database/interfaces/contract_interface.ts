import { Document, Schema } from 'mongoose';


export interface IContract extends Document {
  client: Schema.Types.ObjectId,
  developer: Schema.Types.ObjectId,
  name: string,
  reward: number,
  isDone: boolean,
  details: {
    stack: Array<string>,
    git: string,
    stage: string
  },
  starting_date: Date,
  end_date: Date,
  rating: {
    requirements_fulfilled: boolean,
    communication: number,
    speed: number,
    quality: number
  };
}

export const Contract_Definitions = {
  client: {type: Schema.Types.ObjectId, ref: 'client'},
  developer: {type: Schema.Types.ObjectId, ref: 'developer'},
  name: {type: String, required: true},
  reward: {type: Number, required: true},
  isDone: {type: Boolean, required: false, default: false},
  details: {
    type: {stack: Array, git: String, stage: String},
    required: false,
    default: {stack: [], git: '', stage: 'Not Started'}
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
}

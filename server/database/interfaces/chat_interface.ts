import { Document, Schema, Types } from 'mongoose'

export interface IChat extends Document {
  participants: Array<Types.ObjectId>,
  messages: Array<{ from: Schema.Types.ObjectId, date: Date, message: string }>,
}

export const Chat_Definitions = {
  participants: { type: Array, required: true },
  messages: { type: [{ from: Schema.Types.ObjectId, date: Date, message: String }], required: false, default: [] }
}

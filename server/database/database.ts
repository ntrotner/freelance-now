export import mongoose = require('mongoose');


/**
 * connect to mongodb database
 */
export function connectDB(): void {
  mongoose.connection.once('open', function () {
    console.log('Mongoose successfully connected');
  });
  mongoose.connect(
      'mongodb://mongodb:27017/freelance',
      {useNewUrlParser: true, useUnifiedTopology: true})
      .catch((err: { message: string; }) => console.log(err.message));
}

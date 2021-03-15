const { model, Schema } = require('mongoose');

const postSchema = new Schema({
  
  content: String,
  email:String,
  createdAt: String,
  comments: [
    {
      content: String,
      email: String,
      createdAt: String
    }
  ],
  likes: [
    {
      email: String,
      createdAt: String
    }
  ],

  
});

module.exports = model('Post', postSchema);

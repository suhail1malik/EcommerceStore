import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`Successfully connnected to mongoDB 👍`);
  } catch (error) {
    console.error(`ERROR: ${error.message} 👎`);
    process.exit(1);
  }
};

export default connectDB;

//Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js. It provides a schema-based solution to model your application data. Mongoose allows you to define schemas for your data, which can include validation, default values, and other features. It also provides a powerful query language and middleware support for pre- and post-processing of data.

//MongoDB is a NoSQL database that uses a document-oriented data model. It stores data in flexible, JSON-like documents, which makes it easy to work with and scale. MongoDB is designed for high availability and scalability, making it a popular choice for modern web applications.
//Mongoose is built on top of the MongoDB driver for Node.js, which means it provides a higher-level abstraction for working with MongoDB. Mongoose allows you to define models, which are JavaScript objects that represent your data and provide methods for querying and manipulating it. Mongoose also provides features like middleware, which allows you to run custom logic before or after certain operations, and population, which allows you to reference documents in other collections.
//In summary, Mongoose is a powerful library that simplifies working with MongoDB in Node.js applications. It provides a schema-based approach to modeling data, validation, and other features that make it easier to work with Mong
// const mongoose = require('mongoose');

// // Connect to MongoDB
// mongoose.connect('mongodb://127.0.0.1:27017/testssds', { useNewUrlParser: true, useUnifiedTopology: true });

// // Define a schema
// const kittySchema = new mongoose.Schema({
// name: String
// });

// // Compile schema into a model
// const Kitten = mongoose.model('Kitten', kittySchema);

// // Create a new kitten document
// const silence = new Kitten({ name: 'Silence' });
// console.log(silence.name); // 'Silence'

// // Save the kitten to the database
// silence.save().then(() => console.log('Kitten saved!'));

// Create a new blog post
// const newPost = new Blog({ title: 'My First Post', author: 'John Doe', content: 'Hello World!', published: true });
// newPost.save();

// // Find a blog post by ID
// Blog.findById('60c72b2f9b1d4c3a4c8e4d3b').then(post => console.log(post));

// // Update a blog post
// Blog.updateOne({ _id: '60c72b2f9b1d4c3a4c8e4d3b' }, { title: 'Updated Title' }).then(() => console.log('Post updated'));

// // Delete a blog post
// Blog.deleteOne({ _id: '60c72b2f9b1d4c3a4c8e4d3b' }).then(() => console.log('Post deleted'));

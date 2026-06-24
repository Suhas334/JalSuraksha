const mongoose = require('mongoose');
const dns = require('dns');

dns.setServers(['8.8.8.8', '8.8.4.4']);

const connectDB = async () => {
  let mongoUri = process.env.MONGO_URI;

  if (mongoUri) {
    try {
      console.log('Attempting to connect to MongoDB Atlas...');
      const conn = await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 10000 });
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return;
    } catch (error) {
      console.error(`Atlas connection failed: ${error.message}`);
      console.log('Falling back to in-memory MongoDB...');
    }
  }

  try {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mongod = await MongoMemoryServer.create();
    mongoUri = mongod.getUri();
    console.log(`In-memory MongoDB started at: ${mongoUri}`);
    global.__MONGOD__ = mongod;
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected (in-memory): ${conn.connection.host}`);
  } catch (error) {
    console.error(`In-memory MongoDB also failed: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;

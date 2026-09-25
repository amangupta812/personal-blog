import mongoose from 'mongoose';

let mongoMemoryServer = null;

export const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/personal_blog';

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500,
    });
    console.log(`[MongoDB] Connected successfully to: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (err) {
    console.warn(`[MongoDB] Direct connection to ${uri} failed: ${err.message}`);
    console.log('[MongoDB] Booting fallback in-memory MongoDB instance for zero-config local development...');

    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      mongoMemoryServer = await MongoMemoryServer.create({
        instance: {
          dbName: 'personal_blog',
        },
      });
      const memUri = mongoMemoryServer.getUri();
      const conn = await mongoose.connect(memUri);
      console.log(`[MongoDB] Connected to Fallback In-Memory MongoDB at: ${memUri}`);
      console.log('[MongoDB] Note: To persist data across restarts, start MongoDB service or add your MongoDB Atlas URI in server/.env');
      return conn;
    } catch (memErr) {
      console.error(`[MongoDB] In-memory fallback failed: ${memErr.message}`);
      throw memErr;
    }
  }
};

export const closeDB = async () => {
  await mongoose.disconnect();
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
  }
};

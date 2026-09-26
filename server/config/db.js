import mongoose from 'mongoose';

let mongoMemoryServer = null;

export const connectDB = async () => {
  const uri = process.env.MONGO_URI || '';

  if (!uri) {
    console.warn('[MongoDB] No MONGO_URI provided in server/.env');
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
      return conn;
    } catch (memErr) {
      console.error(`[MongoDB] In-memory fallback failed: ${memErr.message}`);
      throw memErr;
    }
  }

  try {
    const isAtlas = uri.includes('mongodb+srv') || uri.includes('mongodb.net');
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: isAtlas ? 10000 : 3500,
    });
    console.log(`[MongoDB] Connected successfully to: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (err) {
    console.warn(`[MongoDB] Direct connection to ${uri.replace(/:([^:@]+)@/, ':****@')} failed: ${err.message}`);

    if (uri.includes('mongodb.net')) {
      console.warn('[MongoDB Atlas Hint] Common causes for Atlas connection failure:');
      console.warn('  1. Network Access: Ensure your IP address (or 0.0.0.0/0 for testing) is whitelisted in MongoDB Atlas under "Network Access".');
      console.warn('  2. Credentials: Check your Database User username and password. If your password contains special characters (like @, #, $, %), URL-encode them.');
      console.warn('  3. Database Name: Ensure a database name is specified in your URI (e.g. ...mongodb.net/personal_blog?retryWrites=true&w=majority).');
    }

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

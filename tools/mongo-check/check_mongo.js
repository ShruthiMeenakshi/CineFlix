const { MongoClient } = require('mongodb');
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const db = client.db('MoviesHere');
    const col = db.collection('ContactUs');
    const docs = await col.find({}).sort({ createdAt: -1 }).limit(50).toArray();
    console.log(JSON.stringify(docs, null, 2));
  } catch (err) {
    console.error('Error:', err.message || err);
    process.exitCode = 1;
  } finally {
    await client.close();
  }
}

run();

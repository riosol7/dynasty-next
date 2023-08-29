import { MongoClient } from 'mongodb';

const uri: string = process.env.MONGODB_URI || '';
const client: MongoClient = new MongoClient(uri);

let cachedClient: MongoClient | null = null;

export async function connectToDatabase(): Promise<MongoClient> {
  if (!cachedClient) {
    await client.connect();
    cachedClient = client;
  }

  return cachedClient;
}

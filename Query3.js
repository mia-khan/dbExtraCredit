// Counting Plants for a Specific User

import { MongoClient } from 'mongodb';

const client = await MongoClient.connect('mongodb://localhost:27017/');
const collection = client.db('ProjectTwo').collection('Plants');

const userId = 110;
const count = await collection.count({ user_id: userId });
console.log("Number of Plants for User ID", userId + ":", count);

await client.close();

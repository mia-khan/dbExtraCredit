// Finding Plants Added After a Certain Date

import { MongoClient } from 'mongodb';

const client = await MongoClient.connect('mongodb://localhost:27017/');
const collection = client.db('ProjectTwo').collection('Plants');

const dateThreshold = new Date("2024-01-01T00:00:00Z");
const result = await collection.find({ date_added: { $gt: dateThreshold } }).toArray();
console.log("Plants Added After a Certain Date:", result);

await client.close();

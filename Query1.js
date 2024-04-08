// Aggregation Framework Query: Calculate average condition ID

import { MongoClient } from 'mongodb';

const client = await MongoClient.connect('mongodb://localhost:27017/');
const collection = client.db('ProjectTwo').collection('Plants');

const aggregationPipeline = [
  { $group: { _id: null, avgConditionId: { $avg: "$condition_id" } } }
];
const aggregationResult = await collection.aggregate(aggregationPipeline).toArray();
console.log("Average Condition ID:", aggregationResult);

await client.close();

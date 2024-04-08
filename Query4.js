// Updating plant condition status

import { MongoClient } from 'mongodb';

const client = await MongoClient.connect('mongodb://localhost:27017/');
const collection = client.db('ProjectTwo').collection('Plants');

const plantIdToUpdate = "661336aafc13ae2430ab89f5";
const newConditionStatus = "Poor";

const result = await collection.updateOne(
    { "plant_id.$oid": plantIdToUpdate },
    { $set: { condition_status: newConditionStatus } }
);
console.log(result.modifiedCount + " Plant Condition Status Updated");

await client.close();

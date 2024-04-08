// Complex Search Criterion Query: Find plants with specific condition status or temperature range (Limit: 3)

import { MongoClient } from 'mongodb';

const client = await MongoClient.connect('mongodb://localhost:27017/');
const collection = client.db('ProjectTwo').collection('Plants');

const result = await collection.find({
    $or: [
        { condition_status: "good" },
        { temperature_range: "medium" }
    ]
}).limit(3).toArray(); // Limit to 10 documents
console.log("Top 10 Plants with Specific Condition Status or Temperature Range:", result);

await client.close();

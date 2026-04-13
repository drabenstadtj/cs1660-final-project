const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand, PutCommand } = require('@aws-sdk/lib-dynamodb');
const { randomUUID } = require('crypto');

// create a DynamoDB client using the region Lambda is running in
const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);

const POSTS_TABLE = process.env.POSTS_TABLE;

// helper to build a response 
const response = (statusCode, body) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
});

// GET /posts - fetch all posts from DynamoDB
exports.getPosts = async (event) => {
  const result = await dynamo.send(new ScanCommand({
    TableName: POSTS_TABLE,
  }));
  return response(200, result.Items);
};

// POST /posts - create a new post
exports.createPost = async (event) => {
  const body = JSON.parse(event.body);
  
  const post = {
    postId: randomUUID(),       // generate a unique ID
    title: body.title,
    content: body.content,
    author: body.author,
    createdAt: new Date().toISOString(),
  };

  await dynamo.send(new PutCommand({
    TableName: POSTS_TABLE,
    Item: post,
  }));

  return response(201, post);
};
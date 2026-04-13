const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand, PutCommand } = require('@aws-sdk/lib-dynamodb');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { randomUUID } = require('crypto');

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);
const s3 = new S3Client({});

const POSTS_TABLE = process.env.POSTS_TABLE;
const MEDIA_BUCKET = process.env.MEDIA_BUCKET;

const response = (statusCode, body) => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
  },
  body: JSON.stringify(body),
});

// GET /posts - fetch all posts
exports.getPosts = async (event) => {
  const result = await dynamo.send(new ScanCommand({ TableName: POSTS_TABLE }));
  return response(200, result.Items);
};

// POST /posts - create a new post
exports.createPost = async (event) => {
  const body = JSON.parse(event.body);

  const post = {
    postId: randomUUID(),
    title: body.title,
    content: body.content,
    author: body.author,
    createdAt: new Date().toISOString(),
    ...(body.imageUrl && { imageUrl: body.imageUrl }),
  };

  await dynamo.send(new PutCommand({ TableName: POSTS_TABLE, Item: post }));
  return response(201, post);
};

// GET /upload-url?filename=x&contentType=y - return a presigned S3 PUT URL
exports.getUploadUrl = async (event) => {
  const { filename, contentType } = event.queryStringParameters || {};
  if (!filename || !contentType) {
    return response(400, { error: 'filename and contentType are required' });
  }

  const key = `uploads/${randomUUID()}-${filename}`;
  const command = new PutObjectCommand({
    Bucket: MEDIA_BUCKET,
    Key: key,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 });
  const imageUrl = `https://${MEDIA_BUCKET}.s3.amazonaws.com/${key}`;

  return response(200, { uploadUrl, imageUrl });
};

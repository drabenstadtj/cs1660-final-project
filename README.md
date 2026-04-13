# Overcast

A cloud-native blogging platform built on AWS. Users can create accounts, write and publish posts, upload images, and receive notifications when others engage with their content.

## Architecture Overview

Overcast is a fully serverless application. The frontend is a React SPA hosted on S3 and served globally via CloudFront. All user interactions hit API Gateway, which routes requests to Lambda functions that handle business logic. User data, posts, and comments are persisted in DynamoDB. Images are stored directly in S3. Cognito handles all authentication and session management. SES delivers email notifications when users receive comments. SNS is used for internal alerting on Lambda failures. CloudWatch collects logs and metrics across all services.

## AWS Services

| Service           | Role                                                          | Why this over alternatives?                                                                                                                                                           |
| ----------------- | ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Amazon Cognito    | User authentication — registration, login, session management | Managed auth with built-in JWT and persistent user pools. Saves building auth from scratch and integrates natively with API Gateway.                                                  |
| API Gateway       | REST API entrypoint for all client-server communication       | Fully managed, scales automatically, and integrates directly with Lambda — no need to manage an EC2-based API server.                                                                 |
| AWS Lambda        | Serverless backend logic for posts, comments, and user data   | Our workload is event-driven and infrequent, making serverless more cost-effective than running a persistent EC2 instance.                                                            |
| Amazon DynamoDB   | Persistent storage for posts, comments, and user profiles     | Always-free tier, schema-less structure suits blog post documents, and scales seamlessly. Chosen over RDS to avoid managing a relational DB for a document-oriented workload.         |
| Amazon S3         | Image/media uploads and static frontend hosting               | Industry-standard object storage. Hosting the static frontend on S3 eliminates the need for a dedicated web server.                                                                   |
| Amazon CloudFront | CDN for frontend and media delivery                           | Reduces latency by caching S3 content at edge locations. Chosen over serving directly from S3 for performance and HTTPS support.                                                      |
| Amazon SES        | Email notifications for comments and engagement               | Sends email directly to any address from Lambda without requiring subscription confirmation. Chosen over SNS for user-facing email delivery due to SES's simpler end-user experience. |
| Amazon SNS        | Internal alerting on Lambda failures                          | Used as a dead letter queue target for failed Lambda invocations, alerting the developer when backend errors occur.                                                                   |
| Amazon CloudWatch | Logging and monitoring                                        | Native AWS observability — collects Lambda logs and API Gateway metrics without additional configuration.                                                                             |

## Service Interactions

1. **User visits the app** → CloudFront serves the React frontend from S3
2. **User registers or logs in** → Frontend communicates directly with Cognito, which returns a JWT
3. **User makes any API request** → JWT is attached to the request, API Gateway validates it against Cognito before passing to Lambda
4. **User creates a post or comment** → Lambda writes the data to DynamoDB and returns a response
5. **User uploads an image** → Lambda generates a presigned S3 URL, frontend uploads directly to S3
6. **User receives a comment** → Lambda sends an email notification via SES directly to the post author
7. **A Lambda function fails** → The failed invocation is forwarded to an SNS topic, which alerts the developer
8. **Any Lambda invocation** → Logs and metrics are automatically sent to CloudWatch


UserPoolId: us-east-1_U0jZAbaIu
UserPoolClientId: 34pmvvbfne5t17n6k5e57b9ffa
ApiUrl: https://jvjkzd3e00.execute-api.us-east-1.amazonaws.com/Prod/
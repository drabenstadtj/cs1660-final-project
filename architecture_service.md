# Overcast

A cloud-native blogging platform built on AWS. Users can create accounts, write and publish posts, upload images, and receive notifications when others engage with their content.

---

## Architecture

![Architecture Diagram](architecture.png)

Overcast is a serverless application. The frontend is a React SPA hosted on S3 and served via CloudFront. All user interactions hit API Gateway, which routes requests to Lambda functions that handle business logic. User data, posts, and comments are persisted in DynamoDB. Images are stored directly in S3. Cognito handles all authentication and session management. SES delivers email notifications when users receive comments. SNS is used for internal alerting on Lambda failures. CloudWatch collects logs and metrics across all services.

---

## AWS Services

| Service              | Role                                                            |
| -------------------- | --------------------------------------------------------------- |
| Amazon CloudFront    | CDN — serves the React frontend and media globally              |
| Amazon S3 (frontend) | Hosts the compiled React SPA static files                       |
| Amazon Cognito       | User authentication — registration, login, session management   |
| Amazon API Gateway   | REST API entry point for all client-server communication        |
| AWS Lambda           | Serverless backend logic for posts, comments, and image uploads |
| Amazon DynamoDB      | Persistent storage for posts, comments, and user profiles       |
| Amazon S3 (media)    | Object storage for user image uploads                           |
| Amazon SES           | Email notifications to post authors when comments are received  |
| Amazon SNS           | Internal developer alerts on Lambda function failures           |
| Amazon CloudWatch    | Logging and metrics for Lambda and API Gateway                  |

---

## Data Flow

1. **User loads the app** — the browser hits CloudFront, which serves the React SPA from S3.
2. **User registers or logs in** — the frontend communicates directly with Cognito, which returns a JWT on success.
3. **User makes an API request** — the JWT is attached to every request. API Gateway validates it against Cognito before passing the request to Lambda.
4. **User creates a post or comment** — Lambda writes the data to DynamoDB and returns a response to the client.
5. **User uploads an image** — Lambda generates a presigned S3 URL and returns it to the frontend, which uploads directly to S3 without the file passing through the backend.
6. **User receives a comment** — Lambda sends an email notification via SES directly to the post author.
7. **A Lambda function fails** — the failed invocation is forwarded to an SNS topic as an async destination, which alerts the developer.
8. **Any Lambda invocation** — logs and metrics are automatically streamed to CloudWatch.

---

## Network Architecture

Lambda functions run in AWS-managed infrastructure and communicate with DynamoDB, S3, SES, SNS, and CloudWatch over AWS service endpoints. API Gateway is public-facing and secured via Cognito JWT authorization. CloudFront sits in front of both the S3 frontend bucket and the S3 media bucket, handling HTTPS termination.

---

## Service Justification

**Amazon CloudFront** — chosen over serving directly from S3 because S3 static website hosting does not support HTTPS on custom domains. CloudFront handles HTTPS termination at edge locations, reducing latency for users regardless of geographic location.

**Amazon S3 (frontend)** — chosen over EC2 or Amplify for static hosting because it requires no server management, scales automatically, and costs essentially nothing at this scale. The React app is a compiled set of static files that does not need a running web server.

**Amazon Cognito** — chosen over building a custom authentication system because it provides managed user pools with built-in JWT issuance, password hashing, and session management. It integrates natively with API Gateway, meaning JWT validation requires zero custom middleware.

**Amazon API Gateway** — chosen over an EC2-hosted API server because it is fully managed, scales automatically with traffic, and integrates directly with both Cognito (for auth) and Lambda (for compute). There is no infrastructure to provision or maintain.

**AWS Lambda** — chosen over EC2 because the workload is event-driven and traffic is unpredictable. Lambda scales to zero when idle and handles spikes automatically, making it significantly more cost-effective than a persistent EC2 instance for a platform of this scale.

**Amazon DynamoDB** — chosen over RDS because the data model (posts, comments, user profiles) is document-oriented and does not require relational joins. DynamoDB's schema-less structure suits this workload naturally, and its always-free tier covers the expected read/write volume indefinitely.

**Amazon S3 (media)** — chosen over EFS or storing images in DynamoDB because S3 is purpose-built for object storage at any scale. Using presigned URLs means image uploads go directly from the browser to S3, so large files never pass through Lambda or API Gateway.

**Amazon SES** — chosen over SNS for user-facing email because SES delivers email directly to any address without requiring the recipient to subscribe to a topic first. This makes it the appropriate choice for transactional notifications like comment alerts.

**Amazon SNS** — chosen for internal developer alerting because it acts as an async Lambda destination, meaning failed invocations are forwarded automatically without any polling or log-scraping. SNS then fans the alert out to the developer via email or SMS.

**Amazon CloudWatch** — chosen over a third-party monitoring solution because it integrates natively with Lambda and API Gateway at no additional configuration cost. Logs and metrics are collected automatically for every invocation.

---

## AI Usage

This project used Claude (Anthropic) to assist with architecture design, service selection rationale, and documentation. All AWS architecture decisions were made and reviewed by the team. AI-generated content was verified for correctness and all team members are able to explain every component shown in the architecture diagram and video demonstration.

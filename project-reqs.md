# Cloud Computing Final Project

### CS 1660/2060 - Introduction to Cloud Computing

> **Note:** The group project is optional. If you choose not to participate, you will instead take a 50-question open-note final exam. You must decide by the group formation deadline.

---

## Key Dates

| Milestone                       | Date           |
| ------------------------------- | -------------- |
| Group Formation Deadline        | March 15, 2026 |
| Final Submission & Presentation | April 29, 2026 |

---

## Group Formation

- Group size: 3-5 students
- Undergraduate and graduate students may work together
- Submit your group roster on Canvas by March 15, 2026
- If you do not form a group by the deadline, you will take the final exam instead

---

## Overview

This final project challenges you to design and deploy a cloud-based application using Amazon Web Services (AWS). Your solution must integrate at least seven distinct AWS services (e.g., S3, EC2, Lambda, RDS, API Gateway, Cognito, etc.). You are welcome to explore services beyond those discussed in class, using any programming language or framework of your choice.

Each team will select a project idea, build the application, and deploy it using AWS. Your application must include **persistent storage**, some form of **automation**, and cannot rely solely on ephemeral/temporary workloads.

---

## Rubric

### 1. Usage of at least 7 AWS Services — 15 pts

The project should incorporate at least seven different AWS services.

> **Note:** Networking services like VPC, route tables, and NACLs are **not counted** towards your 7 services, as they are foundational requirements for most AWS deployments.

Examples of services with free tier options include but are not limited to:

- **Compute:** EC2, Lambda
- **Storage:** S3, EFS, EBS
- **Database:** RDS, DynamoDB
- **Networking:** VPC, CloudFront, API Gateway
- **Security:** IAM, Cognito
- **DevOps:** CodePipeline, CodeBuild, CodeDeploy, ECR
- **Monitoring:** CloudWatch, X-Ray
- **Messaging:** SNS, SQS, EventBridge

---

### 2. Authentication Layer — 5 pts

Your application must implement an authentication mechanism with persistent storage. Users should be able to:

- Create an account and log in
- Alter the state of the application (e.g., save preferences, create content)
- Log out and log back in to see their persisted data

Consider using AWS Cognito for user authentication or implementing your own authentication system with secure password storage.

---

### 3. Persistent Storage — 5 pts

Your application must include at least one form of persistent storage (e.g., RDS, DynamoDB, S3). The application cannot be entirely ephemeral; data must be retained across sessions and service restarts.

---

### 4. Architecture Diagram and Service Justification — 10 pts

Create a comprehensive architecture diagram that includes:

- All AWS services used in your application
- Data flow between services
- Network architecture (if applicable)
- **Written justification:** For each major service chosen, explain why you selected it over alternatives (e.g., _"We chose Lambda over EC2 because our workload is event-driven with unpredictable traffic patterns, making serverless more cost-effective"_)

---

### 5. Video Demonstration — 10 pts

Record a video demonstration (maximum 10 minutes) that covers:

- **Problem statement:** What problem does your application solve?
- **Live demo:** Show your application working end-to-end
- **Architecture walkthrough:** Explain your AWS services and how they interact
- **Authentication & persistence:** Demonstrate user login and data persistence
- **Challenges & learnings:** Briefly discuss any challenges you faced

---

### 6. Deployment Automation — 5 pts

The deployment process should be automated and not require manual intervention. Recommended approach: GitHub Actions with AWS deployment. This can range from automated container deployment to ECR to full infrastructure-as-code deployment of your entire stack.

---

**Total Points: 50**

---

## Submission Requirements

1. **GitHub Repository:** Include all source code, infrastructure code, and README with setup instructions
2. **Architecture Diagram:** Include in your README or as a PDF/image file in the GitHub repo
3. **Video Demo:** Upload to YouTube/Vimeo (unlisted is fine) and include link in your README
4. **Written Report** _(optional but recommended):_ 2-3 page document describing your project, architecture decisions, and learnings

---

## Possible Project Ideas

### 1. QR Code Class Attendance Mechanism

Implement a system that uses QR codes for class attendance tracking.

- **Suggested AWS Services:** Lambda, API Gateway, DynamoDB, S3, Cognito, CloudFront, SNS
- Generate unique QR codes for each class session
- Students scan QR codes to mark attendance
- Professors can view attendance reports and analytics

### 2. Serverless Image Processing Service

Develop a web application that allows users to upload and process images.

- **Suggested AWS Services:** S3, Lambda, API Gateway, DynamoDB, Cognito, CloudFront, Step Functions
- Users upload images to S3
- Lambda functions process images (resize, filter, format conversion)
- Provide downloadable URLs for processed images
- Track processing history per user

### 3. AI-Powered Application with Amazon Bedrock

Create an innovative application leveraging AWS's AI/ML capabilities.

- **Suggested AWS Services:** Bedrock, Lambda, API Gateway, DynamoDB, S3, Cognito, CloudFront
- Build a chatbot, content generator, or document analyzer
- Implement conversation history and user preferences
- Consider cost optimization for API calls

---

## Tips for Success

- **Start early:** AWS can be complex; give yourself time to learn and troubleshoot
- **Use the free tier wisely:** Most AWS services offer free tier options — consult [aws.amazon.com/free](https://aws.amazon.com/free/) or message the instructor directly
- **Monitor costs:** Set up billing alerts to avoid unexpected charges
- **Document as you go:** Keep track of your architecture decisions and challenges
- **Test authentication thoroughly:** Ensure secure password handling and session management
- **Plan your demo:** Practice your video presentation to stay within the 10-minute limit

---

## AI Usage Policy

The use of AI tools (ChatGPT, Claude, GitHub Copilot, etc.) for application development is **encouraged**. This course is about cloud computing, not coding. However, you must be transparent about your AI usage:

- If you use AI to generate code or infrastructure configurations, explain your choices in your documentation
- You must understand what the AI-generated code does and be able to explain it in your video demonstration
- Include a brief section in your README describing which parts of your project used AI assistance
- The focus of grading is on your **AWS architecture decisions, service integration, and understanding of cloud concepts**, not on whether you wrote every line of code yourself

# AWS Infrastructure Programming Exercise

Create an S3 bucket and a Lambda function. If a file is created in the `incoming/` folder in the S3 bucket
the lambda is triggered. The Lambda loads the file and parses an integer number from the first line. If
the number is a prime it creates an object `outgoing/<the integer number>.prime` if it is not a prime, it
will create `outgoing/<the integer number>.notprime` and if there is an invalid input it creates
`errors/<original_object_name>` with the original content.

The result is delivered as an infrastructure-as-code fashion. CloudFormation, Terraform, CDK,
Serverless are all accepted. The programming language does not matter as long as the full source is
provided and the deployment handles creating a runnable version (binary) automatically.

The name of the S3 bucket and the Lambda function is a configurable parameter = can be changed
without breaking the automation.

CI/CD – it is sufficient to provide a shell/PowerShell script which assumes that it has proper AWS
deployment permissions for this task.

## Prerequisites
- [Node.js v18+](https://nodejs.org/)
- [Git client](https://git-scm.com/downloads)
- AWS CLI and AWS credentials configured

## Environment setup
### Install AWS CDK
```
npm install -g aws-cdk
```
Verify install: `cdk --version` should return something like `2.100.0 (build e1b5c77)`

### Bootstrap CDK (once per AWS account)
```
cdk bootstrap
```
Initialize CDK resources in the AWS. It takes few minutes to complete.

---
#### _NOTE:_ AWS profile
All cdk and npm commands have to be run in context of AWS account with actual deploy rights, e.g. using "sandbox" profile.
The name of AWS profile comes from `~/.aws/credentials`

e.g.
```
AWS_PROFILE=sandbox cdk_or_npm_command
```

Default profile may be omitted.

# Usage

Checkout Git repository:
```
git clone https://github.com/moravcik/aws-infra-exercise
cd aws-infra-exercise
```
Install NPM dependencies:
```
npm install
```

Run commands:
- `npm run deploy` or `cdk deploy` - deploy CDK application into AWS
- `npm run watch` or `cdk watch` - deploy CDK application into AWS in watch mode, allowing lambda code hotswapping

Optionally configure the fixed name of bucket and lambda function:
- uncomment and edit `TEST_BUCKET_NAME` and/or `TEST_LAMBDA_NAME` in `.env` file
- or use environment variable with npm/cdk command, e.g.
```
TEST_LAMBDA_NAME=AwsInfraExerciseStack-TestHandler cdk deploy
```

> _NOTE:_ name of the S3 bucket has to be globally unique across all AWS accounts

Other userfule CDK commands:
- `cdk ls` - list stacks in current CDK application
- `cdk synth` - synthetize CloudFormation template
- `cdk diff` - show changes between deployed CloudFormation stack and current stack in CDK code

# What's next
- Enable local development using [Serverless framework Offline plugin](https://www.serverless.com/plugins/serverless-offline)
- Unit tests and/or e2e tests
- Improve logging
- Setup eslint, prettier, etc.
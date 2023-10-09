import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Bucket, EventType } from 'aws-cdk-lib/aws-s3';
import { LambdaDestination } from 'aws-cdk-lib/aws-s3-notifications';
import { Construct } from 'constructs';
import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';

export class AwsInfraExerciseStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const env: any = yaml.load(readFileSync('.env', 'utf8')) ?? {};
    
    const testBucketName = env.TEST_BUCKET_NAME || process.env.TEST_BUCKET_NAME;
    const testLambdaName = env.TEST_LAMBDA_NAME || process.env.TEST_LAMBDA_NAME;

    const testHandler = new NodejsFunction(this, 'TestHandler', {
      entry: 'resources/test-lambda.ts',
      functionName: testLambdaName, // optional
      runtime: Runtime.NODEJS_18_X,
      // AWS SDK v3 is already bundled in Node.js v18 runtime
      bundling: { externalModules: ['@aws-sdk'] },
      memorySize: 256,
      timeout: Duration.seconds(30),
    });

    const testBucket = new Bucket(this, 'TestBucket', {
      bucketName: testBucketName // optional
    });

    testBucket.grantReadWrite(testHandler);
    testBucket.addEventNotification(
      EventType.OBJECT_CREATED, 
      new LambdaDestination(testHandler),
      { prefix: 'incoming' }
    );
  }
}

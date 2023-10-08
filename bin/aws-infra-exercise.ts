#!/usr/bin/env node
import 'source-map-support/register';
import { App } from 'aws-cdk-lib';
import { AwsInfraExerciseStack } from '../lib/aws-infra-exercise-stack';

const app = new App();
new AwsInfraExerciseStack(app, 'AwsInfraExerciseStack', {});
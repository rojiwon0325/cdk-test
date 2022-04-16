#!/usr/bin/env node
import "dotenv/config";
import "source-map-support/register";
import { App } from "aws-cdk-lib";
import { CdkStack } from "../lib/cdk-stack";

const app = new App();
new CdkStack(app, "CdkStack", {
  env: {
    account: process.env.AWS_ACCOUNT,
    region: process.env.AWS_DEFAULT_REGION,
  },
});

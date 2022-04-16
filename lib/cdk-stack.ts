import "dotenv/config";
import {
  aws_ecs,
  aws_ecs_patterns,
  aws_route53,
  Stack,
  StackProps,
} from "aws-cdk-lib";
import { Vpc } from "aws-cdk-lib/aws-ec2";
import { Cluster } from "aws-cdk-lib/aws-ecs";
import { Construct } from "constructs";

export class CdkStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const config = {
      Domain: process.env.DOMAIN as string,
      SubDomain: `${process.env.SUB_OF_DOMAIN}.${process.env.DOMAIN}`,
    };

    const vpc = new Vpc(this, "rojiwon-cdk-vpc", { maxAzs: 2 });
    const cluster = new Cluster(this, "rojiwon-cdk-ecs", { vpc });
    const hostzone = aws_route53.HostedZone.fromLookup(this, "SubZone", {
      domainName: config.Domain,
    });

    // const LoadBalancedFargateService =
    new aws_ecs_patterns.ApplicationLoadBalancedFargateService(
      this,
      "rojiwon-cdk-service",
      {
        domainZone: hostzone,
        domainName: config.SubDomain,
        cluster,
        desiredCount: 2,
        memoryLimitMiB: 1024,
        taskImageOptions: {
          image: aws_ecs.ContainerImage.fromRegistry(
            "amazon/amazon-ecs-sample"
          ),
          environment: {
            // TEST_ENVIRONMENT_VARIABLE1: "test environment variable 1 value",
            // TEST_ENVIRONMENT_VARIABLE2: "test environment variable 2 value",
          },
        },
      }
    );
  }
}

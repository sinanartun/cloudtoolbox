import {
    EC2Client,
    DescribeInstancesCommand,
    TerminateInstancesCommand,
    ModifyInstanceAttributeCommand
} from "@aws-sdk/client-ec2";
import { defaultProvider } from "@aws-sdk/credential-provider-node";
import { out } from '../providers/log';
interface Tag {
    Key: string;
    Value: string;
}
class EC2Instance {
    instance: any;
    client: EC2Client;

    constructor(instance: any, region: string = "us-west-2") {
        this.instance = instance;
        this.client = new EC2Client({ region: region });
    }

    static async deleteEC2(profile: string, regions: string[]) {

        for (const region of regions) {
            out(`Initializing EC2 client for region ${region}...`);
            const ec2Client = new EC2Client({
                region: region,
                credentials: defaultProvider({ profile: profile }),
            });

            out("Fetching EC2 instances...");
            const instances = await ec2Client.send(new DescribeInstancesCommand({}));

            if (instances.Reservations && instances.Reservations.length > 0) {
                out(`Found instances in region ${region}`);
            }

            out("Iterating over reservations...");
            for (const reservation of instances.Reservations || []) {
                out("Iterating over instances...");
                if (reservation.Instances) {
                    for (const instance of reservation.Instances) {
                        if (instance.InstanceId) {
                            out(`Terminating instance with ID: ${instance.InstanceId}...`);
                            await ec2Client.send(
                                new TerminateInstancesCommand({
                                    InstanceIds: [instance.InstanceId],
                                })
                            );
                            out(`Instance with ID: ${instance.InstanceId} terminated.`);
                        }
                    }
                }
            }
            out("EC2 deletion process completed.");
        }
    }

    static async listInstances() {
        const client = new EC2Client({ region: "us-west-2" }); // replace with your region
        const command = new DescribeInstancesCommand({});
        const instances: EC2Instance[] = [];

        try {
            const data = await client.send(command);
            if (data.Reservations) {
                for (const reservation of data.Reservations) {
                    if (reservation.Instances) {
                        for (const instance of reservation.Instances) {
                            instances.push(new EC2Instance(instance));
                        }
                    }
                }
            }
        } catch (error) {
            console.error(error);
        }

        return instances;
    }

    async remove() {
        const command = new TerminateInstancesCommand({
            InstanceIds: [this.instance.InstanceId]
        });

        try {
            await this.client.send(command);
        } catch (error: any) {
            if (error.code === 'OperationNotPermitted') {
                if (error.message.includes('disableApiTermination')) {
                    await this.disableTerminationProtection();
                } else if (error.message.includes('disableApiStop')) {
                    await this.disableStopProtection();
                }
                await this.client.send(command);
            } else {
                console.error(error);
            }
        }
    }

    async disableTerminationProtection() {
        const command = new ModifyInstanceAttributeCommand({
            InstanceId: this.instance.InstanceId,
            DisableApiTermination: {
                Value: false
            }
        });

        try {
            await this.client.send(command);
        } catch (error) {
            console.error(error);
        }
    }

    async disableStopProtection() {
        const command = new ModifyInstanceAttributeCommand({
            InstanceId: this.instance.InstanceId,
            DisableApiStop: {
                Value: false
            }
        });

        try {
            await this.client.send(command);
        } catch (error) {
            console.error(error);
        }
    }



    properties() {
        const properties: { [key: string]: any } = {
            Identifier: this.instance.InstanceId,
            ImageIdentifier: this.instance.ImageId,
            InstanceState: this.instance.State?.Name,
            InstanceType: this.instance.InstanceType,
            LaunchTime: this.instance.LaunchTime
        };

        this.instance.Tags?.forEach((tag: Tag) => {
            if (tag.Key && tag.Value) {
                properties[tag.Key] = tag.Value;
            }
        });

        return properties;
    }

    toString() {
        return this.instance.InstanceId;
    }
}

export { EC2Instance };
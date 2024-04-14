"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EC2Instance = void 0;
const client_ec2_1 = require("@aws-sdk/client-ec2");
const credential_provider_node_1 = require("@aws-sdk/credential-provider-node");
const log_1 = require("../providers/log");
class EC2Instance {
    instance;
    client;
    constructor(instance, region = "us-west-2") {
        this.instance = instance;
        this.client = new client_ec2_1.EC2Client({ region: region });
    }
    static async deleteEC2(profile, regions) {
        for (const region of regions) {
            (0, log_1.out)(`Initializing EC2 client for region ${region}...`);
            const ec2Client = new client_ec2_1.EC2Client({
                region: region,
                credentials: (0, credential_provider_node_1.defaultProvider)({ profile: profile }),
            });
            (0, log_1.out)("Fetching EC2 instances...");
            const instances = await ec2Client.send(new client_ec2_1.DescribeInstancesCommand({}));
            if (instances.Reservations && instances.Reservations.length > 0) {
                (0, log_1.out)(`Found instances in region ${region}`);
            }
            (0, log_1.out)("Iterating over reservations...");
            for (const reservation of instances.Reservations || []) {
                (0, log_1.out)("Iterating over instances...");
                if (reservation.Instances) {
                    for (const instance of reservation.Instances) {
                        if (instance.InstanceId) {
                            (0, log_1.out)(`Terminating instance with ID: ${instance.InstanceId}...`);
                            await ec2Client.send(new client_ec2_1.TerminateInstancesCommand({
                                InstanceIds: [instance.InstanceId],
                            }));
                            (0, log_1.out)(`Instance with ID: ${instance.InstanceId} terminated.`);
                        }
                    }
                }
            }
            (0, log_1.out)("EC2 deletion process completed.");
        }
    }
    static async listInstances() {
        const client = new client_ec2_1.EC2Client({ region: "us-west-2" }); // replace with your region
        const command = new client_ec2_1.DescribeInstancesCommand({});
        const instances = [];
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
        }
        catch (error) {
            console.error(error);
        }
        return instances;
    }
    async remove() {
        const command = new client_ec2_1.TerminateInstancesCommand({
            InstanceIds: [this.instance.InstanceId]
        });
        try {
            await this.client.send(command);
        }
        catch (error) {
            if (error.code === 'OperationNotPermitted') {
                if (error.message.includes('disableApiTermination')) {
                    await this.disableTerminationProtection();
                }
                else if (error.message.includes('disableApiStop')) {
                    await this.disableStopProtection();
                }
                await this.client.send(command);
            }
            else {
                console.error(error);
            }
        }
    }
    async disableTerminationProtection() {
        const command = new client_ec2_1.ModifyInstanceAttributeCommand({
            InstanceId: this.instance.InstanceId,
            DisableApiTermination: {
                Value: false
            }
        });
        try {
            await this.client.send(command);
        }
        catch (error) {
            console.error(error);
        }
    }
    async disableStopProtection() {
        const command = new client_ec2_1.ModifyInstanceAttributeCommand({
            InstanceId: this.instance.InstanceId,
            DisableApiStop: {
                Value: false
            }
        });
        try {
            await this.client.send(command);
        }
        catch (error) {
            console.error(error);
        }
    }
    properties() {
        const properties = {
            Identifier: this.instance.InstanceId,
            ImageIdentifier: this.instance.ImageId,
            InstanceState: this.instance.State?.Name,
            InstanceType: this.instance.InstanceType,
            LaunchTime: this.instance.LaunchTime
        };
        this.instance.Tags?.forEach((tag) => {
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
exports.EC2Instance = EC2Instance;
//# sourceMappingURL=EC2.js.map
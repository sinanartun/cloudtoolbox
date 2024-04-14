import {
    LambdaClient,
    ListEventSourceMappingsCommand,
    DeleteEventSourceMappingCommand,
    EventSourceMappingConfiguration,
    ListFunctionsCommand,
    ListTagsCommand
} from "@aws-sdk/client-lambda";
import { RegionProvider } from '../providers/RegionProvider';

class LambdaEventSourceMapping {
    private client: LambdaClient;
    private mapping: EventSourceMappingConfiguration;

    constructor(client: LambdaClient, mapping: EventSourceMappingConfiguration) {
        this.client = client;
        this.mapping = mapping;
    }

    async remove() {
        const params = { UUID: this.mapping.UUID };
        const command = new DeleteEventSourceMappingCommand(params);
        try {
            const data = await this.client.send(command);
            console.log("Event Source Mapping deleted successfully", data);
        } catch (error) {
            console.error("Error deleting Event Source Mapping", error);
        }
    }

    properties() {
        return {
            UUID: this.mapping.UUID,
            EventSourceArn: this.mapping.EventSourceArn,
            FunctionArn: this.mapping.FunctionArn,
            State: this.mapping.State,
        };
    }
}

interface LambdaFunction {
    svc: LambdaClient;
    functionName: string;
    tags: { [key: string]: string };
}

class Lambda {
    private client: LambdaClient;
    private regionProvider: RegionProvider; 

    constructor(region: string, regionProvider: RegionProvider) {
        this.client = new LambdaClient({ region: region });
        this.regionProvider = regionProvider; // A
    }

    async listEventSourceMappings(): Promise<LambdaEventSourceMapping[]> {
        const command = new ListEventSourceMappingsCommand({});
        const resources: LambdaEventSourceMapping[] = [];

        try {
            let done = false;
            let page = await this.client.send(command);

            while (!done) {
                const mappings = page.EventSourceMappings;
                if (mappings) {
                    for (const mapping of mappings) {
                        resources.push(new LambdaEventSourceMapping(this.client, mapping));
                    }
                }

                if (!page.NextMarker) {
                    done = true;
                } else {
                    command.input.Marker = page.NextMarker;
                    page = await this.client.send(command);
                }
            }
        } catch (error) {
            console.error("Error listing Event Source Mappings", error);
        }

        return resources;
    }

    async listFunctions(): Promise<LambdaFunction[]> {
        const command = new ListFunctionsCommand({});
        const resources: LambdaFunction[] = [];

        try {
            let done = false;
            let page = await this.client.send(command);

            while (!done) {
                const functions = page.Functions;
                if (functions) {
                    for (const func of functions) {
                        const tagsCommand = new ListTagsCommand({ Resource: func.FunctionArn });
                        const tagsResponse = await this.client.send(tagsCommand);
                        resources.push({
                            svc: this.client,
                            functionName: func.FunctionName || "",
                            tags: tagsResponse.Tags || {},
                        });
                    }
                }

                if (!page.NextMarker) {
                    done = true;
                } else {
                    command.input.Marker = page.NextMarker;
                    page = await this.client.send(command);
                }
            }
        } catch (error) {
            console.error("Error listing Lambda functions", error);
        }

        return resources;
    }

    async countFunctions(): Promise<number> {
        const command = new ListFunctionsCommand({});
        let count = 0;

        try {
            let done = false;
            let page = await this.client.send(command);

            while (!done) {
                const functions = page.Functions;
                if (functions) {
                    count += functions.length;
                }

                if (!page.NextMarker) {
                    done = true;
                } else {
                    command.input.Marker = page.NextMarker;
                    page = await this.client.send(command);
                }
            }
        } catch (error) {
            console.error("Error counting Lambda functions", error);
        }

        return count;
    }


}

export { Lambda, LambdaEventSourceMapping, LambdaFunction };
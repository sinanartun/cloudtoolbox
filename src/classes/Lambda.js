"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LambdaEventSourceMapping = exports.Lambda = void 0;
const client_lambda_1 = require("@aws-sdk/client-lambda");
class LambdaEventSourceMapping {
    client;
    mapping;
    constructor(client, mapping) {
        this.client = client;
        this.mapping = mapping;
    }
    async remove() {
        const params = { UUID: this.mapping.UUID };
        const command = new client_lambda_1.DeleteEventSourceMappingCommand(params);
        try {
            const data = await this.client.send(command);
            console.log("Event Source Mapping deleted successfully", data);
        }
        catch (error) {
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
exports.LambdaEventSourceMapping = LambdaEventSourceMapping;
class Lambda {
    client;
    regionProvider;
    constructor(region, regionProvider) {
        this.client = new client_lambda_1.LambdaClient({ region: region });
        this.regionProvider = regionProvider; // A
    }
    async listEventSourceMappings() {
        const command = new client_lambda_1.ListEventSourceMappingsCommand({});
        const resources = [];
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
                }
                else {
                    command.input.Marker = page.NextMarker;
                    page = await this.client.send(command);
                }
            }
        }
        catch (error) {
            console.error("Error listing Event Source Mappings", error);
        }
        return resources;
    }
    async listFunctions() {
        const command = new client_lambda_1.ListFunctionsCommand({});
        const resources = [];
        try {
            let done = false;
            let page = await this.client.send(command);
            while (!done) {
                const functions = page.Functions;
                if (functions) {
                    for (const func of functions) {
                        const tagsCommand = new client_lambda_1.ListTagsCommand({ Resource: func.FunctionArn });
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
                }
                else {
                    command.input.Marker = page.NextMarker;
                    page = await this.client.send(command);
                }
            }
        }
        catch (error) {
            console.error("Error listing Lambda functions", error);
        }
        return resources;
    }
    async countFunctions() {
        const command = new client_lambda_1.ListFunctionsCommand({});
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
                }
                else {
                    command.input.Marker = page.NextMarker;
                    page = await this.client.send(command);
                }
            }
        }
        catch (error) {
            console.error("Error counting Lambda functions", error);
        }
        return count;
    }
}
exports.Lambda = Lambda;
//# sourceMappingURL=Lambda.js.map
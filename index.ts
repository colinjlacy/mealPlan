import { SkillBuilders, HandlerInput, RequestHandler } from "ask-sdk";
import { Response } from 'ask-sdk-model';

class HelloHandler implements RequestHandler {
	canHandle(handlerInput: HandlerInput): boolean {
		return true;
	}
	
	handle(handlerInput: HandlerInput): Response | Promise<Response> {
		return {
			"outputSpeech": {
				"type": "SSML",
				"ssml": "<speak>Here's your fact: Saturn radiates two and a half times more energy into space than it receives from the sun.</speak>"
			},
			"card": {
				"type": "Simple",
				"title": "Space Facts",
				"content": "Saturn radiates two and a half times more energy into space than it receives from the sun."
			}
		}
	}
}

export const handler = SkillBuilders
	.standard()
	.addRequestHandlers(
		new HelloHandler()
	)
	.lambda();


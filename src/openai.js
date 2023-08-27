import OpenAI from "openai"
import config from "config"
import { createReadStream } from "fs"

class opAI {
    roles = {
        SYSTEM: 'system',
        USER: 'user',
        ASSISTANT: 'assistant',
        FUNCTION: 'function'
    }

    constructor(OPENAI_API_KEY) {
        this.openai = new OpenAI({
            apiKey: OPENAI_API_KEY,
        });
    }

    async chat(messages) {
        try {
            const response = await this.openai.chat.completions.create({
                messages: messages,
                model: 'gpt-3.5-turbo',
            })

            return response.choices.pop().message.content
        } catch (e) {
            console.log('Error while OpenAI processing', e.message)
        }
    }

    async transcription (mp3Path) {
        try {
            //const response = await this.openai.createTranscription(
            const response = await this.openai.audio.transcriptions.create({
                file: createReadStream(mp3Path),
                model: 'whisper-1'
            })
            return response.text
        } catch (e) {
            console.log('Error while OpenAI transcription', e.message)
        }
    }
}

export const openai = new opAI(config.get('OPENAI_API_KEY'))
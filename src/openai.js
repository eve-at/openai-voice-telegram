import OpenAI from "openai"
import config from "config"
import { createReadStream } from "fs"

class opAI {
    constructor(OPENAI_API_KEY) {
        this.openai = new OpenAI({
            apiKey: OPENAI_API_KEY,
        });
    }

    chat() {}

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
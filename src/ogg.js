import axios from "axios"
import ffmpeg from "fluent-ffmpeg"
import installer from "@ffmpeg-installer/ffmpeg"
import { createWriteStream } from "fs"
import { dirname, resolve} from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))

class OggConverter {
    constructor() {
        ffmpeg.setFfmpegPath(installer.path)
    }

    toMp3(oggPath, filename) {
        try {
            const outputPath = resolve(dirname(oggPath), `${filename}.mp3`)
            return new Promise((resolve, reject) => {
                ffmpeg(oggPath)
                    .inputOption('-t 30')
                    .output(outputPath)
                    .on('end', () => resolve(outputPath))
                    .on('error', err => reject(err.message))
                    .run()
            })
        } catch (e) {
            console.log('MP3 converting error ', e.message)
        }
    }

    async create(url, filename) {
        try {
            const oggPath = resolve(__dirname, '../voices', `${filename}.ogg`)
            const response = await axios({
                method: 'get',
                url,
                responseType: 'stream'
            })
            return new Promise((resolve, reject) => {
                const stream = createWriteStream(oggPath)
                response.data.pipe(stream)
                stream.on('finish', () => resolve(oggPath))
            })
        } catch (e) {
            console.log('Axios error ', e.message)
        }

    }
}

export const ogg = new OggConverter()
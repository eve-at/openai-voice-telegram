import { unlink } from "fs/promises"

export async function removeFile(path) {
    try {
        await unlink(path)
    } catch (e) {
        console.log('Erro while removing a voice file ', e.message)
    }
}
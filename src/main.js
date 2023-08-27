import { Telegraf } from "telegraf"
import { message } from "telegraf/filters"
import { code } from "telegraf/format"
import config from "config"
import { ogg } from "./ogg.js"
import { openai } from "./openai.js"

const bot = new Telegraf(config.get('TELEGRAM_TOKEN'))

// text message
bot.on(message('text'), async ctx => {
    try {
        await ctx.reply(JSON.stringify(ctx.message.text, null, 2))
    } catch (e) {
        console.log('Voice message error ', e.message);
    }
})

// voice message
bot.on(message('voice'), async ctx => {
    try {
        await ctx.reply(code('Message received. Waiting the answer from the server...'))

        //await ctx.reply(JSON.stringify(ctx.message, null, 2))
        const link = await ctx.telegram.getFileLink(ctx.message.voice.file_id)
        const userId = String(ctx.message.from.id)
        console.log('Voice url: ', link.href);

        const oggPath = await ogg.create(link.href, userId)
        const mp3Path = await ogg.toMp3(oggPath, userId)

        const text = await openai.transcription(mp3Path)
        await ctx.reply(code(`Your message: ${text}`))

        const messages = [{role: openai.roles.USER, content: text }]
        const response = await openai.chat(messages)

        await ctx.reply(response)
    } catch (e) {
        console.log('Voice message error ', e.message);
    }
})

bot.command('start', async (ctx) => {
    await ctx.reply(JSON.stringify(ctx.message, null, 2))
})

bot.launch()

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
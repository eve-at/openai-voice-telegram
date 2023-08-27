import { Telegraf, session } from "telegraf"
import { message } from "telegraf/filters"
import { code } from "telegraf/format"
import config from "config"
import { ogg } from "./ogg.js"
import { openai } from "./openai.js"

const INITIAL_SESSION = {
    messages: []
}

const bot = new Telegraf(config.get('TELEGRAM_TOKEN'))

bot.use(session())

bot.command('new', async (ctx) => {
    ctx.session = INITIAL_SESSION
    await ctx.reply(code('Waiting for your text or voice message'))
})

bot.command('start', async (ctx) => {
    ctx.session = INITIAL_SESSION
    await ctx.reply(code('Waiting for your text or voice message. Tap /new to start new session'))
})

async function askChat(ctx, text) {
    ctx.session.messages.push({role: openai.roles.USER, content: text })
    const response = await openai.chat(ctx.session.messages)
    ctx.session.messages.push({role: openai.roles.ASSISTANT, content: response })

    return response
}

// text message
bot.on(message('text'), async ctx => {
    ctx.session ??= INITIAL_SESSION

    try {
        await ctx.reply(code('Message received. Waiting the answer from the server...'))

        const response = await askChat(ctx, ctx.message.text);

        await ctx.reply(response)
    } catch (e) {
        console.log('Voice message error ', e.message);
    }
})

// voice message
bot.on(message('voice'), async ctx => {
    ctx.session ??= INITIAL_SESSION

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

        const response = await askChat(ctx, text);

        await ctx.reply(response)
    } catch (e) {
        console.log('Voice message error ', e.message);
    }
})

bot.launch()

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
import { Telegraf } from "telegraf"
import { message } from "telegraf/filters"
import config from "config"
import { ogg } from "./ogg.js"

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
        //await ctx.reply(JSON.stringify(ctx.message, null, 2))
        const link = await ctx.telegram.getFileLink(ctx.message.voice.file_id)
        const userId = String(ctx.message.from.id)
        await ctx.reply(JSON.stringify(link, null, 2))
        console.log('Voice url: ', link.href);

        const offPath = await ogg.create(link.href, userId)
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
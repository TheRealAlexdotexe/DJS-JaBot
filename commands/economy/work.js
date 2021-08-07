const economy = require('../../economy')
const jobSchema = require('../../schemas/job-schema')
const mongo = require('../../mongo')
const levels = require('../../levels')
const DiscordJS = require('discord.js')

module.exports = {
    commands: ['work', 'job'],
    description: 'Work lol',
    maxArgs: 0,
    cooldown: 1,
    callback: async (message) => {
        levels.addXP(message.guild.id, message.author.id, 50, message)

        const results = await jobSchema.findOne({
            guildId: message.guild.id,
            userId: message.author.id
        })

        const coinsEarned = +results.level ^ 3 * 10

        console.log(results.level)

        const newBalance = economy.addCoins(message.guild.id, message.author.id, coinsEarned)

        const embed = new DiscordJS.MessageEmbed()
        .setColor('RANDOM')
        .setTitle(`You went to work!`)
        .setDescription(`You earned ${coinsEarned} coins!\nYou now have ${newBalance} coins!`)

        message.reply(embed)
    }
}

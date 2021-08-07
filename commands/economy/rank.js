const levels = require('../../levels')
const jobSchema = require('../../schemas/job-schema')

module.exports = {
    commands: ['rank', 'level'],
    description: 'Shows your worklevel/rank',
    cooldown: 5,
    callback: (message) => {
        const results = jobSchema.findOne({
            guildId: message.guild.id,
            userId: message.author.id,
        })

        const bruh = results.level

        message.reply(`You are level ${bruh}!`)
    }
}
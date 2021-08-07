const levels = require('../../levels')
const jobSchema = require('../../schemas/job-schema')

module.exports = {
    commands: ['rank', 'level'],
    description: 'Shows your worklevel/rank',
    cooldown: 5,
    callback: async (message) => {
        const results = await jobSchema.findOne({
            guildId: message.guild.id,
            userId: message.author.id,
        })

        if (results === null) {
            message.reply('That user is unemployed!')
        }

        message.reply(`You are level ${results.level}!`)
    }
}
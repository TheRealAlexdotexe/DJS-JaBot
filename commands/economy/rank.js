const levels = require('../../levels')
const jobSchema = require('../../schemas/job-schema')
const mongo = require('../../mongo')

module.exports = {
    commands: ['rank', 'level'],
    description: 'Shows your worklevel/rank',
    cooldown: 5,
    callback: async (message) => {
        const guildId = message.guild.id
        const userId = message.user.id

        await mongo().then(async mongoose => {
            try {
                const results = await jobSchema.findOne({
                    guildId,
                    userId
                })

                if (results === null) {
                    message.reply('That user is unemployed!')
                    return
                } else {
                    message.reply(results.level)
                }
            } finally {
                mongoose.connection.close()
            }
        })

        if (results === null) {
            message.reply('That user is unemployed!')
            return
        }

        message.reply(`You are level ${results.level}!`)
    }
}
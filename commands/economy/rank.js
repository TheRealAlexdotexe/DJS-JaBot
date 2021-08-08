const levels = require('../../levels')
const jobSchema = require('../../schemas/job-schema')
const mongo = require('../../mongo')

module.exports = {
    commands: ['rank', 'level'],
    description: 'Shows your worklevel/rank',
    cooldown: 5,
    callback: async (message) => {
        const guildId = message.guild.id
        const userId = message.author.id

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
                    message.reply(`You are level ${results.level}! (<:JB_Coin:874023062960472085> Salary: ${results.level * results.level * results.level})`)
                }
            } finally {
                mongoose.connection.close()
            }
        })
    }
}
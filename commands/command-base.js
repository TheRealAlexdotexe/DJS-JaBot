/**
 * NOTE:
 *  Some parts of this code have been improved since the original command base video.
 *  This file should still work as expected, however if you are learning the inner workings of
 *  this file then expect the file to be slightly different than in the video.
 */

const colors = require('colors')
const { prefix } = require('../config.json')
const backtick = "`"
const validatePermissions = (permissions) => {
  const validPermissions = [
    'CREATE_INSTANT_INVITE',
    'KICK_MEMBERS',
    'BAN_MEMBERS',
    'ADMINISTRATOR',
    'MANAGE_CHANNELS',
    'MANAGE_GUILD',
    'ADD_REACTIONS',
    'VIEW_AUDIT_LOG',
    'PRIORITY_SPEAKER',
    'STREAM',
    'VIEW_CHANNEL',
    'SEND_MESSAGES',
    'SEND_TTS_MESSAGES',
    'MANAGE_MESSAGES',
    'EMBED_LINKS',
    'ATTACH_FILES',
    'READ_MESSAGE_HISTORY',
    'MENTION_EVERYONE',
    'USE_EXTERNAL_EMOJIS',
    'VIEW_GUILD_INSIGHTS',
    'CONNECT',
    'SPEAK',
    'MUTE_MEMBERS',
    'DEAFEN_MEMBERS',
    'MOVE_MEMBERS',
    'USE_VAD',
    'CHANGE_NICKNAME',
    'MANAGE_NICKNAMES',
    'MANAGE_ROLES',
    'MANAGE_WEBHOOKS',
    'MANAGE_EMOJIS',
  ]

  for (const permission of permissions) {
    if (!validPermissions.includes(permission)) {
      throw new Error(`Unknown permission node "${permission}"`)
    }
  }
}

let recentlyRan = [] // guildId-userId-command

module.exports = (client, commandOptions) => {
  let {
    commands,
    expectedArgs = '',
    permissionError = ':x: | Invalid Perms!',
    minArgs = 0,
    maxArgs = null,
    cooldown = -1,
    permissions = [],
    requiredRoles = [],
    callback,
  } = commandOptions

  // Ensure the command and aliases are in an array
  if (typeof commands === 'string') {
    commands = [commands]
  }
  const quote = '"'
  console.log(`Registering command ${`${quote}${commands[0]}${quote}`.blue}`.cyan)

  // Ensure the permissions are in an array and are all valid
  if (permissions.length) {
    if (typeof permissions === 'string') {
      permissions = [permissions]
    }

    validatePermissions(permissions)
  }

  // Listen for messages
  client.on('message', (message) => {
    const { member, content, guild } = message

    for (const alias of commands) {
      const command = `${prefix}${alias.toLowerCase()}`

      if (
        content.toLowerCase().startsWith(`${command}`) ||
        content.toLowerCase() === command
      ) {
        // A command has been ran

        // Ensure the user has the required permissions
        for (const permission of permissions) {
          if (!member.hasPermission(permission)) {
            message.reply(permissionError)
            return
          }
        }

        // Ensure the user has the required roles
        for (const requiredRole of requiredRoles) {
          const role = guild.roles.cache.find(
            (role) => role.name === requiredRole
          )

          if (!role || !member.roles.cache.has(role.id)) {
            message.reply(
              `:x: | Invalid Roles! Roles Required :\n${backtick}${requiredRoles}${backtick}\n ***You either have none of the required roles or you have some but not the other ones.***`
            )
            return
          }
        }

        // Ensure the user has not ran this command too frequently
        let cooldownString = ''
        if (cooldown > 0 && recentlyRan.includes(cooldownString)) {
          message.reply(':x: | Please wait a little longer before you execute this command again!')
          return
        }

        // Split on any number of spaces
        const arguments = content.split(/[ ]+/)

        // Remove the command which is the first index
        arguments.shift()

        // Ensure we have the correct number of arguments
        if (
          arguments.length < minArgs ||
          (maxArgs !== null && arguments.length > maxArgs)
        ) {

          message.reply(
            `:x: | Incorrect syntax! | Correct syntax:\n ${backtick}${prefix}${alias} ${expectedArgs}${backtick}`
          )
          return
        }

        if (cooldown > 0) {
          recentlyRan.push(cooldownString)

          setTimeout(() => {
            console.log(`BEFORE: ${recentlyRan}`.yellow)

            recentlyRan = recentlyRan.filter((string) => {
              return string !== cooldownString
            })
            
            console.log(`AFTER: ${recentlyRan}`.yellow)
          }, 1000 * cooldown)
        }

        // Handle the custom command code
        callback(message, arguments, arguments.join(' '), client)

        return
      }
    }
  })
}
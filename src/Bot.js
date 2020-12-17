import lodash from 'lodash'

const MESSAGE_PREFIX = '!sk'

class Bot {
	#discord
	#modules
	#discordBotToken
	#discordClientId

	constructor(discord, modules, discordBotToken, discordClientId) {
		this.#discord = discord
		this.#modules = modules
		this.#discordBotToken = discordBotToken
		this.#discordClientId = discordClientId
	}

	start() {
		this.#attachEventHandlers()

		this.#discord.login(this.#discordBotToken)
	}

	#attachEventHandlers() {
		this.#discord.on('ready', this.#onReady.bind(this))
		this.#discord.on('message', this.#onMessage.bind(this))
	}

	#onReady() {
		console.info(`Logged in as ${this.#discord.user.tag}`)
		console.info(`Add bot to server directly using: https://discord.com/oauth2/authorize?client_id=${this.#discordClientId}&scope=bot`)

		this.#discord.user.setActivity(MESSAGE_PREFIX, { type: 'LISTENING' })
	}

	#onMessage(message) {
		// Ignore our own messages to save on processing
		if (message.author.id === this.#discordClientId) {
			return
		}

		// Ignore messages that don't start with our prefix (!sk)
		if (lodash.startsWith(message.content, MESSAGE_PREFIX) === false) {
			return
		}

		const unparsed = message.content.slice(MESSAGE_PREFIX.length + 1)
		console.log('unparsed', unparsed)

		for (const module of this.#modules) {
			const result = module.run(unparsed)

			console.log('module result', result)

			if (result !== null) {
				message.reply(result)
			}
		}

		/*if (msg.content === 'ping') {
			msg.reply('pong')
		} else if (msg.content === 'attack') {
			let response = hero.attack({
				attacker: {
					ocv: 3,
				},
				defender: {
					dcv: 3,
				},
			})

			console.debug(response)
			msg.reply(`DCV Hit: ${response.hit.dcv}`)
		}*/
	}
}

export default Bot

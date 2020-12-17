// Must be first
import dotenv from 'dotenv/config.js'

import Bot from './src/Bot.js'
import Commandments from 'sk-commandments'
import Discord from 'discord.js'
import Hero from 'sk-module-hero'
import HeroConstants from 'sk-module-hero/src/Constants.js'

const hero = new Hero()

const heroCommand = new Commandments.Command('hero', 'Hero System 6 Module', function () { return 'hero without args' })
const attack = new Commandments.Command('attack', 'Attack using combat values and damage', function (params) {
	console.log('params', params)

	if (!params.ocv) {
		return null
	}

	let damageModifier = null

	if (params.m === '+') {
		damageModifier = HeroConstants.DMG_MOD_PLUS
	} else if (params.m === '-') {
		damageModifier = HeroConstants.DMG_MOD_MINUS
	} else if (params.m === 'h') {
		damageModifier = HeroConstants.DMG_MOD_HALF
	}

	const config = {
		attacker: {
			ocv: params.ocv ?? null,
			damage: {
				dice: params.dmg ?? null,
				modifier: damageModifier,
				killing: params.k ?? false,
			},
		},
		defender: {
			dcv: params.dcv ?? null,
			def: params.def ?? null,
			rDef: params.rdef ?? null,
			knockbackResistance: params.kbr ?? null,
		},
	}

	console.log('config', config)

	const result = hero.attack(config)

	console.log('attack result')
	console.dir(result)

	const response = ['Results of attack:']
	const hitRolls = `${result.hit.rolled.result} (${result.hit.rolled.rolled.join(', ')})`

	response.push(`Hit a DCV of **${result.hit.dcv}** with an OCV of **${params.ocv}** [${hitRolls}]`)

	result.locations.forEach(location => {
		const rolls = `${location.rolls.location.result} (${location.rolls.location.rolled.join(', ')})`

		if (location.location.side === true) {
			response.push(`Hit location **${location.location.name}** (${location.side}) [${rolls}]`)
		} else {
			response.push(`Hit location **${location.location.name}** [${rolls}]`)
		}
	})

	if (result.damage.length > 0) {
		result.damage.forEach(damage => {
			console.dir(damage)
			console.dir(damage.rolls)
			console.dir(damage.afterDefences)
			console.dir(damage.afterLocation)
			console.dir(damage.taken)
			response.push(`Damage taken: **${damage.taken.body}** BODY and **${damage.taken.stun}** STUN`)
			response.push(`Damage rolled: **${damage.body}** BODY and **${damage.stun}** STUN`)
			response.push(`Damage after defences: **${damage.afterDefences.body}** BODY and **${damage.afterDefences.stun}** STUN`)
			response.push(`Damage after hit location: **${damage.afterLocation.body}** BODY and **${damage.afterLocation.stun}** STUN`)
		})
	}

	if (result.knockback !== null) {
		response.push(`Knockback details here`)
	}

	return response.join("\n")
})
attack.addOption(new Commandments.Option('o', 'OCV or OMCV', 'ocv'))
attack.addOption(new Commandments.Option('d', 'DCV or DMCV', 'dcv'))
attack.addOption(new Commandments.Option('x', 'Damage dice in d6', 'dmg'))
attack.addOption(new Commandments.Option('m', 'Damage modifier (+, -, h)', 'dmg-mod'))
attack.addOption(new Commandments.Option('k', 'Toggle whether this is a killing attack'))
attack.addOption(new Commandments.Option('p', 'Non-resistant defenses against attack (PD/ED)', 'def'))
attack.addOption(new Commandments.Option('r', 'Resistant defenses against attack (PD/ED)', 'rdef'))
attack.addOption(new Commandments.Option('b', 'Knockback resistance in meters', 'kbr'))
heroCommand.addCommand(attack)

const bot = new Bot(
	new Discord.Client(),
	[
		heroCommand,
	],
	process.env.DISCORD_BOT_TOKEN,
	process.env.DISCORD_CLIENT_ID,
)

bot.start()

// const dayjs = require('dayjs');

module.exports = {
	initializeObject: (serverId, condemnedMember, condemnedRoleId, channelId, modRole, meanDelay = 1440, variation = 5) => {
		return {
			serverId,
			condemnedMember,
			newSoulMade: false,
			settings: {
				paused: false,
				condemnedRoleId,
				channelId,
				modRole,
			},
			schedule: {
				next: {
					time: null,
					soulTypeId: null,
				},
				past: {
					time: null,
					soulTypeId: null,
				},
				meanDelay,
				variation,
			},
			stats: {
				serverSoulsCaught: 0,
				hauntingsCount: 0,
				soulsCreated: 0,
				lastCondemnedMember: 0,
			},
		};
	},

	getServerDataFromMemory: (client, guildIdString) => {
		if (client.nateBotData === null) {
			return null;
		}
		if (guildIdString in client.nateBotData) {
			return client.nateBotData[guildIdString];
		} else {
			return null;
		}
	},

	updateAppearancesWith: (dayjsObj, soulType, client, guildIdString) => {
		const serverDataObject = module.exports.getServerDataFromMemory(client, guildIdString);
		if (serverDataObject === null) throw new Error(`Error in replaceEarlierAppearance: Server data object does not exist in memory: key ${guildIdString} in data:\n${client.nateBotData}`);
		client.nateBotData[guildIdString].schedule = { ...serverDataObject.schedule, next: { when: dayjsObj, soulType }, past: serverDataObject.schedule.next };
		// console.log(`next is ${JSON.stringify(serverDataObject.schedule.next)}, past is ${JSON.stringify(serverDataObject.schedule.past)}`);
		// console.log(client.nateBotData['672609929495969813'].schedule);
	},
};
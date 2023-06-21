const profileModel = require ('../models/profileSchema');
const profileModelGuild = require ('../models/profileSchemaGuild');

module.exports = {
	name: 'set',
	setValue : async (interaction, id, datapoint, value) => {
		try {
			await profileModel.findOneAndUpdate({ fetcherID: id }, {
				$set: {
					[datapoint]: value,
				},
			});
		} catch (err) {
			console.log(err);
		}
	},
	settingsAvailable: {
		'paused': 'boolean',
		'condemnedRoleId': 'string',
		'schedule.meanDelay': 'number',
		'schedule.variation': 'number',
	},
	setServerSetting: async (guildId, setting, newValue) => {
		if (setting in module.exports.settingsAvailable && typeof newValue === module.exports.settingsAvailable[setting]) {
			try {
				if (setting.contains('schedule.')) {
					await profileModelGuild.findOneAndUpdate({ serverId: guildId }, {
						$set: {
							'schedule': {
								[setting]: newValue,
							},
						},
					});
				} else {
					await profileModelGuild.findOneAndUpdate({ serverId: guildId }, {
						$set: {
							[setting]: newValue,
						},
					});
				}
			} catch (err) {
				console.log(err);
			}
		} else {
			throw new Error(`Error in set.js: invalid setting or type for ${setting}: ${newValue}`);
		}
	},
};
const { MessageEmbed, MessageButton } = require('discord.js');
const { editInteraction } = require('../events/editInteraction');
const { getActionRow } = require('../events/getActionRow');
const { getSoulData } = require('../events/query');
const { getGuildData } = require('../events/guildquery');
const profileModel = require ('../models/profileSchema');
const { getMemory } = require('../functions/serverData');
const dayjs = require('dayjs');

module.exports = {
	name: 'serverStatsButton',
	data: new MessageButton()
		.setCustomId('serverStatsButton')
		.setLabel('Server Stats 📊')
		.setStyle('SECONDARY'),
    
	async execute(interaction) {
		const guildData = await getGuildData(interaction);
		const condemnedData = await getSoulData(interaction, guildData.condemnedMember);
		const allFetchersDataOne = await profileModel.find({ serverID: interaction.guild.id }).sort({ souls: -1, soulsCaught: -1 });
		const allFetchersData = [];
		for (const i in allFetchersDataOne) {
			if (allFetchersDataOne[i].fetcherID !== condemnedData.fetcherID) {
				allFetchersData.push(allFetchersDataOne[i]);
			}
		}
		let nextAppearanceBounds;
		try {
			nextAppearanceBounds = getMemory(interaction.client, interaction.guild.id).nextAppearanceBounds;
		} catch (err) {
			nextAppearanceBounds = '???';
		}
		const pastTime = guildData.schedule.past.time ? dayjs(guildData.schedule.past.time).format('MM/DD/YYYY h:mm A') : 'None yet...';

		const serverEmbed = new MessageEmbed()
			.setColor('GREEN')
			.setTitle(`__***${interaction.guild.name}'s Stats***__`)
			.setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
			.setThumbnail(interaction.guild.iconURL({ dynamic: true }))
			.addFields(
				{ name: '__**T̸̪́Ḥ̷̞̏̔Ē̵̦ ̶̰̍̀C̴̟͇͒̑O̸͈̊Ņ̸̱̀D̵̼͌Ĕ̴̝̕M̶̢̎̀Ń̵̦͆Ĕ̷̡͈͝D̵̬͗̓**__', value: `👹 **${condemnedData.fetcherTag}** 👹` },
			)
			.addFields(
				{ name: '---------------------------------', value: ' ' },
				{ name: 'Next Appearance ⏭️', value: `Between ${nextAppearanceBounds}` },
				{ name: 'Last Appearance ⏮️', value: `*${pastTime}*` },
				{ name: '---------------------------------', value: ' ' });
		
		try {
			serverEmbed.addFields({ name: '__**Top Fetchers 📊**__', value: `__**#1 - ${allFetchersData[0].fetcherTag}:**__ ${allFetchersData[0].souls} souls\n__**#2 - ${allFetchersData[1].fetcherTag}:**__ ${allFetchersData[1].souls} souls\n__**#3 - ${allFetchersData[2].fetcherTag}:**__ ${allFetchersData[2].souls} souls` });
		} catch (error) {
			serverEmbed.addFields({ name: '__**Top Fetchers 📊**__', value: 'Not Enough Fetchers' });
		}
		serverEmbed.setImage('https://i.imgur.com/bJDpP4T.jpeg');
		serverEmbed.setTimestamp();
		serverEmbed.setFooter({ text: 'Developed by Zade Dohan and Corey Briscoe' });
    
		const finalComponents = await getActionRow(interaction);
            
		const data = { embeds : [serverEmbed], components: [finalComponents] };
    
		try {
			await editInteraction(interaction, data);
			await interaction.deferUpdate();
		} catch (error) {
			// await interaction.reply({ content: 'There was an error', ephemeral: true });
			console.log(error);
		}
	},
};
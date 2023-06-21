const { MessageButton } = require('discord.js');
const { getEmbed } = require('../embeds/getEmbed');
const { editInteraction } = require('../events/editInteraction');
const { getActionRow } = require('../events/getActionRow');

module.exports = {
	name: 'backButton',
	data: new MessageButton()
		.setCustomId('backButton')
		.setLabel('⬅ Back')
		.setStyle('SUCCESS'),
	
	async execute(interaction) {
		const target = interaction.client.usersCurrentTarget[interaction.user.id];
		const finalEmbed = await getEmbed(interaction, target);
		const finalComponents = await getActionRow(interaction, target);

		const data = { embeds : [finalEmbed], components : [finalComponents] };
		try {
			await editInteraction(interaction, data);
			await interaction.deferUpdate();
			interaction.client.usersCurrentTarget = { ...interaction.client.usersCurrentTarget, [interaction.user.id] : target };
		} catch (error) {
			console.error('Error in myProfileButton.js: ' + error);
			return;
		}
	},
};
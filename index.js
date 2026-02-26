require('dotenv').config();
const { 
    Client, 
    GatewayIntentBits, 
    REST, 
    Routes, 
    SlashCommandBuilder,
    PermissionFlagsBits
} = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers
    ]
});

const commands = [
    new SlashCommandBuilder()
        .setName('addrole')
        .setDescription('Add a role to a user')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('User to add role to')
                .setRequired(true))
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('Role to add')
                .setRequired(true)),

    new SlashCommandBuilder()
        .setName('removerole')
        .setDescription('Remove a role from a user')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('User to remove role from')
                .setRequired(true))
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('Role to remove')
                .setRequired(true))
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
    try {

    if (interaction.commandName === 'addrole') {

        if (member.roles.cache.has(role.id)) {
            return interaction.reply({
                content: `⚠️ ${user.tag} already has the ${role.name} role.`,
                ephemeral: true
            });
        }

        await member.roles.add(role);

        return interaction.reply({
            content: `✅ Successfully added ${role.name} to ${user.tag}.`
        });
    }

    if (interaction.commandName === 'removerole') {

        if (!member.roles.cache.has(role.id)) {
            return interaction.reply({
                content: `⚠️ ${user.tag} does not have the ${role.name} role.`,
                ephemeral: true
            });
        }

        await member.roles.remove(role);

        return interaction.reply({
            content: `✅ Successfully removed ${role.name} from ${user.tag}.`
        });
    }

} catch (err) {
    console.error(err);
    return interaction.reply({
        content: "⚠️ Error modifying role. Check bot permissions and role hierarchy.",
        ephemeral: true
    });
}


client.login(process.env.TOKEN);

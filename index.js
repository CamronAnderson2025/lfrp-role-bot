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
        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands }
        );
        console.log('Slash commands registered.');
    } catch (error) {
        console.error(error);
    }
})();

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const hrRole = interaction.guild.roles.cache.find(r => r.name === "Department Human Resources");

    if (!interaction.member.roles.cache.has(hrRole?.id)) {
        return interaction.reply({ content: "❌ You do not have permission to use this command.", ephemeral: true });
    }

    const user = interaction.options.getUser('user');
    const role = interaction.options.getRole('role');
    const member = await interaction.guild.members.fetch(user.id);

    try {
        if (interaction.commandName === 'addrole') {
            await member.roles.add(role);
            await interaction.reply({ content: `✅ Added ${role.name} to ${user.tag}` });
        }

        if (interaction.commandName === 'removerole') {
            await member.roles.remove(role);
            await interaction.reply({ content: `✅ Removed ${role.name} from ${user.tag}` });
        }
    } catch (err) {
        console.error(err);
        interaction.reply({ content: "⚠️ Error modifying role.", ephemeral: true });
    }
});

client.login(process.env.TOKEN);
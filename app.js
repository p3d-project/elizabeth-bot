import 'dotenv/config';
import fs from 'fs';
import { Client, GatewayIntentBits, Events, ChannelType } from 'discord.js';
const configPath = './config.json';

// --- CONFIG MANAGEMENT ---
function loadConfig() {
  if (fs.existsSync(configPath)) {
    return JSON.parse(fs.readFileSync(configPath, 'utf8'));
  }
  return { APPLICANT_ROLE_ID: null, TEAM_LEAD_ROLE_ID: null, APP_CHANNEL_ID: null, FORM_LINK: null };
}

function saveConfig(config) {
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
}

let appConfig = loadConfig();

// --- BOT INITIALIZATION ---
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers // Required to listen to role changes
  ]
});

client.once(Events.ClientReady, c => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
});

// --- AUTOMATED ONBOARDING TRIGGER ---
client.on(Events.GuildMemberUpdate, async (oldMember, newMember) => {
  if (!appConfig.APPLICANT_ROLE_ID || !appConfig.APP_CHANNEL_ID || !appConfig.FORM_LINK) return;

  const hadRole = oldMember.roles.cache.has(appConfig.APPLICANT_ROLE_ID);
  const hasRole = newMember.roles.cache.has(appConfig.APPLICANT_ROLE_ID);

  // If the user JUST received the trigger role from Discord Onboarding
  if (!hadRole && hasRole) {
    try {
      const channel = await newMember.guild.channels.fetch(appConfig.APP_CHANNEL_ID);
      if (!channel) return;

      // Create the private thread
      const thread = await channel.threads.create({
        name: `app-${newMember.user.username}`,
        type: ChannelType.PrivateThread,
        invitable: false
      });

      // Ping user and send instructions
      await thread.send(`Welcome <@${newMember.id}>!\n\nTo continue your application, please fill out this form: **[Team Application Form](${appConfig.FORM_LINK})**\n\nOnce completed, our Team Leads (<@&${appConfig.TEAM_LEAD_ROLE_ID}>) will review it and reply to you directly in this thread.`);

    } catch (error) {
      console.error('Failed to execute automated workflow:', error);
    }
  }
});

// --- SLASH COMMANDS ---
client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;

  if (commandName === 'set_config') {
    appConfig.APPLICANT_ROLE_ID = interaction.options.getRole('applicant_role').id;
    appConfig.TEAM_LEAD_ROLE_ID = interaction.options.getRole('team_lead_role').id;
    appConfig.APP_CHANNEL_ID = interaction.options.getChannel('app_channel').id;
    appConfig.FORM_LINK = interaction.options.getString('form_link');
    saveConfig(appConfig);

    await interaction.reply({ content: '✅ Configuration saved successfully!', ephemeral: true });
  }

  if (commandName === 'approve') {
    const targetMember = await interaction.guild.members.fetch(interaction.options.getUser('user').id);
    
    // Gather all provided roles
    const rolesToAssign = [
      interaction.options.getRole('role1'),
      interaction.options.getRole('role2'),
    ].filter(role => role !== null);

    try {
      for (const role of rolesToAssign) {
        await targetMember.roles.add(role.id);
      }
      
      const roleMentions = rolesToAssign.map(r => `<@&${r.id}>`).join(', ');
      await interaction.reply({ content: `✅ Application approved for: ${roleMentions}. Welcome to the team!` });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: '❗️ Failed to assign roles. Check bot hierarchy.', ephemeral: true });
    }
  }

  if (commandName === 'reject') {
    const rolesToReject = [
      interaction.options.getRole('role1'),
      interaction.options.getRole('role2'),
    ].filter(role => role !== null);

    const roleMentions = rolesToReject.length > 0 
      ? rolesToReject.map(r => `<@&${r.id}>`).join(', ') 
      : 'all applied positions';

    await interaction.reply({ content: `❌ Application declined for: ${roleMentions}. Feel free to apply again at a later date.` });
  }

  if (commandName === 'close_ticket') {
    const targetMember = await interaction.guild.members.fetch(interaction.options.getUser('user').id);
    
    try {
      await targetMember.roles.remove(appConfig.APPLICANT_ROLE_ID);
      await interaction.reply({ content: '❗️ Ticket closed. Archiving thread in 5 seconds...' });

      setTimeout(async () => {
        try {
          await interaction.channel.setArchived(true);
          await interaction.channel.setLocked(true);
        } catch (err) {
          console.error('Non-fatal error archiving thread:', err);
        }
      }, 5000);
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: '❗️ Failed to remove applicant role.', ephemeral: true });
    }
  }
});

// Start the bot
client.login(process.env.DISCORD_TOKEN);
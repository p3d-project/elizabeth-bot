import 'dotenv/config';
import { REST, Routes, SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

const commands = [
  new SlashCommandBuilder()
    .setName('set_config')
    .setDescription('Configure the automated ticketing system (Admin only)')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addRoleOption(opt => opt.setName('applicant_role').setDescription('Applicant role').setRequired(true))
    .addRoleOption(opt => opt.setName('team_lead_role').setDescription('Team Lead role for pinging').setRequired(true))
    .addChannelOption(opt => opt.setName('app_channel').setDescription('Channel where private threads will be created').setRequired(true))
    .addStringOption(opt => opt.setName('form_link').setDescription('The Google Form link for applications').setRequired(true)),
    
  new SlashCommandBuilder()
    .setName('approve')
    .setDescription('Approve an applicant for one or more roles')
    .addUserOption(opt => opt.setName('user').setDescription('The applicant').setRequired(true))
    .addRoleOption(opt => opt.setName('role1').setDescription('First role').setRequired(true))
    .addRoleOption(opt => opt.setName('role2').setDescription('Second role').setRequired(false)),

  new SlashCommandBuilder()
    .setName('reject')
    .setDescription('Decline an applicant')
    .addUserOption(opt => opt.setName('user').setDescription('The applicant').setRequired(true))
    .addRoleOption(opt => opt.setName('role1').setDescription('First role to decline (leave empty for all)').setRequired(false))
    .addRoleOption(opt => opt.setName('role2').setDescription('Second role').setRequired(false)),

  new SlashCommandBuilder()
    .setName('close_ticket')
    .setDescription('Finish the application, remove Applicant role, and archive thread')
    .addUserOption(opt => opt.setName('user').setDescription('The applicant').setRequired(true))
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');
    await rest.put(Routes.applicationCommands(process.env.APP_ID), { body: commands });
    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();
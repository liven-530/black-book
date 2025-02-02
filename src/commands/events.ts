import {
  CacheType,
  ChatInputCommandInteraction,
  SlashCommandBooleanOption,
  SlashCommandBuilder,
  SlashCommandMentionableOption,
  SlashCommandStringOption,
} from 'discord.js';
import { dbWrapper } from '../bot';
import { deleteSubs } from './unsub';

const name = 'events';

const hellTideOptionName = 'helltide';
const hellTideOption = (option: SlashCommandBooleanOption) => option
    .setName(hellTideOptionName)
    .setDescription('enable alerts on upcoming helltides');

const worldBossOptionName = 'world-boss';
const worldBossOption = (option: SlashCommandBooleanOption) => option
    .setName(worldBossOptionName)
    .setDescription('enable alerts on upcoming world bosses');

const zoneEventOptionName = 'zone-event';
const zoneEventOption = (option: SlashCommandBooleanOption) => option
    .setName(zoneEventOptionName)
    .setDescription('enable alerts on upcoming zone events');

const hellTideRoleOptionName = 'helltide-role'
const hellTideRoleOption = (option: SlashCommandMentionableOption) => option
    .setName(hellTideRoleOptionName)
    .setDescription('set user or role to be alerted on upcoming helltides');

const worldBossRoleOptionName = 'world-boss-role'
const worldBossRoleOption = (option: SlashCommandMentionableOption) => option
    .setName(worldBossRoleOptionName)
    .setDescription('set user or role to be alerted on upcoming world bosses');

const zoneEventRoleOptionName = 'zone-event-role'
const zoneEventRoleOption = (option: SlashCommandMentionableOption) => option
    .setName(zoneEventRoleOptionName)
    .setDescription('set user or role to be alerted on upcoming zone events');

const allEventRoleOptionName = 'all-event-role';
const allEventRoleOption = (option: SlashCommandMentionableOption) => option
    .setName(allEventRoleOptionName)
    .setDescription('set user or role to be alerted on all events');


const eventsBuilder = new SlashCommandBuilder()
  .setName(name)
  .setDescription('get updates on helltides and world bosses')
  .addBooleanOption(hellTideOption)
  .addBooleanOption(worldBossOption)
  .addBooleanOption(zoneEventOption)
  .addMentionableOption(hellTideRoleOption)
  .addMentionableOption(worldBossRoleOption)
  .addMentionableOption(zoneEventRoleOption)
  .addMentionableOption(allEventRoleOption)


const events = (db: dbWrapper) => ({
  name,
  execute: async (interaction: ChatInputCommandInteraction<CacheType>) => {
    if ( !db ) {
      interaction.reply('db not initialized');
      return;
    }

    const hellTideEnabled = interaction.options.getBoolean(hellTideOptionName)
    const worldBossEnabled = interaction.options.getBoolean(worldBossOptionName)
    const zoneEventEnabled = interaction.options.getBoolean(zoneEventOptionName)
    const hellTideRole = interaction.options.getMentionable(hellTideRoleOptionName);
    const worldBossRole = interaction.options.getMentionable(worldBossRoleOptionName);
    const zoneEventRole = interaction.options.getMentionable(zoneEventRoleOptionName);
    const allEventRole = interaction.options.getMentionable(allEventRoleOptionName);

    const { error: deletionError } = await deleteSubs(db, interaction);
    if (deletionError) {
      console.error(deletionError);
      interaction.reply('something went wrong!');
      return;
    }

    const {error: insertionError} = await db
      .from('subscriptions')
      .insert([
        {
          channel_id: interaction.channelId,
          guild_id: interaction.guildId || 'unknown',
          helltide: hellTideEnabled === null ? true : hellTideEnabled,
          worldboss: worldBossEnabled === null ? true : worldBossEnabled,
          zoneevent: zoneEventEnabled || false,
          role: allEventRole?.toString(),
          boss_role: worldBossRole?.toString(),
          helltide_role: hellTideRole?.toString(),
          event_role: zoneEventRole?.toString(),
        },
      ])
      .select();
    if (insertionError) {
      console.error(insertionError);
      interaction.reply('something went wrong!');
      return;
    }
    interaction.reply('events will be posted in this channel! Use `/unsub` to stop event posts here. Use the `/events` command again to change your configuration.');
  },
});

export {eventsBuilder};
export default events;

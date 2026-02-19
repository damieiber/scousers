import mongoose from 'mongoose';
import dbConnect from '../lib/mongodb';
import Team from '../lib/models/Team';
import Source from '../lib/models/Source';

const TEAMS = [
  {
    key: 'liverpool',
    name: 'Liverpool FC',
    colors: { primary: '#C8102E', secondary: '#F6EB61' },
    competitions: ['Premier League', 'Champions League', 'FA Cup', 'Carabao Cup'],
    keywords: ['Liverpool FC', 'Anfield', 'Klopp', 'Salah', 'Reds']
  },
  {
    key: 'everton',
    name: 'Everton',
    colors: { primary: '#003399', secondary: '#FFFFFF' },
    competitions: ['Premier League', 'FA Cup', 'Carabao Cup'],
    keywords: ['Everton', 'Toffees', 'Goodison Park', 'Dyche']
  }
];

const SOURCES = [
  {
    name: 'Liverpool FC Official',
    url: 'https://www.liverpoolfc.com/news',
    team_key: 'liverpool'
  },
  {
    name: 'This Is Anfield',
    url: 'https://www.thisisanfield.com/',
    team_key: 'liverpool'
  },
  {
    name: 'Empire of the Kop',
    url: 'https://www.empireofthekop.com/',
    team_key: 'liverpool'
  },
  {
    name: 'Liverpool Echo',
    url: 'https://www.liverpoolecho.co.uk/all-about/liverpool-fc',
    team_key: 'liverpool'
  },
    {
    name: 'Anfield Watch',
    url: 'https://anfieldwatch.co.uk/',
    team_key: 'liverpool'
  },
  {
    name: 'Rousing The Kop',
    url: 'https://www.rousingthekop.com/',
    team_key: 'liverpool'
  },
  {
    name: 'Everton FC Official',
    url: 'https://www.evertonfc.com/news',
    team_key: 'everton'
  },
  {
    name: 'ToffeeWeb',
    url: 'https://www.toffeeweb.com/',
    team_key: 'everton'
  },
  {
    name: 'GrandOldTeam',
    url: 'https://www.grandoldteam.com/news/',
    team_key: 'everton'
  },
  {
    name: 'Royal Blue Mersey',
    url: 'https://royalbluemersey.sbnation.com/',
    team_key: 'everton'
  },
    {
    name: 'Goodison News',
    url: 'https://www.goodisonnews.com/',
    team_key: 'everton'
  },
    {
    name: 'Prince Rupert\'s Tower',
    url: 'https://princerupertstower.com/',
    team_key: 'everton'
  }
];

async function seedTeamsAndSources() {
  await dbConnect();
  console.log('🌱 Seeding Teams and Sources...');

  // Keep track of created teams to assign IDs to sources
  const teamIdMap: Record<string, mongoose.Types.ObjectId> = {};

  // Seed Teams
  for (const teamData of TEAMS) {
    let team = await Team.findOne({ key: teamData.key });
    if (!team) {
      console.log(`Creating team: ${teamData.name}`);
      team = await Team.create(teamData);
    } else {
      console.log(`Updating team: ${teamData.name}`);
      team.set(teamData);
      await team.save();
    }
    teamIdMap[teamData.key] = team._id as mongoose.Types.ObjectId;
  }

  // Seed Sources
  for (const sourceData of SOURCES) {
    const teamId = teamIdMap[sourceData.team_key];
    if (!teamId) {
      console.warn(`Skipping source ${sourceData.name} - Team ${sourceData.team_key} not found.`);
      continue;
    }

    const exists = await Source.findOne({ url: sourceData.url });
    if (!exists) {
      console.log(`Creating source: ${sourceData.name}`);
      await Source.create({
        name: sourceData.name,
        url: sourceData.url,
        team_id: teamId,
        status: 'active'
      });
    } else {
      console.log(`Source exists: ${sourceData.name}`);
      exists.team_id = teamId; // Ensure relationship is correct
      await exists.save();
    }
  }

  console.log('✅ Teams and Sources seeded.');
  await mongoose.disconnect();
}

seedTeamsAndSources().catch(console.error);

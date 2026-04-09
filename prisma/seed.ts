import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import * as dotenv from 'dotenv';
dotenv.config();

import { CLUBS } from '../src/data/clubs';

const adapter = new PrismaNeon({ connectionString: process.env.DIRECT_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding clubs...');

  for (const club of CLUBS) {
    await prisma.club.upsert({
      where: { id: club.id },
      update: {},
      create: {
        id:              club.id,
        name:            club.name,
        category:        club.category,
        description:     club.description,
        shortDesc:       club.shortDesc,
        emoji:           club.emoji,
        color:           club.color,
        color2:          club.color2,
        memberCount:     club.memberCount,
        maxMembers:      club.maxMembers,
        isRecruiting:    club.isRecruiting,
        meetingDay:      club.meetingDay,
        meetingPlace:    club.meetingPlace,
        establishedYear: club.establishedYear,
        tags:            JSON.stringify(club.tags),
        president:       club.president,
        likes:           club.likes,
        postCount:       club.postCount,
        snsUrl:          club.snsUrl ?? null,
      },
    });
  }

  console.log('Done!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
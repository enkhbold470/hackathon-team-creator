import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient(); 
import seedData from '../applications.json' with { type: 'json' };
import { User } from '@/lib/types';

async function main() {
 
  console.log('Starting to seed the database...');

  // Create users
  for (const user of seedData) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, created_at, updated_at, ...userData } = user as any; // Destructure to remove id and dates

    const dataToCreate: any = { ...userData };

    if (created_at && typeof created_at === 'string') {
      dataToCreate.created_at = new Date(created_at.replace(' ', 'T') + 'Z');
    }
    if (updated_at && typeof updated_at === 'string') {
      dataToCreate.updated_at = new Date(updated_at.replace(' ', 'T') + 'Z');
    }

    await prisma.user.create({
      data: dataToCreate as User 
      
    });
  }

  console.log('Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 
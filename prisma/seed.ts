import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient(); 
import seedData from '../applications.json' with { type: 'json' };

interface Application {
  user_id: string;
  cwid?: string;
  full_name?: string;
  discord?: string;
  skill_level?: string;
  hackathon_experience?: string;
  hear_about_us?: string;
  why_attend?: string;
  project_experience?: string;
  future_plans?: string;
  fun_fact?: string;
  self_description?: string;
  links?: string;
  teammates?: string;
  referral_email?: string;
  dietary_restrictions_extra?: string;
  tshirt_size?: string;
  agree_to_terms: boolean;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

async function main() {
 
  console.log('Starting to seed the database...');

  // Create applications
  for (const application of seedData) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, created_at, updated_at, ...applicationData } = application as any; // Destructure to remove id and dates

    const dataToCreate: any = { ...applicationData };

    if (created_at && typeof created_at === 'string') {
      dataToCreate.created_at = new Date(created_at.replace(' ', 'T') + 'Z');
    }
    if (updated_at && typeof updated_at === 'string') {
      dataToCreate.updated_at = new Date(updated_at.replace(' ', 'T') + 'Z');
    }

    await prisma.application.create({
      data: dataToCreate as Application 
      
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
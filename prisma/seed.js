const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const seedData = [
    {
      userId: 'user_2w4iVs7wAQoSrlzCKEqLi0iH8sE',
      cwid: '12345678',
      fullName: 'Alice Johnson',
      discord: 'alice#1111',
      skillLevel: 'Beginner',
      hackathonExperience: 'First timer',
      hearAboutUs: 'Discord',
      whyAttend: 'To learn and build something cool',
      projectExperience: 'Built a weather app with React',
      futurePlans: 'Become a frontend developer',
      funFact: 'I have a pet turtle',
      selfDescription: 'Curious and fast learner',
      links: 'https://github.com/alice',
      teammates: 'bob@dahacks.com,charlie@dahacks.com',
      referralEmail: 'referral@dahacks.com',
      dietaryRestrictionsExtra: 'Vegan',
      tshirtSize: 'M',
      agreeToTerms: true,
      status: 'submitted'
    },
    {
      userId: 'user_3xqKdL9zBYmXutGHwPpRb4Na0cTy',
      cwid: '87654321',
      fullName: 'Bob Smith',
      discord: 'bob#2222',
      skillLevel: 'Intermediate',
      hackathonExperience: 'Participated in 2 hackathons',
      hearAboutUs: 'Instagram',
      whyAttend: 'Looking to network and explore ideas',
      projectExperience: 'Built a to-do list with Firebase',
      futurePlans: 'Start a tech company',
      funFact: 'I juggle in my free time',
      selfDescription: 'Creative and driven',
      links: 'https://bob.dev',
      teammates: '',
      referralEmail: '',
      dietaryRestrictionsExtra: '',
      tshirtSize: 'L',
      agreeToTerms: true,
      status: 'submitted'
    },
    {
      userId: 'user_J0uVxKwQ8AcR5Zel9FtHCBgN2pWu',
      cwid: '13579246',
      fullName: 'Clara Zheng',
      discord: 'clara#3333',
      skillLevel: 'Advanced',
      hackathonExperience: 'Won 1st prize at MLH',
      hearAboutUs: 'Twitter',
      whyAttend: 'Challenge myself with new APIs',
      projectExperience: 'Created a crypto tracker app',
      futurePlans: 'Contribute to open source',
      funFact: 'I can solve a Rubik\'s cube blindfolded',
      selfDescription: 'Loves AI and design',
      links: 'https://claraz.dev',
      teammates: 'dan@hack.xyz',
      referralEmail: '',
      dietaryRestrictionsExtra: '',
      tshirtSize: 'S',
      agreeToTerms: true,
      status: 'submitted'
    },
    {
      userId: 'user_AqE0yLtW73JkcUZvF6DpNH2mwfxl',
      cwid: '19283746',
      fullName: 'Daniel Lee',
      discord: 'daniel#4444',
      skillLevel: 'Beginner',
      hackathonExperience: 'Attended 1 online hackathon',
      hearAboutUs: 'Class',
      whyAttend: 'To learn teamwork and project building',
      projectExperience: 'Made a Python CLI tool',
      futurePlans: 'Get internship next summer',
      funFact: 'I play 5 instruments',
      selfDescription: 'Energetic and focused',
      links: '',
      teammates: '',
      referralEmail: '',
      dietaryRestrictionsExtra: 'Halal',
      tshirtSize: 'M',
      agreeToTerms: true,
      status: 'submitted'
    },
    {
      userId: 'user_MZkTy09HEfNqgBL3aWuvYDseC24p',
      cwid: '11235813',
      fullName: 'Emily Nguyen',
      discord: 'emily#5555',
      skillLevel: 'Intermediate',
      hackathonExperience: 'Helped build a fintech app',
      hearAboutUs: 'Friend',
      whyAttend: 'Make a social impact',
      projectExperience: 'Developed an expense tracker',
      futurePlans: 'Launch my own startup',
      funFact: "I've never missed a hackathon",
      selfDescription: 'Social and full of ideas',
      links: 'https://emily.codes',
      teammates: '',
      referralEmail: 'friend@uni.edu',
      dietaryRestrictionsExtra: '',
      tshirtSize: 'XS',
      agreeToTerms: true,
      status: 'submitted'
    }
  ];

  console.log('Starting to seed the database...');

  // Create applications
  for (const application of seedData) {
    await prisma.application.create({
      data: application
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
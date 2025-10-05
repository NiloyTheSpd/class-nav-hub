import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // Create sample users
  const user1 = await prisma.user.upsert({
    where: { email: 'john.doe@example.com' },
    update: {},
    create: {
      email: 'john.doe@example.com',
      firstName: 'John',
      lastName: 'Doe',
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'jane.smith@example.com' },
    update: {},
    create: {
      email: 'jane.smith@example.com',
      firstName: 'Jane',
      lastName: 'Smith',
    },
  });

  const user3 = await prisma.user.upsert({
    where: { email: 'bob.tutor@example.com' },
    update: {},
    create: {
      email: 'bob.tutor@example.com',
      firstName: 'Bob',
      lastName: 'Wilson',
    },
  });

  // Create sample students
  const student1 = await prisma.student.upsert({
    where: { userId: user1.id },
    update: {},
    create: {
      userId: user1.id,
      grade: '10th Grade',
      attendance: 95.5,
    },
  });

  const student2 = await prisma.student.upsert({
    where: { userId: user2.id },
    update: {},
    create: {
      userId: user2.id,
      grade: '11th Grade',
      attendance: 88.0,
    },
  });

  // Create sample tutor
  const tutor1 = await prisma.tutor.upsert({
    where: { userId: user3.id },
    update: {},
    create: {
      userId: user3.id,
      earnings: 1500.0,
    },
  });

  // Create sample sessions
  const now = new Date();
  const futureDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
  const pastDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days ago

  await prisma.session.create({
    data: {
      title: 'Math Tutoring',
      description: 'Algebra and geometry review',
      startTime: futureDate,
      endTime: new Date(futureDate.getTime() + 60 * 60 * 1000), // 1 hour later
      studentId: student1.id,
      tutorId: tutor1.id,
    },
  });

  await prisma.session.create({
    data: {
      title: 'Science Tutoring',
      description: 'Physics concepts',
      startTime: pastDate,
      endTime: new Date(pastDate.getTime() + 60 * 60 * 1000), // 1 hour later
      studentId: student2.id,
      tutorId: tutor1.id,
    },
  });

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

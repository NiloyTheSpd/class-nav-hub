import 'dotenv/config';
import express from 'express';
import { clerkMiddleware } from '@clerk/express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(clerkMiddleware());

app.get('/', (req, res) => {
  res.send('Hello from Express.js backend!');
});

// Protected route example
app.get('/protected', (req, res) => {
  res.json({ message: 'You are authenticated!', userId: req.auth.userId });
});

// Students CRUD
app.get('/students', async (req, res) => {
  const students = await prisma.student.findMany();
  res.json(students);
});

app.post('/students', async (req, res) => {
  const newStudent = await prisma.student.create({ data: req.body });
  res.status(201).json(newStudent);
});

app.get('/students/:id', async (req, res) => {
  const student = await prisma.student.findUnique({ where: { id: req.params.id } });
  res.json(student);
});

app.put('/students/:id', async (req, res) => {
  const updatedStudent = await prisma.student.update({
    where: { id: req.params.id },
    data: req.body,
  });
  res.json(updatedStudent);
});

app.delete('/students/:id', async (req, res) => {
  await prisma.student.delete({ where: { id: req.params.id } });
  res.status(204).send();
});

// Tutors CRUD
app.get('/tutors', async (req, res) => {
  const tutors = await prisma.tutor.findMany();
  res.json(tutors);
});

app.post('/tutors', async (req, res) => {
  const newTutor = await prisma.tutor.create({ data: req.body });
  res.status(201).json(newTutor);
});

app.get('/tutors/:id', async (req, res) => {
  const tutor = await prisma.tutor.findUnique({ where: { id: req.params.id } });
  res.json(tutor);
});

app.put('/tutors/:id', async (req, res) => {
  const updatedTutor = await prisma.tutor.update({
    where: { id: req.params.id },
    data: req.body,
  });
  res.json(updatedTutor);
});

app.delete('/tutors/:id', async (req, res) => {
  await prisma.tutor.delete({ where: { id: req.params.id } });
  res.status(204).send();
});

// Sessions CRUD
app.get('/sessions', async (req, res) => {
  const sessions = await prisma.session.findMany();
  res.json(sessions);
});

app.post('/sessions', async (req, res) => {
  const newSession = await prisma.session.create({ data: req.body });
  res.status(201).json(newSession);
});

app.get('/sessions/:id', async (req, res) => {
  const session = await prisma.session.findUnique({ where: { id: req.params.id } });
  res.json(session);
});

app.put('/sessions/:id', async (req, res) => {
  const updatedSession = await prisma.session.update({
    where: { id: req.params.id },
    data: req.body,
  });
  res.json(updatedSession);
});

app.delete('/sessions/:id', async (req, res) => {
  await prisma.session.delete({ where: { id: req.params.id } });
  res.status(204).send();
});

// Reports CRUD
app.get('/reports', async (req, res) => {
  const reports = await prisma.report.findMany();
  res.json(reports);
});

app.post('/reports', async (req, res) => {
  const newReport = await prisma.report.create({ data: req.body });
  res.status(201).json(newReport);
});

app.get('/reports/:id', async (req, res) => {
  const report = await prisma.report.findUnique({ where: { id: req.params.id } });
  res.json(report);
});

app.put('/reports/:id', async (req, res) => {
  const updatedReport = await prisma.report.update({
    where: { id: req.params.id },
    data: req.body,
  });
  res.json(updatedReport);
});

app.delete('/reports/:id', async (req, res) => {
  await prisma.report.delete({ where: { id: req.params.id } });
  res.status(204).send();
});

// Settings CRUD
app.get('/settings', async (req, res) => {
  const settings = await prisma.setting.findMany({ where: { userId: req.auth.userId } });
  res.json(settings);
});

app.post('/settings', async (req, res) => {
  const newSetting = await prisma.setting.create({ data: { ...req.body, userId: req.auth.userId } });
  res.status(201).json(newSetting);
});

app.put('/settings', async (req, res) => {
  const updatedSetting = await prisma.setting.updateMany({
    where: { userId: req.auth.userId },
    data: req.body,
  });
  res.json(updatedSetting);
});

app.get('/debug-db', async (req, res) => {
  try {
    const tables = await prisma.$queryRaw`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`;
    res.json(tables);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.listen(port, () => {
  console.log(`Backend server running on port ${port}`);
  console.log(`DATABASE_URL: ${process.env.DATABASE_URL}`);
});

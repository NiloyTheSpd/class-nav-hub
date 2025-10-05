import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { clerkMiddleware } from '@clerk/express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();
const port = process.env.PORT || 3001;

// Enable CORS for the frontend
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8080',
  credentials: true,
}));

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
  try {
    const students = await prisma.student.findMany({
      include: {
        user: true,
      },
    });
    
    // Transform data to match frontend expectations
    const transformedStudents = students.map((student: any) => ({
      id: student.id,
      name: student.user.firstName && student.user.lastName 
        ? `${student.user.firstName} ${student.user.lastName}`
        : student.user.email,
      grade: student.grade || 'N/A',
      attendance: student.attendance || 0,
      sessions: 0, // This would need to be calculated or joined
    }));
    
    res.json(transformedStudents);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

app.post('/students', async (req, res) => {
  try {
    const newStudent = await prisma.student.create({ data: req.body });
    res.status(201).json(newStudent);
  } catch (error) {
    console.error('Error creating student:', error);
    res.status(500).json({ error: 'Failed to create student' });
  }
});

app.get('/students/:id', async (req, res) => {
  try {
    const student = await prisma.student.findUnique({ 
      where: { id: req.params.id },
      include: {
        user: true,
      },
    });
    
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    
    res.json(student);
  } catch (error) {
    console.error('Error fetching student:', error);
    res.status(500).json({ error: 'Failed to fetch student' });
  }
});

app.put('/students/:id', async (req, res) => {
  try {
    const updatedStudent = await prisma.student.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(updatedStudent);
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({ error: 'Failed to update student' });
  }
});

app.delete('/students/:id', async (req, res) => {
  try {
    await prisma.student.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ error: 'Failed to delete student' });
  }
});

// Tutors CRUD
app.get('/tutors', async (req, res) => {
  try {
    const tutors = await prisma.tutor.findMany({
      include: {
        user: true,
      },
    });
    
    // Transform data to match frontend expectations
    const transformedTutors = tutors.map((tutor: any) => ({
      id: tutor.id,
      name: tutor.user.firstName && tutor.user.lastName 
        ? `${tutor.user.firstName} ${tutor.user.lastName}`
        : tutor.user.email,
      earnings: tutor.earnings || 0,
    }));
    
    res.json(transformedTutors);
  } catch (error) {
    console.error('Error fetching tutors:', error);
    res.status(500).json({ error: 'Failed to fetch tutors' });
  }
});

app.post('/tutors', async (req, res) => {
  try {
    const newTutor = await prisma.tutor.create({ data: req.body });
    res.status(201).json(newTutor);
  } catch (error) {
    console.error('Error creating tutor:', error);
    res.status(500).json({ error: 'Failed to create tutor' });
  }
});

app.get('/tutors/:id', async (req, res) => {
  try {
    const tutor = await prisma.tutor.findUnique({ 
      where: { id: req.params.id },
      include: {
        user: true,
      },
    });
    
    if (!tutor) {
      return res.status(404).json({ error: 'Tutor not found' });
    }
    
    res.json(tutor);
  } catch (error) {
    console.error('Error fetching tutor:', error);
    res.status(500).json({ error: 'Failed to fetch tutor' });
  }
});

app.put('/tutors/:id', async (req, res) => {
  try {
    const updatedTutor = await prisma.tutor.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(updatedTutor);
  } catch (error) {
    console.error('Error updating tutor:', error);
    res.status(500).json({ error: 'Failed to update tutor' });
  }
});

app.delete('/tutors/:id', async (req, res) => {
  try {
    await prisma.tutor.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting tutor:', error);
    res.status(500).json({ error: 'Failed to delete tutor' });
  }
});

// Sessions CRUD
app.get('/sessions', async (req, res) => {
  try {
    const sessions = await prisma.session.findMany({
      include: {
        student: {
          include: {
            user: true,
          },
        },
        tutor: {
          include: {
            user: true,
          },
        },
      },
    });
    
    // Transform data to match frontend expectations
    const transformedSessions = sessions.map((session: any) => ({
      id: session.id,
      title: session.title,
      description: session.description,
      date: session.startTime.toISOString().split('T')[0],
      startTime: session.startTime,
      endTime: session.endTime,
      studentId: session.studentId,
      studentName: session.student.user.firstName && session.student.user.lastName
        ? `${session.student.user.firstName} ${session.student.user.lastName}`
        : session.student.user.email,
      tutorId: session.tutorId,
      tutorName: session.tutor.user.firstName && session.tutor.user.lastName
        ? `${session.tutor.user.firstName} ${session.tutor.user.lastName}`
        : session.tutor.user.email,
      status: session.endTime < new Date() ? 'Completed' : 'Upcoming',
    }));
    
    res.json(transformedSessions);
  } catch (error) {
    console.error('Error fetching sessions:', error);
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

app.post('/sessions', async (req, res) => {
  try {
    const newSession = await prisma.session.create({ data: req.body });
    res.status(201).json(newSession);
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({ error: 'Failed to create session' });
  }
});

app.get('/sessions/:id', async (req, res) => {
  try {
    const session = await prisma.session.findUnique({ 
      where: { id: req.params.id },
      include: {
        student: {
          include: {
            user: true,
          },
        },
        tutor: {
          include: {
            user: true,
          },
        },
      },
    });
    
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    res.json(session);
  } catch (error) {
    console.error('Error fetching session:', error);
    res.status(500).json({ error: 'Failed to fetch session' });
  }
});

app.put('/sessions/:id', async (req, res) => {
  try {
    const updatedSession = await prisma.session.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(updatedSession);
  } catch (error) {
    console.error('Error updating session:', error);
    res.status(500).json({ error: 'Failed to update session' });
  }
});

app.delete('/sessions/:id', async (req, res) => {
  try {
    await prisma.session.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting session:', error);
    res.status(500).json({ error: 'Failed to delete session' });
  }
});

// Reports CRUD
app.get('/reports', async (req, res) => {
  try {
    const reports = await prisma.report.findMany({
      include: {
        student: {
          include: {
            user: true,
          },
        },
      },
    });
    res.json(reports);
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
});

app.post('/reports', async (req, res) => {
  try {
    const newReport = await prisma.report.create({ data: req.body });
    res.status(201).json(newReport);
  } catch (error) {
    console.error('Error creating report:', error);
    res.status(500).json({ error: 'Failed to create report' });
  }
});

app.get('/reports/:id', async (req, res) => {
  try {
    const report = await prisma.report.findUnique({ 
      where: { id: req.params.id },
      include: {
        student: {
          include: {
            user: true,
          },
        },
      },
    });
    
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }
    
    res.json(report);
  } catch (error) {
    console.error('Error fetching report:', error);
    res.status(500).json({ error: 'Failed to fetch report' });
  }
});

app.put('/reports/:id', async (req, res) => {
  try {
    const updatedReport = await prisma.report.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(updatedReport);
  } catch (error) {
    console.error('Error updating report:', error);
    res.status(500).json({ error: 'Failed to update report' });
  }
});

app.delete('/reports/:id', async (req, res) => {
  try {
    await prisma.report.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting report:', error);
    res.status(500).json({ error: 'Failed to delete report' });
  }
});

// Settings CRUD
app.get('/settings', async (req, res) => {
  try {
    const settings = await prisma.setting.findMany({ where: { userId: req.auth.userId } });
    res.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

app.post('/settings', async (req, res) => {
  try {
    const newSetting = await prisma.setting.create({ data: { ...req.body, userId: req.auth.userId } });
    res.status(201).json(newSetting);
  } catch (error) {
    console.error('Error creating setting:', error);
    res.status(500).json({ error: 'Failed to create setting' });
  }
});

app.put('/settings', async (req, res) => {
  try {
    const updatedSetting = await prisma.setting.updateMany({
      where: { userId: req.auth.userId },
      data: req.body,
    });
    res.json(updatedSetting);
  } catch (error) {
    console.error('Error updating setting:', error);
    res.status(500).json({ error: 'Failed to update setting' });
  }
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

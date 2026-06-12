import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize SQLite Database
const dbPath = path.join(__dirname, 'meetings.db');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS meetings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    duration INTEGER NOT NULL,
    agenda TEXT,
    meetingType TEXT DEFAULT 'decision',
    includeOverhead BOOLEAN DEFAULT 0,
    includeOppCost BOOLEAN DEFAULT 0,
    engagement INTEGER DEFAULT 100,
    baseCost REAL NOT NULL,
    totalCost REAL NOT NULL,
    wastedCapital REAL NOT NULL,
    overheadCost REAL DEFAULT 0,
    opportunityCost REAL DEFAULT 0,
    rating INTEGER,
    notes TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS participants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    meetingId INTEGER NOT NULL,
    name TEXT NOT NULL,
    cost REAL NOT NULL,
    FOREIGN KEY (meetingId) REFERENCES meetings(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS meeting_tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    meetingId INTEGER NOT NULL,
    tag TEXT NOT NULL,
    FOREIGN KEY (meetingId) REFERENCES meetings(id) ON DELETE CASCADE
  );
`);

// API Routes

// GET all meetings
app.get('/api/meetings', (req, res) => {
  try {
    const meetings = db.prepare('SELECT * FROM meetings ORDER BY createdAt DESC').all();
    const meetingsWithParticipants = meetings.map(meeting => {
      const participants = db.prepare('SELECT * FROM participants WHERE meetingId = ?').all(meeting.id);
      const tags = db.prepare('SELECT tag FROM meeting_tags WHERE meetingId = ?').all(meeting.id).map(t => t.tag);
      return { ...meeting, participants, tags };
    });
    res.json(meetingsWithParticipants);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single meeting by ID
app.get('/api/meetings/:id', (req, res) => {
  try {
    const meeting = db.prepare('SELECT * FROM meetings WHERE id = ?').get(req.params.id);
    if (!meeting) {
      return res.status(404).json({ error: 'Meeting not found' });
    }
    const participants = db.prepare('SELECT * FROM participants WHERE meetingId = ?').all(meeting.id);
    const tags = db.prepare('SELECT tag FROM meeting_tags WHERE meetingId = ?').all(meeting.id).map(t => t.tag);
    res.json({ ...meeting, participants, tags });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create new meeting
app.post('/api/meetings', (req, res) => {
  try {
    const {
      name,
      duration,
      agenda,
      meetingType,
      includeOverhead,
      includeOppCost,
      engagement,
      baseCost,
      totalCost,
      wastedCapital,
      overheadCost,
      opportunityCost,
      participants,
      tags,
    } = req.body;

    const stmt = db.prepare(`
      INSERT INTO meetings (
        name, duration, agenda, meetingType, includeOverhead, includeOppCost,
        engagement, baseCost, totalCost, wastedCapital, overheadCost, opportunityCost
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      name,
      duration,
      agenda,
      meetingType,
      includeOverhead ? 1 : 0,
      includeOppCost ? 1 : 0,
      engagement,
      baseCost,
      totalCost,
      wastedCapital,
      overheadCost,
      opportunityCost
    );

    const meetingId = result.lastInsertRowid;

    // Insert participants
    const participantStmt = db.prepare('INSERT INTO participants (meetingId, name, cost) VALUES (?, ?, ?)');
    if (participants && participants.length > 0) {
      participants.forEach(p => {
        participantStmt.run(meetingId, p.name, p.cost);
      });
    }

    // Insert tags
    const tagStmt = db.prepare('INSERT INTO meeting_tags (meetingId, tag) VALUES (?, ?)');
    if (tags && tags.length > 0) {
      tags.forEach(tag => {
        tagStmt.run(meetingId, tag);
      });
    }

    res.status(201).json({ id: meetingId, message: 'Meeting created successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update meeting
app.put('/api/meetings/:id', (req, res) => {
  try {
    const {
      name,
      duration,
      agenda,
      meetingType,
      includeOverhead,
      includeOppCost,
      engagement,
      baseCost,
      totalCost,
      wastedCapital,
      overheadCost,
      opportunityCost,
      rating,
      notes,
      participants,
      tags,
    } = req.body;

    const stmt = db.prepare(`
      UPDATE meetings SET
        name = ?, duration = ?, agenda = ?, meetingType = ?, includeOverhead = ?,
        includeOppCost = ?, engagement = ?, baseCost = ?, totalCost = ?, wastedCapital = ?,
        overheadCost = ?, opportunityCost = ?, rating = ?, notes = ?, updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    stmt.run(
      name,
      duration,
      agenda,
      meetingType,
      includeOverhead ? 1 : 0,
      includeOppCost ? 1 : 0,
      engagement,
      baseCost,
      totalCost,
      wastedCapital,
      overheadCost,
      opportunityCost,
      rating,
      notes,
      req.params.id
    );

    // Delete and recreate participants
    db.prepare('DELETE FROM participants WHERE meetingId = ?').run(req.params.id);
    const participantStmt = db.prepare('INSERT INTO participants (meetingId, name, cost) VALUES (?, ?, ?)');
    if (participants && participants.length > 0) {
      participants.forEach(p => {
        participantStmt.run(req.params.id, p.name, p.cost);
      });
    }

    // Delete and recreate tags
    db.prepare('DELETE FROM meeting_tags WHERE meetingId = ?').run(req.params.id);
    const tagStmt = db.prepare('INSERT INTO meeting_tags (meetingId, tag) VALUES (?, ?)');
    if (tags && tags.length > 0) {
      tags.forEach(tag => {
        tagStmt.run(req.params.id, tag);
      });
    }

    res.json({ message: 'Meeting updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE meeting
app.delete('/api/meetings/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM meetings WHERE id = ?').run(req.params.id);
    res.json({ message: 'Meeting deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET statistics
app.get('/api/statistics', (req, res) => {
  try {
    const stats = db.prepare(`
      SELECT
        COUNT(*) as totalMeetings,
        AVG(totalCost) as avgCost,
        SUM(totalCost) as totalCost,
        SUM(wastedCapital) as totalWasted,
        AVG(engagement) as avgEngagement
      FROM meetings
    `).get();

    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Database: ${dbPath}`);
});

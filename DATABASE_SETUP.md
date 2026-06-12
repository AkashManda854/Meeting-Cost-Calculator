# Meeting Cost Calculator - SQLite Backend Setup

## Overview
This project now includes SQLite database integration with a Node.js/Express backend API for persistent meeting storage.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     React Frontend                          │
│                    (Vite + React 18)                        │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTP/JSON
                     ↓
┌─────────────────────────────────────────────────────────────┐
│                   Express Server                            │
│                   (Node.js Backend)                         │
│              ┌──────────────────────────┐                   │
│              │   API Endpoints          │                   │
│              │   - GET /meetings        │                   │
│              │   - POST /meetings       │                   │
│              │   - PUT /meetings/:id    │                   │
│              │   - DELETE /meetings/:id │                   │
│              └──────────────┬───────────┘                   │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ↓
                    ┌────────────────┐
                    │ SQLite Database│
                    │  (meetings.db) │
                    └────────────────┘
```

## Installation

### 1. Install Dependencies
```bash
npm install
```

This installs both frontend and backend dependencies:
- **Frontend:** React, Vite, Tailwind CSS, Framer Motion, Lucide React
- **Backend:** Express, SQLite (better-sqlite3), CORS

### 2. Configure Environment
```bash
cp .env.example .env
```

Edit `.env` if your API server is running on a different URL:
```
VITE_API_URL=http://localhost:3001/api
```

## Running the Application

### Development Mode (Both Frontend & Backend)
```bash
npm run dev:all
```

This runs both:
- Frontend dev server on `http://localhost:5173`
- Backend API server on `http://localhost:3001`

### Backend Only
```bash
npm run server:dev
```

Uses `nodemon` for auto-restart on file changes.

### Frontend Only
```bash
npm run dev
```

## Database Schema

### Meetings Table
```sql
CREATE TABLE meetings (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  duration INTEGER NOT NULL,
  agenda TEXT,
  meetingType TEXT,
  includeOverhead BOOLEAN,
  includeOppCost BOOLEAN,
  engagement INTEGER,
  baseCost REAL,
  totalCost REAL,
  wastedCapital REAL,
  overheadCost REAL,
  opportunityCost REAL,
  rating INTEGER,
  notes TEXT,
  createdAt DATETIME,
  updatedAt DATETIME
);
```

### Participants Table
```sql
CREATE TABLE participants (
  id INTEGER PRIMARY KEY,
  meetingId INTEGER FOREIGN KEY,
  name TEXT NOT NULL,
  cost REAL NOT NULL
);
```

### Meeting Tags Table
```sql
CREATE TABLE meeting_tags (
  id INTEGER PRIMARY KEY,
  meetingId INTEGER FOREIGN KEY,
  tag TEXT NOT NULL
);
```

## API Endpoints

### Meetings

#### GET /api/meetings
Retrieve all meetings with participants and tags.

**Response:**
```json
[
  {
    "id": 1,
    "name": "Team Sync",
    "duration": 30,
    "totalCost": 250.00,
    "participants": [
      { "id": 1, "name": "John", "cost": 100 }
    ],
    "tags": ["standup"],
    "createdAt": "2024-01-15T10:30:00Z"
  }
]
```

#### GET /api/meetings/:id
Retrieve a single meeting by ID.

#### POST /api/meetings
Create a new meeting.

**Request:**
```json
{
  "name": "Team Sync",
  "duration": 30,
  "agenda": "Sprint planning",
  "meetingType": "decision",
  "includeOverhead": false,
  "includeOppCost": false,
  "engagement": 100,
  "baseCost": 250,
  "totalCost": 250,
  "wastedCapital": 0,
  "participants": [
    { "name": "John", "cost": 100 }
  ],
  "tags": ["standup"]
}
```

#### PUT /api/meetings/:id
Update an existing meeting.

#### DELETE /api/meetings/:id
Delete a meeting and its associated data.

#### GET /api/statistics
Get aggregate statistics of all meetings.

**Response:**
```json
{
  "totalMeetings": 10,
  "avgCost": 250.00,
  "totalCost": 2500.00,
  "totalWasted": 500.00,
  "avgEngagement": 85.5
}
```

## Frontend Integration

### Using the Storage Hook
```jsx
import { useMeetingStorage } from './hooks/useMeetingStorage';

export default function MyComponent() {
  const {
    meetings,
    loading,
    error,
    serverOnline,
    saveMeeting,
    updateMeeting,
    deleteMeeting,
    getStatistics
  } = useMeetingStorage();

  // Use the storage functions...
}
```

### Saving a Meeting
```jsx
const handleSaveMeeting = async () => {
  try {
    await saveMeeting({
      name: 'Team Sync',
      duration: 30,
      baseCost: 250,
      totalCost: 250,
      // ... other meeting data
      participants: participants,
      tags: extractedTags
    });
    console.log('Meeting saved to database!');
  } catch (err) {
    console.error('Failed to save:', err);
  }
};
```

## Files Structure

```
src/
├── api/
│   └── meetingsAPI.js          # API client functions
├── hooks/
│   └── useMeetingStorage.js    # Storage hook for React
├── components/
│   └── DatabaseStatus.jsx       # Connection status indicator
└── ...

server.js                          # Express backend server
.env                               # Environment variables
.env.example                       # Example env file
```

## Building for Production

### Build Frontend
```bash
npm run build
```

Outputs to `dist/` folder.

### Production Server
For production, you should:

1. Build the frontend: `npm run build`
2. Serve the built files from the Express server
3. Update `server.js` to serve static files from `dist/`

Example:
```javascript
import express from 'express';
import path from 'path';

const app = express();
const __dirname = path.dirname(new URL(import.meta.url).pathname);

// Serve static files from dist
app.use(express.static(path.join(__dirname, 'dist')));

// API routes...

// Serve index.html for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});
```

## Troubleshooting

### "Cannot connect to server"
- Ensure backend is running: `npm run server:dev`
- Check if port 3001 is already in use
- Check browser console for CORS errors

### "Database locked" errors
- Close any other database clients
- Ensure only one server instance is running

### Data not persisting
- Verify `meetings.db` file exists in project root
- Check folder permissions

## Future Enhancements

- [ ] User authentication
- [ ] Multi-user support with permissions
- [ ] Advanced filtering and search
- [ ] Data export (CSV, PDF)
- [ ] Meeting analytics and trends
- [ ] Cloud backup integration
- [ ] Mobile app support

## License

MIT

# 🚀 Quick Start - SQLite Backend Setup

## What's New? 🎉

The Meeting Cost Calculator now includes **persistent SQLite storage** with a full backend API!

### New Features:
- 💾 **SQLite Database** - All meetings saved persistently
- 🔌 **Express API** - RESTful endpoints for CRUD operations
- 🔄 **Real-time Sync** - Seamless data synchronization
- 📊 **Statistics** - Built-in analytics endpoints
- 🔌 **Connection Status** - Visual indicator for database connectivity

---

## Installation (First Time)

### Step 1: Install all dependencies
```bash
npm install
```

This installs:
- ✅ Frontend dependencies (React, Vite, Tailwind CSS, Framer Motion, Lucide React)
- ✅ Backend dependencies (Express, better-sqlite3, CORS)
- ✅ Dev tools (Nodemon, Concurrently)

### Step 2: Create environment file
```bash
copy .env.example .env
```
(Or manually create `.env` in the project root with):
```
VITE_API_URL=http://localhost:3001/api
```

---

## Running the Application

### Option 1: Run Both Frontend & Backend Together ⭐ (Recommended)
```bash
npm run dev:all
```

This automatically starts:
- 🎨 **Frontend** → http://localhost:5173
- 🔌 **Backend API** → http://localhost:3001

### Option 2: Run Frontend Only
```bash
npm run dev
```
- Frontend runs on http://localhost:5173
- Will use local storage if backend is not available

### Option 3: Run Backend Only
```bash
npm run server:dev
```
- Backend API runs on http://localhost:3001
- Useful for testing API separately

---

## How It Works

```
Your Browser (React App)
        ↓
   Vite Dev Server (port 5173)
        ↓
   Express Backend (port 3001)
        ↓
   SQLite Database (meetings.db)
```

### Saving a Meeting:
1. User enters meeting details in the React app
2. Clicks "Save Meeting" button
3. React sends data to Express API
4. Express stores it in SQLite database
5. App receives confirmation and shows success message
6. Data persists in `meetings.db` file

### Loading Meetings:
1. App loads and checks if backend is online
2. If online: Fetches all meetings from database via API
3. If offline: Uses local browser storage as fallback
4. Displays meetings with full history

---

## File Structure

```
📦 Meeting Cost Calculator
 ├── 📁 src/
 │   ├── 📁 api/
 │   │   └── meetingsAPI.js          ← API client functions
 │   ├── 📁 hooks/
 │   │   └── useMeetingStorage.js    ← React storage hook
 │   ├── 📁 components/
 │   │   ├── DatabaseStatus.jsx       ← Connection indicator
 │   │   └── ... (other components)
 │   └── App.jsx                      ← Main app
 ├── 📄 server.js                     ← Express backend
 ├── 📄 package.json                  ← Dependencies
 ├── 📄 .env                          ← Environment variables
 ├── 📄 DATABASE_SETUP.md             ← Full documentation
 └── 📄 meetings.db                   ← SQLite database (auto-created)
```

---

## Using the Database in Components

### Import the hook:
```jsx
import { useMeetingStorage } from './hooks/useMeetingStorage';
```

### Use in your component:
```jsx
export default function MyComponent() {
  const {
    meetings,           // All meetings from database
    loading,            // Loading state
    error,              // Error messages
    serverOnline,       // Is backend connected?
    saveMeeting,        // Function to save
    updateMeeting,      // Function to update
    deleteMeeting,      // Function to delete
    getStatistics,      // Function to get stats
    loadMeetings        // Function to reload
  } = useMeetingStorage();

  const handleSave = async () => {
    await saveMeeting({
      name: 'Team Sync',
      duration: 30,
      baseCost: 250,
      totalCost: 250,
      participants: participants,
      tags: ['standup']
    });
  };

  return (
    <>
      <button onClick={handleSave}>Save Meeting</button>
      <div>{serverOnline ? '✅ Connected' : '⚠️ Offline'}</div>
      <div>{error && <span>Error: {error}</span>}</div>
    </>
  );
}
```

---

## Database Tables

### meetings
Stores meeting information:
```
id, name, duration, agenda, meetingType, engagement, 
baseCost, totalCost, wastedCapital, rating, notes, etc.
```

### participants
Stores people attending each meeting:
```
id, meetingId, name, cost
```

### meeting_tags
Stores tags/categories for meetings:
```
id, meetingId, tag
```

---

## API Endpoints

### Create Meeting
```
POST /api/meetings
Body: { name, duration, agenda, participants[], tags[] }
Response: { id, message }
```

### Get All Meetings
```
GET /api/meetings
Response: [{ id, name, duration, participants[], tags[], ... }]
```

### Get Single Meeting
```
GET /api/meetings/:id
Response: { id, name, duration, participants[], tags[], ... }
```

### Update Meeting
```
PUT /api/meetings/:id
Body: { name, duration, ... }
Response: { message }
```

### Delete Meeting
```
DELETE /api/meetings/:id
Response: { message }
```

### Get Statistics
```
GET /api/statistics
Response: { totalMeetings, avgCost, totalCost, totalWasted, avgEngagement }
```

---

## Troubleshooting

### ❌ "Cannot find module 'better-sqlite3'"
```bash
npm install
npm install better-sqlite3
```

### ❌ "Port 3001 already in use"
- Find the process using port 3001 and close it
- Or change the port in `server.js`: `const PORT = 3002;`

### ❌ "Database is locked"
- Make sure only one server instance is running
- Close any database management tools

### ❌ "CORS error" in browser console
- Ensure backend is running on port 3001
- Check `.env` has correct `VITE_API_URL`

### ❌ Data not saving
- Check browser console for errors
- Verify backend is running: `npm run server:dev`
- Check if `meetings.db` exists in project root

---

## Building for Production

### Build Frontend
```bash
npm run build
```
Creates optimized bundle in `dist/` folder.

### Server for Production
The `server.js` file needs to be updated to serve static files:
```javascript
import express from 'express';
import path from 'path';

const app = express();
app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'dist/index.html')));
```

---

## Next Steps

- [ ] Add user authentication
- [ ] Add meeting filters and search
- [ ] Create analytics dashboard
- [ ] Export meetings to CSV/PDF
- [ ] Add meeting templates
- [ ] Cloud sync integration

---

## Need Help?

See [DATABASE_SETUP.md](./DATABASE_SETUP.md) for complete documentation!

**Happy calculating! 🎉📊**

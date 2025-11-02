# SAM.CHAT Desktop Application

This guide explains how to run SAM.CHAT as a desktop application on Windows.

## Prerequisites

Before running SAM.CHAT as a desktop app, you need to have:

1. **Node.js** (v18 or higher) - Download from https://nodejs.org/
2. **PostgreSQL** - Download from https://www.postgresql.org/download/
3. **Git** (optional) - For cloning the repository

## Installation & Setup

### Step 1: Clone or Download the Repository

```bash
git clone https://github.com/Daivik1520/SAM.CHAT.git
cd SAM.CHAT
```

Or download the ZIP file and extract it.

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Set Up Database

1. Start PostgreSQL
2. Create a database for SAM.CHAT:

```bash
createdb -h localhost sam_chat
```

3. Set environment variables in a `.env.local` file:

```
PGUSER=postgres
PGPASSWORD=your_password
PGDATABASE=sam_chat
PGHOST=localhost
PGPORT=5432
```

### Step 4: Build the Application

```bash
npm run build
```

## Running the Desktop App

### Option 1: Using the Batch File (Easiest)

Simply double-click `SAM-CHAT.bat` in the project folder. This will:
- Install dependencies (if needed)
- Start the application
- Open it in your default browser at http://localhost:3000

### Option 2: Using Command Line

```bash
npm start
```

Then open your browser and navigate to `http://localhost:3000`

### Option 3: Development Mode

For development with hot reload:

```bash
npm run dev
```

## Features

✅ **Dark Mode Support** - Toggle between light and dark themes
✅ **Message Reactions** - React to messages with 8 different emojis
✅ **Message Formatting** - Bold, italic, code, quotes, lists, and links
✅ **Stickers & GIFs** - 6 sticker packs and GIF search
✅ **Conversation Themes** - 6 beautiful themes for conversations
✅ **Real-time Messaging** - Instant message delivery
✅ **User Authentication** - Secure login and registration
✅ **Group Chats** - Create and manage group conversations

## Troubleshooting

### Port 3000 Already in Use

If port 3000 is already in use, you can change it:

```bash
npm start -- -p 3001
```

### Database Connection Error

Make sure PostgreSQL is running and your `.env.local` file has the correct credentials.

### Dependencies Installation Failed

Try clearing npm cache and reinstalling:

```bash
npm cache clean --force
npm install
```

## Building a Standalone Executable

To create a standalone .exe file that doesn't require Node.js:

### Using PyInstaller (Recommended)

1. Install Python 3.8+ from https://www.python.org/
2. Install PyInstaller:

```bash
pip install pyinstaller
```

3. Build the executable:

```bash
npm run build
pyinstaller --onefile --windowed launcher.py --name SAM-CHAT
```

The executable will be in the `dist` folder.

### Using Electron (Advanced)

For a full desktop app experience similar to Discord:

```bash
npm install --save-dev electron electron-builder
npm run electron-dev
```

## System Requirements

- **OS**: Windows 7 or later
- **RAM**: 2GB minimum (4GB recommended)
- **Disk Space**: 500MB for installation
- **Internet**: Required for real-time messaging

## Support

For issues or questions, please visit:
- GitHub: https://github.com/Daivik1520/SAM.CHAT
- Email: daivik1520@gmail.com

## License

This project is private and proprietary.

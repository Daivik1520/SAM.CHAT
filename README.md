# SAM.CHAT - Social Media Messaging Application

A modern, fully functional social media messaging application built with Next.js, React, and PostgreSQL. Connect with friends, create groups, and chat seamlessly in real-time.

## 🚀 Features

- **User Authentication**: Secure registration and login with JWT tokens and bcrypt password hashing
- **Direct Messaging**: Send and receive messages with other users with full message history
- **Group Chats**: Create and manage group conversations
- **User Profiles**: Customize your profile with bio, avatar, and status (Online/Away/Offline)
- **User Discovery**: Search and find other users to connect with
- **Responsive Design**: Fully optimized for mobile and desktop devices
- **Real-time Updates**: Instant message delivery and notifications
- **Production Ready**: Optimized database queries, secure API endpoints, and zero console errors

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, Node.js
- **Database**: PostgreSQL with optimized indexes
- **Authentication**: JWT (JSON Web Tokens), bcryptjs
- **UI Components**: shadcn/ui, Lucide React Icons
- **Package Manager**: Bun

## 📋 Prerequisites

- Node.js 18+ or Bun
- PostgreSQL 12+
- Git

## 🔧 Installation

1. **Clone the repository**
```bash
git clone https://github.com/Daivik1520/SAM.CHAT.git
cd SAM.CHAT
```

2. **Install dependencies**
```bash
bun install
```

3. **Set up environment variables**
Create a `.env.local` file in the root directory:
```env
PGUSER=postgres
PGPASSWORD=your_password
PGHOST=localhost
PGPORT=5432
PGDATABASE=sam_chat
JWT_SECRET=your-secret-key-here
```

4. **Create the database**
```bash
createdb -h localhost sam_chat
```

5. **Run the development server**
```bash
bun run dev
```

The application will be available at `http://localhost:3000`

## 📱 Usage

### Registration
1. Navigate to `/register`
2. Enter username, email, and password
3. Click "Register" to create your account

### Login
1. Navigate to `/login`
2. Enter your email and password
3. Click "Login" to access your account

### Direct Messaging
1. Go to the Messages tab
2. Click on a user to open the chat
3. Type your message and click Send
4. View message history with timestamps

### Groups
1. Go to the Groups tab
2. Click "New Group" to create a group
3. Enter the group name and click Create
4. Share the group with friends

### Profile Settings
1. Click the Settings icon (gear icon)
2. Update your bio, avatar URL, and status
3. Click "Save Changes" to update your profile

## 📁 Project Structure

```
sam-chat/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.ts
│   │   │   └── register/route.ts
│   │   ├── messages/route.ts
│   │   ├── groups/route.ts
│   │   └── users/route.ts
│   ├── chat/page.tsx
│   ├── login/page.tsx
│   ├── register/page.tsx
│   ├── profile/page.tsx
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   └── ui/
│       └── [shadcn components]
├── lib/
│   ├── auth-context.tsx
│   ├── db.ts
│   └── utils.ts
├── public/
├── .env.local
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## 🗄️ Database Schema

### Users Table
- `id`: Primary key
- `username`: Unique username
- `email`: Unique email address
- `password_hash`: Hashed password
- `avatar_url`: Profile picture URL
- `bio`: User biography
- `status`: Online/Away/Offline
- `created_at`: Account creation timestamp
- `updated_at`: Last update timestamp

### Direct Messages Table
- `id`: Primary key
- `sender_id`: Foreign key to users
- `recipient_id`: Foreign key to users
- `content`: Message text
- `media_url`: Optional media attachment
- `created_at`: Message timestamp
- `read_at`: Read status timestamp

### Groups Table
- `id`: Primary key
- `name`: Group name
- `description`: Group description
- `avatar_url`: Group picture URL
- `creator_id`: Foreign key to users
- `created_at`: Creation timestamp
- `updated_at`: Last update timestamp

### Group Members Table
- `id`: Primary key
- `group_id`: Foreign key to groups
- `user_id`: Foreign key to users
- `role`: admin/member
- `joined_at`: Join timestamp

### Group Messages Table
- `id`: Primary key
- `group_id`: Foreign key to groups
- `sender_id`: Foreign key to users
- `content`: Message text
- `media_url`: Optional media attachment
- `created_at`: Message timestamp

## 🔐 Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Authentication**: Secure token-based authentication
- **SQL Injection Prevention**: Parameterized queries
- **CORS Protection**: Secure API endpoints
- **Input Validation**: Server-side validation on all endpoints

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy with one click

### Deploy to Other Platforms

The application can be deployed to any platform that supports Node.js:
- Heroku
- Railway
- Render
- AWS
- DigitalOcean
- etc.

## 📊 Performance Optimizations

- Database indexes on frequently queried columns
- Connection pooling for database efficiency
- Optimized API responses
- Client-side caching with localStorage
- Lazy loading of components
- Responsive image optimization

## 🐛 Troubleshooting

### Database Connection Error
- Ensure PostgreSQL is running
- Check environment variables
- Verify database exists: `psql -l`

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Authentication Issues
- Clear browser localStorage
- Check JWT_SECRET is set
- Verify token expiration

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Messages
- `GET /api/messages?recipientId=X` - Get message history
- `POST /api/messages` - Send message

### Groups
- `GET /api/groups` - Get user's groups
- `POST /api/groups` - Create new group

### Users
- `GET /api/users?search=X` - Search users
- `PATCH /api/users` - Update user profile

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

**Daivik Reddy**
- Email: daivik1520@gmail.com
- GitHub: [@Daivik1520](https://github.com/Daivik1520)

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI Components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide React](https://lucide.dev/)
- Styling with [Tailwind CSS](https://tailwindcss.com/)

## 📞 Support

For support, email daivik1520@gmail.com or open an issue on GitHub.

---

**Live Demo**: https://samchat-2.lindy.site

Made with ❤️ by Daivik Reddy

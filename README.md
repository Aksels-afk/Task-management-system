# Task Management System

A full-stack task management application built with Laravel 12 backend and React frontend. Features username-based authentication, task descriptions, and modern UI design.

## 🚀 Features

- **User Authentication**: Username-based registration and login
- **Task Management**: Create, read, update, and delete tasks
- **Task Properties**: Title, description, deadline, and status tracking
- **Modern UI**: Modal-based forms with responsive design
- **Real-time Updates**: Instant task updates without page refresh
- **Task Details View**: Full-screen modal for task information
- **Input Validation**: Client-side and server-side validation
- **Date Constraints**: Tasks limited to 1 year in advance
- **API-First**: RESTful API backend for scalability

## 🛠️ Technology Stack

### Backend
- **Laravel 12** - PHP framework for robust backend development
- **SQLite** - Lightweight database for easy setup and deployment
- **Laravel Sanctum** - API authentication and token management
- **PHP 8.4.3** - Modern PHP with enhanced performance
- **Eloquent ORM** - Database abstraction layer

### Frontend
- **React 19** - Latest React with hooks
- **Vite** - Fast build tool and development server
- **Tailwind CSS 3.4.0** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **Heroicons** - SVG icons
- **State Management** - React hooks

### Development Tools
- **ESLint** - Code linting and formatting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **PHP 8.2 or higher**
- **Composer** (PHP package manager)
- **Node.js 18 or higher**
- **npm** (Node.js package manager)

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Task-management-system
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install PHP dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Create SQLite database
touch database/database.sqlite

# Run database migrations
php artisan migrate

# Start the development server
php artisan serve
```

The backend will be available at `http://localhost:8000`

### 3. Frontend Setup

```bash
# Open a new terminal and navigate to frontend directory
cd frontend

# Install Node.js dependencies
npm install

# Start the development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

## 📁 Project Structure

```
Task-management-system/
├── backend/                 # Laravel backend
│   ├── app/
│   │   ├── Http/Controllers/
│   │   │   ├── AuthController.php
│   │   │   └── TaskController.php
│   │   └── Models/
│   │       ├── User.php
│   │       └── Task.php
│   ├── database/
│   │   └── migrations/
│   ├── routes/
│   │   └── api.php
│   └── composer.json
├── frontend/                # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   └── Register.jsx
│   │   │   └── Dashboard/
│   │   │       └── Dashboard.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── tailwind.config.js
│   └── package.json
└── README.md
```

## 🔧 Configuration

### Backend Configuration

- `.env` - Environment variables
- `config/database.php` - Database configuration
- `config/sanctum.php` - API authentication settings

### Frontend Configuration

- `vite.config.js` - Vite build configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `postcss.config.js` - PostCSS processing

## 🎯 API Endpoints

### Authentication Endpoints

#### Register User
```http
POST /api/register
Content-Type: application/json

{
  "username": "john_doe",
  "password": "password123",
  "password_confirmation": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "name": "john_doe",
      "username": "john_doe",
      "email": "john_doe@example.com"
    },
    "token": "1|abc123...",
    "token_type": "Bearer"
  }
}
```

#### Login User
```http
POST /api/login
Content-Type: application/json

{
  "username": "john_doe",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "name": "john_doe",
      "username": "john_doe"
    },
    "token": "1|abc123...",
    "token_type": "Bearer"
  }
}
```

#### Logout User
```http
POST /api/logout
Authorization: Bearer {token}
```

#### Get Current User
```http
GET /api/user
Authorization: Bearer {token}
```

### Task Endpoints

#### Get All Tasks
```http
GET /api/tasks
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Complete project",
      "description": "Finish the task management system",
      "deadline": "2024-12-31T23:59:59.000000Z",
      "status": "pending",
      "user_id": 1,
      "created_at": "2024-01-01T00:00:00.000000Z",
      "updated_at": "2024-01-01T00:00:00.000000Z"
    }
  ]
}
```

#### Create Task
```http
POST /api/tasks
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "New Task",
  "description": "Optional task description",
  "deadline": "2024-12-31",
  "status": "pending"
}
```

**Validation Rules:**
- `title`: required, string, max 255 characters
- `description`: optional, string, max 1000 characters
- `deadline`: required, date, must be in future, max 1 year ahead
- `status`: optional, enum: pending, in_progress, completed

#### Get Specific Task
```http
GET /api/tasks/{id}
Authorization: Bearer {token}
```

#### Update Task
```http
PUT /api/tasks/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Updated Task",
  "description": "Updated description",
  "deadline": "2024-12-31",
  "status": "in_progress"
}
```

#### Delete Task
```http
DELETE /api/tasks/{id}
Authorization: Bearer {token}
```

## 🧪 Testing the Application

### 1. Basic Functionality
1. **Start both servers** (backend on port 8000, frontend on port 5173)
2. **Register a new account** with username and password
3. **Login** with your credentials (should redirect immediately to dashboard)
4. **Create tasks** with titles, descriptions, and deadlines
5. **View task details** by clicking the eye icon on tasks with descriptions
6. **Edit and delete tasks** using the action buttons

### 2. Advanced Features
1. **Test date validation** - Try creating tasks with dates more than 1 year ahead
2. **Test description limits** - Try entering more than 1000 characters
3. **Test authentication** - Try accessing protected routes without login
4. **Test responsive design** - Resize browser window to test mobile layout

### 3. API Testing
Use tools like Postman or curl to test the API endpoints directly:

```bash
# Test API health
curl http://localhost:8000/api/test

# Register user
curl -X POST http://localhost:8000/api/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123","password_confirmation":"password123"}'

# Login and get token
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}'

# Create task with token
curl -X POST http://localhost:8000/api/tasks \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Task","description":"Test description","deadline":"2024-12-31","status":"pending"}'
```

## 🔒 Security Features

- **Username-based authentication** (no email required)
- **Password hashing** using Laravel's built-in Hash facade
- **API token authentication** with Laravel Sanctum
- **CSRF protection** on web routes
- **Input validation** on all API endpoints
- **SQL injection protection** via Eloquent ORM
- **XSS protection** with input sanitization
- **Rate limiting** capabilities (can be enabled)
- **Secure headers** and CORS configuration

## 🎨 UI/UX Features

- **Responsive design** that works on all devices
- **Modal-based forms** for focused user interaction
- **Beautiful task creation interface** with validation feedback
- **Task details modal** for viewing complete information
- **Smooth animations** and transitions
- **Loading states** and error handling
- **Character counters** for description fields
- **Visual indicators** for tasks with descriptions
- **Intuitive navigation** with protected routes
- **Real-time form validation** with error messages

## 🚀 Deployment

### Backend Deployment
1. Set up a web server (Apache/Nginx)
2. Configure PHP 8.2+
3. Set up a production database (MySQL/PostgreSQL)
4. Update `.env` with production settings
5. Run `composer install --optimize-autoloader --no-dev`
6. Run `php artisan migrate --force`
7. Set proper file permissions
8. Configure SSL certificate

### Frontend Deployment
1. Build the production version: `npm run build`
2. Deploy the `dist` folder to your web server
3. Configure your web server to serve the React app
4. Set up proper caching headers
5. Configure environment variables for production

## 🔧 Troubleshooting

### Common Issues

**Authentication Issues:**
- Clear browser localStorage if login state gets stuck
- Check if token is being sent in Authorization header
- Verify CORS settings in backend

**Database Issues:**
- Ensure SQLite file exists: `touch database/database.sqlite`
- Check file permissions on database directory
- Run migrations: `php artisan migrate:fresh`

**Frontend Issues:**
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check browser console for errors
- Verify API endpoints are accessible

**Backend Issues:**
- Check Laravel logs in `storage/logs/`
- Ensure all dependencies are installed
- Verify database connection
- Check API route registration

### Performance Optimization

**Backend:**
- Enable OPcache for PHP
- Use Redis for caching
- Optimize database queries
- Enable compression

**Frontend:**
- Enable gzip compression
- Use CDN for static assets
- Implement lazy loading
- Optimize bundle size

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly (including API endpoints)
5. Update documentation
6. Submit a pull request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 📞 Support

If you encounter any issues or have questions, please:
1. Check the troubleshooting section above
2. Review Laravel and React documentation
3. Test API endpoints with Postman
4. Create an issue in the repository

---

**Happy coding! 🎉** 
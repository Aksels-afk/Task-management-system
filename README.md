# Task Management System

A full-stack task management application built with Laravel 12 backend and React frontend, featuring username-based authentication and modern UI design.

## 🚀 Features

- **User Authentication**: Username-based registration and login
- **Task Management**: Create, read, update, and delete tasks
- **Task Properties**: Title, description, deadline, and status tracking
- **Modern UI**: Clean, responsive design with Tailwind CSS
- **Real-time Updates**: Instant task updates without page refresh
- **API-First**: RESTful API backend for scalability

## 🛠️ Technology Stack

### Backend
- **Laravel 12** - PHP framework for robust backend development
- **SQLite** - Lightweight database for easy setup and deployment
- **Laravel Sanctum** - API authentication and token management
- **PHP 8.4.3** - Modern PHP with enhanced performance

### Frontend
- **React 19** - Latest React with concurrent features
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework for modern styling
- **React Router DOM** - Client-side routing
- **Heroicons** - Beautiful SVG icons
- **Headless UI** - Accessible UI components

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
├── backend/                 # Laravel backend application
│   ├── app/
│   │   ├── Http/Controllers/
│   │   │   ├── AuthController.php    # Authentication logic
│   │   │   └── TaskController.php    # Task CRUD operations
│   │   └── Models/
│   │       ├── User.php              # User model
│   │       └── Task.php              # Task model
│   ├── database/
│   │   └── migrations/               # Database migrations
│   ├── routes/
│   │   └── api.php                   # API routes
│   └── composer.json
├── frontend/                # React frontend application
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/
│   │   │   │   ├── Login.jsx         # Login component
│   │   │   │   └── Register.jsx      # Registration component
│   │   │   └── Dashboard.jsx         # Main dashboard
│   │   ├── App.jsx                   # Main app component
│   │   └── main.jsx                  # App entry point
│   ├── tailwind.config.js            # Tailwind configuration
│   └── package.json
└── README.md
```

## 🔧 Configuration

### Backend Configuration

The backend uses SQLite by default. Key configuration files:

- `.env` - Environment variables
- `config/database.php` - Database configuration
- `config/sanctum.php` - API authentication settings

### Frontend Configuration

- `vite.config.js` - Vite build configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `postcss.config.js` - PostCSS processing

## 🎯 API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `POST /api/logout` - User logout (requires authentication)
- `GET /api/user` - Get current user info (requires authentication)

### Tasks
- `GET /api/tasks` - Get all tasks for authenticated user
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/{id}` - Get specific task
- `PUT /api/tasks/{id}` - Update a task
- `DELETE /api/tasks/{id}` - Delete a task

## 🧪 Testing the Application

1. **Start both servers** (backend on port 8000, frontend on port 5173)
2. **Register a new account** with username and password
3. **Login** with your credentials
4. **Create, edit, and delete tasks** in the dashboard
5. **Test the responsive design** on different screen sizes

## 🔒 Security Features

- **Username-based authentication** (no email required)
- **Password hashing** using Laravel's built-in Hash facade
- **API token authentication** with Laravel Sanctum
- **CSRF protection** on web routes
- **Input validation** on all API endpoints

## 🎨 UI/UX Features

- **Responsive design** that works on all devices
- **Modern card-based layout** for tasks
- **Smooth animations** and transitions
- **Intuitive form design** with validation feedback
- **Loading states** for better user experience
- **Error handling** with user-friendly messages

## 🚀 Deployment

### Backend Deployment
1. Set up a web server (Apache/Nginx)
2. Configure PHP 8.2+
3. Set up a production database (MySQL/PostgreSQL)
4. Update `.env` with production settings
5. Run `composer install --optimize-autoloader --no-dev`
6. Run `php artisan migrate --force`

### Frontend Deployment
1. Build the production version: `npm run build`
2. Deploy the `dist` folder to your web server
3. Configure your web server to serve the React app

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Troubleshooting

### Common Issues

**Backend Issues:**
- Ensure PHP 8.2+ is installed
- Check if Composer dependencies are installed
- Verify database migrations have been run
- Check Laravel logs in `storage/logs/`

**Frontend Issues:**
- Ensure Node.js 18+ is installed
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check browser console for errors

**Database Issues:**
- Ensure SQLite file exists: `touch database/database.sqlite`
- Check file permissions on database directory
- Run migrations: `php artisan migrate:fresh`

## 📞 Support

If you encounter any issues or have questions, please:
1. Check the troubleshooting section above
2. Review Laravel and React documentation
3. Create an issue in the repository

---

**Happy coding! 🎉** 
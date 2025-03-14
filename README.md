# Load Posting System

A full-stack application for connecting shippers with truckers for freight transportation.

## Features

- User authentication (Shipper/Trucker)
- Load posting and management
- Load search and filtering
- Bidding system
- Real-time load status updates
- Profile management
- Dashboard for both shippers and truckers

## Tech Stack

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- RESTful API architecture

### Frontend
- Next.js with React
- Tailwind CSS for styling
- Axios for API calls
- React Router for navigation

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/load-posting-system.git
cd load-posting-system
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

4. Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

5. Create a `.env.local` file in the frontend directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Running the Application

1. Start the backend server:
```bash
cd backend
npm run dev
```

2. Start the frontend development server:
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## API Endpoints

### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user
- GET /api/auth/me - Get current user profile

### Shipper Routes
- GET /api/shippers - Get all shippers
- GET /api/shippers/:id - Get shipper by ID
- PUT /api/shippers/:id - Update shipper profile
- POST /api/shippers/loads - Create a new load
- GET /api/shippers/loads - Get shipper's loads
- PUT /api/shippers/loads/:id - Update load status

### Trucker Routes
- GET /api/truckers - Get all truckers
- GET /api/truckers/:id - Get trucker by ID
- PUT /api/truckers/:id - Update trucker profile
- GET /api/truckers/loads - Get trucker's assigned loads
- PUT /api/truckers/loads/:id - Update load status

### Load Routes
- GET /api/loads - Get all loads
- GET /api/loads/:id - Get load by ID
- GET /api/loads/search - Search loads with filters
- POST /api/loads/:id/bids - Place a bid on a load
- GET /api/loads/:id/bids - Get bids for a load
- PUT /api/loads/:id/bids/:bidId - Accept/reject a bid

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 
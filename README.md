# Load Posting System

A comprehensive platform connecting shippers and truckers for efficient load management, bidding, and tracking.

## Features

### For Shippers
- Post loads with detailed information
- Receive and review bids from truckers
- Track shipments in real-time
- Manage payments and financial transactions
- Generate reports and analytics

### For Truckers
- Browse and filter loads based on preferences
- Submit competitive bids on available loads
- Access exclusive benefits and discounts
- Real-time load tracking and updates
- Manage earnings and financial records

### For Admins
- Comprehensive dashboard for system oversight
- User management (shippers and truckers)
- Verification and approval processes
- Analytics and reporting
- System configuration and settings

## Technology Stack

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT Authentication
- Socket.io for real-time tracking
- RESTful API architecture

### Frontend
- Next.js (React framework)
- TypeScript
- Tailwind CSS for styling
- Socket.io client for real-time updates
- Responsive design for all devices

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/load-posting-system.git
cd load-posting-system
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Install frontend dependencies
```bash
cd ../frontend
npm install
```

4. Set up environment variables
   - Create a `.env` file in the backend directory based on the `.env.example` template
   - Configure your MongoDB connection string, JWT secret, and other required variables

5. Start the development servers

Backend:
```bash
cd backend
npm run dev
```

Frontend:
```bash
cd frontend
npm run dev
```

6. Access the application
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Project Structure

```
load-posting-system/
├── backend/                # Node.js Express backend
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Custom middleware
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # API routes
│   │   ├── utils/          # Utility functions
│   │   └── server.js       # Entry point
│   ├── .env                # Environment variables
│   └── package.json        # Dependencies
│
├── frontend/               # Next.js frontend
│   ├── src/
│   │   ├── app/            # Next.js app directory
│   │   ├── components/     # Reusable components
│   │   ├── lib/            # Utility functions
│   │   └── styles/         # Global styles
│   └── package.json        # Dependencies
│
└── docs/                   # Documentation
```

## API Documentation

The API documentation is available at `/api/docs` when running the backend server.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Express.js](https://expressjs.com/)
- [Next.js](https://nextjs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Socket.io](https://socket.io/) 
🗳️ Collaborative Decision Voting App – Backend
This is the backend API for the Collaborative Decision Voting App — a full-stack project that enables users to create decision rooms, invite participants, and anonymously collect votes on important topics. Built with Node.js, Express, TypeScript, and MongoDB.

🚀 Features
🔐 JWT Authentication (Register/Login)

🧑‍🤝‍🧑 Create Decision Rooms

📩 Anonymous Voting (Guests & Authenticated Users)

🗓️ Voting Deadline Enforcement

🔁 Vote Justification Support (Optional)

🔒 One-Vote-Per-User/Guest

📊 Creator-only Access to Live Results

🛠️ Technologies Used
Area Tech Stack
Language TypeScript
Server Node.js, Express
Auth JWT, bcrypt
Database MongoDB, Mongoose
Deployment (Recommended: Render / Railway)
Dev Tools ts-node-dev, dotenv, nodemon

📁 Project Structure
bash
Copy
Edit
server/
├── src/
│ ├── config/ # Database config
│ ├── controllers/ # Logic for API endpoints
│ ├── middleware/ # Auth + async handlers
│ ├── models/ # Mongoose models
│ ├── routes/ # Route definitions
│ ├── utils/ # Utility helpers (e.g., JWT)
│ └── index.ts # App entry point
├── .env # Environment variables (not committed)
├── .env.example # Example template
├── tsconfig.json # TypeScript config
└── README.md
🌐 API Endpoints
🔐 Auth Routes
Method Endpoint Description
POST /api/auth/register Register new user
POST /api/auth/login Log in and get JWT

🏛️ Room Routes
Method Endpoint Description
POST /api/rooms Create a new room (auth only)
GET /api/rooms/:id Get room details
POST /api/rooms/:id/vote Vote anonymously in a room
GET /api/rooms/:id/results View final tally (auth only)

⚙️ Environment Variables
Create a .env file based on .env.example:

ini
Copy
Edit
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
🧪 Running Locally
Install dependencies

bash
Copy
Edit
npm install
Start the server

bash
Copy
Edit
npx ts-node-dev src/index.ts
The backend will be available at:

arduino
Copy
Edit
http://localhost:5000
✍️ Thought Process
Separated business logic from request/response routing for clarity.

Applied strict TypeScript types for safety and scalability.

Used JWT to decouple frontend from session management.

Enforced clean coding practices: asyncHandler, protect, modular structure.

Tracked all voters by ID/UUID to enforce one anonymous vote per room.

⚠️ Known Limitations
No rate limiting or brute-force protection yet.

Voting is tracked via guest ID but not with full IP/device fingerprinting.

Socket.io live updates are not included (polling recommended for MVP).

🌍 Deployment Notes
Use Render or Railway for free hosting.

Configure PORT, MONGO_URI, and JWT_SECRET in your production .env.

📌 Future Enhancements
🔁 Live voting results via WebSockets

💬 Discussion threads in each room

🧾 Guest token persistence via secure cookie

📈 Admin dashboard & analytics

✅ Unit testing and CI via GitHub Actions

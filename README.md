# 🗳️ PollPulse – Collaborative Decision Voting App

**Full-Stack Developer Assessment Submission**  
Author: Ibrahim Openiyi

---

## 📖 Project Overview

PollPulse is a full-stack web application designed to facilitate **collaborative decision-making** through anonymous voting. Users can create decision rooms, share unique URLs, and collect votes on various options — supporting transparency, inclusiveness, and democratic input.

This project demonstrates end-to-end implementation of a real-world app with a focus on:
- Secure authentication (JWT)
- RESTful API design
- Typed development with TypeScript
- Real-time decision tracking
- Maintainability and scalable architecture

---

## 🛠️ Technologies Used

| Layer      | Tech Stack |
|------------|------------|
| Frontend   | React + TypeScript, TailwindCSS |
| Backend    | Node.js, Express, TypeScript |
| Database   | MongoDB with Mongoose |
| Auth       | JSON Web Tokens (JWT) |
| Hosting    | Netlify (frontend), Render (backend) |
| Extras     | Lucide Icons, dotenv, express-validator |

---

## 📁 Project Structure

collab-vote-app/
├── client/ # Frontend (React + TS)
├── server/ # Backend (Node + Express + TS)
│ ├── controllers/ # Business logic
│ ├── models/ # Mongoose schemas
│ ├── routes/ # API routes
│ ├── services/ # Reusable logic (if used)
│ ├── utils/ # JWT token generation, etc.
│ ├── index.ts # Entry point
│ └── .env # Local environment variables
├── .env.example # Sample environment config
├── README.md # Project documentation

yaml
Copy
Edit

---

## 🚀 Deployment Links

- **Frontend (Netlify)**: [https://pollpulse-client.netlify.app](https://pollpulse-client.netlify.app)
- **Backend (Render)**: [https://pollpulse-server.onrender.com](https://pollpulse-server.onrender.com)
- **GitHub Repo**: [https://github.com/DonaldKnut/pollpulse](https://github.com/DonaldKnut/pollpulse)

---

## 🧠 Thought Process & Architecture

- Prioritized **clean separation** of frontend and backend for independent deployment and scalability.
- Used **TypeScript** on both ends to ensure safety and predictability.
- API design follows **REST principles** and protects critical routes with JWT-based authentication.
- Votes are tracked anonymously per room with voter ID to **enforce one-vote-per-user**.
- Rooms include options, deadline validation, and justification support for deeper context.

---

## ✅ Core Functionalities

- 🔐 **User Auth** (JWT-based register & login)
- 🏛 **Create Decision Rooms** with title, description, options, and deadline
- 📩 **Invite via URL** – each room has a unique, shareable link
- 🗳 **Anonymous Voting** – only one vote per user or guest per room
- 📊 **Live Results** (room creator only)
- ✍ **Vote Justification** (optional with each vote)
- 🗨 **Bonus Ready**: Forum & discussions planned in UI

---

## ⚠️ Challenges & Known Limitations

- No real-time sockets yet (vote results are fetched on-demand).
- Discussion thread UI planned but not yet wired to backend.
- Limited user role structure — all users have same permissions except room ownership.

---

## 🧪 How to Run Locally

1. **Clone the Repo**
   ```bash
   git clone https://github.com/DonaldKnut/pollpulse.git
   cd collab-vote-app

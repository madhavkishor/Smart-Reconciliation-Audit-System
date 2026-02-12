🧾 Smart Reconciliation & Audit System

A scalable MERN-based backend system designed for high-volume financial data reconciliation with immutable audit logging, idempotent uploads, and high-performance MongoDB indexing.

This system is built as a non-CRUD architecture, focusing on data integrity, traceability, and batch processing efficiency.

🚀 Features

📂 Bulk File Upload Processing

Supports files with up to 50,000 records

Idempotent uploads using file hashing

🔄 Smart Reconciliation Engine

Detects:

Matched records

Partially matched records

Unmatched records

Duplicate transactions

🧾 Immutable Audit Logs

Every system change is logged

Audit entries cannot be modified or deleted

👥 Role-Based Users

Admin

Analyst

Viewer

⚡ High-Performance MongoDB Design

Optimized indexes for reconciliation & lookups

Scales efficiently with large datasets

🏗️ Tech Stack
Layer	Technology
Backend	Node.js, Express
Database	MongoDB + Mongoose
Queue (Ready)	BullMQ
Security	Helmet, JWT
Logging	Morgan
File Parsing	CSV / XLSX
📁 Project Structure
smart-reconciliation/
├── client/                # Frontend (React)
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── jobs/
│   │   ├── middleware/
│   │   ├── modules/
│   │   │   ├── users/
│   │   │   ├── uploads/
│   │   │   ├── records/
│   │   │   ├── reconciliation/
│   │   │   └── audit/
│   │   ├── app.js
│   │   └── server.js
│   ├── package.json
│   └── .env.example

🧠 Core Modules
👤 User

Role-based access (Admin / Analyst / Viewer)

Secure authentication support

📦 Upload Job

Tracks file uploads

Prevents duplicate uploads via hash

Maintains upload lifecycle

🧾 Record

Stores raw transaction data

Indexed for fast reconciliation

🔄 Reconciliation Result

Links source & system records

Stores reconciliation status & mismatches

🧱 Audit Log

Immutable by design

Captures system & data changes

Ensures compliance & traceability

🔌 API Health Check
GET /health


Response

{
  "status": "ok",
  "timestamp": "2024-02-15T10:15:00.000Z"
}

⚙️ Setup Instructions
1️⃣ Clone Repository
git clone <repo-url>
cd smart-reconciliation/server

2️⃣ Install Dependencies
npm install

3️⃣ Environment Variables

Create .env file:

PORT=5000
MONGO_URI=mongodb://localhost:27017/smart-reconciliation

4️⃣ Run Server
npm run dev

✅ Server Status
✅ Connected to MongoDB
🚀 Server running on port 5000

🛡️ Design Principles

Idempotency First

Audit Before Mutation

Schema-Driven Validation

Scalability Over Simplicity

Security by Default

🧪 Ideal Use Cases

Bank statement reconciliation

Payment gateway settlements

Ledger vs system comparison

Financial audits & compliance systems

📌 Future Enhancements

Background processing using BullMQ

Admin dashboard

File validation rules engine

Advanced reconciliation rules

👨‍💻 Author

Abhishek Yadav
Backend Developer | MERN Stack
Focused on scalable systems & clean architecture

⭐ Final Note

This project is built with real-world enterprise considerations and is suitable for:

Backend interviews

System design discussions

Production-ready financial systems
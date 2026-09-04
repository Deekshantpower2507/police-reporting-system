# Online Crime Reporting System

A modern, responsive, and robust full-stack web application designed for citizens to report crimes, track complaint statuses, and allow police/administrators to manage and investigate reports efficiently.

## Features

### Citizen Portal
* **Secure Registration & Login** (JWT-based authentication)
* **Report a Crime**: Multi-step intuitive form to submit complaints.
* **Evidence Upload**: Attach images, PDFs, and documents.
* **Real-time Tracking**: Track investigation progress via a Complaint ID.
* **Complaint History**: View past reports and detailed status timelines.

### Police Dashboard
* **Assigned Cases**: View complaints assigned to the officer.
* **Investigation Management**: Update statuses (Under Investigation, Resolved, etc.).
* **Investigation Notes**: Add official remarks which reflect on the citizen's tracking timeline.
* **Case Details & Evidence**: Full access to victim/suspect details and attached evidence.

### Admin Dashboard
* **Analytics**: Interactive charts (Recharts) showing complaint statistics and crime types.
* **Complaint Management**: View all complaints, assign specific police officers.
* **User Management**: View and manage registered citizens.
* **Officer Management**: Register and assign credentials to new police personnel.

## Tech Stack

* **Frontend**: React.js, Tailwind CSS, React Router, Axios, Lucide React Icons, Recharts, Vite.
* **Backend**: Node.js, Express.js.
* **Database**: MySQL with Sequelize ORM.
* **Authentication**: JSON Web Tokens (JWT) & bcrypt for password hashing.
* **File Uploads**: Multer.

## Installation

### Prerequisites
* Node.js (v16 or higher)
* MySQL Server (running locally on port 3306)

### Clone & Setup

1. **Clone the repository** (if applicable) and navigate to the project directory.

2. **Backend Setup**:
   ```bash
   cd server
   npm install
   ```

3. **Frontend Setup**:
   ```bash
   cd client
   npm install
   ```

## Environment Variables

Create a `.env` file in the `server` directory and add the following:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=crime_reporting
JWT_SECRET=supersecret_crime_reporting_key_2026
```
*(Note: Create the `crime_reporting` database manually in MySQL before running the server, or change the credentials to match your setup).*

## Database Setup & Demo Data

To seed the database with initial admin, police, and citizen accounts:

```bash
cd server
node seeder.js
```
*This command resets the database and injects initial required roles.*

## How to Run

You will need two separate terminal windows/tabs to run both ends concurrently.

**Terminal 1 (Backend Server):**
```bash
cd server
node server.js
```
*Runs on http://localhost:5000*

**Terminal 2 (Frontend Client):**
```bash
cd client
npm run dev
```
*Runs on http://localhost:3000 (Proxy is configured in vite.config.js to point to the backend).*

## Demo Accounts

You can use the following accounts for testing out the different roles:

**Admin Role:**
* Email: `admin@gov.in`
* Password: `password123`

**Police Role:**
* Email: `sharma@police.gov.in`
* Password: `password123`

**Citizen Role:**
* Email: `rahul@example.com`
* Password: `password123`

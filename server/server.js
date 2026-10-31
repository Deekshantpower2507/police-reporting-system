require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { connectDB, sequelize } = require('./config/db');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Connect to Database
connectDB();

// Initialize Models and associations
require('./models');

// Sync Database (in development you might use { alter: true } or { force: false })
sequelize.sync({ force: false })
    .then(async () => {
        console.log('Database synced successfully');
        try {
            const { User } = require('./models');
            const userCount = await User.count();
            if (userCount === 0) {
                console.log('Database empty. Auto-seeding initial officers and admin...');
                const { seedInitialData } = require('./seedData');
                await seedInitialData();
            }
        } catch (seedErr) {
            console.error('Auto-seed check error:', seedErr.message);
        }
    })
    .catch(err => console.error('Failed to sync database:', err));

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/complaints', require('./routes/complaintRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/bulletins', require('./routes/bulletinRoutes'));

// Serve frontend static assets (production build)
const clientDist = path.join(__dirname, '../client/dist');
app.use(express.static(clientDist));

// React Router fallback (serve index.html for non-API client routes)
app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api') && !req.path.startsWith('/uploads')) {
        const indexPath = path.join(clientDist, 'index.html');
        if (fs.existsSync(indexPath)) {
            return res.sendFile(indexPath);
        } else {
            return res.status(200).send('NCRS API is running. Client build not found. Run npm run build.');
        }
    }
    next();
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Server Error', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

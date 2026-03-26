require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const { initializeSchema } = require('./config/db');


const authRoutes = require('./routes/authRoutes');
const quizRoutes = require('./routes/quizRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Parse JSON request bodies.
app.use(express.json());

// Allow requests from browser clients on other origins.
app.use(cors());

// Serve static files from /public.
app.use(express.static(path.join(__dirname, 'public')));

// Route groups.

app.use('/api/auth', authRoutes);
app.use('/api', quizRoutes); // All quiz and result endpoints are under /api

app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    const status = err.statusCode || 500;
    res.status(status).json({
        success: false,
        message: err.message || 'Internal server error'
    });
});

async function startServer() {
    try {
        // Create tables if they do not exist yet.
        await initializeSchema();
        console.log('Database schema ensured.');

        // Start listening for incoming requests.
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Server startup failed:', error.message);
        process.exit(1);
    }
}

startServer();

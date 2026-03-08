require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const { initializeSchema } = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const quizRoutes = require('./routes/quizRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/auth', authRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/admin', adminRoutes);

app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    const status = err.statusCode || 500;
    return res.status(status).json({
        success: false,
        message: err.message || 'Internal server error'
    });
});

const PORT = process.env.PORT || 3000;

(async () => {
    try {
        await initializeSchema();
        console.log('Database schema ensured.');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Server startup failed:', error.message);
        process.exit(1);
    }
})();

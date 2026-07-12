require('dotenv').config();
const connectDB = require('./config/db');
const app = require('./app');

// Connect to Database
connectDB();

const PORT = process.env.PORT || 5000;

// Only start server if not running on Vercel
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
}

// Export for Vercel Serverless
module.exports = app;

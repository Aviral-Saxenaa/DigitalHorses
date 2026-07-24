require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Load .env.example as fallback if .env is missing
const envPath = path.join(__dirname, '..', '.env');
if (!fs.existsSync(envPath)) {
  require('dotenv').config({ path: path.join(__dirname, '..', '.env.example') });
}

const authRoutes = require('./routes/auth');
const leadRoutes = require('./routes/leads');
const userRoutes = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 5000;
if (!process.env.JWT_SECRET) process.env.JWT_SECRET = 'digitalhorses_jwt_secret_key_2024';

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/users', userRoutes);

app.get('/api', (req, res) => {
  res.json({ message: 'DigitalHorses API', docs: '/api/docs' });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;

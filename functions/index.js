const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const passport = require('./controllers/googleController');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cookieParser());

const corsOption = {
    origin: process.env.UI_URL,
    credentials:true,
}

app.use(cors(corsOption));

connectDB();
app.use(passport.initialize());

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/users', postRoutes);


const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import prisma from './db.js'; // <-- 1. Import the database connection

const app = express();

app.use(cors()); 
app.use(express.json()); 

// Original health-check route
app.get('/', (req, res) => {
  res.json({ message: "Railway Booking API V2 is running smoothly!" });
});

// --- NEW ROUTE: Database Test ---
app.get('/api/users', async (req, res) => {
  try {
    // Tell Prisma to fetch all records from the User table
    const allUsers = await prisma.user.findMany();
    res.json(allUsers);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Failed to fetch data from the database" });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running live on http://localhost:${PORT}`);
});
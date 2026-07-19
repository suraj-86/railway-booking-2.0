import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import prisma from './db.js'; // <-- 1. Import the database connection
import bcrypt from 'bcrypt';

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

// --- NEW ROUTE: Register a new user (Secured) ---
app.post('/api/users/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Generate a "salt" (random string added to the password) and hash it
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 2. Instruct Prisma to create a new record with the SECURE password
    const newUser = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword 
      }
    });

    // 3. Send the newly created user back (without showing the password in the response!)
    res.status(201).json({ 
      message: "User registered successfully!", 
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email
      } 
    });
    
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Failed to register user." });
  }
});

// --- NEW ROUTE: User Login ---
app.post('/api/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Ask Prisma to find the user by their email
    const user = await prisma.user.findUnique({
      where: { email: email }
    });

    // If no user is found, stop here and return an error
    if (!user) {
      return res.status(404).json({ error: "User not found. Please register first." });
    }

    // 2. Use bcrypt to compare the typed password against the saved scrambled password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // If they don't match, stop here and return an error
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Incorrect password." });
    }

    // 3. If the email exists and the password matches, success!
    res.json({ 
      message: "Login successful!", 
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
    
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Failed to log in." });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running live on http://localhost:${PORT}`);
});
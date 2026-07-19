import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import prisma from './db.js'; // <-- 1. Import the database connection
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import verifyToken from './middleware/auth.js';

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

// --- UPDATED ROUTE: User Login (Now with JWT) ---
app.post('/api/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Ask Prisma to find the user by their email
    const user = await prisma.user.findUnique({
      where: { email: email }
    });

    if (!user) {
      return res.status(404).json({ error: "User not found. Please register first." });
    }

    // 2. Use bcrypt to compare the typed password against the saved scrambled password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Incorrect password." });
    }

    // 3. GENERATE THE JWT "WRISTBAND"
    // We package the user's ID inside the token so the server knows who they are later
    const token = jwt.sign(
      { userId: user.id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '24h' } // The wristband expires in 24 hours
    );

    // 4. Send back the success message, the user data, AND the new token
    res.json({ 
      message: "Login successful!", 
      token: token,
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

// --- NEW ROUTE: View Profile (Protected by JWT) ---
app.get('/api/users/profile', verifyToken, async (req, res) => {
  try {
    // Because the bouncer (verifyToken) successfully passed the request, 
    // we now have access to req.user (which contains the userId)
    
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId } // We use the ID from the token!
    });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Send back the user's profile info (always hide the password!)
    res.json({
      message: "Welcome to your VIP profile!",
      profile: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({ error: "Failed to fetch profile." });
  }
});

// --- NEW ROUTE: Admin Add Train ---
app.post('/api/trains', verifyToken, async (req, res) => {
  try {
    // 1. Fetch the user to check their role
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId }
    });

    // 2. The Admin Check
    if (user.role !== 'ADMIN') {
      return res.status(403).json({ error: "Access Denied. Admins only." });
    }

    // 3. Grab train details from the request body
    const { trainNumber, name, source, destination, departure, arrival, totalSeats } = req.body;

    // 4. Ask Prisma to create the train in the database
    const newTrain = await prisma.train.create({
      data: {
        trainNumber: trainNumber,
        name: name,
        source: source,
        destination: destination,
        // We wrap the dates in new Date() to format them for PostgreSQL
        departure: new Date(departure), 
        arrival: new Date(arrival),
        totalSeats: totalSeats
      }
    });

    res.status(201).json({ 
      message: "Train added successfully!", 
      train: newTrain 
    });

  } catch (error) {
    console.error("Add train error:", error);
    res.status(500).json({ error: "Failed to add train." });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running live on http://localhost:${PORT}`);
});
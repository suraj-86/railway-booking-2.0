import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import prisma from './db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import verifyToken, { requireAdmin } from './middleware/auth.js';
import generateSeats from './utils/generateSeats.js';

const app = express();
const isAdmin = requireAdmin(prisma);

app.use(cors()); 
app.use(express.json()); 

app.get('/', (req, res) => {
  res.json({ message: "Railway Booking API V2 is running smoothly!" });
});

app.get('/api/users', async (req, res) => {
  try {
    const allUsers = await prisma.user.findMany();
    res.json(allUsers);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Failed to fetch data from the database" });
  }
});

app.post('/api/users/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword 
      }
    });

    res.status(201).json({ 
      message: "User registered successfully!", 
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      } 
    });
    
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ error: "An account with that email already exists." });
    }
    console.error("Registration error:", error);
    res.status(500).json({ error: "Failed to register user." });
  }
});

app.post('/api/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email: email }
    });

    if (!user) {
      return res.status(404).json({ error: "User not found. Please register first." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Incorrect password." });
    }

    const token = jwt.sign(
      { userId: user.id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '24h' }
    );

    res.json({ 
      message: "Login successful!", 
      token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
    
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Failed to log in." });
  }
});

app.get('/api/users/profile', verifyToken, async (req, res) => {
  try {
    
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId }
    });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

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

app.put('/api/users/profile', verifyToken, async (req, res) => {
  try {
    const { name } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: req.user.userId },
      data: {
        ...(name && { name })
      }
    });

    res.json({ 
      message: "Profile updated successfully!", 
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role
      }
    });

  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ error: "Failed to update profile." });
  }
});


app.post('/api/stations', verifyToken, isAdmin, async (req, res) => {
  try {
    const { code, name, city } = req.body;

    const newStation = await prisma.station.create({
      data: {
        code: code.toUpperCase(),
        name: name,
        city: city
      }
    });

    res.status(201).json({
      message: "Station added successfully!",
      station: newStation
    });

  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ error: "A station with that code already exists." });
    }
    console.error("Add station error:", error);
    res.status(500).json({ error: "Failed to add station." });
  }
});

app.get('/api/stations', async (req, res) => {
  try {
    const { q } = req.query;

    const stations = await prisma.station.findMany({
      where: q ? {
        OR: [
          { code: { contains: q, mode: 'insensitive' } },
          { name: { contains: q, mode: 'insensitive' } },
          { city: { contains: q, mode: 'insensitive' } }
        ]
      } : undefined,
      orderBy: { name: 'asc' }
    });

    res.json({ results: stations.length, stations });

  } catch (error) {
    console.error("Fetch stations error:", error);
    res.status(500).json({ error: "Failed to fetch stations." });
  }
});

app.put('/api/stations/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const { code, name, city } = req.body;

    const updatedStation = await prisma.station.update({
      where: { id: req.params.id },
      data: {
        ...(code && { code: code.toUpperCase() }),
        ...(name && { name }),
        ...(city && { city })
      }
    });

    res.json({ message: "Station updated successfully!", station: updatedStation });

  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: "Station not found." });
    }
    console.error("Update station error:", error);
    res.status(500).json({ error: "Failed to update station." });
  }
});

app.delete('/api/stations/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    await prisma.station.delete({ where: { id: req.params.id } });
    res.json({ message: "Station deleted successfully!" });

  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: "Station not found." });
    }
    if (error.code === 'P2003') {
      return res.status(409).json({ error: "Cannot delete a station that trains still reference." });
    }
    console.error("Delete station error:", error);
    res.status(500).json({ error: "Failed to delete station." });
  }
});


app.post('/api/trains', verifyToken, isAdmin, async (req, res) => {
  try {
    const { trainNumber, name, sourceId, destinationId, departure, arrival, totalSeats, price } = req.body;

    const newTrain = await prisma.$transaction(async (tx) => {
      const train = await tx.train.create({
        data: {
          trainNumber: trainNumber,
          name: name,
          sourceId: sourceId,
          destinationId: destinationId,
          departure: new Date(departure),
          arrival: new Date(arrival),
          totalSeats: totalSeats,
          price: price ? parseInt(price, 10) : 500 
        },
        include: { source: true, destination: true }
      });

      const seatRows = generateSeats(totalSeats).map((seat) => ({
        ...seat,
        trainId: train.id
      }));

      await tx.seat.createMany({ data: seatRows });

      return train;
    });

    res.status(201).json({ 
      message: "Train added successfully, seats generated!", 
      train: newTrain 
    });

  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ error: "A train with that train number already exists." });
    }
    if (error.code === 'P2003') {
      return res.status(400).json({ error: "sourceId or destinationId does not match a real station." });
    }
    console.error("Add train error:", error);
    res.status(500).json({ error: "Failed to add train." });
  }
});

app.get('/api/trains', async (req, res) => {
  try {
    const { source, destination, q, date } = req.query;

    let filter = {};
    if (source) {
      filter.source = {
        OR: [
          { code: { equals: source, mode: 'insensitive' } },
          { name: { contains: source, mode: 'insensitive' } }
        ]
      };
    }
    if (destination) {
      filter.destination = {
        OR: [
          { code: { equals: destination, mode: 'insensitive' } },
          { name: { contains: destination, mode: 'insensitive' } }
        ]
      };
    }
    if (q) {
      filter.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { trainNumber: { contains: q, mode: 'insensitive' } }
      ];
    }
    if (date) {
      const startOfDay = new Date(date);
      const endOfDay = new Date(date);
      endOfDay.setDate(endOfDay.getDate() + 1);
      filter.departure = { gte: startOfDay, lt: endOfDay };
    }

    const trains = await prisma.train.findMany({
      where: filter,
      include: {
        source: true,
        destination: true,
        _count: { select: { seats: { where: { isBooked: false } } } }
      }
    });

    const trainsWithAvailability = trains.map((train) => ({
      ...train,
      availableSeats: train._count.seats,
      _count: undefined
    }));

    res.json({
      message: "Master schedule fetched successfully!",
      results: trainsWithAvailability.length,
      trains: trainsWithAvailability
    });

  } catch (error) {
    console.error("Fetch trains error:", error);
    res.status(500).json({ error: "Failed to fetch trains." });
  }
});


app.put('/api/trains/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const { name, sourceId, destinationId, departure, arrival, pricePerSeat } = req.body;

    const updatedTrain = await prisma.train.update({
      where: { id: req.params.id },
      data: {
        ...(name && { name }),
        ...(sourceId && { sourceId }),
        ...(destinationId && { destinationId }),
        ...(departure && { departure: new Date(departure) }),
        ...(arrival && { arrival: new Date(arrival) }),
        ...(pricePerSeat !== undefined && { pricePerSeat: parseFloat(pricePerSeat) })
      },
      include: { source: true, destination: true }
    });

    res.json({ message: "Train updated successfully!", train: updatedTrain });

  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: "Train not found." });
    }
    if (error.code === 'P2003') {
      return res.status(400).json({ error: "sourceId or destinationId does not match a real station." });
    }
    console.error("Update train error:", error);
    res.status(500).json({ error: "Failed to update train." });
  }
});

app.delete('/api/trains/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const existingBookings = await prisma.booking.count({
      where: { trainId: req.params.id }
    });

    if (existingBookings > 0) {
      return res.status(409).json({
        error: `Cannot delete: ${existingBookings} booking(s) exist for this train.`
      });
    }

    await prisma.train.delete({ where: { id: req.params.id } });

    res.json({ message: "Train deleted successfully!" });

  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: "Train not found." });
    }
    console.error("Delete train error:", error);
    res.status(500).json({ error: "Failed to delete train." });
  }
});



app.get('/api/trains/:id', async (req, res) => {
  try {
    const train = await prisma.train.findUnique({
      where: { id: req.params.id },
      include: {
        source: true,
        destination: true,
        _count: { select: { seats: { where: { isBooked: false } } } }
      }
    });

    if (!train) {
      return res.status(404).json({ error: "Train not found." });
    }

    res.json({
      train: { ...train, availableSeats: train._count.seats, _count: undefined }
    });

  } catch (error) {
    console.error("Fetch train error:", error);
    res.status(500).json({ error: "Failed to fetch train." });
  }
});

app.get('/api/trains/:id/seats', async (req, res) => {
  try {
    const seats = await prisma.seat.findMany({
      where: { trainId: req.params.id },
      orderBy: [{ coach: 'asc' }, { seatNumber: 'asc' }]
    });

    if (seats.length === 0) {
      return res.status(404).json({ error: "No seats found for this train." });
    }

    res.json({ results: seats.length, seats });

  } catch (error) {
    console.error("Fetch seats error:", error);
    res.status(500).json({ error: "Failed to fetch seat map." });
  }
});

app.post('/api/bookings', verifyToken, async (req, res) => {
  try {
    const { trainId, seatIds, totalAmount } = req.body;
    const userId = req.user.userId;

    if (!Array.isArray(seatIds) || seatIds.length === 0) {
      return res.status(400).json({ error: "seatIds must be a non-empty array." });
    }

    const train = await prisma.train.findUnique({ where: { id: trainId } });
    if (!train) {
      return res.status(404).json({ error: "Train not found." });
    }

    const generatedPnr = Math.floor(1000000000 + Math.random() * 9000000000).toString();

    const newBooking = await prisma.$transaction(async (tx) => {
      const availableSeats = await tx.seat.findMany({
        where: { id: { in: seatIds }, trainId: trainId, isBooked: false }
      });

      if (availableSeats.length !== seatIds.length) {
        throw new Error("SEATS_UNAVAILABLE");
      }

      const booking = await tx.booking.create({
        data: {
          pnr: generatedPnr,
          userId: userId,
          trainId: trainId,
          totalAmount: parseFloat(totalAmount),
          status: "CONFIRMED"
        }
      });

      await tx.seat.updateMany({
        where: { id: { in: seatIds } },
        data: { isBooked: true, bookingId: booking.id }
      });

      return booking;
    });

    const bookingWithSeats = await prisma.booking.findUnique({
      where: { id: newBooking.id },
      include: { seats: true }
    });

    res.status(201).json({
      message: "Ticket booked successfully!",
      booking: bookingWithSeats
    });

  } catch (error) {
    if (error.message === "SEATS_UNAVAILABLE") {
      return res.status(409).json({ error: "One or more selected seats are no longer available." });
    }
    console.error("Booking error:", error);
    res.status(500).json({ error: "Failed to complete the booking." });
  }
});

const PORT = process.env.PORT || 5000;

app.get('/api/bookings/me', verifyToken, async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: { userId: req.user.userId },
      include: { 
        train: { include: { source: true, destination: true } }, 
        seats: true 
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ bookings });
  } catch (error) {
    console.error("Fetch bookings error:", error);
    res.status(500).json({ error: "Failed to fetch your bookings." });
  }
});

app.get('/api/bookings/pnr/:pnr', async (req, res) => {
  try {
    const booking = await prisma.booking.findUnique({
      where: { pnr: req.params.pnr },
      include: { 
        train: { include: { source: true, destination: true } }, 
        seats: true 
      }
    });

    if (!booking) {
      return res.status(404).json({ error: "PNR not found or invalid." });
    }

    res.json({ booking });
  } catch (error) {
    console.error("PNR lookup error:", error);
    res.status(500).json({ error: "Failed to fetch PNR status." });
  }
});

app.get('/api/users/profile', verifyToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      include: { bookings: true }
    });

    if (!user) return res.status(404).json({ error: "User not found." });

    const totalJourneys = user.bookings.length;
    const upcoming = user.bookings.filter(b => b.status === 'CONFIRMED').length;

    res.json({
      profile: { id: user.id, name: user.name, email: user.email },
      metrics: { totalJourneys, upcoming, miles: totalJourneys * 450 },
      savedPassengers: []
    });
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({ error: "Failed to fetch profile." });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running live on http://localhost:${PORT}`);
});

// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { SitemapStream, streamToPromise } from "sitemap";
import { createGzip } from "zlib";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

const app = express();
// Update CORS to allow multiple origins (Local + Production)
const allowedOrigins = [
  process.env.FRONTEND_URL, 
  "http://localhost:3000",
  "https://jaynit25.github.io" // Add this if you use GitHub Pages for frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        return callback(new Error("CORS policy blocked this origin"), false);
      }
      return callback(null, true);
    },
    credentials: true // Changed to true to support secure sessions/cookies if needed later
  })
);

// Health Check Route (Render uses this to monitor your app)
app.get("/", (req, res) => {
  res.send("Khodiyar Global Holidays API is running...");
});
app.use(express.json());



// -------------------- MODELS --------------------

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { 
    type: String, 
    unique: true, 
    required: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  mobile: { 
    type: String, 
    required: true,
    match: [/^[6-9]\d{9}$/, 'Please fill a valid 10-digit mobile number'] 
  },
  password: { type: String, required: true },
  role: { type: String, default: "customer" }
});
userSchema.index({ email: 1 });

// Auto hash password on save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const User = mongoose.model("User", userSchema);

const Tour = mongoose.model("Tour", new mongoose.Schema({
  title: String,
  location: String,
  category: { type: String, enum: ["char_dham","weekend","trending","destination","exclusive"] },
  actualPrice: Number,
  discountPrice: Number,
  days: Number, 
  person: Number,    
  description: String,
  date: String,
  image: String
}));


const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  tour: { type: mongoose.Schema.Types.ObjectId, ref: "Tour" },
  status: { type: String, default: "Pending" }
});

bookingSchema.index({ user: 1, tour: 1 }, { unique: true });

const Booking = mongoose.model("Booking", bookingSchema);

// -------------------- REVIEW MODEL --------------------

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  tour: { type: mongoose.Schema.Types.ObjectId, ref: "Tour", required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  isApproved: { type: Boolean, default: false }, // New Field
  createdAt: { type: Date, default: Date.now }
});

// Prevent a user from leaving multiple reviews for the same tour
reviewSchema.index({ user: 1, tour: 1 }, { unique: true });

const Review = mongoose.model("Review", reviewSchema);

//--------------------- Upload Image ------------------
// Storage configuration
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // folder where images are saved
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Serve uploads folder statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// -------------------- MIDDLEWARE --------------------

const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "No token" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};


const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Admin only" });
  next();
};

// -------------------- AUTH ROUTES --------------------

app.post("/api/register", async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already registered" });

    const user = await User.create({
      name,
      email,
      mobile,
      password,
      role: "customer"
    });

    res.json({ message: "User registered successfully" });
  } catch (err) {
    // This catches Mongoose validation errors
    res.status(400).json({ message: err.message });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token, role: user.role, name: user.name });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// -------------------- ADMIN DASHBOARD ROUTES --------------------

app.get("/api/admin/total-tours", protect, adminOnly, async (req, res) => {
  const tours = await Tour.countDocuments();
  res.json({ total: tours });
});

app.get("/api/admin/total-bookings", protect, adminOnly, async (req, res) => {
  const bookings = await Booking.countDocuments();
  res.json({ total: bookings });
});

app.get("/api/admin/total-users", protect, adminOnly, async (req, res) => {
  const users = await User.countDocuments();
  res.json({ total: users });
});

// -------------------- TOURS ROUTES --------------------

app.get("/api/tours", async (req, res) => {
  const tours = await Tour.find();
  res.json(tours);
});

app.post("/api/tours", protect, adminOnly, upload.single("image"), async (req, res) => {
  const tourData = req.body;

  if (req.file) {
    tourData.image = `/uploads/${req.file.filename}`; // save path to DB
  }

  const tour = await Tour.create(tourData);
  res.json(tour);
});


app.put("/api/tours/:id", protect, adminOnly, upload.single("image"), async (req, res) => {
  const tourData = req.body;

  if (req.file) {
    tourData.image = `/uploads/${req.file.filename}`;
  }

  const tour = await Tour.findByIdAndUpdate(req.params.id, tourData, { new: true });
  res.json(tour);
});
app.delete("/api/tours/:id", protect, adminOnly, async (req, res) => {
  try {
    const tourId = req.params.id;

    // 1. Delete all Bookings associated with this tour
    await Booking.deleteMany({ tour: tourId });

    // 2. Delete all Reviews associated with this tour
    await Review.deleteMany({ tour: tourId });

    // 3. Finally, delete the Tour itself
    const deletedTour = await Tour.findByIdAndDelete(tourId);

    if (!deletedTour) {
      return res.status(404).json({ message: "Tour not found" });
    }

    res.json({ 
      message: "Tour and all associated bookings/reviews have been removed successfully." 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// -------------------- BOOKINGS ROUTES --------------------

app.post("/api/book", protect, async (req, res) => {
  try {
    const { tourId } = req.body;

    // 1. Check if the user has already booked THIS tour
    const existingBooking = await Booking.findOne({ 
      user: req.user.id, 
      tour: tourId 
    });

    if (existingBooking) {
      return res.status(400).json({ 
        message: "You have already booked this tour package!" 
      });
    }

    // 2. If no duplicate, create the booking
    const booking = await Booking.create({ 
      user: req.user.id, 
      tour: tourId 
    });

    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/api/mybookings", protect, async (req, res) => {
  const bookings = await Booking.find({ user: req.user.id }).populate("tour");
  res.json(bookings);
});

// Get all bookings with user & tour
app.get("/api/admin/bookings", protect, adminOnly, async (req, res) => {
  const bookings = await Booking.find().populate("user").populate("tour");
  res.json(bookings);
});

// Update booking status
app.put("/api/admin/bookings/:id", protect, adminOnly, async (req, res) => {
  const booking = await Booking.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  res.json(booking);
});


// -------------------- USERS ROUTES --------------------

// Get all users
app.get("/api/admin/users", protect, adminOnly, async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// Delete user
app.delete("/api/admin/users/:id", protect, adminOnly, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted" });
});

// ---------------------- Users Profile ---------------------
// Get Profile
app.get("/api/profile", protect, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");

  if (!user) return res.status(404).json({ message: "User not found" });

  res.json(user);
});

// UPDATE PROFILE
app.put("/api/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.mobile = req.body.mobile || user.mobile;

    if (req.body.password && req.body.password !== "") {
      user.password = req.body.password; // hashed by pre-save hook
    }

    await user.save();
    res.json({ message: "Profile updated successfully!" });
  } catch (err) {
    if (err.code === 11000) {
      // Duplicate key error
      if (err.keyPattern.email) {
        return res.status(400).json({ message: "This email is already taken." });
      }
      if (err.keyPattern.mobile) {
        return res.status(400).json({ message: "This mobile number is already taken." });
      }
    }
    res.status(500).json({ message: err.message });
  }
});

// --------------------- Review Section ---------------------

// 1. Submit a Review
app.post("/api/reviews", protect, async (req, res) => {
  try {
    const { tourId, rating, comment } = req.body;

    // Optional: Check if user actually booked this tour before allowing a review
    const hasBooked = await Booking.findOne({ user: req.user.id, tour: tourId, status: "Confirmed" });
    // If you want to allow everyone to review, comment out the next 2 lines:
    if (!hasBooked) return res.status(403).json({ message: "You can only review tours you have a confirmed booking for." });

    const review = await Review.create({
      user: req.user.id,
      tour: tourId,
      rating,
      comment
    });

    res.status(201).json(review);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "You have already reviewed this tour." });
    }
    res.status(500).json({ message: err.message });
  }
});

// Get only APPROVED reviews for customers
app.get("/api/reviews/:tourId", async (req, res) => {
  try {
    const reviews = await Review.find({ 
      tour: req.params.tourId, 
      isApproved: true // Only show approved ones
    })
    .populate("user", "name")
    .sort({ createdAt: -1 });
    
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: Approve or Reject a review
app.put("/api/admin/reviews/:id/approve", protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    const review = await Review.findByIdAndUpdate(
      req.params.id, 
      { isApproved: status }, 
      { new: true }
    );

    // Add this check
    if (!review) return res.status(404).json({ message: "Review not found" });

    res.json({ message: `Review ${status ? 'Approved' : 'Hidden'}`, review });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: Get ALL reviews (including pending) for the dashboard
app.get("/api/admin/reviews", protect, adminOnly, async (req, res) => {
  const reviews = await Review.find().populate("user", "name").populate("tour", "title");
  res.json(reviews);
});
// -------------------- SEO & SITEMAP ROUTE --------------------

app.get("/sitemap.xml", async (req, res) => {
  res.header("Content-Type", "application/xml");
  res.header("Content-Encoding", "gzip");

  try {
    const smStream = new SitemapStream({ 
      hostname: "https://www.khodiyarglobalholidays.com" 
    });
    const pipeline = smStream.pipe(createGzip());

    // 1. Static Pages
    smStream.write({ url: "/", changefreq: "daily", priority: 1.0 });
    smStream.write({ url: "/login", changefreq: "monthly", priority: 0.3 });
    smStream.write({ url: "/register", changefreq: "monthly", priority: 0.3 });

    // 2. Dynamic Tour Pages
    // This pulls every tour you've added to MongoDB automatically
    const tours = await Tour.find(); 
    tours.forEach((tour) => {
      smStream.write({
        url: `/tour/${tour._id}`, 
        changefreq: "weekly",
        priority: 0.8,
      });
    });

    smStream.end();

    // Stream the result to the response
    streamToPromise(pipeline).then((sm) => res.send(sm));
  } catch (err) {
    console.error(err);
    res.status(500).end();
  }
});
// -------------------- START SERVER --------------------

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Backend running on port ${PORT}`)
);

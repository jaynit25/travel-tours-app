const fs = require("fs");
const path = require("path");

function createFile(filePath, content) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filePath, content);
}

/* ================= BACKEND ================= */

createFile("backend/package.json", `
{
  "name": "travel-backend",
  "version": "1.0.0",
  "main": "server.js",
  "type": "module",
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^16.0.3",
    "express": "^4.18.2",
    "jsonwebtoken": "^9.0.0",
    "mongoose": "^7.0.0"
  }
}
`);

createFile("backend/server.js", `
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

mongoose.connect("mongodb://127.0.0.1:27017/travelapp");

const app = express();
app.use(cors());
app.use(express.json());

const User = mongoose.model("User", new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: { type: String, default: "customer" }
}));

const Tour = mongoose.model("Tour", new mongoose.Schema({
  title: String,
  location: String,
  price: Number,
  description: String,
  date: String
}));

const Booking = mongoose.model("Booking", new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  tour: { type: mongoose.Schema.Types.ObjectId, ref: "Tour" },
  status: { type: String, default: "Pending" }
}));

const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token" });
  const decoded = jwt.verify(token, "SECRET");
  req.user = decoded;
  next();
};

const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Admin only" });
  next();
};

/* AUTH */
app.post("/api/register", async (req, res) => {
  const hashed = await bcrypt.hash(req.body.password, 10);
  const user = await User.create({ ...req.body, password: hashed });
  res.json(user);
});

app.post("/api/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user || !(await bcrypt.compare(req.body.password, user.password)))
    return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign({ id: user._id, role: user.role }, "SECRET");
  res.json({ token, role: user.role });
});

/* TOURS */
app.get("/api/tours", async (req, res) => {
  res.json(await Tour.find());
});

app.post("/api/tours", protect, adminOnly, async (req, res) => {
  res.json(await Tour.create(req.body));
});

app.delete("/api/tours/:id", protect, adminOnly, async (req, res) => {
  await Tour.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

/* BOOKINGS */
app.post("/api/book", protect, async (req, res) => {
  res.json(await Booking.create({ user: req.user.id, tour: req.body.tourId }));
});

app.get("/api/mybookings", protect, async (req, res) => {
  res.json(await Booking.find({ user: req.user.id }).populate("tour"));
});

app.listen(5000, () => console.log("Backend running on 5000"));
`);

/* ================= FRONTEND ================= */

createFile("frontend/package.json", `
{
  "name": "travel-frontend",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "axios": "^1.6.0",
    "bootstrap": "^5.3.2",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.18.0"
  }
}
`);

createFile("frontend/src/index.js", `
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
`);

createFile("frontend/src/App.js", `
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Tours from "./pages/Tours";
import MyBookings from "./pages/MyBookings";
import Admin from "./pages/Admin";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/tours" element={<Tours />} />
        <Route path="/mybookings" element={<MyBookings />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}
`);

createFile("frontend/src/pages/Home.js", `
export default function Home(){
  return <div className="container mt-5">
    <h1 className="text-primary">Travel Tours</h1>
    <p>Welcome to our professional travel booking platform.</p>
  </div>
}
`);

createFile("frontend/src/pages/Login.js", `
import axios from "axios";
import { useState } from "react";

export default function Login(){
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");

  const login=async()=>{
    const res=await axios.post("http://localhost:5000/api/login",{email,password});
    localStorage.setItem("token",res.data.token);
    alert("Logged in");
  }

  return <div className="container mt-5">
    <h2>Login</h2>
    <input className="form-control mb-2" placeholder="Email" onChange={e=>setEmail(e.target.value)}/>
    <input className="form-control mb-2" type="password" placeholder="Password" onChange={e=>setPassword(e.target.value)}/>
    <button className="btn btn-primary" onClick={login}>Login</button>
  </div>
}
`);

createFile("frontend/src/pages/Register.js", `
import axios from "axios";
import { useState } from "react";

export default function Register(){
  const [data,setData]=useState({name:"",email:"",password:""});

  const register=async()=>{
    await axios.post("http://localhost:5000/api/register",data);
    alert("Registered");
  }

  return <div className="container mt-5">
    <h2>Register</h2>
    <input className="form-control mb-2" placeholder="Name" onChange={e=>setData({...data,name:e.target.value})}/>
    <input className="form-control mb-2" placeholder="Email" onChange={e=>setData({...data,email:e.target.value})}/>
    <input className="form-control mb-2" type="password" placeholder="Password" onChange={e=>setData({...data,password:e.target.value})}/>
    <button className="btn btn-success" onClick={register}>Register</button>
  </div>
}
`);

createFile("frontend/src/pages/Tours.js", `
import axios from "axios";
import { useEffect,useState } from "react";

export default function Tours(){
  const [tours,setTours]=useState([]);

  useEffect(()=>{axios.get("http://localhost:5000/api/tours").then(res=>setTours(res.data))},[]);

  const book=async(id)=>{
    await axios.post("http://localhost:5000/api/book",{tourId:id},{
      headers:{Authorization:"Bearer "+localStorage.getItem("token")}
    });
    alert("Booked!");
  }

  return <div className="container mt-5">
    <h2>Available Tours</h2>
    {tours.map(t=>
      <div key={t._id} className="card p-3 mb-3">
        <h5>{t.title}</h5>
        <p>{t.location} - \${t.price}</p>
        <button className="btn btn-primary" onClick={()=>book(t._id)}>Book</button>
      </div>
    )}
  </div>
}
`);

createFile("frontend/src/pages/MyBookings.js", `
import axios from "axios";
import { useEffect,useState } from "react";

export default function MyBookings(){
  const [bookings,setBookings]=useState([]);

  useEffect(()=>{
    axios.get("http://localhost:5000/api/mybookings",{
      headers:{Authorization:"Bearer "+localStorage.getItem("token")}
    }).then(res=>setBookings(res.data));
  },[]);

  return <div className="container mt-5">
    <h2>My Bookings</h2>
    {bookings.map(b=>
      <div key={b._id} className="card p-3 mb-3">
        <h5>{b.tour.title}</h5>
        <p>Status: {b.status}</p>
      </div>
    )}
  </div>
}
`);

createFile("frontend/src/pages/Admin.js", `
import axios from "axios";
import { useState } from "react";

export default function Admin(){
  const [tour,setTour]=useState({title:"",location:"",price:"",description:"",date:""});

  const addTour=async()=>{
    await axios.post("http://localhost:5000/api/tours",tour,{
      headers:{Authorization:"Bearer "+localStorage.getItem("token")}
    });
    alert("Tour Added");
  }

  return <div className="container mt-5">
    <h2>Admin Dashboard</h2>
    <input className="form-control mb-2" placeholder="Title" onChange={e=>setTour({...tour,title:e.target.value})}/>
    <input className="form-control mb-2" placeholder="Location" onChange={e=>setTour({...tour,location:e.target.value})}/>
    <input className="form-control mb-2" placeholder="Price" onChange={e=>setTour({...tour,price:e.target.value})}/>
    <button className="btn btn-danger" onClick={addTour}>Add Tour</button>
  </div>
}
`);

console.log("Project Generated Successfully!");

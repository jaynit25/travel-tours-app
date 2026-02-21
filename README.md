Perfect ✅ since:

✅ MongoDB Atlas is ready

✅ .env is configured

✅ CORS fixed

✅ PORT fixed

Now let’s go step-by-step from zero to LIVE website for your travel app.

🌍 COMPLETE DEPLOYMENT PLAN (FINAL VERSION)

You have a MERN stack (CRA + Node + MongoDB Atlas).

We’ll use:

Backend → Render

Frontend → Render

Database → MongoDB Atlas

Domain → Namecheap (or GoDaddy / Hostinger)

🟢 PHASE 1 — Deploy Backend (Render)
Step 1:

Go to Render.com → Sign in → Connect GitHub

Step 2:

Click New → Web Service

Step 3:

Select your Backend repository

Step 4:

Fill:

Runtime: Node

Build Command:

npm install

Start Command:

node server.js
Step 5:

Add Environment Variables:

MONGO_URI=your_mongodb_atlas_url
JWT_SECRET=your_secret
FRONTEND_URL=http://localhost:3000 (temporary)
NODE_ENV=production
Step 6:

Click Deploy

After 2–3 minutes, you’ll get:

https://khodiyar-backend.onrender.com

Test:

https://your-backend.onrender.com/api/tours

If JSON appears → backend is LIVE ✅

🟢 PHASE 2 — Deploy Frontend (CRA)
Step 1:

In Render → New → Static Site

Step 2:

Select your frontend repo

Step 3:

Build Command:

npm run build
Step 4:

Publish Directory:

build
Step 5:

Add Environment Variable:

REACT_APP_API_URL=https://your-backend.onrender.com
Step 6:

Deploy

You’ll get:

https://khodiyar-frontend.onrender.com

Your site is now LIVE 🌍

🟢 PHASE 3 — Buy Domain

Buy domain from:

Namecheap (recommended)

GoDaddy

Hostinger

Example domain:

www.khodiyarglobalholidays.com

Cost:
₹800 – ₹1200 per year approx.

🟢 PHASE 4 — Connect Domain to Render

After buying domain:

Step 1:

Go to Render → Frontend Service → Settings → Custom Domain

Add:

www.khodiyarglobalholidays.com

Render will give you:

CNAME Record
Step 2:

Go to your Domain provider → DNS Settings

Add:

Type	Host	Value
CNAME	www	your-frontend.onrender.com

Save.

Wait 5–30 minutes.

Your site will open as:

https://www.khodiyarglobalholidays.com
🟢 PHASE 5 — Update Backend CORS

Now update Backend Environment Variable:

FRONTEND_URL=https://www.khodiyarglobalholidays.com

Redeploy backend.

Done ✅

💰 Total Cost (Starter Version)
Item	Cost
MongoDB Atlas	Free
Render	Free Tier
Domain	₹1000/year
SSL	Free (Auto by Render)

So you can go LIVE for approx ₹1000/year.

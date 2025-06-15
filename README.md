# 🛒 Product Catalog Web App

This is a simple web app with **login/signup** functionality and a **product catalog** page, powered by a PostgreSQL database and a TypeScript backend.

---

## 🚀 Setup Instructions

1. **Clone the Repository**

```bash
git clone https://github.com/a-3isa/market.git
```

2. **Install Dependencies**

```bash
npm install
```

3. **Configure the Database**

Make sure you have PostgreSQL installed and running locally.

Set the environment variable `DATABASE_URL` (you can use `dotenv` or pass inline):

```bash
DATABASE_URL=postgres://<USERNAME>:<PASSWORD>@localhost:<PORT>/market
```

> ⚠️ Replace `USERNAME` , `PASSWORD` , `PORT` with your actual PostgreSQL cardinals if it's different.

4. **Run Database Migrations**

```bash
npm run migrate up
```

> This will create the required tables in your `market` database.

5. **Start the Backend Server**

```bash
npm start
```

> This will start your API server on `http://localhost:3000`.

6. **Serve the Frontend**

If your frontend is static (like plain HTML/JS), run:

```bash
http-server .
```

Then open your browser and go to:

```
http://localhost:8080
```

---

## 📁 Project Structure

```
├── index.html         # Login/Signup UI
├── catalog.html       # Product catalog UI
├── backend/           # TypeScript backend code
│   ├── index.ts
│   └── routes/
├── migrations/        # DB migrations
├── package.json
├── tsconfig.json
└── README.md
```

---

## 📦 Tech Stack

- TypeScript (Node.js)
- PostgreSQL
- Plain HTML/CSS/JS (Frontend)
- `http-server` for static serving

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "authdb",
  password: "arabbinmazi",
  port: 5432,
});

// 🔐 Signup
app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3)",
      [name, email, hashedPassword]
    );
    res.status(201).json({ message: "User created successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Error registering user" });
  }
});

// 👥 Get all users
app.get("/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT id, name, email FROM users");
    res.status(200).json({ users: result.rows });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// ❌ Delete user — now public (no token needed)
app.delete("/users/:id", async (req, res) => {
  const { id } = req.params;
  console.log("🔥 DELETE /users/:id HIT");
  console.log("Deleting user with ID:", id);

  try {
    const result = await pool.query(
      "DELETE FROM users WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0) {
      console.warn("⚠️ No user found with that ID.");
      return res.status(404).json({ error: "User not found", success: false });
    }

    console.log("✅ User deleted:", result.rows[0]);
    return res.json({ message: "User deleted successfully!", success: true });
  } catch (error) {
    console.error("💥 Error deleting user:", error.message);
    return res
      .status(500)
      .json({ error: "Failed to delete user", success: false });
  }
});

// 🔓 Login — now only checks password, no token returned
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (user.rows.length === 0)
      return res.status(400).json({ error: "User not found" });

    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword)
      return res.status(400).json({ error: "Invalid password" });

    res.json({ message: "Login successful!" });
  } catch (error) {
    res.status(500).json({ error: "Error logging in" });
  }
});

// 💬 Contact route is public now
app.get("/contact", (req, res) => {
  res.json({ message: "Welcome to the contact form!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

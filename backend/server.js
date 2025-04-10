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
// app.post("/signup", async (req, res) => {
//   const { name, email, password } = req.body;
//   try {
//     const hashedPassword = await bcrypt.hash(password, 10);
//     await pool.query(
//       "INSERT INTO users (name, email, password) VALUES ($1, $2, $3)",
//       [name, email, hashedPassword]
//     );
//     res.status(201).json({ message: "User created successfully!" });
//   } catch (error) {
//     res.status(500).json({ error: "Error registering user" });
//   }
// });

app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    // 👇 Insert with is_active = true by default
    await pool.query(
      "INSERT INTO users (name, email, password, is_active,is_admin) VALUES ($1, $2, $3, $4,$5)",
      [name, email, hashedPassword, true, false]
    );

    res.status(201).json({ message: "User created successfully!" });
  } catch (error) {
    console.error("Signup error:", error.message);
    res.status(500).json({ error: "Error registering user" });
  }
});

// 👥 Get all users
// 👥 Get all users — now includes is_active
app.get("/users", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email, is_active FROM users ORDER BY id"
    );
    res.status(200).json({ users: result.rows });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

app.patch("/users/:id/deactivate", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "UPDATE users SET is_active = false WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User deactivated successfully!" });
  } catch (error) {
    console.error("Deactivate error:", error.message);
    res.status(500).json({ error: "Failed to deactivate user" });
  }
});

app.patch("/users/:id/activate", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "UPDATE users SET is_active = true WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User activated successfully!" });
  } catch (error) {
    console.error("Activate error:", error.message);
    res.status(500).json({ error: "Failed to activate user" });
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
// app.post("/login", async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const user = await pool.query("SELECT * FROM users WHERE email = $1", [
//       email,
//     ]);
//     if (user.rows.length === 0)
//       return res.status(400).json({ error: "User not found" });

//     const validPassword = await bcrypt.compare(password, user.rows[0].password);
//     if (!validPassword)
//       return res.status(400).json({ error: "Invalid password" });

//     res.json({ message: "Login successful!" });
//   } catch (error) {
//     res.status(500).json({ error: "Error logging in" });
//   }
// });
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    const user = result.rows[0];

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    if (!user.is_active) {
      return res.status(403).json({
        error: "Your account is deactivated. Please contact support or admin.",
      });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: "Invalid password" });
    }

    res.json({ message: "Login successful!" });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Error logging in" });
  }
});

// new route added
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    const user = result.rows[0];

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    if (!user.is_active) {
      return res.status(403).json({
        error: "Your account is deactivated. Please contact support or admin.",
      });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: "Invalid password" });
    }

    res.json({ message: "Login successful!" });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Error logging in" });
  }
});
app.put("/users/:id/status", async (req, res) => {
  const { id } = req.params;
  const { is_active } = req.body;

  try {
    const result = await pool.query(
      "UPDATE users SET is_active = $1 WHERE id = $2 RETURNING id, name, email, is_active",
      [is_active, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const statusMsg = is_active ? "activated" : "deactivated";
    return res.json({
      message: `User ${statusMsg} successfully!`,
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Error updating user status:", error);
    res.status(500).json({ error: "Failed to update user status" });
  }
});

// 💬 Contact route is public now
app.get("/contact", (req, res) => {
  res.json({ message: "Welcome to the contact form!" });
});

app.put("/users/:id/admin", async (req, res) => {
  const { id } = req.params;

  try {
    // 1. Set all users' is_admin = false
    await pool.query("UPDATE users SET is_admin = false");

    // 2. Set selected user is_admin = true
    const result = await pool.query(
      "UPDATE users SET is_admin = true WHERE id = $1 RETURNING id, name, email, is_admin",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({
      message: "Admin rights assigned to user successfully!",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Error setting admin:", error);
    res.status(500).json({ error: "Failed to set admin user" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

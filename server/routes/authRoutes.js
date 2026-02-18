import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import connectdb from "../config/db.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "secretkey";

// Rôles autorisés
const ALLOWED_ROLES = ["client", "seller", "admin"];

// 🔹 REGISTER
router.post("/register", async (req, res) => {
  let { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields required" });
  }

  // rôle par défaut = "client"
  if (!role || !ALLOWED_ROLES.includes(role)) {
    role = "client";
  }

  console.log(`[REGISTER] Attempting to register: ${email} as ${role}`);

  // vérifier si l'email existe
  connectdb.query("SELECT * FROM user WHERE email = ?", [email], async (err, data) => {
    if (err) {
      console.error("[REGISTER] DB error (SELECT):", err);
      return res.status(500).json({ message: "DB error", error: err });
    }
    if (data.length > 0) {
      console.log("[REGISTER] Email already exists:", email);
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // insérer l'utilisateur
    connectdb.query(
      "INSERT INTO user (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, role],
      (err, result) => {
        if (err) {
          console.error("[REGISTER] DB error (INSERT):", err);
          return res.status(500).json({ message: "Failed to create user", error: err });
        }

        console.log("[REGISTER] User created successfully:", email);

        const token = jwt.sign(
          { id: result.insertId, email, role },
          JWT_SECRET,
          { expiresIn: "1h" }
        );

        res.json({ status: true, message: "User registered successfully", token, role });
      }
    );
  });
});

// 🔹 LOGIN
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  console.log(`[LOGIN] Attempting login for: ${email}`);

  connectdb.query("SELECT * FROM user WHERE email = ?", [email], async (err, data) => {
    if (err) {
      console.error("[LOGIN] DB error (SELECT):", err);
      return res.status(500).json({ message: "DB error", error: err });
    }

    if (data.length === 0) {
      console.log("[LOGIN] Invalid email:", email);
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const user = data[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("[LOGIN] Invalid password for:", email);
      return res.status(400).json({ message: "Invalid email or password" });
    }

    console.log("[LOGIN] Login successful:", email);

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ status: true, message: "Login successful", token, role: user.role });
  });
});

export default router;

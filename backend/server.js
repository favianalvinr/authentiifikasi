import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

const app = express();
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

// ======================
// Setup database JSON
// =======================
const adapter = new JSONFile("./db.json");
const db = new Low(adapter, { users: [], items: [] });
await db.read();
db.data ||= { users: [], items: [] };
await db.write();

const SECRET = "rahasia123";

// ==================== REGISTER ====================
app.post("/api/auth/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ message: "Lengkapi semua field" });

  const users = db.data.users;
  if (users.find((u) => u.email === email)) {
    return res.status(400).json({ message: "Email sudah terdaftar" });
  }

  const hashed = await bcrypt.hash(password, 10);
  const newUser = { id: Date.now(), name, email, password: hashed };
  users.push(newUser);
  await db.write();

  res.json({ message: "Registrasi berhasil" });
});

// ==================== LOGIN ====================
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const user = db.data.users.find((u) => u.email === email);
  if (!user) return res.status(400).json({ message: "Email tidak ditemukan" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ message: "Password salah" });

  const token = jwt.sign({ id: user.id, email: user.email }, SECRET, {
    expiresIn: "2h",
  });
  res.json({ token });
});

// ==================== AUTH MIDDLEWARE ====================
function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ message: "Token tidak ditemukan" });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Token tidak valid" });
    req.user = decoded;
    next();
  });
}

// ==================== CRUD ITEMS ====================
app.get("/api/items", auth, (req, res) => {
  res.json(db.data.items);
});

app.post("/api/items", auth, async (req, res) => {
  const { title, description } = req.body;
  const newItem = { id: Date.now(), title, description };
  db.data.items.push(newItem);
  await db.write();
  res.json({ message: "Data berhasil ditambah", data: newItem });
});

app.put("/api/items/:id", auth, async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  const index = db.data.items.findIndex((i) => i.id == id);
  if (index === -1)
    return res.status(404).json({ message: "Data tidak ditemukan" });

  db.data.items[index] = { ...db.data.items[index], title, description };
  await db.write();
  res.json({ message: "Data berhasil diperbarui" });
});

app.delete("/api/items/:id", auth, async (req, res) => {
  const { id } = req.params;
  db.data.items = db.data.items.filter((i) => i.id != id);
  await db.write();
  res.json({ message: "Data berhasil dihapus" });
});

// ==================== START SERVER ====================
const PORT = 5000;
app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);

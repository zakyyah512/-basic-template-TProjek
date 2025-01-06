import express from "express";
import mysql from "mysql";
import { fileURLToPath } from "url";
import path from "path";

const app = express();
const hostname = "127.0.0.1";
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

// Konfigurasi koneksi MySQL
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "bakso_pakde",
});

// Cek koneksi ke database
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to database:", err);
    return;
  }
  console.log("Connected to MySQL database!");
});

// CREATE - Post

app.post("/food", (req, res) => {
  const { nama, harga, gambar } = req.body;
  let sql = "INSERT INTO food (nama, harga, gambar) VALUES (?, ?, ?)";
  connection.query(sql, [nama, harga, gambar], (err, result) => {
    if (err) {
      console.error("Error inserting data: ", err);
      return res.status(500).json({ success: false, message: "Gagal menambahkan menu" });
    }
    res.json({ success: true, message: "Menu berhasil ditambahkan", type: "food" });
  });
});

app.post("/drink", (req, res) => {
  const { nama, harga, gambar } = req.body;
  let sql = "INSERT INTO drink (nama, harga, gambar) VALUES (?, ?, ?)";
  connection.query(sql, [nama, harga, gambar], (err, result) => {
    if (err) {
      console.error("Error inserting data: ", err);
      return res.status(500).json({ success: false, message: "Gagal menambahkan menu" });
    }
    res.json({ success: true, message: "Menu berhasil ditambahkan", type: "drink" });
  });
});

// READ - Get
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "main.html"));
});

app.get("/food", (req, res) => {
  let sql = "SELECT * FROM food";
  connection.query(sql, (err, result) => {
    if (err) {
      res.status(500).send("Error fetching data");
      return;
    }
    res.status(200).json(result);
  });
});

app.get("/food/:id", (req, res) => {
  const { id } = req.params;
  let sql = "SELECT * FROM food WHERE id = ?";
  connection.query(sql, [id], (err, result) => {
    if (err) {
      res.status(500).send("Error fetching data");
      return;
    }
    if (result.length === 0) {
      res.status(404).send("Food not found");
      return;
    }
    res.status(200).json(result[0]);
  });
});

app.get("/drink", (req, res) => {
  let sql = "SELECT * FROM drink";
  connection.query(sql, (err, result) => {
    if (err) {
      res.status(500).send("Error fetching data");
      return;
    }
    res.status(200).json(result);
  });
});

app.get("/drink/:id", (req, res) => {
  const { id } = req.params;
  let sql = "SELECT * FROM drink WHERE id = ?";
  connection.query(sql, [id], (err, result) => {
    if (err) {
      res.status(500).send("Error fetching data");
      return;
    }
    if (result.length === 0) {
      res.status(404).send("Drink not found");
      return;
    }
    res.status(200).json(result[0]);
  });
});

// UPDATE - Put
app.put("/food/:id", (req, res) => {
  const { id } = req.params;
  const { nama, harga, gambar } = req.body;
  let sql = "UPDATE food SET nama = ?, harga = ?, gambar = ? WHERE id = ?";
  connection.query(sql, [nama, harga, gambar, id], (err, result) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.send("Menu updated successfully!");
  });
});

app.put("/drink/:id", (req, res) => {
  const { id } = req.params;
  const { nama, harga, gambar } = req.body;
  let sql = "UPDATE drink SET nama = ?, harga = ?, gambar = ? WHERE id = ?";
  connection.query(sql, [nama, harga, gambar, id], (err, result) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.send("Menu updated successfully!");
  });
});

// DELETE
app.delete("/food/:id", (req, res) => {
  const { id } = req.params;
  let sql = "DELETE FROM food WHERE id = ?";
  connection.query(sql, [id], (err, result) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.send("Menu deleted successfully!");
  });
});

app.delete("/drink/:id", (req, res) => {
  const { id } = req.params;
  let sql = "DELETE FROM drink WHERE id = ?";
  connection.query(sql, [id], (err, result) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.send("Menu deleted successfully!");
  });
});

// Jalankan server
app.listen(port, hostname, () => {
  console.log(`Server running at ${hostname}:${port}`);
});

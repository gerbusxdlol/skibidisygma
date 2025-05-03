const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");

const app = express(); // <- To musi być ZANIM używasz app.use()

// Middleware
app.use(express.static('public')); // serwowanie plików statycznych z folderu public
app.use(cors());
app.use(bodyParser.json());

// Trasa główna
app.get('/', (req, res) => {
  res.send('Witaj na stronie głównej!');
});

// Połączenie z MongoDB
mongoose.connect("mongodb+srv://gerbusxdlol:Didolek098@cluster0.di7y32w.mongodb.net/logindbnp?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log("✅ Połączono z MongoDB!");
})
.catch(err => {
  console.error("❌ Błąd połączenia z MongoDB:", err);
});

// Model użytkownika
const User = mongoose.model("User", new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}));

// Endpoint: Rejestracja
app.post("/register", async (req, res) => {
  const { email, password } = req.body;
  console.log("📥 Otrzymano dane do rejestracji:", email);

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Użytkownik już istnieje!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });

    await newUser.save();
    console.log("✅ Użytkownik zapisany:", email);
    res.status(201).json({ message: "Rejestracja zakończona pomyślnie!" });

  } catch (error) {
    console.error("❌ Błąd rejestracji:", error);
    res.status(500).json({ message: "Wystąpił błąd podczas rejestracji." });
  }
});

// Endpoint: Logowanie
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("🔐 Próba logowania:", email);

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Użytkownik nie znaleziony!" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Niepoprawne hasło!" });
    }

    res.status(200).json({ message: "Zalogowano pomyślnie!" });
  } catch (error) {
    console.error("❌ Błąd logowania:", error);
    res.status(500).json({ message: "Wystąpił błąd podczas logowania." });
  }
});

// Uruchomienie serwera
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Serwer działa na porcie ${PORT}`);
});

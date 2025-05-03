const express = require("express");
const mongoose = require("mongoose");
const app = express();

// Połączenie z MongoDB
mongoose.connect("mongodb+srv://gerbusxdlol:Didolek098@cluster0.di7y32w.mongodb.net/logindbnp", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.error("Connection error", err);
});

// Definicja schematu i modelu
const userSchema = new mongoose.Schema({
    name: String,
    age: Number
});

const usermodel = mongoose.model("emp", userSchema);

// Tworzenie nowego użytkownika
const emps = new usermodel({
    name: "gerbus",
    age: 23
});

// Zapis użytkownika do bazy
emps.save().then(() => {
    console.log("User saved");
}).catch((err) => {
    console.error("Save error", err);
});

// Start serwera
app.listen(2137, () => {
    console.log("Server is running on port 2137!!!");
});

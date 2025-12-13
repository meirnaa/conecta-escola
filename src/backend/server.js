const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const USERS_FILE = "./users.json";

/* 🔧 função utilitária */
function readUsers() {
  try {
    const data = fs.readFileSync(USERS_FILE, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Erro ao ler users.json:", err);
    return [];
  }
}

function saveUsers(users) {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  } catch (err) {
    console.error("Erro ao salvar users.json:", err);
  }
}

/* 📝 CADASTRO */
app.post("/register", (req, res) => {
  const { name, email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ error: "Dados inválidos" });
  }

  const users = readUsers();

  const exists = users.find((u) => u.email === email);
  if (exists) {
    return res.status(409).json({ error: "Usuário já existe" });
  }

  const newUser = {
    id: Date.now(),
    status: "ativo",
    ...req.body,
  };

  users.push(newUser);
  saveUsers(users);

  res.status(201).json(newUser);
});

/* 🔐 LOGIN */
app.post("/login", (req, res) => {
  const { email, password, role } = req.body;

  const users = readUsers();

  const user = users.find(
    (u) =>
      u.email === email &&
      u.password === password &&
      u.role === role
  );

  if (!user) {
    return res.status(401).json({ error: "Credenciais inválidas" });
  }

  res.json(user);
});

/* 🔎 BUSCAR USUÁRIOS */
app.get("/users", (req, res) => {
  const users = readUsers();
  res.json(users);
});

app.listen(3333, () => {
  console.log("🚀 Backend mock rodando em http://localhost:3333");
});

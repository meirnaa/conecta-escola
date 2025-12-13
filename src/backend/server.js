const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const USERS_FILE = "./users.json";
const AULAS_FILE = "./aulas.json";
const AVISOS_FILE = "./avisos.json";

/* 🔧 Funções utilitárias */
function readJson(file) {
  try {
    const data = fs.readFileSync(file, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

function saveJson(file, data) {
  try {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(`Erro ao salvar ${file}:`, err);
  }
}

/* 📝 CADASTRO */
app.post("/register", (req, res) => {
  const { name, email, password, role } = req.body;
  if (!email || !password || !role) {
    return res.status(400).json({ error: "Dados inválidos" });
  }

  const users = readJson(USERS_FILE);
  if (users.find(u => u.email === email)) {
    return res.status(409).json({ error: "Usuário já existe" });
  }

  const newUser = { id: Date.now(), status: "ativo", ...req.body };
  users.push(newUser);
  saveJson(USERS_FILE, users);

  res.status(201).json(newUser);
});

/* 🔐 LOGIN */
app.post("/login", (req, res) => {
  const { email, password, role } = req.body;
  const users = readJson(USERS_FILE);

  const user = users.find(u => u.email === email && u.password === password && u.role === role);
  if (!user) return res.status(401).json({ error: "Credenciais inválidas" });

  res.json(user);
});

/* 🔎 BUSCAR USUÁRIOS */
app.get("/users", (req, res) => {
  const users = readJson(USERS_FILE);
  res.json(users);
});

/* ✏️ EDITAR USUÁRIOS */
app.put("/users/:id", (req, res) => {
  const users = readJson(USERS_FILE);
  const id = parseInt(req.params.id);
  const index = users.findIndex(u => u.id === id);
  if (index === -1) return res.status(404).json({ error: "Usuário não encontrado" });

  users[index] = { ...users[index], ...req.body };
  saveJson(USERS_FILE, users);
  res.json(users[index]);
});

/* 🏫 AULAS */
app.get("/aulas", (req, res) => {
  const aulas = readJson(AULAS_FILE);
  res.json(aulas);
});

app.post("/aulas", (req, res) => {
  const { turma, data, conteudo, frequencia } = req.body;
  if (!turma || !data || !conteudo) {
    return res.status(400).json({ error: "Dados da aula incompletos" });
  }

  const aulas = readJson(AULAS_FILE);
  const novaAula = { id: Date.now(), turma, data, conteudo, frequencia: frequencia || [] };
  aulas.push(novaAula);
  saveJson(AULAS_FILE, aulas);

  res.status(201).json(novaAula);
});

/* 🔔 AVISOS */
app.get("/avisos", (req, res) => {
  const avisos = readJson(AVISOS_FILE);
  res.json(avisos);
});

app.post("/avisos", (req, res) => {
  const { turma, titulo, mensagem } = req.body;
  if (!turma || !titulo || !mensagem) {
    return res.status(400).json({ error: "Dados do aviso incompletos" });
  }

  const avisos = readJson(AVISOS_FILE);
  const novoAviso = { id: Date.now(), turma, titulo, mensagem, data: new Date().toISOString() };
  avisos.push(novoAviso);
  saveJson(AVISOS_FILE, avisos);

  res.status(201).json(novoAviso);
});

/* 🔧 Iniciar servidor */
app.listen(3333, () => {
  console.log("🚀 Backend mock rodando em http://localhost:3333");
});
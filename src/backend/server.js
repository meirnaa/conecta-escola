const db = require("./firebase");
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

/* 📝 CADASTRO */
app.post("/register", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const allowedRoles = ["aluno", "professor", "diretor", "secretaria"];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ error: "Role inválido" });
    }

    if (!email || !password || !role) {
      return res.status(400).json({ error: "Dados inválidos" });
    }

    const collectionName = `users_${role}s`; 
    // ex: users_alunos, users_professores

    // verificar se email já existe
    const snapshot = await db
      .collection(collectionName)
      .where("email", "==", email)
      .get();

    if (!snapshot.empty) {
      return res.status(409).json({ error: "Usuário já existe" });
    }

    const bcrypt = require("bcryptjs");

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      ...req.body,
      password: hashedPassword,
      status: "ativo",
      createdAt: new Date(),
    };

    const docRef = await db.collection(collectionName).add(newUser);

    res.status(201).json({ id: docRef.id, ...newUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/* 🔐 LOGIN */
const bcrypt = require("bcryptjs");

app.post("/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ error: "Dados inválidos" });
    }

    const roleMap = {
      aluno: "users_alunos",
      professor: "users_professores",
      diretor: "users_diretores",
      secretaria: "users_secretarias",
    };

    const collectionName = roleMap[role];

    if (!collectionName) {
      return res.status(400).json({ error: "Role inválido" });
    }

    const snapshot = await db
      .collection(collectionName)
      .where("email", "==", email)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();

    const isValid = await bcrypt.compare(password, userData.password);

    if (!isValid) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    res.json({
      id: userDoc.id,
      ...userData,
      password: undefined, // 🔒 nunca retorna senha
    });
  } catch (err) {
    console.error("🔥 ERRO LOGIN:", err);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});



/* ✏️ EDITAR USUÁRIOS */
app.put("/users/:id", async (req, res) => {
  try {
    const { role } = req.body;
    const { id } = req.params;

    const ref = db.collection(`users_${role}s`).doc(id);

    await ref.update({
      ...req.body,
      updatedAt: new Date(),
    });

    const updated = await ref.get();

    res.json({ id: updated.id, ...updated.data() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/* 🏫 AULAS */
app.get("/aulas", async (req, res) => {
  const snapshot = await db.collection("aulas").get();
  const aulas = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
  res.json(aulas);
});

app.post("/aulas", async (req, res) => {
  const novaAula = {
    ...req.body,
    createdAt: new Date(),
  };

  const doc = await db.collection("aulas").add(novaAula);
  res.status(201).json({ id: doc.id, ...novaAula });
});

/* 🔔 AVISOS */
app.get("/avisos", async (req, res) => {
  const snapshot = await db.collection("avisos").get();
  const avisos = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
  res.json(avisos);
});

app.post("/avisos", async (req, res) => {
  const aviso = {
    ...req.body,
    data: new Date(),
  };

  const doc = await db.collection("avisos").add(aviso);
  res.status(201).json({ id: doc.id, ...aviso });
});

app.get("/users", async (req, res) => {
  try {
    const { role } = req.query;
    if (!role) {
      return res.status(400).json({ error: "Role é obrigatório" });
    }

    const snapshot = await db
      .collection(`users_${role}s`)
      .get();

    const users = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(`🚀 Backend rodando na porta ${PORT}`);
});
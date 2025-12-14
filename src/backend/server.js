const db = require("./firebase");

/* 📝 CADASTRO */
app.post("/register", async (req, res) => {
  try {
    const { email, password, role } = req.body;

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

    const newUser = {
      ...req.body,
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
app.post("/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const collectionName = `users_${role}s`;

    const snapshot = await db
      .collection(collectionName)
      .where("email", "==", email)
      .where("password", "==", password)
      .get();

    if (snapshot.empty) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    const user = snapshot.docs[0];
    res.json({ id: user.id, ...user.data() });
  } catch (err) {
    res.status(500).json({ error: err.message });
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
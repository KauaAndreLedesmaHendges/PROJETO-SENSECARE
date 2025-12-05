const express = require("express");
const mysql = require("mysql2");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "publico"))); 

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "senseCare",
});

db.connect((err) => {
  if (err) {
    console.error("Erro ao conectar no MySQL:", err);
    process.exit(1);
  }
  console.log("Conectado ao MySQL (senseCare).");
});

// ===== ROTAS ENFERMEIRO =====

// GET /enfermeiro → retorna todos os enfermeiros
app.get("/enfermeiro", (req, res) => {
  const sql = "SELECT * FROM enfermeiro ORDER BY nome ASC";

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro ao buscar enfermeiros" });
    }
    res.json(results);
  });
});

// GET /enfermeiro/:id → retorna um enfermeiro específico
app.get("/enfermeiro/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM enfermeiro WHERE id_enfermeiro = ?";

  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro ao buscar enfermeiro" });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "Enfermeiro não encontrado" });
    }
    res.json(results[0]);
  });
});

// POST /enfermeiro → adiciona um novo enfermeiro
app.post("/enfermeiro", (req, res) => {
  const { sexo, nome, sobrenome, cpf, cargo, departamento, salario, data_contratacao, cidade, hospital } = req.body;

  if (!sexo || !nome || !sobrenome || !cpf || !cargo || !departamento || !salario || !data_contratacao || !cidade || !hospital) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios" });
  }

  const sql = "INSERT INTO enfermeiro (sexo, nome, sobrenome, cpf, cargo, departamento, salario, data_contratacao, cidade, hospital) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

  db.query(sql, [sexo, nome, sobrenome, cpf, cargo, departamento, salario, data_contratacao, cidade, hospital], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro ao inserir enfermeiro" });
    }
    res.status(201).json({
      id_enfermeiro: result.insertId,
      sexo,
      nome,
      sobrenome,
      cpf,
      cargo,
      departamento,
      salario,
      data_contratacao,
      cidade,
      hospital
    });
  });
});

// PUT /enfermeiro/:id → atualiza um enfermeiro
app.put("/enfermeiro/:id", (req, res) => {
  const { id } = req.params;
  const { sexo, nome, sobrenome, cpf, cargo, departamento, salario, data_contratacao, cidade, hospital } = req.body;

  const sqlCheck = "SELECT * FROM enfermeiro WHERE id_enfermeiro = ?";

  db.query(sqlCheck, [id], (err, results) => {
    if (err || results.length === 0) {
      return res.status(404).json({ error: "Enfermeiro não encontrado" });
    }

    const sqlUpdate = "UPDATE enfermeiro SET sexo = ?, nome = ?, sobrenome = ?, cpf = ?, cargo = ?, departamento = ?, salario = ?, data_contratacao = ?, cidade = ?, hospital = ? WHERE id_enfermeiro = ?";
    db.query(sqlUpdate, [sexo, nome, sobrenome, cpf, cargo, departamento, salario, data_contratacao, cidade, hospital, id], (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Erro ao atualizar enfermeiro" });
      }
      res.json({ message: "Enfermeiro atualizado com sucesso" });
    });
  });
});

// DELETE /enfermeiro/:id → deleta um enfermeiro
app.delete("/enfermeiro/:id", (req, res) => {
  const { id } = req.params;
  const sqlCheck = "SELECT * FROM enfermeiro WHERE id_enfermeiro = ?";

  db.query(sqlCheck, [id], (err, results) => {
    if (err || results.length === 0) {
      return res.status(404).json({ error: "Enfermeiro não encontrado" });
    }

    const sqlDelete = "DELETE FROM enfermeiro WHERE id_enfermeiro = ?";
    db.query(sqlDelete, [id], (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Erro ao deletar enfermeiro" });
      }
      res.json({ message: "Enfermeiro deletado com sucesso" });
    });
  });
});

// ===== ROTAS PACIENTES =====

// GET /pacientes → retorna todos os pacientes
app.get("/pacientes", (req, res) => {
  const sql = "SELECT * FROM pacientes ORDER BY nome ASC";

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro ao buscar pacientes" });
    }
    res.json(results);
  });
});

// GET /pacientes/:id → retorna um paciente específico
app.get("/pacientes/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM pacientes WHERE id_paciente = ?";

  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro ao buscar paciente" });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "Paciente não encontrado" });
    }
    res.json(results[0]);
  });
});

// POST /pacientes → adiciona um novo paciente
app.post("/pacientes", (req, res) => {
  const { cpf, nome, idade, sobrenome, cidade, hospital, data_entrada, ala, nrm_cama, leito } = req.body;

  if (!cpf || !nome || !idade || !sobrenome || !cidade || !hospital) {
    return res.status(400).json({ error: "cpf, nome, idade, sobrenome, cidade e hospital são obrigatórios" });
  }

  const sql = "INSERT INTO pacientes (cpf, nome, idade, sobrenome, cidade, hospital, data_entrada, ala, nrm_cama, leito) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

  db.query(sql, [cpf, nome, idade, sobrenome, cidade, hospital, data_entrada || "Não informado", ala || "Não alojado", nrm_cama || "Não informado", leito || "Não informado"], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro ao inserir paciente" });
    }
    res.status(201).json({
      id_paciente: result.insertId,
      cpf,
      nome,
      idade,
      sobrenome,
      cidade,
      hospital,
      data_entrada: data_entrada || "Não informado",
      ala: ala || "Não alojado",
      nrm_cama: nrm_cama || "Não informado",
      leito: leito || "Não informado"
    });
  });
});

// PUT /pacientes/:id → atualiza um paciente
app.put("/pacientes/:id", (req, res) => {
  const { id } = req.params;
  const { cpf, nome, idade, sobrenome, cidade, hospital, data_entrada, ala, nrm_cama, leito } = req.body;

  const sqlCheck = "SELECT * FROM pacientes WHERE id_paciente = ?";

  db.query(sqlCheck, [id], (err, results) => {
    if (err || results.length === 0) {
      return res.status(404).json({ error: "Paciente não encontrado" });
    }

    const sqlUpdate = "UPDATE pacientes SET cpf = ?, nome = ?, idade = ?, sobrenome = ?, cidade = ?, hospital = ?, data_entrada = ?, ala = ?, nrm_cama = ?, leito = ? WHERE id_paciente = ?";
    db.query(sqlUpdate, [cpf, nome, idade, sobrenome, cidade, hospital, data_entrada, ala, nrm_cama, leito, id], (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Erro ao atualizar paciente" });
      }
      res.json({ message: "Paciente atualizado com sucesso" });
    });
  });
});

// DELETE /pacientes/:id → deleta um paciente
app.delete("/pacientes/:id", (req, res) => {
  const { id } = req.params;
  const sqlCheck = "SELECT * FROM pacientes WHERE id_paciente = ?";

  db.query(sqlCheck, [id], (err, results) => {
    if (err || results.length === 0) {
      return res.status(404).json({ error: "Paciente não encontrado" });
    }

    const sqlDelete = "DELETE FROM pacientes WHERE id_paciente = ?";
    db.query(sqlDelete, [id], (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Erro ao deletar paciente" });
      }
      res.json({ message: "Paciente deletado com sucesso" });
    });
  });
});

app.listen(3000, () =>
  console.log("Servidor rodando em http://localhost:3000")
);



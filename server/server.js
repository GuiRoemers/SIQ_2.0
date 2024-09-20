const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const port = 3000;

// Configurando o middleware
app.use(cors());
app.use(bodyParser.json());

// Conectando ao banco de dados SQLite (persistente)
const db = new sqlite3.Database('./produtos.db'); // Agora o banco de dados é persistente

// Criando a tabela
db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS produtos (id INTEGER PRIMARY KEY, serial TEXT, material TEXT, descricao TEXT, ordem TEXT, data TEXT, inspetor TEXT, resultado TEXT)");
});

// Endpoint para adicionar produtos
app.post('/produtos', (req, res) => {
    const { serial, material, descricao, ordem, data, inspetor, resultado } = req.body;
    const stmt = db.prepare("INSERT INTO produtos (serial, material, descricao, ordem, data, inspetor, resultado) VALUES (?, ?, ?, ?, ?, ?, ?)");
    stmt.run(serial, material, descricao, ordem, data, inspetor, resultado);
    stmt.finalize();
    res.send({ message: 'Produto adicionado com sucesso!' });
});

// Endpoint para obter produtos
app.get('/produtos', (req, res) => {
    db.all("SELECT * FROM produtos", [], (err, rows) => {
        if (err) {
            res.status(500).send(err.message);
            return;
        }
        res.json(rows);
    });
});

// Iniciando o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});

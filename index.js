const express = require('express');
const cors = require('cors');
const translate = require('google-translate-api-x');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

// Rota que o Bot vai chamar
app.post('/api/traduzir', async (req, res) => {
    const { texto } = req.body;
    if (!texto) return res.status(400).send("Sem texto");

    const input = texto.toLowerCase().trim();
    
    // 1. Tenta carregar o repositório atualizado
    const repositorio = JSON.parse(fs.readFileSync('./traducoes.json', 'utf8'));

    // 2. Checa se você já traduziu isso manualmente no código
    if (repositorio[input]) {
        return res.json({ traducao: repositorio[input], tipo: "Manual" });
    }

    // 3. Se não tiver no código, usa o Google
    try {
        const resGoogle = await translate(texto, { to: 'pt' });
        res.json({ traducao: resGoogle.text, tipo: "Google" });
    } catch (err) {
        res.status(500).json({ erro: "Falha na API" });
    }
});

app.listen(process.env.PORT || 3000);

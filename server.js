const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Esta linha diz ao Express para carregar a página da pasta public
app.use(express.static('public'));

// Rota de teste para a Web API
app.post('/api/habbo-webhook', (req, res) => {
    console.log("Dados recebidos:", req.body);
    res.status(200).json({ status: "sucesso", mensagem: "Dados processados com sucesso!" });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

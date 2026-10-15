const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(express.static('public'));

app.post('/api/habbo-webhook', (req, res) => {
    console.log("Dados recebidos:", req.body);
    res.status(200).json({ status: "sucesso", mensagem: "Dados processados com sucesso!" });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

// Rota de verificação do Habbo (Login por missão)
app.post('/api/verificar-habbo', async (req, res) => {
    const { usuario, codigoEsperado } = req.body;

    if (!usuario || !codigoEsperado) {
        return res.status(400).json({ erro: "Usuário e código são obrigatórios." });
    }

    try {
        const resposta = await fetch(`https://www.habbo.com.br/api/public/users?name=${encodeURIComponent(usuario)}`);
        
        if (!resposta.ok) {
            return res.status(404).json({ erro: "Usuário não encontrado no Habbo." });
        }

        const dados = await resposta.json();
        const missaoAtual = dados.motto || "";

        if (missaoAtual.includes(codigoEsperado)) {
            return res.status(200).json({ 
                sucesso: true, 
                mensagem: "Identidade verificada com sucesso!",
                dadosHabbo: {
                    nome: dados.name,
                    avatar: dados.figureString,
                    missao: dados.motto
                }
            });
        } else {
            return res.status(400).json({ 
                sucesso: false, 
                erro: `Código não encontrado. Sua missão atual é: "${missaoAtual}"` 
            });
        }

    } catch (erro) {
        console.error("Erro ao consultar a API do Habbo:", erro);
        res.status(500).json({ erro: "Erro interno ao validar o utilizador." });
    }
});

app.post('/api/habbo-webhook', (req, res) => {
    console.log("Dados recebidos do Habbo:", req.body);
    res.status(200).json({ status: "sucesso", mensagem: "Dados processados com sucesso!" });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

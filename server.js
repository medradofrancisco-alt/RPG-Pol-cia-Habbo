import express from 'express';
import cors from 'cors';
import { JSONParse, JSONStringify } from 'json-with-bigint';

const app = express();

// Permite requisições de outros locais (CORS)
app.use(cors());

// Configura o servidor para receber textos JSON (necessário para o BigInt do Habbo)
app.use(express.text({ type: 'application/json' }));

// Rota principal que vai receber as informações dos Wireds do Habbo
app.post('/api/habbo-webhook', (req, res) => {
    try {
        // Converte o texto JSON mantendo os números de 64 bits sem erros
        const dados = JSONParse(req.body);
        
        console.log(" Mensagem recebida da Web API do Habbo:");
        console.log(dados);

        // Define que a resposta será em formato JSON
        res.setHeader('Content-Type', 'application/json');

        // Envia uma resposta de sucesso de volta
        res.send(JSONStringify({ 
            status: 'sucesso', 
            mensagem: 'Dados recebidos e processados com sucesso pelo servidor!',
            dadosRecebidos: dados 
        }));

    } catch (erro) {
        console.error(" Erro ao processar as informações do Habbo:", erro);
        res.status(400).send("Formato de JSON inválido");
    }
});

// Porta onde o servidor vai rodar no seu computador
const PORTA = 3000;
app.listen(PORTA, () => {
    console.log(` Servidor de testes rodando com sucesso na porta ${PORTA}!`);
});
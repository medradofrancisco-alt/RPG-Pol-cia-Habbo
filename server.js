const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Libera o site para ser carregado dentro de extensões/iframes no Habbo
app.use((req, res, next) => {
    res.setHeader("X-Frame-Options", "ALLOWALL");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.removeHeader("Content-Security-Policy");
    next();
});

app.use(express.static('public'));

// Rota para download da Extensão
app.get('/download-extensao', (req, res) => {
    const hostUrl = `${req.protocol}://${req.get('host')}`;

    const manifestContent = JSON.stringify({
        "manifest_version": 3,
        "name": "HUD RPG Polícia - Habbo",
        "version": "1.0",
        "description": "Painel de controle e HUD integrado para o Habbo RPG Polícia.",
        "permissions": ["activeTab"],
        "content_scripts": [
            {
                "matches": [
                    "https://www.habbo.com.br/*",
                    "https://www.habbo.com/*"
                ],
                "js": ["content.js"]
            }
        ]
    }, null, 2);

    const contentJsContent = `(function() {
    if (document.getElementById('rpg-hud-overlay')) return;

    const iframe = document.createElement('iframe');
    iframe.id = 'rpg-hud-overlay';
    iframe.src = '${hostUrl}';
    iframe.style.position = 'fixed';
    iframe.style.top = '0';
    iframe.style.left = '0';
    iframe.style.width = '100vw';
    iframe.style.height = '100vh';
    iframe.style.border = 'none';
    iframe.style.zIndex = '999999';
    iframe.style.pointerEvents = 'none';
    iframe.style.background = 'transparent';

    document.body.appendChild(iframe);
})();`;

    // Envia instrução e arquivos para salvar no computador
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(`
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <title>Instalação da Extensão HUD</title>
            <style>
                body { font-family: sans-serif; background: #0f172a; color: #f8fafc; padding: 30px; text-align: center; }
                .card { background: #1e293b; border: 1px solid #38bdf8; border-radius: 12px; max-width: 500px; margin: 0 auto; padding: 20px; }
                button { background: #0284c7; color: white; border: none; padding: 10px 20px; border-radius: 6px; font-weight: bold; cursor: pointer; margin: 10px 0; }
                code { background: #0f172a; padding: 2px 6px; border-radius: 4px; color: #38bdf8; }
            </style>
        </head>
        <body>
            <div class="card">
                <h2>Extensão HUD RPG Polícia</h2>
                <p>Para instalar a extensão no Chrome/Edge:</p>
                <ol style="text-align: left; line-height: 1.6; font-size: 14px;">
                    <li>Crie uma pasta no seu computador chamada <code>extensao-hud</code>.</li>
                    <li>Baixe os dois arquivos abaixo e salve-os dentro dessa pasta:</li>
                </ol>
                <button onclick="baixar('manifest.json', \`${manifestContent.replace(/`/g, '\\`')}\`)">1. Baixar manifest.json</button><br>
                <button onclick="baixar('content.js', \`${contentJsContent.replace(/`/g, '\\`')}\`)">2. Baixar content.js</button>
                <hr style="border-color: #334155; margin: 20px 0;">
                <p style="font-size: 13px; color: #cbd5e1;">Depois, abra o Chrome em <code>chrome://extensions</code>, ative o <b>Modo do desenvolvedor</b> e clique em <b>Carregar sem compactação</b> selecionando a pasta <code>extensao-hud</code>.</p>
            </div>
            <script>
                function baixar(filename, text) {
                    var element = document.createElement('a');
                    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
                    element.setAttribute('download', filename);
                    element.style.display = 'none';
                    document.body.appendChild(element);
                    element.click();
                    document.body.removeChild(element);
                }
            </script>
        </body>
        </html>
    `);
});

// API de verificação do Habbo
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

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

(function() {
    // Evita duplicar o HUD na página do Habbo
    if (document.getElementById('rpg-hud-overlay')) return;

    // Cria a janela do HUD por cima do Habbo
    const iframe = document.createElement('iframe');
    iframe.id = 'rpg-hud-overlay';
    // IMPORTANTE: Mude o link abaixo para a URL real do seu site no Render
    iframe.src = 'https://rpg-pol-cia-habbo.onrender.com'; 
    iframe.style.position = 'fixed';
    iframe.style.top = '0';
    iframe.style.left = '0';
    iframe.style.width = '100vw';
    iframe.style.height = '100vh';
    iframe.style.border = 'none';
    iframe.style.zIndex = '999999';
    iframe.style.pointerEvents = 'none';

    document.body.appendChild(iframe);
})();

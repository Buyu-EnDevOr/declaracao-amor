// 1. ANIMAÇÃO DE VELOCIDADE DA LUZ (FUNDO)
const canvas = document.getElementById('lightSpeedCanvas');
const ctx = canvas.getContext('2d');
let estrelas = [];

function redimensionarCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', redimensionarCanvas);
redimensionarCanvas();

class Estrela {
    constructor() {
        this.reset();
    }
    reset() {
        this.x = (Math.random() - 0.5) * canvas.width;
        this.y = (Math.random() - 0.5) * canvas.height;
        this.z = Math.random() * canvas.width;
    }
    update(velocidade) {
        this.z -= velocidade;
        if (this.z < 1) {
            this.reset();
            this.z = canvas.width;
        }
    }
    draw() {
        let sx = (this.x / this.z) * canvas.width + canvas.width / 2;
        let sy = (this.y / this.z) * canvas.height + canvas.height / 2;
        let r = (1 - this.z / canvas.width) * 3;

        ctx.beginPath();
        ctx.arc(sx, sy, r, 0, Math.PI * 2);
        ctx.fillStyle = "white";
        ctx.fill();
    }
}

// Cria 400 estrelas
for (let i = 0; i < 400; i++) {
    estrelas.push(new Estrela());
}

function animarLuz() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.2)"; // Cria o efeito de rastro
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    estrelas.forEach(estrela => {
        estrela.update(15); // Velocidade do voo
        estrela.draw();
    });
    requestAnimationFrame(animarLuz);
}

// 2. CONTROLE DAS TELAS E FOTO SUMINDO
window.onload = () => {
    animarLuz(); // Inicia o fundo

    // Faz a foto sumir após 3 segundos
    setTimeout(() => {
        const tela1 = document.getElementById('tela1');
        tela1.classList.add('sumindo'); // Ativa a transparência do CSS

        // Aguarda 2 segundos (tempo da transição) para trocar as divs
        setTimeout(() => {
            tela1.classList.add('oculta');
            document.getElementById('tela2').classList.remove('oculta');
        }, 2000); 
    }, 3000); 
};

// Função para os botões "Sim" avançarem as telas
function proximaTela(numero) {
    // Esconde a tela atual
    const telaAtiva = document.querySelector('.tela:not(.oculta)');
    if (telaAtiva) telaAtiva.classList.add('oculta');

    // Mostra a próxima tela
    const proxima = document.getElementById(`tela${numero}`);
    if (proxima) proxima.classList.remove('oculta');

    // Se for a tela final, ativa os corações e a rolagem automática
    if (numero === 4) {
        gerarCoracoes();
        iniciarScrollAutomatico();
    }
}

// 3. O BOTÃO "NÃO" FUJÃO
function fogeBotao(botao) {
    const larguraJanela = window.innerWidth;
    const alturaJanela = window.innerHeight;

    // Calcula uma nova posição que mantenha o botão dentro da tela
    const maxX = larguraJanela - botao.offsetWidth - 20;
    const maxY = alturaJanela - botao.offsetHeight - 20;

    const aleatorioX = Math.floor(Math.random() * maxX);
    const aleatorioY = Math.floor(Math.random() * maxY);

    botao.style.position = 'fixed';
    botao.style.left = `${aleatorioX}px`;
    botao.style.top = `${aleatorioY}px`;
}

// 4. CHUVA DE CORAÇÕES NA TELA FINAL
// Injeta a animação CSS no documento via JS
const style = document.createElement('style');
style.innerHTML = `
    @keyframes subir {
        0% { transform: translateY(0) scale(0.5); opacity: 0; }
        10% { opacity: 1; }
        100% { transform: translateY(-120vh) scale(1.5); opacity: 0; }
    }
`;
document.head.appendChild(style);

function gerarCoracoes() {
    const container = document.getElementById('heartsContainer');
    const cores = ['#ff4d6d', '#c9184a', '#a20a3a', '#ffb3c6', '#800f2f', '#9d4edd', '#c77dff']; // Tons de rosa, vermelho e roxo
    
    setInterval(() => {
        const coracao = document.createElement('div');
        coracao.innerHTML = '❤️';
        coracao.style.position = 'absolute';
        coracao.style.left = Math.random() * 100 + 'vw';
        coracao.style.top = '100vh'; // Começa de baixo
        coracao.style.fontSize = (Math.random() * 50 + 10) + 'px'; // Tamanhos variados
        
        coracao.style.color = cores[Math.floor(Math.random() * cores.length)];
        
        // Tempo de animação aleatório para não subirem todos juntos
        const duracao = Math.random() * 3 + 2; 
        coracao.style.animation = `subir ${duracao}s linear forwards`;
        
        container.appendChild(coracao);

        // Remove o coração do HTML depois que a animação acaba para não travar o navegador
        setTimeout(() => {
            coracao.remove();
        }, duracao * 1000);
    }, 150); // Gera um novo coração a cada 150ms
}

// 5. ROLAGEM AUTOMÁTICA DO TEXTO NA TELA FINAL
function iniciarScrollAutomatico() {
    const caixaTexto = document.getElementById('caixaTexto');
    if (!caixaTexto) return;

    let scrollInterval;
    
    // Pequeno atraso para a pessoa começar a ler antes de rolar
    setTimeout(() => {
        scrollInterval = setInterval(() => {
            caixaTexto.scrollTop += 1; // Velocidade da descida (1 pixel por vez)
            
            // Se chegou no final, para o intervalo
            if (caixaTexto.scrollTop + caixaTexto.clientHeight >= caixaTexto.scrollHeight) {
                clearInterval(scrollInterval);
            }
        }, 50); // A cada 50 milissegundos
    }, 3000); // Espera 3 segundos antes de começar a descer

    // Se ela rolar a tela com o dedo ou mouse, a automação para e ela lê no próprio ritmo
    caixaTexto.addEventListener('touchstart', () => clearInterval(scrollInterval));
    caixaTexto.addEventListener('wheel', () => clearInterval(scrollInterval));
}
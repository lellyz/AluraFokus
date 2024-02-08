const html                   = document.querySelector('html');
const botaoFoco              = document.querySelector('.app__card-button--foco');
const botaoDescansoCurto     = document.querySelector('.app__card-button--curto');
const botaoDescansoLongo     = document.querySelector('.app__card-button--longo');
const appImagem              = document.querySelector('.app__image');
const textoTitulo            = document.querySelector('.app__title');
const botoes                 = document.querySelectorAll('.app__card-button');
const botaoComecar           = document.querySelector('#start-pause');
const musicaFocoInput        = document.querySelector('#alternar-musica');
const iniciarOuPausarBtn     = document.querySelector('#start-pause span');
const imagemBotao            = document.querySelector('.app__card-primary-butto-icon');
const tempoNaTela            = document.querySelector('#timer');

const musica                 = new Audio('/sons/luna-rise-part-one.mp3');
const audioPlay              = new Audio('/sons/play.wav');
const audioPause             = new Audio('/sons/pause.mp3');
const audioFinal             = new Audio('/sons/beep.mp3');

let tempoDecorridoEmSegundos = 15;//1500;
let intervaloId              = null;

musica.loop                  = true;

musicaFocoInput.addEventListener('change', () => {
    if (musica.paused) {
        musica.play();
    } else {
        musica.pause();
    }
});

botaoFoco.addEventListener('click', () => {
    tempoDecorridoEmSegundos = 1500;
    alterarContexto('foco');
    botaoFoco.classList.add('active');
});

botaoDescansoCurto.addEventListener('click', () => {
    tempoDecorridoEmSegundos = 300;
    alterarContexto('descanso-curto');
    botaoDescansoCurto.classList.add('active');
});

botaoDescansoLongo.addEventListener('click', () => {
    tempoDecorridoEmSegundos = 900;
    alterarContexto('descanso-longo');    
    botaoDescansoLongo.classList.add('active');
});

function alterarContexto(contexto) {
    mostrarTempo();
    botoes.forEach(function(contexto) {
            contexto.classList.remove('active')
    });

    html.setAttribute('data-contexto', contexto);
    appImagem.setAttribute('src', `/imagens/${contexto}.png`)
    switch (contexto) {
        case 'foco':
            textoTitulo.innerHTML = `
                Otimize sua produtividade,<br>
                <strong class="app__title-strong">mergulhe no que importa.</strong>
            `; 
            break;    
        case 'descanso-curto':
            textoTitulo.innerHTML = `
                Que tal dar uma respirada?<br>
                <strong class="app__title-strong">Faça uma pausa curta!</strong>
            `;            
            break;    
            case 'descanso-longo':
                textoTitulo.innerHTML = `
                    Hora de voltar à superfície.<br>
                    <strong class="app__title-strong">Faça uma pausa longa.</strong>
                `;            
                break;                       
        default:          
            break;
    }
}

const contagemRegressiva = () => {
    if (tempoDecorridoEmSegundos <= 0){
        audioFinal.play();
        alert('Tempo finalizado!');
        const focoAtivo = html.getAttribute('data-contexto') == 'foco';
        if (focoAtivo) {
            const evento = new CustomEvent('FocoFinalizado');
            document.dispatchEvent(evento);
        }
        zerar();
        return;
    }
    tempoDecorridoEmSegundos -= 1;
    mostrarTempo();
}

botaoComecar.addEventListener('click', iniciarOuPausar);

function iniciarOuPausar() {
    if (intervaloId){
        audioPause.play();
        zerar();
        return;
    } else {
        audioPlay.play();
        intervaloId = setInterval(contagemRegressiva, 1000);
        iniciarOuPausarBtn.textContent = 'Pausar';
        imagemBotao.setAttribute('src', '/imagens/pause.png')
    }
}

function zerar() {
    clearInterval(intervaloId);
    iniciarOuPausarBtn.textContent = 'Começar';
    imagemBotao.setAttribute('src', '/imagens/play_arrow.png')
    intervaloId = null;
}

function mostrarTempo() {
    const tempo = new Date(tempoDecorridoEmSegundos * 1000);
    const tempoFormatado = tempo.toLocaleTimeString('pt-Br', {minute: '2-digit', second: '2-digit'});
    tempoNaTela.innerHTML = `${tempoFormatado}`;
}

mostrarTempo();
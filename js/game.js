class Game {
    constructor() {
        this.personagem = "";
        this.personagemImagem = "";
        this.vidaJogador = 3;
        this.vidaIA = 3;
        this.vidaMaxima = 3;
        this.turno = 1;
        this.ignorouDano = false;
        this.danoCausado = 0;
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('iniciarBtn')?.addEventListener('click', () => this.irParaEscolha());
        document.getElementById('confirmarDadoBtn')?.addEventListener('click', () => this.processarAtaqueJogador());
        document.getElementById('continuarTurnoBtn')?.addEventListener('click', () => this.finalizarTurno());
        document.getElementById('sortearRecompensaBtn')?.addEventListener('click', () => this.sortearRecompensa());
        document.getElementById('reiniciarBtn')?.addEventListener('click', () => this.reiniciarJogo());
    }

    irParaEscolha() {
        document.getElementById("inicio").classList.add("hidden");
        document.getElementById("escolha").classList.remove("hidden");
    }

    escolher(p, imagemSrc) {
        this.personagem = p;
        this.personagemImagem = imagemSrc;
        document.getElementById("escolha").classList.add("hidden");
        document.getElementById("combate").classList.remove("hidden");
        
        // Define a imagem do personagem
        const playerCharacter = document.getElementById("playerCharacter");
        playerCharacter.src = imagemSrc;
        
        // Atualiza HUD de vida do jogador
        const nomeJogador = document.getElementById("nomeJogador");
        const fotoJogador = document.getElementById("fotoJogador");
        if (nomeJogador) nomeJogador.textContent = p;
        if (fotoJogador) fotoJogador.src = imagemSrc;
        
        // Mostrar ou esconder o slot do dado extra
        const dadoHackerContainer = document.getElementById("dadoHackerContainer");
        if (dadoHackerContainer) {
            if (p === "Hacker") {
                dadoHackerContainer.style.display = "block";
            } else {
                dadoHackerContainer.style.display = "none";
            }
        }
        
        this.atualizarBarrasVida();
    }

    atualizarBarrasVida() {
        const porcentagemVidaJogador = (this.vidaJogador / this.vidaMaxima) * 100;
        const porcentagemVidaIA = (this.vidaIA / this.vidaMaxima) * 100;
        
        document.getElementById("vidaJogador").textContent = this.vidaJogador;
        document.getElementById("vidaIA").textContent = this.vidaIA;
        
        document.getElementById("vidaJogadorBarra").style.width = `${porcentagemVidaJogador}%`;
        document.getElementById("vidaIABarra").style.width = `${porcentagemVidaIA}%`;
    }

    processarAtaqueJogador() {
        let dado = parseInt(document.getElementById("dado").value);
        let bonus = 0;
        let ataqueTotal = dado;
        let limiteAcerto = 4;
        if (this.personagem === "Sniper") bonus = 2;
        if (this.personagem === "Hacker") {
            let dadoHacker = parseInt(document.getElementById("dadoHacker").value);
            ataqueTotal = dado + dadoHacker;
            limiteAcerto = 6;
        } else {
            ataqueTotal = dado + bonus;
        }
        let mensagemCentral = '';
        let tipoMensagem = '';
        if (ataqueTotal >= limiteAcerto) {
            this.vidaIA--;
            this.danoCausado++;
            mensagemCentral = `Você acertou a IA! (Dado: ${dado}${this.personagem === "Hacker" ? ` + ${document.getElementById("dadoHacker").value}` : (bonus ? ` + ${bonus}` : '')} = ${ataqueTotal})`;
            tipoMensagem = 'acerto';
            this.mostrarDanoIA();
        } else {
            mensagemCentral = `Você errou o ataque. (Dado: ${dado}${this.personagem === "Hacker" ? ` + ${document.getElementById("dadoHacker").value}` : (bonus ? ` + ${bonus}` : '')} = ${ataqueTotal})`;
            tipoMensagem = 'erro';
        }
        this.exibirMensagemCentral(mensagemCentral, tipoMensagem);
        const resultadoJogador = document.getElementById("resultadoJogador");
        if (resultadoJogador) resultadoJogador.classList.add("hidden");
        this.atualizarBarrasVida();
        // Se a vida do jogador ou da IA chegou a 0, termina com delay para animação
        if (this.vidaJogador <= 0 || this.vidaIA <= 0) {
            setTimeout(() => this.encerrarJogo(), 2000);
            return;
        }
        // Exibir animação de dados antes do ataque da IA
        setTimeout(() => {
            // Só deixa a IA atacar se ela ainda tiver vida
            if (this.vidaIA > 0) {
                this.animarDadosIA(() => this.iniciarAtaqueIA());
            }
        }, 2000);
    }

    animarDadosIA(callback) {
        const diceEl = document.getElementById('diceAnimation');
        if (!diceEl) { callback(); return; }
        diceEl.classList.remove('hidden');
        let interval;
        let count = 0;
        interval = setInterval(() => {
            diceEl.textContent = Math.ceil(Math.random() * 6);
            count++;
            if (count > 10) {
                clearInterval(interval);
                diceEl.classList.add('hidden');
                diceEl.textContent = '';
                if (callback) callback();
            }
        }, 80);
    }

    exibirMensagemCentral(mensagem, tipo, onHide) {
        const el = document.getElementById('playerAttackMessage');
        if (!el) return;
        el.textContent = mensagem;
        el.className = `player-attack-message ${tipo}`;
        el.classList.remove('hidden');
        if (this._timeoutMsg) clearTimeout(this._timeoutMsg);
        this._timeoutMsg = setTimeout(() => {
            el.classList.add('hidden');
            if (onHide) onHide();
        }, 2000);
    }

    mostrarDanoIA() {
        const iaNormal = document.getElementById('iaNormal');
        const iaDano = document.getElementById('iaDano');
        
        // Adiciona efeito de glitch na imagem normal
        iaNormal.classList.add('glitch-effect');
        
        // Mostra a imagem de dano
        iaDano.classList.add('damage-effect');
        
        // Remove os efeitos após a animação
        setTimeout(() => {
            iaNormal.classList.remove('glitch-effect');
            iaDano.classList.remove('damage-effect');
        }, 500);
    }

    iniciarAtaqueIA() {
        // Simula a rolagem do dado da IA
        const ataqueIA = Math.ceil(Math.random() * 6);
        let mensagemCentral = '';
        let tipoMensagem = '';
        let resultadoIA = '';
        const playerCharacter = document.getElementById('playerCharacter');
        const diceEl = document.getElementById('diceAnimation');

        if (ataqueIA >= 5) {
            if (this.personagem === "Assassina" && !this.ignorouDano) {
                this.ignorouDano = true;
                resultadoIA = "Você evitou o ataque! (Habilidade da Assassina)";
                mensagemCentral = resultadoIA;
                tipoMensagem = 'acerto';
            } else {
                this.vidaJogador--;
                resultadoIA = "A IA te acertou!";
                mensagemCentral = resultadoIA;
                tipoMensagem = 'erro';
                // Efeito de dano no personagem do jogador
                if (playerCharacter) {
                    playerCharacter.classList.add('damage-effect');
                    setTimeout(() => {
                        playerCharacter.classList.remove('damage-effect');
                    }, 500);
                }
            }
        } else {
            resultadoIA = "A IA errou o ataque!";
            mensagemCentral = resultadoIA;
            tipoMensagem = 'acerto';
        }

        // Esconde mensagem antiga da IA
        const resultadoIAEl = document.getElementById("resultadoIA");
        if (resultadoIAEl) resultadoIAEl.classList.add("hidden");

        // Exibe o número sorteado da IA
        if (diceEl) {
            diceEl.textContent = ataqueIA;
            diceEl.classList.remove('hidden');
        }

        // Exibe mensagem centralizada da IA após a do jogador
        setTimeout(() => {
            this.exibirMensagemCentral(mensagemCentral, tipoMensagem, () => {
                // Esconde o número sorteado da IA após a mensagem sumir
                if (diceEl) {
                    diceEl.classList.add('hidden');
                    diceEl.textContent = '';
                }
            });
            this.atualizarBarrasVida();

            // Verifica se o jogador ou a IA foram derrotados
            if (this.vidaJogador <= 0 || this.vidaIA <= 0) {
                this.encerrarJogo();
            } else {
                setTimeout(() => {
                    if (resultadoIAEl) resultadoIAEl.classList.add("hidden");
                    this.turno++;
                    document.getElementById("numeroTurno").textContent = this.turno;
                }, 2000);
            }
        }, 0);
    }

    finalizarTurno() {
        this.turno++;
        document.getElementById("numeroTurno").textContent = this.turno;
        if (this.vidaJogador <= 0 || this.vidaIA <= 0) {
            this.encerrarJogo();
        } else {
            // Prepara próximo turno
            document.getElementById("faseIA")?.classList.add("hidden");
            document.getElementById("faseJogador")?.classList.remove("hidden");
            document.getElementById("resultadoJogador")?.classList.add("hidden");
            document.getElementById("dadoIA")?.classList.add("hidden");
            document.getElementById("resultadoIA")?.classList.add("hidden");
            document.getElementById("continuarTurnoBtn")?.classList.add("hidden");
        }
    }

    encerrarJogo() {
        // Esconder qualquer mensagem central de erro/acerto
        const playerAttackMessage = document.getElementById('playerAttackMessage');
        if (playerAttackMessage) playerAttackMessage.classList.add('hidden');
        document.getElementById("combate").classList.add("hidden");
        document.getElementById("resultado").classList.remove("hidden");
        const resultadoFinal = this.vidaIA <= 0 
            ? "MISSÃO CONCLUÍDA! Você derrotou a IA."
            : "VOCÊ FOI DELETADO. A IA venceu.";
        document.getElementById("resultadoFinal").textContent = resultadoFinal;
        document.getElementById("turnosJogados").textContent = this.turno;
        document.getElementById("danoCausado").textContent = this.danoCausado;
        // Atualiza as barras de vida uma última vez
        this.atualizarBarrasVida();
    }

    sortearRecompensa() {
        const itens = ["Print A5", "Print A4", "Botton", "Chaveiro"];
        const item = this.vidaIA <= 0 
            ? itens[Math.floor(Math.random() * itens.length)] 
            : "Você pode escolher um adesivo.";
        
        const recompensaElement = document.getElementById("recompensa");
        recompensaElement.textContent = `Sua recompensa: ${item}`;
        recompensaElement.classList.remove("hidden");
    }

    reiniciarJogo() {
        // Resetar todas as variáveis
        this.personagem = "";
        this.personagemImagem = "";
        this.vidaJogador = 3;
        this.vidaIA = 3;
        this.turno = 1;
        this.ignorouDano = false;
        this.danoCausado = 0;
        // Resetar interface
        document.getElementById("numeroTurno").textContent = "1";
        document.getElementById("vidaJogador").textContent = "3";
        document.getElementById("vidaIA").textContent = "3";
        document.getElementById("vidaJogadorBarra").style.width = "100%";
        document.getElementById("vidaIABarra").style.width = "100%";
        // Limpar HUD do jogador
        const nomeJogador = document.getElementById("nomeJogador");
        const fotoJogador = document.getElementById("fotoJogador");
        if (nomeJogador) nomeJogador.textContent = "Jogador";
        if (fotoJogador) fotoJogador.src = "Imgs/Player/Hacker.png";
        // Limpar resultados anteriores
        document.getElementById("recompensa").classList.add("hidden");
        document.getElementById("resultadoJogador")?.classList.add("hidden");
        document.getElementById("resultadoIA")?.classList.add("hidden");
        // Esconder todas as seções exceto a inicial
        document.getElementById("resultado").classList.add("hidden");
        document.getElementById("combate").classList.add("hidden");
        document.getElementById("escolha").classList.add("hidden");
        document.getElementById("inicio").classList.remove("hidden");
        // Limpar imagem do personagem
        document.getElementById("playerCharacter").src = "";
        // Esconder slot do dado extra
        const dadoHackerContainer = document.getElementById("dadoHackerContainer");
        if (dadoHackerContainer) dadoHackerContainer.style.display = "none";
    }
}

// Inicializar o jogo quando a página carregar
window.addEventListener('DOMContentLoaded', () => {
    window.gameInstance = new Game();
}); 
import k from "../Engine";
import createPlayer from "../game/objects/Player";
import createUI from "../game/objects/UI";
import createEnemy from "../game/objects/Enemy";
import createVolumeControl from "../game/objects/VolumeControl";

// cena principal do jogo
k.scene("playscene", () => {
    // cria o player
    const player = createPlayer();

    // cria a UI (barra de vida + estamina)
    const ui = createUI(player);

    // cria o inimigo e guarda em uma variável (pra poder acessar depois)
    let enemy = createEnemy(player, player);

    // cria o controle de volume  
    const volumeControl = createVolumeControl();

    // RESTAURAR ESTADO SE VOLTOU DA PAUSA 
    // verifica se tem dados salvos (significa que voltou da pausa)
    if (window.gameState && window.gameState.fromPause) {
        // restaura a saude do player
        player.health = window.gameState.playerHealth;
        
        // restaura a stamina do player
        player.stamina = window.gameState.playerStamina;
        
        // restaura a posicao do player (volta pro lugar onde estava)
        player.pos = window.gameState.playerPos;
        
        // restaura a posicao do inimigo (volta pro lugar onde estava)
        enemy.pos = window.gameState.enemyPos;
        
        // restaura o volume do jogo (volta pro volume que tava)
        k.setVolume(window.gameState.volume);
        
        // limpa a flag (marca que nao precisa restaurar mais)
        delete window.gameState.fromPause;
    }

    // Esc pra pausar
    // quando o usuario aperta ESC, pausa o jogo
    k.onKeyDown("escape", () => {
        // SALVA O ESTADO ANTES DE PAUSAR
        // isso permite que quando volta, tudo continua igual
        window.gameState = {
            fromPause: true, // marca que voltou da pausa (pra restaurar depois)
            playerHealth: player.health, // salva a vida do player
            playerStamina: player.stamina, // salva a stamina do player
            playerPos: player.pos, // salva a posicao do player
            enemyPos: enemy.pos, // salva a posicao do inimigo
            volume: k.getVolume(), // salva o volume do jogo
        };
        
        // vai pra cena de pausa
        k.go("pausescene");
    });
});
import { CARDS_ARRAY } from "./CardData";


export default function createCardSystem(player, gun) {

    let chosenCards = {};


    let availableCards = [...CARDS_ARRAY];

    return {

        drawThreeCards() {
            const drawn = [];
            const tempAvailable = [...availableCards];

            // Loopa 3 vezes pra sortear 3 cartas
            for (let i = 0; i < 3; i++) {

                // Se acabou as cartas disponíveis, reseta o pool
                // Agora pode pegar a mesma carta em draws diferentes
                if (tempAvailable.length === 0) {
                    tempAvailable.push(...CARDS_ARRAY);
                }

                // Escolhe um índice aleatório do array
                const randomIndex = Math.floor(Math.random() * tempAvailable.length);

                // Coloca a carta sorteada na lista de "draw"
                drawn.push(tempAvailable[randomIndex]);

                // Remove essa carta do pool temporário
                // (pra não sortear de novo nesse draw)
                tempAvailable.splice(randomIndex, 1);
            }

            return drawn;
        },


        applyCardUpgrade(card) {

            // Incrementa quantas vezes pegou essa carta
            chosenCards[card.id] = (chosenCards[card.id] || 0) + 1;


            switch (card.tipo) {

                //  STAMINA 

                case "stamina_recover":
                    // Aumenta a velocidade de recuperação de stamina
                    // staminaRecover multiplica por 1.25, 1.5, 1.75, etc
                    player.staminaRecover *= card.valor;
                    break;

                case "stamina_efficiency":
                    // Reduz o custo de stamina ao correr
                    // staminaPenalty multiplica por 0.8 (gasta menos)
                    player.staminaPenalty *= card.valor;
                    break;


                //  MOVIMENTO 

                case "movement_speed":
                    // Aumenta a velocidade base de movimento
                    player.speed *= card.valor;
                    break;

                case "run_multiplier":
                    // Aumenta o multiplicador quando corre (shift)
                    player.speedMulti *= card.valor;
                    break;


                //  VIDA 

                case "max_hp":
                    // Aumenta vida máxima E cura o player
                    const hpGain = card.valor;
                    player.maxHp += hpGain;
                    player.hp = Math.min(
                        player.hp + hpGain,  // Soma o ganho
                        player.maxHp         // Mas não passa do máximo
                    );
                    break;

                case "damage_reduction":
                    // Reduz dano recebido de forma aditiva
                    // Armazena em uma propriedade nova do player
                    if (!player.damageReduction) {
                        player.damageReduction = 0;
                    }
                    player.damageReduction += card.valor;
                    break;

                case "health_regen":
                    // Adiciona regeneração passiva de HP
                    // Armazena em uma propriedade nova do player
                    if (!player.healthRegenPerSecond) {
                        player.healthRegenPerSecond = 0;
                    }
                    player.healthRegenPerSecond += card.valor;
                    break;


                // TIRO 

                case "fire_rate":
                    // Aumenta cadência de tiro (reduz cooldown)
                    // Se gun.cooldown existe, multiplica por este valor
                    if (gun && gun.cooldown !== undefined) {
                        gun.cooldown *= card.valor;
                    }
                    break;

                case "spray_spread":
                    // Aumenta o alcance/área do spray
                    // Armazena em uma propriedade nova do gun
                    if (gun) {
                        if (!gun.spreadMultiplier) {
                            gun.spreadMultiplier = 1;
                        }
                        gun.spreadMultiplier *= card.valor;
                    }
                    break;


                // COLETA 

                case "collection_range":
                    // Aumenta o alcance de coleta de adubo/moeda
                    // Armazena em uma propriedade nova do player
                    if (!player.collectionRange) {
                        player.collectionRange = 1;
                    }
                    player.collectionRange *= card.valor;
                    break;

                case "manure_multiplier":
                    // Inimigos soltam mais adubo/moeda
                    // Armazena em uma propriedade nova do player
                    if (!player.manureDropMultiplier) {
                        player.manureDropMultiplier = 1;
                    }
                    player.manureDropMultiplier *= card.valor;
                    break;


                // CRÍTICO 

                case "critical_boost":
                    // Aumenta dano de ataque crítico
                    // Armazena em uma propriedade nova
                    if (gun) {
                        if (!gun.criticalDamageBonus) {
                            gun.criticalDamageBonus = 0;
                        }
                        gun.criticalDamageBonus += card.valor;
                    }
                    break;


                // Se nenhum case bater, exibe erro
                default:
                    console.warn(" Tipo de carta desconhecido:", card.tipo);
            }

            // Log pra debug 
            console.log(` Upgrade aplicado: ${card.nome} (${card.tipo})`);
            console.log(" Player stats agora:", {
                speed: player.speed,
                speedMulti: player.speedMulti,
                staminaRecover: player.staminaRecover,
                staminaPenalty: player.staminaPenalty,
                hp: player.hp,
                maxHp: player.maxHp,
                damageReduction: player.damageReduction || 0,
                healthRegenPerSecond: player.healthRegenPerSecond || 0,
                collectionRange: player.collectionRange || 1,
                manureDropMultiplier: player.manureDropMultiplier || 1,
            });
        },

        /**
         getCardUpgradeLevel(cardId)
         Retorna quantas vezes o player pegou uma carta específica
         */
        getCardUpgradeLevel(cardId) {
            return chosenCards[cardId] || 0;
        },

        /**
         getChosenCards()
         Retorna todas as cartas escolhidas até agora
         */
        getChosenCards() {
            return chosenCards;
        },

        /**
         reset()
         Limpa as cartas e reseta o sistema
         */
        reset() {
            chosenCards = {};
            availableCards = [...CARDS_ARRAY];
        },
    };
}
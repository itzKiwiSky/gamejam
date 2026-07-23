import { CARDS_ARRAY } from "./CardData.js";

export default function createCardSystem(player, gun) {
    let chosenCards = {};
    let availableCards = [...CARDS_ARRAY];

    return {
        drawThreeCards() {
            const drawn = [];
            const tempAvailable = [...availableCards];

            for (let i = 0; i < 3; i++) {
                if (tempAvailable.length === 0) {
                    tempAvailable.push(...CARDS_ARRAY);
                }
                const randomIndex = Math.floor(Math.random() * tempAvailable.length);
                drawn.push(tempAvailable[randomIndex]);
                tempAvailable.splice(randomIndex, 1);
            }

            return drawn;
        },

        applyCardUpgrade(card) {
            chosenCards[card.id] = (chosenCards[card.id] || 0) + 1;

            switch (card.tipo) {
                case "stamina_recover":
                    player.staminaRecover *= card.valor;
                    break;

                case "stamina_efficiency":
                    player.staminaPenalty *= card.valor;
                    break;

                case "movement_speed":
                    player.speed *= card.valor;
                    break;

                case "run_multiplier":
                    player.speedMulti *= card.valor;
                    break;

                case "max_hp":
                    const hpGain = card.valor;
                    player.maxHp += hpGain;
                    player.hp = Math.min(player.hp + hpGain, player.maxHp);
                    break;

                case "damage_reduction":
                    if (!player.damageReduction) {
                        player.damageReduction = 0;
                    }
                    player.damageReduction += card.valor;
                    break;

                case "health_regen":
                    if (!player.healthRegenPerSecond) {
                        player.healthRegenPerSecond = 0;
                    }
                    player.healthRegenPerSecond += card.valor;
                    break;

                case "fire_rate":
                    if (gun && gun.cooldown !== undefined) {
                        gun.cooldown *= card.valor;
                    }
                    break;

                case "spray_spread":
                    if (gun) {
                        if (!gun.spreadMultiplier) {
                            gun.spreadMultiplier = 1;
                        }
                        gun.spreadMultiplier *= card.valor;
                    }
                    break;

                case "collection_range":
                    if (!player.collectionRange) {
                        player.collectionRange = 1;
                    }
                    player.collectionRange *= card.valor;
                    break;

                case "manure_multiplier":
                    if (!player.manureDropMultiplier) {
                        player.manureDropMultiplier = 1;
                    }
                    player.manureDropMultiplier *= card.valor;
                    break;

                case "critical_boost":
                    if (gun) {
                        if (!gun.criticalDamageBonus) {
                            gun.criticalDamageBonus = 0;
                        }
                        gun.criticalDamageBonus += card.valor;
                    }
                    break;

                default:
                    console.warn("Tipo de carta desconhecido:", card.tipo);
            }

            console.log(`Upgrade aplicado: ${card.nome} (${card.tipo})`);
        },

        getCardUpgradeLevel(cardId) {
            return chosenCards[cardId] || 0;
        },

        getChosenCards() {
            return chosenCards;
        },

        reset() {
            chosenCards = {};
            availableCards = [...CARDS_ARRAY];
        },
    };
}
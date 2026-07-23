/**
  Sistema com as 12 cartas de upgrade que o player pode pegar durante o jogo. 
  Cada carta tem propriedades que dizem o que ela faz e os efeitos que ela tem.
  */

///Objeto com as 12 cartas
export const CARDS = {
    //  Carta 1: Recuperação Rápida
    // Aumenta a velocidade de recuperação de stamina
    STAMINA_RECOVER: {
        id: "stamina_recover",
        nome: "Recuperação Rápida",
        descricao: "Estamina regenera 25% mais rápido",
        tipo: "stamina_recover",
        valor: 1.25,                    // 1.25x = 25% mais rápido
        icon: "",
    },

    // Carta 2: Passo rápido
    // Você se move mais rápido pelo mapa
    MOVEMENT_SPEED: {
        id: "movement_speed",
        nome: "Passos Rápidos",
        descricao: "Velocidade de movimento +20%",
        tipo: "movement_speed",
        valor: 1.2,                     // 1.2x = 20% mais rápido
        icon: "",
    },

    // Carta 3: Corrida Turbo
    // Aumenta o multiplicador de velocidade ao correr
    RUN_MULTIPLIER: {
        id: "run_multiplier",
        nome: "Corrida Turbo",
        descricao: "Velocidade ao correr +15%",
        tipo: "run_multiplier",
        valor: 1.15,                    // 1.15x = 15% mais rápido correndo
        icon: "",
    },

    // Carta 4: Mais Fôlego
    // Você gasta menos stamina ao correr
    STAMINA_EFFICIENCY: {
        id: "stamina_efficiency",
        nome: "Fôlego Longo",
        descricao: "Gasta 20% menos stamina ao correr",
        tipo: "stamina_efficiency",
        valor: 0.8,                     // 0.8x = gasta 20% menos
        icon: "",
    },

    // Carta 5: Resistência de lavrador
    // Aumenta sua vida máxima
    MAX_HP: {
        id: "max_hp",
        nome: "Resistência de Lavrador",
        descricao: "Aumenta vida máxima em +10",
        tipo: "max_hp",
        valor: 10,                      // +10 de HP máximo
        icon: "",
    },

    // Carta 6: Escudo Natural
    // Reduz dano recebido (subtrai um valor fixo do dano)
    DAMAGE_REDUCTION: {
        id: "damage_reduction",
        nome: "Escudo Natural",
        descricao: "Reduz dano recebido em -1",
        tipo: "damage_reduction",
        valor: 1,                       // -1 de dano por ataque
        icon: "",
    },

    // Carta 7: Saúde Regenerativa
    // Regenera HP lentamente (será aplicado no onUpdate)
    HEALTH_REGEN: {
        id: "health_regen",
        nome: "Saúde Regenerativa",
        descricao: "Regenera 5 HP por segundo",
        tipo: "health_regen",
        valor: 5,                       // +5 HP por segundo
        icon: "",
    },

    // Carta 8: Tiro Concentrado
    // Aumenta a cadência de tiro (afeta o cooldown do gun)
    FIRE_RATE: {
        id: "fire_rate",
        nome: "Gatilho Rápido",
        descricao: "Atira 20% mais rápido",
        tipo: "fire_rate",
        valor: 0.8,                     // 0.8x = 20% mais rápido (cooldown reduz)
        icon: "",
    },

    // Carta 9: Spray Devastador
    // Aumenta a área de efeito do spray
    SPRAY_SPREAD: {
        id: "spray_spread",
        nome: "Spray Devastador",
        descricao: "Aumenta o alcance do spray em +30%",
        tipo: "spray_spread",
        valor: 1.3,                     // 1.3x = 30% mais espalhado
        icon: "",
    },

    // Carta 10: Coleta Rápida
    // Você coleta o adubo (moeda) com maior alcance
    COLLECTION_RANGE: {
        id: "collection_range",
        nome: "Mãos Rápidas",
        descricao: "Coleta adubo com maior alcance",
        tipo: "collection_range",
        valor: 1.5,                     // 1.5x = 50% mais alcance
        icon: "",
    },

    // Carta 11: Bônus de Colheita
    // Inimigos soltam mais adubo quando morrem
    MANURE_MULTIPLIER: {
        id: "manure_multiplier",
        nome: "Bônus de Colheita",
        descricao: "Inimigos soltam +50% mais adubo",
        tipo: "manure_multiplier",
        valor: 1.5,                     // 1.5x = 50% a mais
        icon: "",
    },

    // Carta 12: Golpe Crítico
    // Chance de atirar mais forte (é um multiplicador de dano ativado aleatoriamente)
    CRITICAL_BOOST: {
        id: "critical_boost",
        nome: "Golpe Crítico",
        descricao: "+2 de dano a cada 10 ataques",
        tipo: "critical_boost",
        valor: 2,                       // +2 de dano crítico
        icon: "",
    },
};


//Conversão pra Array
// Object.values() pega todos os valores do objeto cards e coloca em um array. 
// Isso facilita escolher 3 cartas aleatórias
export const CARDS_ARRAY = Object.values(CARDS);
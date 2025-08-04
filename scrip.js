// --- Funções de Diálogo e Interação ---

// O resto do código (saveCharacter, loadCharacter, addMessage, getRandomResponse)
// permanece o mesmo. Apenas a função principal muda.

function processUserMessage() {
    const userMessage = userInput.value.trim().toLowerCase();

    if (userMessage === '') return;

    addMessage(userInput.value, 'user');
    userInput.value = '';

    let response = getRandomResponse('apology');
    let hasResponded = false;

    // --- Lógica de Humor e Respostas ---
    if (userMessage.includes('gentil') || userMessage.includes('legal') || userMessage.includes('obrigado')) {
        character.mood += 1; // Aumenta o humor por gentileza
        response = "Você é muito gentil. Fico feliz em poder ajudar.";
        hasResponded = true;
    } else if (userMessage.includes('tecnologia') || userMessage.includes('computador') || userMessage.includes('robô')) {
        // Diminui o humor e gera uma resposta de suspeita
        character.mood -= 2;
        response = getRandomResponse('technology');
        hasResponded = true;
    }

    // Respostas que variam com o humor
    if (userMessage.includes('como você está') && !hasResponded) {
        if (character.mood > 5) {
            response = getRandomResponse('positiveMood');
        } else if (character.mood < -5) {
            response = getRandomResponse('negativeMood');
        } else {
            response = getRandomResponse('howAreYou');
        }
        hasResponded = true;
    }

    // --- Lógica de Memória e Aprendizado ---
    // A lógica de aprendizado continua a mesma, pois é uma habilidade geral.
    if (character.memory.learningTopic && userMessage.includes('é')) {
        const explanation = userMessage.split('é')[1].trim();
        character.memory[character.memory.learningTopic] = explanation;
        response = `Obrigado por me ensinar sobre **${character.memory.learningTopic}**! Eu salvei essa informação.`;
        delete character.memory.learningTopic;
        hasResponded = true;
    }

    if (userMessage.includes('o que é') && !hasResponded) {
        const queryTerm = userMessage.split('o que é')[1].trim();
        if (character.memory[queryTerm]) {
            response = `Eu aprendi que **${queryTerm}** é ${character.memory[queryTerm]}.`;
            hasResponded = true;
        } else {
            character.memory.learningTopic = queryTerm;
            response = `Não sei o que é **${queryTerm}**. Você pode me ensinar?`;
            hasResponded = true;
        }
    }

    // Respostas padrão, caso não haja uma específica para a entrada
    if (!hasResponded) {
        if (userMessage.includes('olá') || userMessage.includes('oi')) {
            response = getRandomResponse('hello');
        } else if (userMessage.includes('natureza') || userMessage.includes('animais') || userMessage.includes('selvagem')) {
            response = "A natureza é o meu lar. É um lugar de beleza e paz que merece ser protegido.";
        } else if (userMessage.includes('o que você gosta')) {
            response = getRandomResponse('hobbies');
        } else if (userMessage.includes('meu nome é')) {
            const name = userMessage.split('é')[1].trim();
            character.memory.userName = name;
            response = `Prazer em te conhecer, **${name}**! Vou me lembrar de você.`;
        } else if (userMessage.includes('qual é o meu nome') && character.memory.userName) {
            response = `Seu nome é **${character.memory.userName}**, certo?`;
        }
    }

    // Exibe a resposta e salva a memória após a interação
    setTimeout(() => {
        addMessage(response, 'character');
        saveCharacter();
    }, 500);
}

// Inicia o carregamento da memória quando a página é carregada
window.addEventListener('load', loadCharacter);


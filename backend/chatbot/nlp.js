const { NlpManager } = require('node-nlp');
const fs = require('fs');
const path = require('path');

// Instanciar un nuevo manager de NLP para el idioma Español
// forceNER fuerza a la red a no perder entidades aunque las respuestas sean fijas
const manager = new NlpManager({ languages: ['es'], forceNER: true });

async function trainChatbot() {
    const modelPath = path.join(__dirname, 'model.nlp');
    const corpusPath = path.join(__dirname, 'corpus-es.json');

    // Intentar cargar modelo existente para no reentrenar innecesariamente si no hay cambios
    // Aunque usualmente se reentrena en desarrollo, si ya existe y cargamos, es más rápido en prod
    if (fs.existsSync(modelPath)) {
        console.log('Cargando modelo NLP existente...');
        manager.load(modelPath);
    } else {
        console.log('No existe modelo NLP local. Iniciando entrenamiento desde el Corpus...');

        // Agregar intenciones y respuestas desde el archivo corpus-es.json
        try {
            const corpus = JSON.parse(fs.readFileSync(corpusPath, 'utf8'));

            for (const item of corpus.data) {
                const { intent, utterances, answers } = item;

                // Añadir frases de entrenamiento
                utterances.forEach(utterance => {
                    manager.addDocument('es', utterance, intent);
                });

                // Añadir respuestas posibles
                answers.forEach(answer => {
                    manager.addAnswer('es', intent, answer);
                });
            }

            console.log('Entrenando red neuronal local...');
            await manager.train();
            manager.save(modelPath);
            console.log('Modelo NLP Entrenado y guardado exitosamente.');
        } catch (error) {
            console.error('Error durante el entrenamiento del chatbot:', error);
        }
    }
}

async function processMessage(message) {
    try {
        const response = await manager.process('es', message);
        return response;
    } catch (error) {
        console.error('Error procesando mensaje:', error);
        return { answer: 'Ocurrió un error en mi procesamiento neuronal.' };
    }
}

module.exports = {
    trainChatbot,
    processMessage
};

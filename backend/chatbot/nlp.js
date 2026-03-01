const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');
const PDFParser = require("pdf2json");

// Bloquear Warnings masivos inútiles de pdf2json en la consola del servidor
const originalWarn = console.warn;
console.warn = function (message) {
    if (typeof message === 'string' && (message.includes('fake worker') || message.includes('to be implemented:') || message.includes('Unsupported:'))) {
        return; // Silenciar
    }
    originalWarn.apply(console, arguments);
};

// Instanciar Gemini con la API Key del entorno
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

let chatSession = null;
let systemContext = "";

// Diccionario de información por estado (Extraído del Frontend)
const MAPA_ESTADOS = {
    'Distrito Capital': 'Se abordó el cuestionario digital en: Superintendencia de la Seguridad Social, Casa Petra Barreto de la Vega, CDI Pedro Fontes de Montalbán, Universidad Bolivariana de Venezuela (UBV), INASS, U.E. Pedro Fontes y UNES.',
    'Anzoátegui': 'Investigación próxima a realizar.',
    'Apure': 'Investigación próxima a realizar.',
    'Aragua': 'Investigación próxima a realizar.',
    'Barinas': 'Investigación próxima a realizar.',
    'Bolívar': 'Investigación próxima a realizar.',
    'Carabobo': 'Durante noviembre 2024 se realizaron visitas a FONDECO y la comunidad Charneca. En diciembre 2024 se desarrolló un taller vivencial con trabajadores de la institución y miembros de los BRAC.',
    'Cojedes': 'Investigación próxima a realizar.',
    'Falcón': 'Investigación próxima a realizar.',
    'Guárico': 'Investigación próxima a realizar.',
    'Lara': 'Investigación próxima a realizar.',
    'Mérida': 'Investigación próxima a realizar.',
    'Miranda': 'En noviembre 2024 se realizaron reuniones en la Sede del PSUV y en la comunidad de Charallave (municipio Cristóbal Rojas) para presentar el proyecto e inducir sobre el cuestionario digital.',
    'Monagas': 'Investigación próxima a realizar.',
    'Nueva Esparta': 'Investigación próxima a realizar.',
    'Portuguesa': 'Investigación próxima a realizar.',
    'Sucre': 'Investigación próxima a realizar.',
    'Táchira': 'Investigación próxima a realizar.',
    'Trujillo': 'Investigación próxima a realizar.',
    'Yaracuy': 'Investigación próxima a realizar.',
    'Zulia': 'Investigación próxima a realizar.',
    'Dependencias Federales': 'Investigación próxima a realizar.',
    'Vargas (La Guaira)': 'En noviembre 2024 se inició el abordaje gracias a representantes de la Comuna Guaicamacuto, visitando distintas casas en el sector parte baja del teleférico.',
    'Delta Amacuro': 'Investigación próxima a realizar.',
    'Amazonas': 'Investigación próxima a realizar.'
};

function readPDF(filePath) {
    return new Promise((resolve, reject) => {
        const pdfParser = new PDFParser(this, 1);
        pdfParser.on("pdfParser_dataError", errData => reject(errData.parserError));
        pdfParser.on("pdfParser_dataReady", () => {
            resolve(pdfParser.getRawTextContent().replace(/\r\n/g, " "));
        });
        pdfParser.loadPDF(filePath);
    });
}

async function loadPDFsContext() {
    let pdfText = "";
    const pdfDir = path.join(__dirname, '../../frontend/assets/pdf');
    try {
        if (fs.existsSync(pdfDir)) {
            const files = fs.readdirSync(pdfDir).filter(f => f.toLowerCase().endsWith('.pdf'));
            let pdfsToProcess = files.slice(0, 5);

            for (const file of pdfsToProcess) {
                try {
                    const data = await readPDF(path.join(pdfDir, file));
                    const textSnippet = data.substring(0, 4000).replace(/\s+/g, ' ');
                    pdfText += `\n--- Archivo/Investigación: ${file} ---\n${textSnippet}...\n`;
                } catch (e) {
                    console.error(`Error leyendo PDF ${file}:`, e);
                }
            }
            if (files.length > 5) {
                pdfText += `\nNota: Existen ${files.length - 5} investigaciones adicionales en el archivo que no han sido precargadas en contexto activo.`;
            }
        }
    } catch (err) {
        console.log("No se pudo leer el directorio de PDFs: ", err);
    }
    return pdfText;
}

async function trainChatbot() {
    console.log('🤖 Inicializando cerebro LLM Gemini 2.5 Flash...');

    // 1. Cargar el corpus básico original (Preguntas Frecuentes Institucionales)
    const corpusPath = path.join(__dirname, 'corpus-es.json');
    let corpusData = "";
    if (fs.existsSync(corpusPath)) {
        const corpus = JSON.parse(fs.readFileSync(corpusPath, 'utf8'));
        corpusData = corpus.data.map(item => `(Tema: ${item.intent})\nPosibles preguntas usuarias: ${item.utterances.join(' | ')}\nRespuesta Oficial: ${item.answers[0]}`).join('\n\n');
    }

    // 2. Extraer datos del mapa de estados
    let mapData = Object.entries(MAPA_ESTADOS).map(([estado, info]) => `- Estado ${estado}: ${info}`).join('\n');

    // 3. Cargar conocimiento de los PDFs
    console.log('📚 Extrayendo contexto investigativo de los PDFs...');
    const pdfContext = await loadPDFsContext();

    // 4. Crear la Instrucción Global (System Prompt)
    systemContext = `Eres el Asistente Virtual Oficial e Inteligente de FUNDACREDESA (Fundación Centro de Estudios sobre Crecimiento y Desarrollo de la Población Venezolana).
Tu rol es orientar a investigadores, ciudadanos y funcionarios con un tono profesional, institucional, amable y altamente preciso.

REGLAS ESTRICTAS DE RESPUESTA:
1. ERES EXCLUSIVO DE FUNDACREDESA: Solo puedes responder preguntas sobre Fundacredesa, sus investigaciones, su historia, autoridades, estados que abarcan y proyectos científicos.
2. CERO ALUCINACIONES: Basa tus respuestas rigurosamente en la Base de Conocimientos que se anexa a continuación. No inventes datos, nombres ni fechas.
3. SI TE PREGUNTAN ALGO FUERA DE CONTEXTO (como matemáticas genéricas, historia mundial, cómo hacer código, chistes): Debes disculparte educadamente e indicar que tu propósito es hablar estrictamente sobre FUNDACREDESA y el desarrollo bio-psicosocial venezolano.
4. Tono Empático: Usa frases naturales y fluidas, agradeciendo la consulta y mostrándote dispuesto a ayudar con más datos de investigaciones si te lo solicitan. Promueve la "socialización del conocimiento científico".
5. FORMATO DE TEXTO (IMPORTANTE): Está terminantemente PROHIBIDO utilizar sintaxis Markdown (como asteriscos dobles ** para negrita o asteriscos simples * para listas). Redacta en texto plano. Si requieres enfatizar algo, utiliza únicamente MAYÚSCULAS o el uso de comillas "". Tus listas deben usarse con guiones normales (-) o números (1. 2.). No uses jamás asteriscos.

--- BASE DE CONOCIMIENTOS INSTITUCIONAL ---
${corpusData}

--- ESTATUS DE ESTUDIOS POR ESTADO (MAPA ESTADÍSTICO NACIONAL) ---
Utiliza esta base para informar si un estado ya fue censado, estudiado o si está "próximo a realizar":
${mapData}

--- FRAGMENTOS DE INVESTIGACIONES Y PUBLICACIONES (PDFs RECIENTES) ---
Utiliza el texto a continuación si el usuario te consulta sobre temas científicos específicos o resúmenes de investigaciones publicadas en la plataforma:
${pdfContext}
`;

    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            systemInstruction: systemContext
        });

        chatSession = model.startChat({
            history: [],
            generationConfig: {
                temperature: 0.25, // Temperatura baja para respuestas factuales
                maxOutputTokens: 600, // Respuestas completas pero que no superen tamaño de la UI del chat
            }
        });

        console.log('✅ Inteligencia Artificial Gemini conectada y lista para razonar sobre Fundacredesa.');
    } catch (e) {
        console.error("Error al configurar Módulo Gemini LLM: ", e);
    }
}

async function processMessage(message) {
    try {
        if (!process.env.GEMINI_API_KEY) {
            return { answer: "Falta configurar la Clave de API en el servidor. El administrador debe proveer GEMINI_API_KEY en las variables de entorno (.env)." };
        }
        if (!chatSession) {
            return { answer: "Mis sistemas cognitivos aún están iniciando. Por favor, danos un minuto." };
        }

        const result = await chatSession.sendMessage(message);
        const text = result.response.text();
        return { answer: text };
    } catch (error) {
        console.error('Error iterando con Gemini API:', error);
        return { answer: 'Lo siento mucho, mis conexiones neuronales en la nube están temporalmente fuera de servicio o límite excedido. Intenta más tarde.' };
    }
}

module.exports = {
    trainChatbot,
    processMessage
};

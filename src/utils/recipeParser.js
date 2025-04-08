// Helper function to extract ingredients from text
const extractIngredients = (text) => {
    const ingredients = [];
    const lines = text.split('\n');
    
    for (const line of lines) {
        // Look for lines that might be ingredients (containing numbers and units)
        const match = line.match(/(\d+(?:[.,]\d+)?)\s*(g|kg|ml|l|cup|cups|tbsp|tsp|oz|lb|piece|pieces|unit|units)\s+(.+)/i);
        if (match) {
            ingredients.push({
                cantidad: parseFloat(match[1]),
                unidad: match[2].toLowerCase(),
                ingrediente: match[3].trim()
            });
        }
    }
    
    return ingredients;
};

// Helper function to extract title from text
const extractTitle = (text) => {
    const lines = text.split('\n');
    // Assume the first non-empty line is the title
    return lines.find(line => line.trim().length > 0) || '';
};

// Helper function to extract servings from text
const extractServings = (text) => {
    const match = text.match(/(?:serves|servings|portions|raciones|porciones|para)\s*(\d+)/i);
    return match ? parseInt(match[1]) : 4; // Default to 4 servings if not found
};

// Helper function to extract instructions from text
const extractInstructions = (text) => {
    const lines = text.split('\n');
    let instructions = '';
    let foundInstructions = false;
    
    for (const line of lines) {
        // Look for common section headers that indicate instructions
        if (line.match(/(?:instructions|preparation|method|directions|steps|preparación|instrucciones|pasos)/i)) {
            foundInstructions = true;
            continue;
        }
        
        if (foundInstructions && line.trim()) {
            instructions += line.trim() + '\n';
        }
    }
    
    return instructions.trim();
};

// Main function to parse recipe text
export const parseRecipeText = (text) => {
    const title = extractTitle(text);
    const servings = extractServings(text);
    const ingredients = extractIngredients(text);
    const instructions = extractInstructions(text);
    
    return {
        titulo: title,
        racion: servings,
        tipoPlatillo: 'Plato Fuerte', // Default value, should be updated by user
        ingredientes: ingredients,
        descripcion: instructions,
        fuente: 'Texto importado',
        tags: ''
    };
};

// Function to process image using Tesseract.js
export const processImage = async (imageFile) => {
    try {
        const Tesseract = (await import('tesseract.js')).default;
        const worker = await Tesseract.createWorker();
        
        await worker.loadLanguage('spa+eng');
        await worker.initialize('spa+eng');
        
        const { data: { text } } = await worker.recognize(imageFile);
        
        await worker.terminate();
        
        return parseRecipeText(text);
    } catch (error) {
        console.error('Error processing image:', error);
        throw new Error('Failed to process image');
    }
}; 
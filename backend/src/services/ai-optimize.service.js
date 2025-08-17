import logger from '../utils/logger.js';
import fetch from 'node-fetch';

// Get DeepSeek configuration
const getDeepSeekConfig = () => ({
  apiKey: process.env.DEEPSEEK_API_KEY,
  apiUrl: process.env.DEEPSEEK_API_URL || 'https://api.deepseek.com/v1/chat/completions'
});

// Language names mapping
const languageNames = {
  de: 'German',
  en: 'English', 
  fr: 'French',
  it: 'Italian',
  es: 'Spanish'
};

// Call DeepSeek API for text optimization
const callDeepSeekAPI = async (text, type, language = 'de', context = '') => {
  try {
    const langName = languageNames[language] || language;
    
    // Build different prompts based on the optimization type
    let systemPrompt = '';
    let userPrompt = '';
    
    if (type === 'extend') {
      systemPrompt = `You are a professional content writer specializing in architecture and construction. 
Your task is to extend and enhance the given text in ${langName}.

Requirements:
1. Keep the same language (${langName}) - do not translate
2. Maintain the professional architectural tone
3. Add relevant details and context
4. Expand the text to be 2-3 times longer
5. Ensure perfect grammar and spelling
6. Keep technical terms accurate
7. Make the text more engaging and descriptive
8. IMPORTANT: Return ONLY the extended text itself - no titles, labels, explanations, or commentary
9. Do NOT include phrases like "Erweiterte Version:" or any meta-information
10. Do NOT add explanations about what was changed or improved
${context ? `\nContext: ${context}` : ''}`;

      userPrompt = `Extend the following ${langName} text about architecture/construction. Return ONLY the extended text without any additional commentary:

"${text}"`;
    } else if (type === 'optimize') {
      systemPrompt = `You are a professional content editor specializing in architecture and construction. 
Your task is to optimize the given text in ${langName}.

Requirements:
1. Keep the same language (${langName}) - do not translate
2. Improve clarity and readability
3. Fix any grammar or spelling errors
4. Maintain professional architectural terminology
5. Keep the text length similar (can be slightly longer or shorter)
6. Make the text more engaging without changing the meaning
7. IMPORTANT: Return ONLY the optimized text itself - no explanations or commentary
8. Do NOT include phrases like "Optimierte Version:" or "Optimierungen:"
9. Do NOT list what was changed or provide recommendations
${context ? `\nContext: ${context}` : ''}`;

      userPrompt = `Optimize the following ${langName} text about architecture/construction. Return ONLY the optimized text without any additional commentary:

"${text}"`;
    } else if (type === 'shorten') {
      systemPrompt = `You are a professional content editor specializing in architecture and construction. 
Your task is to shorten and condense the given text in ${langName}.

Requirements:
1. Keep the same language (${langName}) - do not translate
2. Maintain all key information
3. Remove redundancy and unnecessary words
4. Keep professional architectural terminology
5. Make the text 30-50% shorter
6. Ensure perfect grammar and spelling
7. IMPORTANT: Return ONLY the shortened text itself - no explanations
8. Do NOT include any meta-information or commentary about changes
${context ? `\nContext: ${context}` : ''}`;

      userPrompt = `Shorten the following ${langName} text about architecture/construction. Return ONLY the shortened text without any additional commentary:

"${text}"`;
    }

    const { apiKey, apiUrl } = getDeepSeekConfig();
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: userPrompt
          }
        ],
        temperature: 0.7, // Moderate temperature for creativity
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      logger.error('DeepSeek API error:', errorText);
      throw new Error(`DeepSeek API returned ${response.status}`);
    }

    const data = await response.json();
    
    if (data.choices && data.choices[0] && data.choices[0].message) {
      const optimizedText = data.choices[0].message.content.trim();
      // Remove any quotes that might have been added
      return optimizedText.replace(/^["']|["']$/g, '');
    }
    
    throw new Error('Invalid response from DeepSeek API');
    
  } catch (error) {
    logger.error('DeepSeek API call failed:', error);
    throw error;
  }
};

// Mock optimization function (fallback)
const mockOptimize = async (text, type, language) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Simple mock optimizations for fallback
  if (type === 'extend') {
    return `${text} [Extended with additional architectural details and professional context. This would normally be a longer, more detailed version of the text with enhanced descriptions and relevant information about the project.]`;
  } else if (type === 'optimize') {
    return `${text} [Optimized for clarity and engagement]`;
  } else if (type === 'shorten') {
    // Return first half of the text as a mock shortening
    const words = text.split(' ');
    const shortenedWords = words.slice(0, Math.ceil(words.length * 0.6));
    return shortenedWords.join(' ') + '...';
  }
  
  return text;
};

// Main optimization function
const optimizeText = async (text, type = 'optimize', language = 'de', context = '') => {
  try {
    // Validate input
    if (!text || text.trim().length === 0) {
      throw new Error('Text cannot be empty');
    }
    
    if (!['extend', 'optimize', 'shorten'].includes(type)) {
      throw new Error('Invalid optimization type. Must be: extend, optimize, or shorten');
    }
    
    let optimizedText;
    
    // Check if we have DeepSeek API key configured
    const { apiKey } = getDeepSeekConfig();
    if (apiKey && apiKey !== 'your-api-key-here') {
      logger.info(`Optimizing text with DeepSeek API (${type}): "${text.substring(0, 50)}..." in ${language}`);
      try {
        optimizedText = await callDeepSeekAPI(text, type, language, context);
        logger.info(`DeepSeek optimization successful`);
      } catch (apiError) {
        logger.error('DeepSeek API failed, falling back to mock:', apiError);
        optimizedText = await mockOptimize(text, type, language);
      }
    } else {
      // Use mock optimization for development
      logger.debug(`Using mock optimization for: ${text.substring(0, 50)}...`);
      optimizedText = await mockOptimize(text, type, language);
    }
    
    return optimizedText;
    
  } catch (error) {
    logger.error('Text optimization error:', error);
    throw error;
  }
};

// Optimize multiple fields in an object
const optimizeProjectContent = async (projectData, language = 'de') => {
  try {
    const optimized = { ...projectData };
    
    // Optimize title - keep it concise
    if (projectData.title) {
      optimized.title = await optimizeText(
        projectData.title,
        'optimize',
        language,
        'Project title - should be clear and professional'
      );
    }
    
    // Extend description - make it more detailed
    if (projectData.description) {
      optimized.description = await optimizeText(
        projectData.description,
        'extend',
        language,
        'Project description - detailed overview of the architectural project'
      );
    }
    
    // Extend details if present
    if (projectData.details) {
      optimized.details = await optimizeText(
        projectData.details,
        'extend',
        language,
        'Project details - comprehensive technical and design information'
      );
    }
    
    return optimized;
    
  } catch (error) {
    logger.error('Project content optimization error:', error);
    throw error;
  }
};

export default {
  optimizeText,
  optimizeProjectContent
};
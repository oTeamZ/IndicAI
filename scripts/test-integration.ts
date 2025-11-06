/**
 * Script de teste para verificar a integração da API de recomendações
 */

import { getPersonalizedRecommendations } from './lib/recommendations';

async function testApiIntegration() {
  console.log('🚀 Iniciando teste de integração da API...');
  
  try {
    // Testar com preferências de exemplo
    const userPreferences = ["Ação", "Ficção Científica", "Drama"];
    
    console.log('📝 Buscando recomendações para preferências:', userPreferences);
    
    const recommendations = await getPersonalizedRecommendations(userPreferences);
    
    console.log(`✅ Recebidas ${recommendations.length} recomendações`);
    
    if (recommendations.length > 0) {
      console.log('📄 Primeira recomendação:', {
        title: recommendations[0].title,
        type: recommendations[0].type,
        rating: recommendations[0].rating,
        genres: recommendations[0].genres
      });
    }
    
    console.log('✅ Teste de integração concluído com sucesso!');
    return true;
    
  } catch (error) {
    console.error('❌ Erro no teste de integração:', error);
    return false;
  }
}

// Para executar no Node.js
if (typeof require !== 'undefined' && require.main === module) {
  testApiIntegration();
}

export { testApiIntegration };
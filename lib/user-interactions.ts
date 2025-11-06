/**
 * Atualiza o perfil do usuário com base em uma interação
 */
export async function updateUserProfileWithInteraction(
  currentPreferences: string[],
  interaction: { 
    itemId: string; 
    action: "like" | "dislike" | "superlike" | "skip" 
  }
): Promise<string[]> {
  // Importar os dados para obter informações sobre o item interagido
  const { getMediaDetails } = await import("@/lib/recommendations");
  const item = await getMediaDetails(interaction.itemId);
  
  if (!item) {
    // Se não puder obter detalhes do item, apenas retornar as preferências atuais
    return currentPreferences;
  }

  let newPreferences = [...currentPreferences];
  
  // Atualiza as preferências baseado na ação
  if (interaction.action === "like" || interaction.action === "superlike") {
    // Adiciona os gêneros do item curtido às preferências
    for (const genre of item.genres) {
      if (!newPreferences.includes(genre)) {
        newPreferences.push(genre);
      }
    }
  } else if (interaction.action === "dislike") {
    // Poderia implementar lógica para remover gêneros descurtidos ou reduzir seu peso
    // Por enquanto, não fazemos nada
  }
  
  // Remove duplicatas e limita o tamanho
  newPreferences = [...new Set(newPreferences)];
  return newPreferences.slice(0, 10); // Limitar a 10 preferências
}

/**
 * Processa uma interação e atualiza as preferências do usuário
 */
export async function processUserInteraction(
  itemId: string,
  action: "like" | "dislike" | "superlike" | "skip",
  currentPreferences: string[],
  onUpdatePreferences: (newPreferences: string[]) => void
) {
  const updatedPreferences = await updateUserProfileWithInteraction(
    currentPreferences, 
    { itemId, action }
  );
  
  // Atualiza as preferências no estado do componente
  onUpdatePreferences(updatedPreferences);
  
  // Aqui poderíamos também enviar para um backend para persistência
  console.log(`Interação processada: ${action} para item ${itemId}`);
  console.log(`Novas preferências:`, updatedPreferences);
}
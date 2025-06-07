
async function config(item) {
    try {
      const response = await fetch("../../config/config.json");
      if (!response.ok) throw new Error("Erro ao carregar JSON");
      const data = await response.json();
      if(!item) return data
      if (!data[item]) return null;
      return data[item];
    } catch (error) {
      console.error("Erro ao importar config.json:", error);
      return null;
    }
  }
// Exporta a função para uso externo
export default config;

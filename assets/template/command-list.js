import { postLoad } from "../../src/js/post.js";

// Função principal para gerar e inserir os cards na página
async function generatePage() {
    try {
        const data = await postLoad(true); // Espera os dados
        const commands = data.commands;

        if (!commands || commands.length === 0) {
            return notexist("Conteúdo não encontrado!!");
        }

        // Seleciona o contêiner onde os cards serão inseridos
        const container = document.querySelector(".command__list .results__list");
        
        if (!container) return;
        // Gera os cards dinamicamente
        const cards = commands.map((post) => {
            const imageUrl = post.code
                ? post.img[0] || "https://i.pinimg.com/736x/39/dc/ee/39dcee8b6ba09ea7004cd901326eb823.jpg"
                : "https://placehold.co/600x400";

            return `
                <div class="card">
                    <h4 class="card__title">${post.title}</h4>
                    ${post.code?`<code class="card__code">${post.code[0]}</code>`:""}
                    <div class="view-card__image">
                        <img loading="lazy" src="${imageUrl}" alt="${post.title}" class="card__image">
                    </div>
                    <div class="card__details">
                        <p class="card__description">${post.description}</p>
                        <a class="btn btn__bg btn__copy" href="./page/post.html?article=${encodeURIComponent(post.title?.toLowerCase())}">
                            Copiar
                        </a>
                    </div>
                </div>
            `;
        }).join("");
        if(!cards) return false;
        // Insere os cards no contêiner
        if(container.innerHTML = cards) return true;
    } catch (err) {
        console.error("Erro ao gerar a página:", err);
        return false;
    }
}

// Exporta a função para uso externo
export default generatePage;

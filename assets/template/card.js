// Função principal para gerar e inserir os cards na página
async function generatePage(post, type) {
    try {
        
        if(type === "list"){
        const imageUrl = post.code
              ?post.img[0] || "https://i.pinimg.com/736x/39/dc/ee/39dcee8b6ba09ea7004cd901326eb823.jpg"
              :post.img[0] ||"https://placehold.co/600x400";
              return `
            <div class="card">
                ${post.code ? `<code class="card__code">${post.code[0]}</code>` : ""}
                <div class="view-card__image">
                    <img loading="lazy" src="${imageUrl}" alt="${post.title}" class="card__image">
                </div>
                <div class="card__details">
                <div>
                    <h4 class="card__title">${post.title}</h4>
                    <p class="card__description">${post.description}</p>
                </div>
                    <a class="btn btn__bg btn__copy" href="../../page/post.html?article=${encodeURIComponent(post.title?.toLowerCase())}" target="self">
                        ${post.type === "command"?'Copiar':'Baixar Mapa'}
                    </a>
                </div>
            </div>
        `;
        
    }else if(type === 'search'){
        const imageUrl = post.code
              ? post.img[0] || "https://i.pinimg.com/736x/39/dc/ee/39dcee8b6ba09ea7004cd901326eb823.jpg"
              : post.img[0] || "https://placehold.co/600x400";
              
        return `
              <a href="../../page/post.html?article=${encodeURIComponent(post.title?.toLowerCase() || post.code[0]?.toLowerCase())}"
                 class="result__item" data-categoria="${post.type}">
                <div style="width: var(--size); height: auto; overflow: hidden; position: relative;">
                  <img loading="lazy" src="${imageUrl}" alt="${post.title || post.code[0]}" class="result__img">
                </div>
                <div class="result__info">
                  <h3 class="result__title">${post.title || post.code[0]}</h3>
                  <p class="result__description">${post.description}</p>
                </div>
              </a>`;
    }
    } catch (error) {
        console.error("An error occurred while generating the page:", error);
        return ""; // Retorna uma string vazia em caso de erro
    }
}

// Exporta a função para uso externo
export default generatePage;

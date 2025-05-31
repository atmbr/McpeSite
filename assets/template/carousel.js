// Função principal para gerar e inserir os cards na página
async function generatePage(post, type, index) {
    try {
        if(type === "carousel"){
        return `
          <div class="carousel__item ${index === 0 ? 'active' : ''}" data-id="${post.id}" >
            <img src="${post.img || 'https://placehold.co/600x400'}" alt="${post.title || ''}" class="carousel__img">
            <div class="carousel__info">
              <h3 class="carousel__title">${post.title || 'teste'}</h3>
              <p class="carousel__desc">${post.description || ''}</p>
              <div class="btn__container w-100 ">
                ${post.btn?.map((button, btnIndex) => {
                  return `
                    <a title="${button.text}" href="${button.link || '#'}" class="btn carousel__btn ${btnIndex === 0 ? 'btn__bg ' : 'btn__txt'}" ${button.external ? 'target="_blank"' : ''}>
                      ${button.text || 'Botão'}
                    </a>
                  `;
                }).join('')}
              </div>
            </div>
          </div>
        `;
        
    }else if(type === 'preview'){
        return `
            <a class="carousel__list__item ${index === 0 ? 'active' : ''}" 
              data-id="${post.id}" 
              data-config='${JSON.stringify([ post.title, post.img, post.description, post.btn, post.id ]).replace(/'/g, "&apos;")}'>
              <img src="${post.img || 'https://placehold.co/600x400'}" alt="${post.title || ''}" class="carousel__list__img">
            </a>
        `
    }
    } catch (error) {
        console.error("An error occurred while generating the page:", error);
        return ""; // Retorna uma string vazia em caso de erro
    }
}

// Exporta a função para uso externo
export default generatePage;


export function postLoad(){
    return new Promise((resolve, reject) => {
    
    
        // reject('Erro: Promise rejeitada.');
    fetch('../assets/data/post.json')
      .then(res => {
        if (!res.ok) throw new Error(`Erro HTTP: ${res.status}`);
        return res.json();
      })
      .then(data => {
        const limit = 4;
    
        // Função para criar o card do mapa ou comando
        const createCard = ({ title, image, video, description, downloadLink, code }, isMap = true) => `
          <div class="card">
            ${isMap ? `<h4 class="card__title">${title}</h4>` : `<h4 class="card__title">${title}</h4><code class="card__code">${code}</code>`}
            ${video ? `
              <div class="view-card__video">
                <iframe class="card__video" src="https://www.youtube.com/embed/${video}" title="${title || code}"></iframe>
              </div>` :
            image ? `
              <div class="view-card__image">
                <img src="${image}" alt="${title || code}" class="card__image">
              </div>` : ""}
            <div class="card__details">
              <p class="card__description">${description || "Sem descrição"}</p>
              ${isMap
                ? `<a class="btn btn__bg btn__download" href="${downloadLink || '#'}" target="_blank">${downloadLink ? "Baixar Mapa" : "Download Indisponível"}</a>`
                : `<a class="btn btn__bg btn__copy" onclick="copiarComando(this)">Copiar</a>`}
            </div>
          </div>`;
    
        // Função para criar o item do carrossel (com as imagens e informações)
        const createCarousel = ({ title, image, desc, btn, id }, index = 0) => `
          <div class="carousel__item  ${index === 0 ? 'active' : ''}" data-id="${id}" >
            <img src="${image || 'https://placehold.co/600x400'}" alt="${title || ''}" class="carousel__img">
            <div class="carousel__info">
              <h3 class="carousel__title">${title || ''}</h3>
              <p class="carousel__desc">${desc || ''}</p>
              
              <div class="btn__container w-100 ">
                ${btn.map((button, btnIndex) => {
                  return `
                    <a href="${button.link || '#'}" class="carousel__btn ${btnIndex === 0 ? 'btn__bg' : ''}" ${button.external ? 'target="_blank"' : ''}>
                      ${button.text || 'Botão'}
                    </a>
                  `;
                }).join('')}
              </div>
            </div>
          </div>
        `;
    
        // Função para criar o preview (botões de navegação)
        const createCarouselPreview = ({ title, image, desc, btn, id }, index = 0) => `
         
            <a class="carousel__list__item ${index === 0 ? 'active' : ''}" 
              data-id="${id}" 
              data-config='${JSON.stringify({ title, image, desc, btn, id }).replace(/'/g, "&apos;")}'>
              <img src="${image || 'https://placehold.co/600x400'}" alt="${title || ''}" class="carousel__list__img">
            </a>
        `;
    
        // Função para injetar os cartões
        const injectCards = (containerSelector, items, isMap = true) => {
          const container = document.querySelector(containerSelector);
          if (!container || !Array.isArray(items)) return;
    
          items.slice(0, limit > 0 ? limit : items.length).forEach(item => {
            const cardHTML = createCard({
              title: item.title,
              image: item.img,
              video: item.link?.[0]?.video?.split("v=")[1],  // extrai apenas o ID do YouTube
              description: item.description,
              downloadLink: item.link?.[0]?.download,
              code: item.code
            }, isMap);
            container.insertAdjacentHTML('beforeend', cardHTML);
          });
        };
    
        // Seleciona o contêiner do carrossel
        const carouselContainer = document.querySelector('.carousel__list');
        const carouselItems = document.querySelector('.carousel__items');
        if (carouselContainer) {
          // Limpa a .carousel__container antes de adicionar novos itens
          carouselContainer.innerHTML = '';
    
          // Adiciona os itens do carrossel primeiro
          data.carousel.forEach((carouselItem, index) => {
            const carouselHTML = createCarousel({
              title: carouselItem.title,
              image: carouselItem.img,
              desc: carouselItem.description,
              btn: carouselItem.btn.map(button => ({
                text: button.text,
                link: button.link,
                external: button.external
              })),
              id: carouselItem.id
            }, index);
            
            carouselItems.insertAdjacentHTML('beforeend', carouselHTML);
          });
    
          // Adiciona os previews de navegação depois
          data.carousel.forEach((carouselItem, index) => {
            const carouselHTMLPreview = createCarouselPreview({
              title: carouselItem.title,
              image: carouselItem.img,
              desc: carouselItem.description,
              btn: carouselItem.btn.map(button => ({
                text: button.text,
                link: button.link,
                external: button.external
              })),
              id: carouselItem.id
            }, index);
            carouselContainer.insertAdjacentHTML('beforeend', carouselHTMLPreview);
            
          });
        }
        
        // Injetar cartões de mapa e comando
        injectCards('.card__container-map', data.maps, true);
        injectCards('.card__container-command', data.commands, false);
    
        if(document.querySelector('.carousel__list__item') && document.querySelector('.carousel__item')) {
          resolve(["Postagens carregadas com sucesso!", data]);
        }
        // console.log('JSON carregado:', data);
      })
      .catch(err => {
        console.error(`Erro ao carregar o JSON: ${err}`)
      });
    
    
    
    });
    } 
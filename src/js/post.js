import cardCreate from "../../assets/template/card.js";
import carousel from "../../assets/template/carousel.js"
export function postLoad(onlyPost){
    return new Promise((resolve, reject) => {
    
        // reject('Erro: Promise rejeitada.');
    fetch('../../src/data/post.json')
      .then(res => {
        if (!res.ok) throw new Error(`Erro HTTP: ${res.status}`);
        return res.json();
      })
      .then(data => {
        if(onlyPost)  return resolve(data);
        function calcularLimit() {
          const largura = window.innerWidth;
          if (largura <= 979) return 4;
          
          const rootStyles = getComputedStyle(document.documentElement);

          // Exemplo: pegar uma variável específica
          const minhaVariavel = rootStyles.getPropertyValue('--margin-safe');
          const cardLargura = 315, gap = 20, padding = Number(minhaVariavel.split('px')[0]);
          const areaUtil = largura - padding;

          return Math.max(1, Math.floor(areaUtil / (cardLargura + gap))) * 2 ;
        }
        
        let limit = calcularLimit();
          const createCard = async ({ post, mode }, isMap = true) => await cardCreate(post, mode);

    
        // Função para criar o item do carrossel (com as imagens e informações)
        const createCarousel = async ({ post}, index = 0) => await carousel(post, "carousel", index)
    
        // Função para criar o preview (botões de navegação)
        const createCarouselPreview = async ( { post }, index = 0) => await carousel(post,  "preview", index);
    
        // Função para injetar os cartões
        const injectCards = (containerSelector, items, isMap = true) => {
          
          const container = document.querySelector(containerSelector);
          if (!container || !Array.isArray(items)) return;
    
          items.slice(0, limit > 0 ? limit : items.length).forEach(async item => {
            const cardHTML = await createCard({
              post: item,
              mode: 'list',
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
          data.carousel.forEach(async (carouselItem, index) => {
            const carouselHTML = await createCarousel({
              post: carouselItem,
            }, index);  
            carouselItems.insertAdjacentHTML('beforeend', carouselHTML);
          });
    
          // Adiciona os previews de navegação depois
          data.carousel.forEach(async (carouselItem, index) => {
            const carouselHTMLPreview = await createCarouselPreview({
              post: carouselItem
            }, index);
            carouselContainer.insertAdjacentHTML('beforeend', carouselHTMLPreview);
            
          });
        }
        
        // Injetar cartões de mapa e comando
        injectCards('.card__container-map', data.maps, true);
        injectCards('.card__container-command', data.commands, false);
    resolve(["Postagens carregadas com sucesso!", data]);
        if(document.querySelector('.carousel__list__item') && document.querySelector('.carousel__item')) {
          
          
        }
        // console.log('JSON carregado:', data);
      })
      .catch(err => {
        console.error(`Erro ao carregar o JSON: ${err}`)
      });
    
    
    
    });
    } 
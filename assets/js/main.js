const navIcon = document.querySelector('.nav__btn');
const navCloseBtn = document.querySelector('.close__btn');
const nav = document.querySelector('.navigation');
const navContainer = document.querySelector('.nav__container');
const searchIcon = document.querySelector('.search__icon');
const searchInput = document.querySelector('.search__input');
const searchContainer = document.querySelector('.search__container');

// Abrir menu
navIcon?.addEventListener('click', () => {
  nav?.classList.toggle('active');
  navContainer?.classList.toggle('active');
  document.body.classList.toggle('scrollactive');
});

// Fechar menu
navCloseBtn?.addEventListener('click', () => {
  if (nav?.classList.contains('active')) {
    nav.classList.remove('active');
    if(navContainer?.classList.contains('active')){
      navContainer.classList.remove('active');
    }
    if(searchContainer?.classList.contains('active')){
      searchContainer.classList.remove('active');
    }

    document.body.classList.remove('scrollactive');
  }
});

// Ícone de busca
searchIcon?.addEventListener('click', () => {
  document.body.classList.toggle('scrollactive');

  if (searchContainer?.classList.contains('active')) {
    nav?.classList.toggle('active');
    navContainer?.classList.remove('active');
    document.body.classList.remove('scrollactive');
  } else {
    nav?.classList.toggle('active');
    searchContainer?.classList.toggle('active');
    searchInput.focus();

  }
});


import { postLoad } from '../../assets/js/post.js';
postLoad().then((data) => { 
// Navegação e busca
console.log(data[0]);
const posts = data[1];
if(data){
// Carrossel
const carouselList = document.querySelectorAll('.carousel__list .carousel__list__item');
const carouselItems = document.querySelectorAll('.carousel__item');

// Função para criar botões
function createButton({ text, link, external }) {
  if (!text && !link && external == null) return false;

  const btn = document.createElement('a');
  btn.textContent = text || 'Button';
  btn.href = link || '#';
  btn.className = !external ? 'btn btn__bg' : 'btn btn__txt';
  if (external) btn.target = '_blank';
  return btn;
}

// Função para atualizar um item do carrossel
function updateCarouselItem(item, config) {
  const title = item.querySelector('.carousel__title');
  const description = item.querySelector('.carousel__description');
  const img = item.querySelector('.carousel__img');
  const btnContainer = item.querySelector('.btn__container');

  if (title) title.textContent = config.title || '';
  if (description) description.textContent = config.description || '';
  if (img && config.img) img.src = config.img;
  
  if (btnContainer) {
    btnContainer.innerHTML = ''; // limpa os botões antigos
    if (Array.isArray(config.btn)) {
      config.btn.forEach(button => {
        const newButton = createButton(button);
        if (newButton) btnContainer.appendChild(newButton);
      });
    }
  }
}

// Inicializar lista e adicionar eventos
carouselList.forEach(listItem => {
  if (listItem.dataset.config && listItem.dataset.id) {
    try {
      const idItem = listItem.dataset.id;
      const config = JSON.parse(listItem.dataset.config);

      // Atualizar a imagem da lista de navegação
      const listImg = listItem.querySelector('.carousel__list__img');
      if (listImg && config.img) {
        listImg.src = config.img;
      }

      // Atualizar o conteúdo do item correspondente
      carouselItems.forEach(contentItem => {
        if (contentItem.dataset.id === idItem) {
          updateCarouselItem(contentItem, config);
        }
      });

      // Evento de clique para ativar o item
      listItem.addEventListener('click', () => {
        // Atualiza 'active' na lista
        carouselList.forEach(item => item.classList.remove('active'));
        listItem.classList.add('active');

        // Atualiza 'active' nos conteúdos
        carouselItems.forEach(contentItem => {
          if (contentItem.dataset.id === idItem) {
            contentItem.classList.add('active');
          } else {
            contentItem.classList.remove('active');
          }
        });
      });

    } catch (error) {
      console.error('Erro ao carregar data-config:', error);
    }
  }
});
window.clearInput = function (input, btn) {
  if (input?.value.length > 0) {
    input.value = ''; 
    btn?.remove(); 
  }
};

// Pesquisar itens pela letra
searchInput.addEventListener('input', (event) => {
  setTimeout(() => {}, 1000);
  const searchTerm = event.target.value.toLowerCase();
  const searchInpContainer = document.querySelector('.search__inp');
  
  // Se digitou algo, adiciona botão de limpar (se ainda não existir)
  if (searchTerm && !searchInpContainer.querySelector('.btn__clear')) {
    const clearBtn = document.createElement('button');
    clearBtn.type = 'button';
    clearBtn.className = 'btn__clear';
    clearBtn.onclick = () => clearInput(document.querySelector('.search__input'), clearBtn);
    searchInpContainer.appendChild(clearBtn);
  }

  // Se apagou tudo, remove botão de limpar
  if (!searchTerm) {
    const clearBtn = searchInpContainer.querySelector('.btn__clear');
    if (clearBtn) clearBtn.remove();
  }

  // Filtrar Carousel
  const filteredCarousel = posts.carousel.filter(post => 
    post.title?.toLowerCase().includes(searchTerm) || 
    post.description?.toLowerCase().includes(searchTerm)
  );

  // Filtrar Commands
  const filteredCommands = posts.commands.filter(post => 
    post.code?.toLowerCase().includes(searchTerm) ||
    post.description?.toLowerCase().includes(searchTerm)
  );

  // Filtrar Maps
  const filteredMaps = posts.maps.filter(post => 
    post.title?.toLowerCase().includes(searchTerm) ||
    post.description?.toLowerCase().includes(searchTerm)
  );

  // Juntar todos os resultados
  const allFilteredPosts = [
    ...filteredCarousel.map(item => ({ ...item, type: 'carousel' })),
    ...filteredCommands.map(item => ({ ...item, type: 'command' })),
    ...filteredMaps.map(item => ({ ...item, type: 'map' }))
  ];

  // Montar HTML dos resultados
  let postagem = '';
  allFilteredPosts.forEach(post => {
    const imageUrl = post.code 
      ? "https://i.pinimg.com/736x/39/dc/ee/39dcee8b6ba09ea7004cd901326eb823.jpg" 
      : (post.img || post.image || 'https://placehold.co/600x400'); // Fallback se img/image não existir

    postagem += `
      <a href="/post?n=${post.title.toLowerCase()}}" class="result__item" data-categoria="${post.type}">
        <div style="width: var(--size); height: auto; overflow: hidden; position: relative;">
          <img src="${imageUrl}" alt="${post.title || post.code}" class="result__img">
        </div>
        <div class="result__info">
          <h3 class="result__title">${post.title || post.code}</h3>
          <p class="result__description">${post.description}</p>
        </div>
      </a>
    `;
  });

  // Atualizar o container de resultados
  document.querySelector('.search__result').innerHTML = postagem;

  console.log('Resultados filtrados:', allFilteredPosts);
});


}
}).catch((error) => console.error('Erro ao carregar o script:', error));
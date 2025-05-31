const navIcon = document.querySelector('.nav__btn');
const navCloseBtn = document.querySelector('.close__btn');
const nav = document.querySelector('.navigation');
const navContainerMobile = document.querySelector('.nav__container.nav--mobile');
const searchIcon = document.querySelector('.search__icon');
const searchContainerMobile = document.querySelector('.search__container.search--mobile');
const searchContainerDesktop = document.querySelector('.search__container.search--desktop');
const searchInput = document.querySelector('.search__input');

// Abrir menu mobile
navIcon?.addEventListener('click', () => {
  if (window.innerWidth <= 1024) {
    nav?.classList.toggle('active')
    navContainerMobile?.classList.toggle('active');
    document.body.classList.toggle('scrollactive');
  }
});

// Fechar menu mobile
navCloseBtn?.addEventListener('click', () => {
  console.log(1, window.innerWidth <= 1024)
  nav?.classList.toggle('active')

  if (navContainerMobile?.classList.contains('active')) {
    if(nav?.classList.contains('active'))nav?.classList.toggle('active')
      navContainerMobile.classList.remove('active');

  }
  if (searchContainerMobile?.classList.contains('active')) {
    searchContainerMobile.classList.remove('active');
    nav?.classList.remove('active')
  }
  document.body.classList.remove('scrollactive');
});

// Ícone de busca
searchIcon?.addEventListener('click', () => {
  document.body.classList.toggle('scrollactive');

  if (window.innerWidth <= 1024) {
    // Mobile
  nav?.classList.toggle('active')

    searchContainerMobile?.classList.toggle('active');
    searchContainerMobile.querySelector('.search__input').focus()
    navContainerMobile?.classList.remove('active');
  } else {
    // Desktop
    searchContainerDesktop?.classList.toggle('active');
    searchContainerDesktop.querySelector('.search__input').focus()
  }

  searchInput.focus();
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

// Inicializar lista e adicionar eventos
carouselList.forEach(listItem => {
    try {
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
  
});
window.clearInput = function (input, btn) {
  if (input?.value.length > 0) {
    input.value = ''; 
    btn?.remove(); 
  }
};

const searchInputs = document.querySelectorAll('.search__input'); // Todos os campos de busca (mobile + desktop)

searchInputs.forEach(input => {
  input.addEventListener('input', (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const isMobile = event.target.closest('.search--mobile') !== null;

    // Escolher o container certo
    const searchInpContainer = isMobile 
      ? document.querySelector('.search--mobile .search__inp') 
      : document.querySelector('.search--desktop .search__inp');

    const searchResultContainer = isMobile 
      ? document.querySelector('.search--mobile .search__result')
      : document.querySelector('.search--desktop .search__result');

    // Criar botão de limpar se necessário
    if (searchTerm && !searchInpContainer.querySelector('.btn__clear')) {
      const clearBtn = document.createElement('button');
      clearBtn.type = 'button';
      clearBtn.className = 'btn__clear';
      clearBtn.onclick = () => clearInput(input, clearBtn, searchResultContainer);
      searchInpContainer.appendChild(clearBtn);
    }

    // Se apagou tudo, remove botão de limpar
    if (!searchTerm) {
      const clearBtn = searchInpContainer.querySelector('.btn__clear');
      if (clearBtn) clearBtn.remove();
    }

    // Filtrar posts 
    const filteredCarousel = posts.carousel.filter(post => 
      post.title?.toLowerCase().includes(searchTerm) || 
      post.description?.toLowerCase().includes(searchTerm)
    );
    const filteredCommands = posts.commands.filter(post => 
      post.code?.toLowerCase().includes(searchTerm) ||
      post.description?.toLowerCase().includes(searchTerm)
    );
    const filteredMaps = posts.maps.filter(post => 
      post.title?.toLowerCase().includes(searchTerm) ||
      post.description?.toLowerCase().includes(searchTerm)
    );

    // Juntar todos resultados
    const allFilteredPosts = [
      ...filteredCarousel.map(item => ({ ...item, type: 'carousel' })),
      ...filteredCommands.map(item => ({ ...item, type: 'command' })),
      ...filteredMaps.map(item => ({ ...item, type: 'map' }))
    ];

    // Montar HTML
    let postagem = '';
    allFilteredPosts.forEach(post => {
      const imageUrl = post.code 
        ? "https://i.pinimg.com/736x/39/dc/ee/39dcee8b6ba09ea7004cd901326eb823.jpg" 
        : (post.img || post.image || 'https://placehold.co/600x400');

      postagem += `
        <a href="/post?n=${encodeURIComponent(post.title?.toLowerCase() || post.code?.toLowerCase())}" class="result__item" data-categoria="${post.type}">
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

    // Atualizar resultados na tela
    searchResultContainer.innerHTML = postagem;

    console.log('Resultados filtrados:', allFilteredPosts);
  });
});

// Função para limpar o input e remover botão de limpar
function clearInput(inputElement, clearBtn, resultContainer) {
  inputElement.value = '';
  if (clearBtn) clearBtn.remove();
  if (resultContainer) resultContainer.innerHTML = `<span style="text-align: center;width: 100%;font-size: 1.1rem;font-family: 'minecraft seven', 'helvetica', arial, sans-serif;">Está buscando algo? 👀🎉<span>`;
}


}
}).catch((error) => console.error('Erro ao carregar o script:', error));
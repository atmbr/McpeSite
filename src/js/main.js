import { postLoad } from "../../src/js/post.js";
import commandList from "../../assets/template/command-list.js";
import mapList from "../../assets/template/map-list.js";
import cardCreate from "../../assets/template/card.js";
import header from "../../assets/template/header.js";
import footer from "../../assets/template/footer.js";

// ----------------------------
// Funcionalidades do header
// ----------------------------
async function initHeaderFeatures() {
  const isHeaderLoaded = await header();
  if (!isHeaderLoaded) return;

  const navIcon = document.querySelector(".nav__btn > *");
  const navCloseBtn = document.querySelector(".close__btn");
  const nav = document.querySelector(".navigation");
  const navContainerMobile = document.querySelector(".nav__container.nav--mobile");
  const searchIcon = document.querySelector(".search__icon");
  const searchContainerMobile = document.querySelector(".search__container.search--mobile");
  const searchContainerDesktop = document.querySelector(".search__container.search--desktop");
  const searchInput = document.querySelector(".search__input");

  const mobileSize = 978;

  navIcon?.addEventListener("click", () => {
    if (window.innerWidth <= mobileSize) {
      nav?.classList.toggle("active");
      navContainerMobile?.classList.toggle("active");
      document.body.classList.toggle("scrollactive");
      document.querySelector('main').classList.toggle('off');
    }
  });

  navCloseBtn?.addEventListener("click", () => {
    if (window.innerWidth <= mobileSize) {
      nav?.classList.remove("active");
      navContainerMobile?.classList.remove("active");
      searchContainerMobile?.classList.remove("active");
      document.body.classList.remove("scrollactive");
      document.querySelector('main').classList.toggle('off');

    }
  });

  searchIcon?.addEventListener("click", () => {
    const isMobile = window.innerWidth <= mobileSize;
    document.body.classList.toggle("scrollactive");
          document.querySelector('main').classList.toggle('off');

    if (isMobile) {
      nav?.classList.toggle("active");
      searchContainerMobile?.classList.toggle("active");
      searchContainerMobile?.querySelector(".search__input")?.focus();
      navContainerMobile?.classList.remove("active");
    } else {
      searchContainerDesktop?.classList.toggle("active");
      searchContainerDesktop?.querySelector(".search__input")?.focus();
    }
    searchInput?.focus();
  });

  // Controle de páginas
  const goTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const hideAllLists = () => {
    document.querySelectorAll('.list__block').forEach(list => list.classList.add('hidden'));
  };
  const renderPage = () => {
    var page = new URLSearchParams(location.search).get('page');
    console.log(page)
    
    if(page == null) page = "";
    var isHome = location.pathname === "/";
    if(isHome){
      console.log('Home Page!!')
      history.pushState(null, '', `?page=${page}`);
      hideAllLists();
      document.querySelector(page ? `.${page.toLocaleLowerCase()}__list` : '.list__block:nth-child(1)')?.classList.remove('hidden');
      goTop();
    }
    if(!isHome){
      console.log('NOT Home Page!!')
      // `
    }
  };

  const params = new URLSearchParams(window.location.search);
  const page = params.get("page");

  if (page) {
    goTop();
    hideAllLists();
    document.querySelector(`.${page}__list.list__block`)?.classList.remove("hidden");
  } else if (page === "home" || !page) {
    goTop();
    hideAllLists();
    document.querySelector(".list__block:nth-child(1)")?.classList.remove("hidden");
  }

  document.querySelector(".header__title > *")?.addEventListener("click", () => {
    history.pushState(null, '', location.pathname);
    renderPage();
    location.href = `../../index.html?page=${page}`;
  });

  document.querySelectorAll(".nav__link").forEach(link => {
    link.addEventListener("click", e => {
      goTop();
      nav?.classList.remove("active");
      navContainerMobile?.classList.remove("active");
      document.body.classList.remove("scrollactive");

      const page = e.target.dataset.page;
      if (!page) return;

      history.pushState(null, '', `?page=${page}`);
      renderPage();
      location.href = `../../index.html?page=${page}`;
    });
  });

  window.addEventListener("popstate", renderPage);

}

// ----------------------------
// Funcionalidades do footer (se necessário)
// ----------------------------
async function initFooterFeatures() {
  const isFooterLoaded = await footer();
  if (!isFooterLoaded) return;

  // Aqui você pode ativar funcionalidades específicas do footer, se houver
}

// ----------------------------
// Conteúdo principal da página (independente do header/footer)
// ----------------------------
(async () => {
  await commandList();
  await mapList();





    const params = new URLSearchParams(window.location.search);
    const article = params.get("article");
  
    function notexist(err) {
      console.log(err);
      document.querySelector('.not__exist')?.classList.remove('hidden');
    }
  
    if (article) {
      postLoad(true)
        .then((data) => {
          const mapDiv = document.querySelector(".map--type");
          const commandDiv = document.querySelector(".command--type");
  
          // Função de limpeza e normalização
          const normalize = str => str?.toString().toLowerCase().trim();
  
          // Filtragem mais robusta
          const filtrar = (arr, campos) =>
            arr.filter(post =>
              campos.some(campo =>
                normalize(post[campo])?.includes(normalize(article))
              )
            );
  
          const results = [
            ...filtrar(data.commands, ["title"]).map(p => ({ ...p, type: "command" })),
            ...filtrar(data.maps, ["title"]).map(p => ({ ...p, type: "map" })),
          ];
  
          if (!results.length) return notexist("Conteúdo não encontrado!!");
  
          const result = results[0];
  
          if (result.type === "map") {
            commandDiv?.classList.add("hidden");
            mapDiv?.classList.remove("hidden");
  
            const galeryContainer = mapDiv.querySelector(".galery__items > div");
            galeryContainer.innerHTML = result.img
              .map(src => `<div class="galery__item"><img src="${src}" alt="${result.title}"></div>`)
              .join("");
  
            galeryContainer.querySelector("div:nth-child(1)")?.classList.add("active");
  
            mapDiv.querySelector(".post__content").innerHTML = `
              <h2 class="post__title">${result.title}</h2>
              <div class="content__post">
                <div>${result.html}</div>
                <div class="view-card__video">
                  <iframe class="card__video" src="https://www.youtube.com/embed/${result.link[0].video.split("v=")[1]}" title="${result.title}"></iframe>
                </div>
                <a class="btn btn__bg btn__download" href="${result.link[0].download}">Baixa Mapa</a>
              </div>
            `;
          } else if (result.type === "command") {
            mapDiv?.classList.add("hidden");
            commandDiv?.classList.remove("hidden");
  
            const codesHTML = result.code.map((code, i) => `
              <div class="codes">
                <span>Codigo ${i + 1}: 
                  <code title="Copiar ${code}" onclick="copiarComando(this)">${code}</code>
                </span>
              </div>`).join("");
  
            commandDiv.querySelector(".select__image").src = result.img || "https://placehold.co/600x400";
            commandDiv.querySelector(".post__content").innerHTML = `
              <h2 class="post__title">${result.title}</h2>
              <small style="color: gray;font-style: italic;font-weight: bold;">Clique no código para copiar.</small>
              <div class="content__post">
                <div>${codesHTML}${result.html}</div>
              </div>
            `;
          }
  
          // Galeria de imagem
          document.querySelectorAll(".galery__item")?.forEach((item) => {
            if (item.classList.contains("active")) {
              document.querySelector(".select__image").src = item.querySelector("img").src;
            }
  
            item.addEventListener("click", () => {
              document.querySelector(".select__image").src = item.querySelector("img").src;
              document.querySelectorAll(".galery__item").forEach(el => el.classList.remove("active"));
              item.classList.add("active");
            });
          });
        })
        .catch((err) => console.error("Erro ao carregar o script:", err));
    } else {
      notexist("Página não encontrada!!");
    }

postLoad()
  .then((data) => {    
      const posts = data?.[1];
      if (!posts) return;
      // Carrossel
      

      function createButton({ text, link, external }) {
        if (!text && !link && external == null) return null;
        const btn = document.createElement("a");
        btn.textContent = text || "Button";
        btn.href = link || "#";
        btn.className = external ? "btn btn__txt" : "btn btn__bg";
        if (["https://", "http://"].some(part => link.includes(part))) btn.target = "_blank";// Faz um teste em cada item no objeto e verifica se no link inclue os valores do objeto.
        return btn;
      }
      
const observer = new MutationObserver(()=>{
  const carouselList = document.querySelectorAll(
        ".carousel__list .carousel__list__item"
      );
      const carouselItems = document.querySelectorAll(".carousel__item");
      if(carouselList.length > 0){
        observer.disconnect();
        carouselList?.forEach((listItem) => {
      const idItem = listItem.dataset.id;
          listItem.addEventListener("click", () => {
            carouselList.forEach((item) => item.classList.remove("active"));
            listItem.classList.add("active");

            carouselItems.forEach((contentItem) => {
              contentItem.classList.toggle(
                "active",
                contentItem.dataset.id === idItem
              );
            });
          });
    });
      }
})
    if(document.querySelector('.hero__carousel')){
      observer.observe(document.querySelector('.hero__carousel'), {
        childList: true,
        subtree: true,
      });
    }
    
      // INPUT DE BUSCA
      const searchInputs = document.querySelectorAll(".search__input");
      const filterInput = document.querySelectorAll(".filter__input");
      function filtrar(posts, campos, valor) {
        return posts.filter((post) =>
          campos.some((campo) =>
            String(post[campo] || "").toLowerCase().includes(valor)
          )
        );
      }
      
      function criarBotaoLimpar(container, input, onClear) {
        if (input.value && !container.querySelector(".btn__clear")) {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = "btn__clear";
          btn.onclick = () => {
            input.value = "";
            onClear?.();
            btn.remove();
          };
          container.appendChild(btn);
        }
      }
      
      async function gerarResultados(results, modo = "lista", type) {
        const cards = await Promise.all(
          results
            .filter(post => !type || post.type === type)
            .map(post => cardCreate(post, modo))
        );
        return cards.join("");
      }
      
      filterInput.forEach((input) => {
        input?.addEventListener("input", async (e) => {
          const value = e.target.value.toLowerCase();
          const spanTxt = e.target.closest("section").querySelector('.list__block span');
          const resultsList = e.target.closest('section').querySelector('.results__list'); // Encontra a lista de resultados da seção atual
      
          criarBotaoLimpar(e.target.offsetParent, e.target);
      
          // Condicional para definir o tipo de filtro (comando ou mapa)
          let results;
          if (e.target.closest(".command__section")) { // Se o input for da seção de comandos
            results = filtrar(posts.commands, ["title", "code", "description"], value).map(p => ({ ...p, type: "command" }));
          } else if (e.target.closest(".map__section")) { // Se o input for da seção de mapas
            results = filtrar(posts.maps, ["title", "description"], value).map(p => ({ ...p, type: "map" }));
          }
      
          // Atualiza o texto de busca ou esconde
          if (value) {
            spanTxt.classList.remove('hidden');
            spanTxt.innerHTML = `Buscando por: <strong>${e.target.value}</strong>`;
          } else {
            spanTxt.classList.add('hidden');
            spanTxt.innerHTML = ``;
          }
          
          // Atualiza os resultados de acordo com o tipo
          resultsList.innerHTML = await gerarResultados(results, "list", e.target.closest(".command__section") ? 'command' : 'map');
        });
      });
      // BUSCA MOBILE/DESKTOP
      searchInputs.forEach((input) => {
        input.addEventListener("input", async (e) => {
          const value = e.target.value.toLowerCase();
          const isMobile = input.closest(".search--mobile");
          const containerClass = isMobile ? ".search--mobile" : ".search--desktop";
      
          const inputContainer = document.querySelector(`${containerClass} .search__inp`);
          const resultContainer = document.querySelector(`${containerClass} .search__result`);
      
          criarBotaoLimpar(inputContainer, input, () => {
            resultContainer.innerHTML = `<span style="text-align: center;width: 100%;font-size: 1.1rem;font-family: 'minecraft seven', 'helvetica', arial, sans-serif;">Está buscando algo? 👀🎉</span>`;
          });
      
          if (!value) {
            resultContainer.innerHTML = `<span style="text-align: center;width: 100%;font-size: 1.1rem;font-family: 'minecraft seven', 'helvetica', arial, sans-serif;">Está buscando algo? 👀🎉</span>`;
            inputContainer.querySelector(".btn__clear")?.remove();
            return;
          }
      
          const results = [
            ...filtrar(posts.commands, ["title", "code", "description"], value).map(p => ({ ...p, type: "command" })),
            ...filtrar(posts.maps, ["title", "description"], value).map(p => ({ ...p, type: "map" }))
          ];
      
          resultContainer.innerHTML = await gerarResultados(results, "search");
        });
      });
      
      // Limpar input
      function clearInput(input, clearBtn, resultContainer) {
        input.value = "";
        clearBtn?.remove();
        resultContainer.innerHTML = `<span style="text-align: center;width: 100%;font-size: 1.1rem;font-family: 'minecraft seven', 'helvetica', arial, sans-serif;">Está buscando algo? 👀🎉</span>`;
      }
      if(!document.querySelector('.map__list')?.classList.contains('hidden')){
        (async () => {
            await commandList();
            await mapList();
        })();
      }
  }).catch((err) => console.error("Erro ao carregar o script:", err));

  // outras execuções
})();

// ----------------------------
// Inicialização paralela
// ----------------------------
initHeaderFeatures();
initFooterFeatures();


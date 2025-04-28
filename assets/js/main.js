import { postLoad } from "../../assets/js/post.js";
const navIcon = document.querySelector(".nav__btn");
const navCloseBtn = document.querySelector(".close__btn");
const nav = document.querySelector(".navigation");
const navContainerMobile = document.querySelector(
  ".nav__container.nav--mobile"
);
const searchIcon = document.querySelector(".search__icon");
const searchContainerMobile = document.querySelector(
  ".search__container.search--mobile"
);
const searchContainerDesktop = document.querySelector(
  ".search__container.search--desktop"
);
const searchInput = document.querySelector(".search__input");
var mobileSize = 978;
// Abrir menu mobile
navIcon?.addEventListener("click", () => {
  if (window.innerWidth <= mobileSize) {
    nav?.classList.toggle("active");
    navContainerMobile?.classList.toggle("active");
    document.body.classList.toggle("scrollactive");
  }
});

// Fechar menu mobile
navCloseBtn?.addEventListener("click", () => {
  if (window.innerWidth <= mobileSize) {
    nav?.classList.remove("active");
    navContainerMobile?.classList.remove("active");
    searchContainerMobile?.classList.remove("active");
    document.body.classList.remove("scrollactive");
  }
});

// Ícone de busca
searchIcon?.addEventListener("click", () => {
  const isMobile = window.innerWidth <= mobileSize;
  document.body.classList.toggle("scrollactive");
  console.log(11);
  if (isMobile) {
    nav?.classList.toggle("active");
    searchContainerMobile?.classList.toggle("active");
    searchContainerMobile?.querySelector(".search__input")?.focus();
    navContainerMobile?.classList.remove("active");
  } else {
    console.log(searchContainerDesktop);
    searchContainerDesktop?.classList.toggle("active");
    searchContainerDesktop?.querySelector(".search__input")?.focus();
  }

  searchInput?.focus();
});

//Postagem type
if (location.pathname.includes("/page/")) {
  const params = new URLSearchParams(window.location.search);
  const article = params.get("article");
  function notexist(err) {
    console.log(err)
    document.querySelector('.not__exist').classList.remove('hidden')
  }
  // Verifica se o parâmetro 'article' existe antes de continuar
  if (article){
  postLoad(true)
    .then((data) => {
      const mapDiv = document.querySelector(".map--type");
      const commandDiv = document.querySelector(".command--type");

      // Função para filtrar os posts com base nos campos e valor de 'article'
      const filtrar = (arr, campos) =>
        arr.filter((post) =>
          campos.some((campo) =>
            post[campo]
              ?.toLowerCase()
              .replaceAll(" -", "")
              .replaceAll(" ", "-")
              .includes(article)
          )
        );

      // Filtra e tipa os resultados dinamicamente
      const results = [
        ...filtrar(data.carousel, ["title"]).map((p) => ({ ...p, type: "carousel" })),
        ...filtrar(data.commands, ["title"]).map((p) => ({ ...p, type: "command" })),
        ...filtrar(data.maps, ["title"]).map((p) => ({ ...p, type: "map" })),
      ];
      if (!results.length) return notexist("Conteúdo não encontrado!!");

      const result = results[0];

      if (result.type === "map") {
        commandDiv.classList.add("hidden");
        mapDiv.classList.remove("hidden");

        const galeryContainer = mapDiv.querySelector(".map--type .galery__items > div");
        galeryContainer.innerHTML = result.img
          .map((src) => `<div class="galery__item"><img src="${src}" alt="${result.title}"></div>`)
          .join("");

        galeryContainer.querySelector("div:nth-child(1)")?.classList.add("active");

        mapDiv.querySelector(".map--type .post__content").innerHTML = `
          <h2 class="post__title">${result.title}</h2>
          <div class="content__post">
            <div>${result.html}</div>
            <div class="view-card__video">
              <iframe class="card__video" src="https://www.youtube.com/embed/${result.link[0].video.split("v=")[1]}" title="${result.title}"></iframe>
            </div>
            <a class="btn btn__bg btn__download" href="${result.link[0].download}">Baixa Mapa</a>
          </div>
        `;
        console.log(`Item encontrado do "${result.title}": ${result}`)
      } else if (result.type === "command") {
        mapDiv.classList.add("hidden");
        commandDiv.classList.remove("hidden");

        const codesHTML = result.code
          .map(
            (code, i) => `
              <div class="codes">
                <span>Codigo ${i + 1}: 
                  <code title="Copiar ${code}" onclick="copiarComando(this)">${code}</code>
                </span>
              </div>`
          )
          .join("");

        commandDiv.querySelector(".select__image").src = result.img || "https://placehold.co/600x400";
        commandDiv.querySelector(".post__content").innerHTML = `
          <h2 class="post__title">${result.title}</h2>
          <small style="color: gray;font-style: italic;font-weight: bold;">Clique no código para copiar.</small>
          <div class="content__post">
            <div>
              ${codesHTML}
              ${result.html}
            </div>
            <a class="btn btn__bg btn__download" href="${result.link[0].download}">Baixa Mapa</a>
          </div>
        `;
      }

      // Galeria de imagem
      const galeryItems = document.querySelectorAll(".galery__item");
      galeryItems.forEach((item) => {
        if (item.classList.contains("active")) {
          document.querySelector(".select__image").src =
            item.querySelector("img").src || result.img || "https://placehold.co/600x400";
        }

        item.addEventListener("click", () => {
          document.querySelector(".select__image").src =
            item.querySelector("img").src || "https://placehold.co/600x400";

          galeryItems.forEach((el) => el.classList.remove("active"));
          item.classList.add("active");
        });
      });
    })
    .catch((err) => console.error("Erro ao carregar o script:", err));
  } else notexist("Página não encontrada!!");
}



if (!location.pathname.includes("/page/")) {
  postLoad()
    .then((data) => {
      const posts = data?.[1];
      if (!posts) return;

      // Carrossel
      const carouselList = document.querySelectorAll(
        ".carousel__list .carousel__list__item"
      );
      const carouselItems = document.querySelectorAll(".carousel__item");

      function createButton({ text, link, external }) {
        if (!text && !link && external == null) return null;
        const btn = document.createElement("a");
        btn.textContent = text || "Button";
        btn.href = link || "#";
        btn.className = external ? "btn btn__txt" : "btn btn__bg";
        if (external) btn.target = "_blank";
        return btn;
      }

      function updateCarouselItem(item, config) {
        const titleElement = item.querySelector(".carousel__title");
        if (titleElement) {
          titleElement.textContent = config.title || "";
        }
        const descriptionElement = item.querySelector(".carousel__description");
        if (descriptionElement) {
          descriptionElement.textContent = config.description || "";
        }
        const img = item.querySelector(".carousel__img");
        if (img && config.img) img.src = config.img;

        const btnContainer = item.querySelector(".btn__container");
        if (btnContainer && Array.isArray(config.btn)) {
          btnContainer.innerHTML = "";
          config.btn.forEach((button) => {
            const newButton = createButton(button);
            if (newButton) btnContainer.appendChild(newButton);
          });
        }
      }

      carouselList.forEach((listItem) => {
        const idItem = listItem.dataset.id;
        const configData = listItem.dataset.config;

        if (idItem && configData) {
          try {
            const config = JSON.parse(configData);
            const listImg = listItem.querySelector(".carousel__list__img");
            if (listImg && config.img) listImg.src = config.img;

            carouselItems.forEach((contentItem) => {
              if (contentItem.dataset.id === idItem)
                updateCarouselItem(contentItem, config);
            });

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
          } catch (error) {
            console.error("Erro ao carregar data-config:", error);
          }
        }
      });

      // INPUT DE BUSCA
      const searchInputs = document.querySelectorAll(".search__input");

      searchInputs.forEach((input) => {
        input.addEventListener("input", (event) => {
          const value = event.target.value.toLowerCase();
          const isMobile = event.target.closest(".search--mobile") !== null;
          const containerClass = isMobile
            ? ".search--mobile"
            : ".search--desktop";

          const inputContainer = document.querySelector(
            `${containerClass} .search__inp`
          );
          const resultContainer = document.querySelector(
            `${containerClass} .search__result`
          );

          // Criar botão limpar
          if (value && !inputContainer.querySelector(".btn__clear")) {
            const clearBtn = document.createElement("button");
            clearBtn.type = "button";
            clearBtn.className = "btn__clear";
            clearBtn.onclick = () =>
              clearInput(input, clearBtn, resultContainer);
            inputContainer.appendChild(clearBtn);
          }

          if (!value) {
            inputContainer.querySelector(".btn__clear")?.remove();
            resultContainer.innerHTML = `<span style="text-align: center;width: 100%;font-size: 1.1rem;font-family: 'minecraft seven', 'helvetica', arial, sans-serif;">Está buscando algo? 👀🎉</span>`;
            return;
          }

          // Filtragem
          const filtrar = (arr, campos) =>
            arr.filter((post) =>
              campos.some((campo) => post[campo]?.toLowerCase().includes(value))
            );

          const results = [
            ...filtrar(posts.commands, ["title","code", "description"]).map((p) => ({
              ...p,
              type: "command",
            })),
            ...filtrar(posts.maps, ["title", "description"]).map((p) => ({
              ...p,
              type: "map",
            })),
          ];

          resultContainer.innerHTML = results
            .map((post) => {
              const imageUrl = post.code
                ? "https://i.pinimg.com/736x/39/dc/ee/39dcee8b6ba09ea7004cd901326eb823.jpg"
                : post.img || post.image || "https://placehold.co/600x400";

              return `
          <a href="/post?n=${encodeURIComponent(
            post.title?.toLowerCase() || post.code?.toLowerCase()
          )}" class="result__item" data-categoria="${post.type}">
            <div style="width: var(--size); height: auto; overflow: hidden; position: relative;">
              <img src="${imageUrl}" alt="${
                post.title || post.code
              }" class="result__img">
            </div>
            <div class="result__info">
              <h3 class="result__title">${post.title || post.code}</h3>
              <p class="result__description">${post.description}</p>
            </div>
          </a>`;
            })
            .join("");
        });
      });

      // Limpar input
      function clearInput(input, clearBtn, resultContainer) {
        input.value = "";
        clearBtn?.remove();
        resultContainer.innerHTML = `<span style="text-align: center;width: 100%;font-size: 1.1rem;font-family: 'minecraft seven', 'helvetica', arial, sans-serif;">Está buscando algo? 👀🎉</span>`;
      }
    })
    .catch((err) => console.error("Erro ao carregar o script:", err));
}

import config from "../template/config.js";
// Função principal para gerar e inserir os cards na página
async function generatePage() {
    try {
        // Seleciona o contêiner onde os cards serão inseridos
        const headerContainer = document.querySelector("header");
        const nav = [{name:"Comando", prefix:"command", link:""},{name:"Mapa", prefix:"map", link:""},{name:"Suporte",prefix:"", link:`../../support/index.html`}]
        var navs = "";
        for (const [e, key] of Object.entries(nav)) {
            navs += `<button type="map" class="nav__link" ${!key.link?`data-page="${key.prefix}"`:''}>${key.link?`<a href="${key.link}">${key.name}</a>`:`${key.name}`}</button>`
        }
        if (!headerContainer) return;
        // Gera os cards dinamicamente
        const header = `
        <div class="nav__btn">
            <button type="menu" style="color: inherit;">
                <i class="material-icons nav__icon">menu</i>
            </button>
        </div>

        <div class="logo__container">
        <h1 class="header__title"><a href="../../index.html">${await config('siteName')||"Atm"}</a></h1>
        </div>

        <nav class="navigation" id="nav__block">
        <!-- Mobile Navigation -->
        <div class="flex-column flex-left w-100 mobile--nav">
            <div class="header__nav">
            <i class="nav__icon close__btn"></i>
            <h2 class="header__title">${await config('siteName')||"Atm"}</h2>
            </div>

            <div class="search__container search--mobile">
            <div class="search__inp">
                <input type="search" class="search__input search__bar" placeholder="Pesquisar..." />
            </div>
            <div class="search__result">
                <span class="search__placeholder">Está buscando algo? 👀🎉</span>
            </div>
        </div>
        <div class="nav__container nav--mobile">
        ${navs}
            </div>
        </div>
        <!-- Desktop Navigation -->
        <div class="desktop--nav">
            <div class="nav__container nav--desktop">
            ${navs}  
        </div>
            <div class="search__container search--desktop">
            <div class="search__inp">
                <input type="search" class="search__input search__bar" placeholder="Pesquisar..." />
            </div>
            <div class="search__result">
                <span class="search__placeholder">Está buscando algo? 👀🎉</span>
            </div>
            </div>
        </div>
        </nav>

        <div class="search__btn">
        <i class="material-icons nav__icon search__icon">search</i>
        </div>
            `;
        if(!header) return false;
        // Insere os cards no contêiner
        if(headerContainer.innerHTML = header) return true;
    } catch (err) {
        console.error("Erro ao gerar a página:", err);
        return false;
    }
}

// Exporta a função para uso externo
export default generatePage;

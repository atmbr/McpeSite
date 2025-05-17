import config from "../template/config.js";
// Função principal para gerar e inserir os cards na página
async function generatePage() {
    try {
        // Seleciona o contêiner onde os cards serão inseridos
        const footerContainer = document.querySelector("footer");
        
        if (!footerContainer) return;
        // Gera os cards dinamicamente
        const footer = `
                <div class="footer__social">
                    <p>Siga-nos:</p>
                    <a href="#"><i class="fab fa-youtube"></i></a>
                    <a href="#"><i class="fab fa-discord"></i></a>
                    <a href="#"><i class="fab fa-twitter"></i></a>
                </div>
                <div class="footer__content">
                    <div class="footer__links">
                    <ul>
                        <li>
                        <span class="">Menu</span>
                        </li>
                        <li><a data-page="command" class="nav__link" href="javascript:null">Comandos</a></li>
                        <li><a data-page="map" class="nav__link" href="javascript:null">Mapas</a></li>
                        <li><a class="nav__link" href="../../support/index.html">Suporte</a></li>
                    </ul>
                    <ul>
                        <li>
                        <span class="">Suporte</span>
                        </li>
                        <li><a class="nav__link" href="../../support/contact.html">Contato</a></li>
                        <li><a class="nav__link" href="../../page/about.html">Sobre</a></li>
                        <li><a class="nav__link" href="../../page/term.html">Termos</a></li>
                    </ul>
                    </div>
                </div>
                <div class="footer__bottom">
                    <p>© 2025 ${await config('siteName')||"Atm"} - Todos os direitos reservados</p>
                </div>
            `;
        if(!footer) return false;
        // Insere os cards no contêiner
        if(footerContainer.innerHTML = footer) return true;
    } catch (err) {
        console.error("Erro ao gerar a página:", err);
        return false;
    }
}

// Exporta a função para uso externo
export default generatePage;

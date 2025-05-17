// // back.js - Script para gerenciar o fundo do site e atualizar links

// // Função para configurar o fundo do site
// function configurarFundo(cor, imagem) {
//     const body = document.body;
//     body.style.backgroundColor = cor || '#ffffff'; // Cor padrão: branco
//     if (imagem) {
//         body.style.backgroundImage = `url(${imagem})`;
//         body.style.backgroundSize = 'cover';
//         body.style.backgroundPosition = 'center';
//     } else {
//         body.style.backgroundImage = 'none';
//     }
// }

// // Função para atualizar os links do site
// function atualizarLinks(novosLinks) {
//     const links = document.querySelectorAll('a');
//     links.forEach((link, index) => {
//         if (novosLinks[index]) {
//             link.href = novosLinks[index];
//         }
//     });
// }

// // Função para posicionar itens no lugar
// function posicionarItens(seletor, posicoes) {
//     const itens = document.querySelectorAll(seletor);
//     itens.forEach((item, index) => {
//         if (posicoes[index]) {
//             const { top, left } = posicoes[index];
//             item.style.position = 'absolute';
//             item.style.top = top || '0px';
//             item.style.left = left || '0px';
//         }
//     });
// }

// // Exemplo de uso
// document.addEventListener('DOMContentLoaded', () => {
//     configurarFundo('#f0f0f0', 'assets/images/background.jpg');
//     atualizarLinks(['https://example.com', 'https://anotherexample.com']);
//     posicionarItens('.item', [
//         { top: '100px', left: '50px' },
//         { top: '200px', left: '150px' }
//     ]);
// });
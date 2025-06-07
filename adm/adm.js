// Carrega e prepara os posts a partir do JSON

let posts = Object.values(
  (await fetch("../../src/data/post.json")
    .then((response) => response.json())
    .catch(() => console.error("Erro ao carregar postagens"))) || []
).flat();

function renderPosts() {
  const postsDiv = document.getElementById("posts");
  postsDiv.innerHTML = "";

  posts.forEach((post) => {
    const postEl = document.createElement("div");
    postEl.className = "card";
    postEl.dataset.id = post.id;
    postEl.dataset.type = post.type;
    postEl.dataset.json = JSON.stringify(post);

    postEl.innerHTML = `
      <div class="view-card__image">
        <img loading="lazy" src="${post.img?.[0] || "https://placehold.co/600x400"}" class="card__image" alt="${post.title}">
      </div>
      <div class="card__details">
        <div>
          <h4 class="card__title">${post.title}</h4>
          <p class="card__description">${post.description}</p>
        </div>
        <div class="btn__container w-100">
          <button class="edit btn btn__bg btn__txt" onclick="editPost(this, '${post.id}')">Editar</button>
          <button class="delete btn btn__bg btn__txt" onclick="deletePost('${post.type}', '${post.id}')">Apagar</button>
        </div>
      </div>
    `;

    postsDiv.appendChild(postEl);
  });
}

document.querySelector(".postForm").onsubmit = function (e) {
  e.preventDefault();
  console.log(1)

  const titulo = document.getElementById("titulo").value;
const description = document.getElementById("descrição").value;
const conteudo = document.getElementById("conteudo").value;
const video = document.getElementById("link#03").value || "";
const editIndex = document.getElementById("editIndex").value;

const listitems = Array.from(document.querySelectorAll(".listitems .listval"));
const listcodes = Array.from(document.querySelectorAll(".listcodes .listval"));
const imgs = Array.from(document.querySelectorAll(".img__upload > div > img"));
const links = Array.from(document.querySelectorAll(".links"));

const list = { listInfo: [], listCode: [], link: [], img: [] };
  console.log(2)

// Função para coletar dados do formulário
function coletarDados({ imgs = [], listitems = [], listcodes = [], links = [] } = {}, list) {
  if (!list || typeof list !== 'object') {
    console.warn('Objeto "list" não fornecido ou inválido.');
    return;
  }
  const coletar = (arr, destino, getValor) => {
    if (!Array.isArray(arr)) {
      console.warn("Não é array:", arr);
      return;
    }
    arr.forEach(item => {
      const raw = getValor(item);
      const valor = typeof raw === 'string' ? raw.trim() : raw;
      if (valor && valor !== "") {
        destino.push(valor);
      }
    });
  };

  coletar(listitems, list.listInfo, item => item?.value);
  coletar(listcodes, list.listCode, item => item?.value?.split('\n'));
  coletar(imgs, list.img, item => item?.src);
  coletar(links, list.link, item => item?.value);
}

// Função para renderizar botões no formulário
function renderizarBotoes(jsonData) {
  if (jsonData.btn?.length > 0) {
    const btnList = document.querySelectorAll(".postForm .listbtn > div");

    jsonData.btn.forEach((btn, index) => {
      if (btnList[index]) {
        const btnText = btnList[index].querySelector("input[name='text']");
        const btnLink = btnList[index].querySelector("input[name='link']");
        const btnCheck = btnList[index].querySelector("input[type='checkbox']");

        if (btnText) btnText.value = btn.text || "";
        if (btnLink) btnLink.value = btn.link || "";
        if (btnCheck) btnCheck.checked = !!btn.external;
      }
    });
  }
}

// Função para inicializar o Editor.js
function inicializarEditor() {
  const editor = new EditorJS({
    holder: 'editorjs',
    tools: {
      header: Header,
      list: List,
      image: SimpleImage
    },
    data: {}
  });
  return editor;
}

// Exemplo de uso do Editor.js
const editor = inicializarEditor();

// Função para salvar os dados do Editor.js
function salvarConteudoEditor() {
  editor.save().then((outputData) => {
    console.log('Data saved: ', outputData);
  }).catch((error) => {
    console.log('Saving failed: ', error);
  });
}

// var listDone = list.listInfo.map(item =>`<li>${item.trim()}</li>`);
var carousel = true;

const data = {
  code: [list.listCode],
  description: description,
  img: [list.img],
  title: titulo,
  html: conteudo,
  ...(carousel ? {
    btn: [
      { text: `${document.querySelector('.listbtn input[name=text]:nth-child(0)').value}`, link: `${document.querySelector('.listbtn input[name=link]:nth-child(0)').value}`, external: `${`${document.querySelector('.listbtn input[type=checkbox]:nth-child(0)').checked?true:false}`}` },
      { text: `${document.querySelector('.listbtn input[name=text]:nth-child(1)').value}`, link: `${document.querySelector('.listbtn input[name=link]:nth-child(0)').value}`, external: `${`${document.querySelector('.listbtn input[type=checkbox]:nth-child(1)').checked?true:false}`}` }
    ]
  } : {}),
  link: [{ donwload: list.link, video: video }],
  list: list.listInfo,
  type: e.target.dataset.type,
  id: Math.random().toString(36).substring(2, 8) // Corrigido também de base 6 para base 36
};

  localStorage.setItem("postagens", JSON.stringify(data));
  console.log("data: ", data);
  if (editIndex === "") {
    posts.push({ titulo, conteudo });
  } else {
    posts[editIndex] = { titulo, conteudo };
    document.getElementById("btnSalvar").textContent = "Criar Postagem";
  }
//   location.reload();
    // this.reset();
  document.getElementById("editIndex").value = "";
  renderPosts();
};
window.addlistitem = function (e, { func = true, command = [], links = [], list = [] }) {
  const generateItemHTML = item =>
    `<div class="listitem"><input class="listval" type="text" value="${item}"><button type="button" onclick="deletitem(this)">X</button></div>`;

  if (func) {
    if (list && list.length > 0) {
      return list.map(generateItemHTML).join("");
    } else if (command && command.length > 0) {
      return command.map(generateItemHTML).join("");
    } else if (links && links.length > 0) {
      return links.map(generateItemHTML).join("");
    }
    return "";
  }

  const items =
    e.closest(".listinfo")?.querySelector(".listitems") ||
    e.closest(".listcode")?.querySelector(".listcodes");

  items.insertAdjacentHTML(
    "beforeend",
    generateItemHTML("")
  );
};

window.deletitem = function (e) {
  e.closest(".listitem").remove();
};


window.editPost = function (item, id) {
  const postForm = document.querySelector(".postForm");
  const classList = postForm.classList;

  // Garante que "editMode" esteja presente
  classList.add("editMode");

  // Remove todas as classes de modo
  classList.remove("mode__map", "mode__command", "mode__carousel");

  // Determina o tipo e aplica a classe correta
  const type = item.closest(".card").dataset.type;
  console.log(classList, type)

  if (type === "map") classList.add("mode__map");
  else if (type === "command") classList.add("mode__command");
  else if (type === "carousel") classList.add("mode__carousel");

  document.getElementById("btnSalvar").textContent = "Salvar Alteração";

  const jsonData = JSON.parse(item.closest(".card").dataset.json) || {};

if (jsonData.btn?.length > 0) {
  const btnList = document.querySelectorAll(".postForm .listbtn > div");

  if (btnList[0]) {
    const btn0Text = btnList[0].querySelector("input[name='text']");
    const btn0Link = btnList[0].querySelector("input[name='link']");
    const btn0Check = btnList[0].querySelector("input[type='checkbox']");
    console.log(btn0Text, btn0Link, btn0Check)

    if (btn0Text) btn0Text.value = jsonData.btn[0]?.text || "e";
    if (btn0Link) btn0Link.value = jsonData.btn[0]?.link || "";
    if (btn0Check) btn0Check.checked = !!jsonData.btn[0]?.external;
  }

  if (jsonData.btn.length > 1 && btnList[1]) {
    const btn1Text = btnList[1].querySelector("input[name='text']");
    const btn1Link = btnList[1].querySelector("input[name='link']");
    const btn1Check = btnList[1].querySelector("input[type='checkbox']");

    if (btn1Text) btn1Text.value = jsonData.btn[1]?.text || "";
    if (btn1Link) btn1Link.value = jsonData.btn[1]?.link || "";
    if (btn1Check) btn1Check.checked = !!jsonData.btn[1]?.external;
  }
}

  document.getElementById("link#03").value = jsonData.link?.[0]?.video || "";
  document.getElementById("link#01").value = jsonData.link?.[0]?.download || "";
  document.querySelector(".postForm .title input").value = jsonData.title || "";
  document.querySelector(".postForm .description textarea").value = jsonData.description || "";
  document.querySelector(".postForm .content textarea").value = jsonData.html || "";

  // Helper para limpar e inserir HTML em container
  function renderList(selector, html) {
    const container = document.querySelector(selector);
    container.innerHTML = ""; // Limpa todos os filhos
    container.insertAdjacentHTML("beforeend", html);
  }

  if (jsonData.code?.length) {
    renderList(".postForm .listcodes", addlistitem(null, { func: true, command: jsonData.code }));
  }

  if (jsonData.links?.length) {
    renderList(".postForm .listlinks", addlistitem(null, { func: true, links: jsonData.links }));
  }

  if (jsonData.list?.length) {
    renderList(".postForm .listinfo", addlistitem(null, { func: true, list: jsonData.list }));
  }
};




window.deletePost = function (type, idx) {
  if (confirm("Quer mesmo apagar?", confirm("Tem certeza que deseja apagar esta postagem?"))) {
    const index = posts.findIndex(post => post.id === idx && post.type === type);
if (index !== -1) {
  posts.splice(index, 1);  // remove do array original
}

    console.log(index);
    localStorage.setItem("posts", JSON.stringify(posts));
    renderPosts();
  }
};
window.previewImage = function (event) {
  const files = Array.from(event.srcElement.files);
  const container = event.target.parentNode.querySelector(".imgs12");

  const MAX_IMAGENS = 3;
  const imagensAtuais = container.querySelectorAll("img").length;

  if (!files || files.length === 0) {
    return console.error("Não há nenhum arquivo.");
  }

  if (imagensAtuais >= MAX_IMAGENS) {
    return alert(`Limite de ${MAX_IMAGENS} imagens atingido.`);
  }

  files.forEach((file) => {
    if (!file.type.startsWith("image/")) {
      return console.error("Não é uma imagem válida: " + file.type);
    }

    if (container.querySelectorAll("img").length >= MAX_IMAGENS) {
      return; // Impede que ultrapasse o limite mesmo com múltiplos arquivos
    }

   const reader = new FileReader();
    reader.onload = () => {
      const wrapper = Object.assign(document.createElement("div"), {
        className: "img-preview-wrapper",
        style: "position:relative; display:inline-block; margin-right:8px;"
      });

      const img = Object.assign(document.createElement("img"), {
        src: reader.result,
        loading: "lazy",
        style: "width:100%; height:140px; object-fit:cover; aspect-ratio:16/9;"
      });

      const btn = Object.assign(document.createElement("button"), {
        textContent: "×",
        title: "Remover",
        onclick: () => wrapper.remove(),
        style: "position:absolute; top:2px; right:2px; background:red; color:white; border:none; cursor:pointer; border-radius:50%; padding:5px 10px;"
      });

      wrapper.append(img, btn);
      container.appendChild(wrapper);
    };
    reader.readAsDataURL(file);
  });
};
var imagensSelecionadas = [];
window.previewImage = function (event) {

  const input = event.target;
  const files = Array.from(input.files || []);
  const container = input.parentNode.querySelector(".imgs12");
  const MAX = 3;

  const dt = new DataTransfer();
  const previews = container.querySelectorAll(".img-preview-wrapper")|| 0;
  if (previews.length >= MAX) return alert(`Máximo de ${MAX} imagens.`);

  files.forEach((file) => {
    if (!file.type.startsWith("image/")) return;
    if (imagensSelecionadas.length >= MAX) return alert("Limite de imagens atingido.");

    const reader = new FileReader();
    reader.onload = () => {
        console.log("Selecionados:", imagensSelecionadas);

      const wrapper = document.createElement("div");
      wrapper.className = "img-preview-wrapper";
      wrapper.style = "position:relative; display:inline-block; margin-right:8px;";

      const img = document.createElement("img");
      img.src = reader.result;
      img.style = "width:100%; height:140px; object-fit:cover; aspect-ratio:16/9;";
      wrapper.appendChild(img);

      const btn = document.createElement("button");
      btn.textContent = "×";
      btn.title = "Remover";
      btn.style = "position:absolute; top:2px; right:2px; background:red; color:white; border:none; cursor:pointer; border-radius:50%; padding:5px 10px;";
      btn.onclick = () => {
        container.removeChild(wrapper);
        imagensSelecionadas = imagensSelecionadas.filter(f => f !== file);
        console.log("Restantes:", imagensSelecionadas);
      };

      wrapper.appendChild(btn);
      container.appendChild(wrapper);
    };

    imagensSelecionadas.push(file);
    reader.readAsDataURL(file);
  });

  // Substitui arquivos no input
  input.files = dt.files;
};


renderPosts();

window.createPost = function () {
  const overlay = document.querySelector(".createpost__overlay");
  var title = document.querySelector(".postForm h2");
  let names = {map:"Mapa", command: "Comamndo",carousel:"Carrossel"} 
  overlay.style.display = "flex";

  overlay.querySelectorAll(".createpost__options button").forEach(btn => {
    btn.onclick = () => {
      const tipo = btn.dataset.type;
      title.textContent = `Criar Postagem - ${names[tipo]}`;
      overlay.style.display = "none";
      document.querySelector(".postForm").classList.toggle(`mode__${tipo}`);
      iniciarCriacaoPost(tipo); // Chame sua função de criação aqui
    };
  });

  overlay.querySelector(".closeCreatePost").onclick = () => {
    overlay.style.display = "none";
  };
};

function iniciarCriacaoPost(tipo) {
  console.log("Criando post do tipo:", tipo);
  // Aqui você pode carregar o formulário correspondente ou redirecionar
}

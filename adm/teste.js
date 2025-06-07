const generateId = () => Number(Math.random().toString(8).substr(2, 9));

//GetPosts
async function getPosts() {
  try {
    const response = await fetch('../../src/data/post.json');
    const data = await response.json();

    // Popula o localStorage na primeira carga
    localStorage.setItem('carousel', JSON.stringify(data.carousel));
    localStorage.setItem('map', JSON.stringify(data.maps));
    localStorage.setItem('command', JSON.stringify(data.commands));

    return [
      JSON.parse(localStorage.getItem('map')),
      JSON.parse(localStorage.getItem('carousel')),
      JSON.parse(localStorage.getItem('command'))
    ];
  } catch (error) {
    console.error('Erro ao carregar posts:', error);
    return [ [], [], [] ];
  }
}

let posts = await getPosts();
console.log('Posts iniciais:', posts);

//Variáveis para edição em andamento
let currentEditIndex = null;// índice dentro do array “flattened”
let currentEditId = null; // id único do post sendo editado
let originalType = null; // type original do post sendo editado
let currentImages = []; // imagens carregadas no formulário

//RenderImagePreviews
const renderImagePreviews = () => {
  const preview = document.getElementById('thumbPreview');
  preview.innerHTML = '';

  currentImages.forEach(img => {
    const div = document.createElement('div');
    div.className = 'thumb-item';

    const image = document.createElement('img');
    image.src = img.src;
    image.alt = img.name || 'Imagem';
    div.appendChild(image);

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = '×';
    btn.className = 'remove-btn';
    btn.addEventListener('click', () => {
      currentImages = currentImages.filter(i => i.id !== img.id);
      renderImagePreviews();
    });
    div.appendChild(btn);

    preview.appendChild(div);
  });
};

//CreateListItemInput / createBtnItem
const createListItemInput = (placeholder = '', value = '') => {
  const div = document.createElement('div');
  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = placeholder;
  input.value = value;
  input.style.width = '95%';
  div.appendChild(input);
  return div;
};

const createBtnItem = (value = { texto: '', link: '', externo: false }) => {
  const container = document.createElement('div');

  const textLabel = document.createElement('label');
  textLabel.textContent = 'Texto:';
  const textInput = document.createElement('input');
  textInput.type = 'text';
  textInput.value = value.texto;

  const linkLabel = document.createElement('label');
  linkLabel.textContent = 'Link:';
  const linkInput = document.createElement('input');
  linkInput.type = 'text';
  linkInput.value = value.link;

  const checkLabel = document.createElement('label');
  checkLabel.textContent = 'Externo:';
  const check = document.createElement('input');
  check.type = 'checkbox';
  check.checked = value.externo;

  const line = document.createElement('div');
  line.className = 'btn-inline';
  line.append(textLabel, textInput, linkLabel, linkInput, checkLabel, check);

  container.appendChild(line);
  return container;
};

//Botões “+”
document.getElementById('addCommandBtn').addEventListener('click', () => {
  document.getElementById('commandsList')
    .appendChild(createListItemInput('Digite um comando'));
});
document.getElementById('addItemBtn').addEventListener('click', () => {
  document.getElementById('itemsList')
    .appendChild(createListItemInput('Digite um item'));
});
document.getElementById('addBtnBtn').addEventListener('click', () => {
  document.getElementById('btnList').appendChild(createBtnItem());
});

//Mudança de “type”
document.getElementById('postType').addEventListener('change', e => {
  const type = e.target.value;
  const form = document.querySelector('#postForm');
  form.classList.remove('mode__map', 'mode__carousel', 'mode__command');
  form.classList.add(`mode__${type}`);
});

//Lpload de imagens
document.getElementById('thumbInput').addEventListener('change', e => {
  const files = e.target.files;
  Array.from(files).forEach(file => {
    const reader = new FileReader();
    reader.onload = ev => {
      currentImages.push({
        id: generateId(),
        src: ev.target.result,
        file,
        name: file.name
      });
      renderImagePreviews();
    };
    reader.readAsDataURL(file);
  });
  e.target.value = '';
});

//Limpar formulário 
const clearForm = () => {
  document.getElementById('titulo').value = '';
  document.getElementById('descricao').value = '';
  document.getElementById('conteudo').value = '';
  document.getElementById('commandsList').innerHTML = '';
  document.getElementById('itemsList').innerHTML = '';
  document.getElementById('btnList').innerHTML = '';
  document.getElementById('linkDownload').value = '';
  document.getElementById('linkVideo').value = '';
  document.getElementById('postType').value = '';
  currentImages = [];
  renderImagePreviews();

  // “Resetar” flags de edição
  currentEditIndex = null;
  currentEditId = null;
  originalType = null;
};
//Carregar post no formulário
const loadPostInForm = index => {
  const flat = Object.values(posts).flat();
  const post = flat[index];
  if (!post) return;

  currentEditIndex = index;
  currentEditId = post.id;
  originalType = post.type;

  document.getElementById('titulo').value = post.title;
  document.getElementById('descricao').value = post.description;
  document.getElementById('conteudo').value = post.content || '';

  const commands = document.getElementById('commandsList');
  commands.innerHTML = '';
  if (post.code?.length) {
    post.code.forEach(c => 
      commands.appendChild(createListItemInput('Digite um comando', c))
    );
  }

  const items = document.getElementById('itemsList');
  items.innerHTML = '';
  if (post.list?.length) {
    post.list.forEach(i => 
      items.appendChild(createListItemInput('Digite um item', i))
    );
  }

  const btnList = document.getElementById('btnList');
  btnList.innerHTML = '';
  if (post.btn?.length) {
    post.btn.forEach(b => 
      btnList.appendChild(createBtnItem(b))
    );
  }

  document.getElementById('linkDownload').value = post.link?.download || '';
  document.getElementById('linkVideo').value = post.link?.video || '';

  document.getElementById('postType').value = post.type;
  const form = document.querySelector('#postForm');
  form.classList.remove('mode__map', 'mode__carousel', 'mode__command');
  form.classList.add(`mode__${post.type}`);

  currentImages = post.img.map(img => ({
    id: img.id,
    src: img.src ?? img,
    file: null,
    name: img.name || ''
  }));
  renderImagePreviews();
};

//Renderizar lista de posts
const renderPosts = () => {
  const list = document.getElementById('postList');
  list.innerHTML = '<h2>Postagens Criadas (clique para editar)</h2>';

  const flat = Object.values(posts).flat();
  flat.forEach((post, i) => {
    const div = document.createElement('div');
    div.className = 'post-item';
    div.dataset.index = i;
    div.title = 'Clique para editar';

    const meta = document.createElement('div');
    meta.className = 'post__meta';
    meta.innerHTML = `<p style="display:flex;align-items: baseline;gap: 10px;"><strong>ID:</strong> ${post.id} &nbsp; <strong>Tipo:</strong> ${post.type}</P>`;
    div.appendChild(meta);

    const h3 = document.createElement('h3');
    h3.textContent = post.title;
    div.appendChild(h3);

    const desc = document.createElement('p');
    desc.textContent = post.description;
    div.appendChild(desc);

    if (post.img?.length) {
      const thumbDiv = document.createElement('div');
      thumbDiv.className = 'thumbs';
      post.img.forEach(img => {
        const imagem = document.createElement('img');
        imagem.src = img.src ?? img;
        thumbDiv.appendChild(imagem);
      });
      div.appendChild(thumbDiv);
    }

    div.addEventListener('click', () => {
      loadPostInForm(i);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    list.appendChild(div);
  });
};

function getTypeArrayIndex(type) {
  if (type === 'map') return 0;
  if (type === 'carousel') return 1;
  if (type === 'command') return 2;
  return -1;
}

// Envio do formulário (criar ou editar)
document.getElementById('postForm').addEventListener('submit', async e => {
  e.preventDefault();

  const title = document.getElementById('titulo').value.trim();
  const description = document.getElementById('descricao').value.trim();
  const content = document.getElementById('conteudo').value.trim();
  const postType = document.getElementById('postType').value;

  if (!title || !description || !postType) {
    alert('Preencha título, descrição e tipo');
    return;
  }

  // Coletar comandos, itens e botões
  const commands = [...document.getElementById('commandsList').querySelectorAll('input')]
    .map(i => i.value.trim())
    .filter(Boolean);
  const items = [...document.getElementById('itemsList').querySelectorAll('input')]
    .map(i => i.value.trim())
    .filter(Boolean);

  const btns = [...document.getElementById('btnList').children].map(div => {
    const inputs = div.querySelectorAll('input');
    return {
      texto: inputs[0]?.value.trim() || '',
      link: inputs[1]?.value.trim() || '',
      externo: inputs[2]?.checked || false
    };
  }).filter(b => b.texto && b.link);

  // Montar objeto do post
  const newPost = {
    id: currentEditId ?? generateId(),
    title,
    description,
    content,
    type: postType,
    code: commands,
    list: items,
    btn: btns,
    link: {
      download: document.getElementById('linkDownload').value.trim(),
      video: document.getElementById('linkVideo').value.trim()
    },
    img: currentImages.map(img => ({
      id: img.id,
      src: img.src,
      name: img.name
    }))
  };

  // Atualizar posts locais
  const typeIndex = getTypeArrayIndex(postType);

  // Se editando, remover do array antigo se mudou o tipo
  if (currentEditIndex !== null) {
    const flat = Object.values(posts).flat();
    const oldPost = flat[currentEditIndex];
    if (oldPost.type !== postType) {
      // Remove do array antigo
      const oldTypeIndex = getTypeArrayIndex(oldPost.type);
      posts[oldTypeIndex] = posts[oldTypeIndex].filter(p => p.id !== oldPost.id);
      // Adiciona no novo tipo
      posts[typeIndex].push(newPost);
    } else {
      // Apenas substitui no mesmo array
      posts[typeIndex] = posts[typeIndex].map(p => p.id === newPost.id ? newPost : p);
    }
  } else {
    // Adicionar novo post
    posts[typeIndex].push(newPost);
  }

  // Salvar no localStorage
  localStorage.setItem('map', JSON.stringify(posts[0]));
  localStorage.setItem('carousel', JSON.stringify(posts[1]));
  localStorage.setItem('command', JSON.stringify(posts[2]));

  renderPosts();
  clearForm();
  alert('Post salvo localmente. Para enviar ao GitHub, clique no botão abaixo.');
});

// Botão para enviar para o GitHub
document.getElementById('uploadBtn').addEventListener('click', async () => {
  const token = prompt('Cole seu token GitHub aqui (com permissões de repo):');
  if (!token) return alert('Token necessário para upload');

  // Montar payload
  const contentToUpload = JSON.stringify({
    maps: posts[0],
    carousel: posts[1],
    commands: posts[2]
  }, null, 2);

  const path = 'data/post.json';

  try {
    // Pegar sha atual do arquivo para atualizar
    const getResponse = await fetch(`https://api.github.com/repos/atmbr/McpeSite/contents/src/${path}`, {
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.v3+json'
      }
    });
    if (!getResponse.ok) {
  const errorDetails = await getResponse.text();
  console.log(`Erro ao obter arquivo: ${getResponse.status} - ${errorDetails}`)
  throw new Error(`Erro ao obter arquivo: ${getResponse.status} - ${errorDetails}`);
}
    if (!getResponse.ok) throw new Error('Não foi possível obter o arquivo do repo');

    const fileData = await getResponse.json();

    // Atualizar arquivo no GitHub
    const updateResponse = await fetch(`https://api.github.com/repos/atmbr/McpeSite/contents/src/${path}`, {
      method: 'PUT',
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: `Atualização automática de posts em ${new Date().toISOString()}`,
        content: btoa(unescape(encodeURIComponent(contentToUpload))),
        sha: fileData.sha,
        branch: 'main'
      })
    });

    if (!updateResponse.ok) {
      const err = await updateResponse.json();
      throw new Error(err.message || 'Erro ao enviar para GitHub');
    }

    alert('Upload para GitHub realizado com sucesso!');
  } catch (error) {
    alert(`Erro: ${error.message}`);
  }
});

// Inicializa renderização
renderPosts();

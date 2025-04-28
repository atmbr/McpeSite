function copiarComando(item) {
    const codigo = item.parentNode.parentNode.querySelector('.card__code');
    navigator.clipboard.writeText(codigo.innerText).then(() => {
      alert("Comando copiado!");
    });
  }
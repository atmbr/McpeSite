
window.copiarComando = function (item) {
  const texto = item.parentNode.parentNode.querySelector('code')?.innerText;
  if (!texto) return alert("Desculpa, aconteceu algum erro!!💔");
  // Tenta usar a API moderna
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(texto).then(() => {
      alert("Comando copiado!\n" + texto);
    }).catch(err => {
      console.error("Erro ao copiar comando:", err);
      fallbackCopyTextToClipboard(texto);
    });
  } else {
    // Fallback
    fallbackCopyTextToClipboard(texto);
  }

  function fallbackCopyTextToClipboard(text) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    try {
        document.execCommand("copy")?alert("Comando copiado!\n" + text):alert("Não foi possível copiar o comando.");
    } catch (err) {
      console.error("Fallback error:", err);
      alert("Erro ao copiar.");
    }

    document.body.removeChild(textarea);
  }
};

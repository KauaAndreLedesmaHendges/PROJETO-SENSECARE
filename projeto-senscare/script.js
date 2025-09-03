function enviaFormulario() {
  const nome = document.getElementById("nome").value 
  const dataNascimento = document.getElementById("data-nascimento") ? document.getElementById("data-nascimento").value : ""
  const email = document.getElementById("email").value
  const cpf = document.getElementById("cpf").value
  const tipoDeficiencia = document.getElementById("deficiencia").value
  const resultado = document.getElementById("resposta")

  const idade = calcularIdade(dataNascimento)

  let responsavel = null;
  if (idade < 18) {
    const nomeResp = document.getElementById("nome-responsavel").value
    const idadeResp = document.getElementById("idade-responsavel").value
    const cpfResp = document.getElementById("cpf-responsavel").value
    const emailResp = document.getElementById("email-responsavel").value
    if (
      !nomeResp ||
      !idadeResp ||
      idadeResp < 18 ||
      !cpfResp ||
      cpfResp.length !== 11 ||
      !emailResp.includes('@') ||
      !emailResp.includes('.com')
    ) {
      resultado.style.color = "#d32f2f"
      resultado.innerHTML = "Preencha corretamente os dados do responsável!"
      return;
    }
    responsavel = {
      nome: nomeResp,
      idade: idadeResp,
      cpf: cpfResp,
      email: emailResp
    };
  }

  if (nome === "") {
    resultado.style.color = "#d32f2f"
    resultado.innerHTML = "Nome incorreto"
  } else if (!dataNascimento) {
    resultado.style.color = "#d32f2f"
    resultado.innerHTML = "Data de nascimento obrigatória"
  } else if (!email.includes('@') || !email.includes(".com")) {
    resultado.style.color = "#d32f2f"
    resultado.innerHTML = "Email inválido"
  } else if (cpf.length !== 11) {
    resultado.style.color = "#d32f2f"
    resultado.innerHTML = "CPF deve ter 11 dígitos"
  } else {
    const novoUsuario = { nome, dataNascimento, email, cpf, responsavel, tipoDeficiencia }
    const usuariosSalvos = JSON.parse(localStorage.getItem("usuarios")) || []
    usuariosSalvos.push(novoUsuario)
    localStorage.setItem("usuarios", JSON.stringify(usuariosSalvos))
    resultado.style.color = "#2e7d32" 
    resultado.innerHTML = "Cadastro efetuado com sucesso!"
    mostrarInfoEnviada(novoUsuario)
  }
}

function mostrarInfoEnviada(usuario) {
  const infoDiv = document.getElementById("info-enviada")
  let html = `<h3>Informações enviadas:</h3>
    <ul>
      <li><b>Nome:</b> ${usuario.nome}</li>
      <li><b>Data de nascimento:</b> ${usuario.dataNascimento}</li>
      <li><b>Email:</b> ${usuario.email}</li>
      <li><b>CPF:</b> ${usuario.cpf}</li>
      <li><b>Tipo de deficiência:</b> ${usuario.tipoDeficiencia}</li>`
  if (usuario.responsavel) {
    html += `
      <li><b>Nome do responsável:</b> ${usuario.responsavel.nome}</li>
      <li><b>Idade do responsável:</b> ${usuario.responsavel.idade}</li>
      <li><b>CPF do responsável:</b> ${usuario.responsavel.cpf}</li>
      <li><b>Email do responsável:</b> ${usuario.responsavel.email}</li>`
  }
  html += `</ul>`
  infoDiv.innerHTML = html
}

function fazerLogin() {
  const email = document.getElementById("login-email").value
  const resposta = document.getElementById("resposta-login")
  const usuariosSalvos = JSON.parse(localStorage.getItem("usuarios")) || []

  const usuarioEncontrado = usuariosSalvos.find(
    user => user.email === email
  );

  if (usuarioEncontrado) {
    resposta.style.color = "#2e7d32"
    resposta.innerHTML = "✅ Login efetuado com sucesso!"
    console.log("Usuário logado:", usuarioEncontrado)
  } else {
    resposta.style.color = "#d32f2f"
    resposta.innerHTML = "❌ E-mail não encontrado."
  }
}

function mostrarLogin() {
  document.getElementById("cadastro-section").style.display = "none"
  document.getElementById("login-section").style.display = "block"
}

function mostrarCadastro() {
  document.getElementById("login-section").style.display = "none"
  document.getElementById("cadastro-section").style.display = "block"
}

function calcularIdade(dataNascimento) {
  if (!dataNascimento) return 0
  const nascimento = new Date(dataNascimento)
  const hoje = new Date()
  let idade = hoje.getFullYear() - nascimento.getFullYear()
  const mes = hoje.getMonth() - nascimento.getMonth()
  if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
    idade--
  }
  return idade
}

function verificarIdade() {
  const dataNascimento = document.getElementById("data-nascimento").value
  const respostaIdade = document.getElementById("resposta-idade")
  const responsavelSection = document.getElementById("responsavel-section")
  const idade = calcularIdade(dataNascimento)

  document.querySelectorAll('.div-main input, .div-main select').forEach(el => {
    el.style.background = ""
  })

  if (!dataNascimento) {
    respostaIdade.innerHTML = ""
    responsavelSection.style.display = "none"
    return;
  }

  respostaIdade.innerHTML = `Você tem ${idade} anos.`
  if (idade < 18) {
    respostaIdade.innerHTML += " Você é menor de idade."
    responsavelSection.style.display = "block"
  } else {
    respostaIdade.innerHTML += " Você é maior de idade."
    responsavelSection.style.display = "none"
  }
  if (idade >= 60) {
    document.querySelectorAll('.div-main input, .div-main select').forEach(el => {
      el.style.background = "#fff9c4"
    })
  }
}

function enviarFormularioDeficiencia() {
  const tipoDeficiencia = document.getElementById("deficiencia").value
  const resultado = document.getElementById("resposta-deficiencia")

  if (tipoDeficiencia === "") {
    resultado.innerHTML = "Selecione o tipo de deficiência"
  } else {
    resultado.innerHTML = `Tipo de deficiência selecionado: ${tipoDeficiencia}`
    console.log("Tipo de deficiência:", tipoDeficiencia)
    const usuariosSalvos = JSON.parse(localStorage.getItem("usuarios")) || []
    usuariosSalvos.push(novoUsuario)

}
}
  { { localStorage.setItem("usuarios", JSON.stringify(usuariosSalvos))
    resultado.innerHTML = "Cadastro efetuado com sucesso!"
    mostrarInfoEnviada(novoUsuario)
  }
}
  
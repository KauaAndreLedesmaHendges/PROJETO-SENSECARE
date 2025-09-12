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

function mostrarOutraDeficiencia() {
  const select = document.getElementById("deficiencia")
  const outra = document.getElementById("outra-deficiencia")
  outra.style.display = select.value === "outra" ? "block" : "none"
}

function verificarIdade() {
  const dataNascimento = document.getElementById("data-nascimento").value
  const sexo = document.getElementById("sexo") ? document.getElementById("sexo").value : ""
  const respostaIdade = document.getElementById("resposta-idade")
  const responsavelSection = document.getElementById("responsavel-section")
  const gestanteSection = document.getElementById("gestante-section")
  const idade = calcularIdade(dataNascimento)
  respostaIdade.innerHTML = dataNascimento ? `Você tem ${idade} anos.` : ""
  responsavelSection.style.display = idade > 0 && idade < 18 ? "block" : "none"

  
  if (sexo === "feminino" && idade >= 10 && idade < 60) {
    gestanteSection.style.display = "block"
  } else {
    gestanteSection.style.display = "none"
    document.getElementById("gestante").value = ""
    document.getElementById("info-gestante").style.display = "none"
  }
}

function mostrarInfoGestante() {
  const gestante = document.getElementById("gestante").value
  document.getElementById("info-gestante").style.display = gestante === "sim" ? "block" : "none"
}

function enviaFormulario() {
  const nome = document.getElementById("nome").value.trim()
  const sexo = document.getElementById("sexo") ? document.getElementById("sexo").value : ""
  const dataNascimento = document.getElementById("data-nascimento").value
  const email = document.getElementById("email").value.trim()
  const cpf = document.getElementById("cpf").value.trim()
  const senha = document.getElementById("senha").value
  const senhaRepetida = document.getElementById("senha-repetida").value
  const tipoDeficiencia = document.getElementById("deficiencia").value
  const outraDeficiencia = document.getElementById("outra-deficiencia").value.trim()
  const resultado = document.getElementById("resposta")
  const idade = calcularIdade(dataNascimento)

  
  let infoGestante = null
  if (sexo === "feminino" && idade >= 10 && idade < 60) {
    const gestante = document.getElementById("gestante").value
    if (gestante === "sim") {
      const mesesGestacao = document.getElementById("meses-gestacao").value
      const acompanhamentoMedico = document.getElementById("acompanhamento-medico").value
      if (!mesesGestacao || !acompanhamentoMedico) {
        resultado.style.color = "#d32f2f"
        resultado.innerHTML = "Preencha todas as informações de gestante."
        return
      }
      infoGestante = {
        gestante: true,
        mesesGestacao,
        acompanhamentoMedico
      }
    } else if (gestante === "nao") {
      infoGestante = { gestante: false }
    }
  }

  let responsavel = null
  if (idade < 18) {
    const nomeResp = document.getElementById("nome-responsavel").value.trim()
    const idadeResp = parseInt(document.getElementById("idade-responsavel").value)
    const cpfResp = document.getElementById("cpf-responsavel").value.trim()
    const emailResp = document.getElementById("email-responsavel").value.trim()
    if (
      !nomeResp || !idadeResp || idadeResp < 18 ||
      !cpfResp || cpfResp.length !== 11 ||
      !emailResp.includes('@') || !emailResp.includes('.')
    ) {
      resultado.style.color = "#d32f2f"
      resultado.innerHTML = "Preencha corretamente os dados do responsável!"
      return
    }
    responsavel = { nome: nomeResp, idade: idadeResp, cpf: cpfResp, email: emailResp }
  }

  if (!nome) {
    resultado.style.color = "#d32f2f"
    resultado.innerHTML = "Nome obrigatório."
    return
  }
  if (!sexo) {
    resultado.style.color = "#d32f2f"
    resultado.innerHTML = "Selecione o sexo."
    return
  }
  if (!dataNascimento) {
    resultado.style.color = "#d32f2f"
    resultado.innerHTML = "Data de nascimento obrigatória."
    return
  }
  if (!email.includes('@') || !email.includes('.')) {
    resultado.style.color = "#d32f2f"
    resultado.innerHTML = "E-mail inválido."
    return
  }
  if (cpf.length !== 11) {
    resultado.style.color = "#d32f2f"
    resultado.innerHTML = "CPF deve ter 11 dígitos."
    return
  }
  if (!senha || senha !== senhaRepetida ||
      !/[a-z]/.test(senha) || !/[A-Z]/.test(senha) || !/[^A-Za-z0-9]/.test(senha)) {
    resultado.style.color = "#d32f2f"
    resultado.innerHTML = "Senha inválida (mín. 1 minúscula, 1 maiúscula, 1 caractere especial e igual à repetida)."
    return
  }
  let defFinal = tipoDeficiencia
  if (tipoDeficiencia === "outra") {
    if (!outraDeficiencia) {
      resultado.style.color = "#d32f2f"
      resultado.innerHTML = "Especifique a deficiência."
      return
    }
    defFinal = outraDeficiencia
  }

  const novoUsuario = { nome, sexo, dataNascimento, email, cpf, senha, responsavel, tipoDeficiencia: defFinal, infoGestante }
  const usuariosSalvos = JSON.parse(localStorage.getItem("usuarios")) || []
  if (usuariosSalvos.some(u => u.email === email)) {
    resultado.style.color = "#d32f2f"
    resultado.innerHTML = "E-mail já cadastrado."
    return
  }
  usuariosSalvos.push(novoUsuario)
  localStorage.setItem("usuarios", JSON.stringify(usuariosSalvos))
  resultado.style.color = "#2e7d32"
  resultado.innerHTML = "Cadastro efetuado com sucesso!"
  mostrarInfoEnviada(novoUsuario)
}

function mostrarInfoEnviada(usuario) {
  const infoDiv = document.getElementById("info-enviada")
  const idade = calcularIdade(usuario.dataNascimento)
  let html = `<h3>Informações enviadas:</h3>
    <ul>
      <li><b>Nome:</b> ${usuario.nome}</li>
      <li><b>Sexo:</b> ${usuario.sexo}</li>
      <li><b>Data de nascimento:</b> ${usuario.dataNascimento}</li>
      <li><b>Idade:</b> ${idade}</li>
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
  if (usuario.infoGestante && usuario.infoGestante.gestante) {
    html += `
      <li><b>Gestante:</b> Sim</li>
      <li><b>Meses de gestação:</b> ${usuario.infoGestante.mesesGestacao}</li>
      <li><b>Acompanhamento médico:</b> ${usuario.infoGestante.acompanhamentoMedico === "sim" ? "Sim" : "Não"}</li>`
  } else if (usuario.infoGestante && usuario.infoGestante.gestante === false) {
    html += `<li><b>Gestante:</b> Não</li>`
  }
  html += `</ul>`
  infoDiv.innerHTML = html

  
  if (idade >= 60) {
    infoDiv.style.background = "#fffde7"
    infoDiv.style.borderColor = "#ffe082"
  } else {
    infoDiv.style.background = "#e3f2fd"
    infoDiv.style.borderColor = "#3bce7c"
  }
}

function fazerLogin() {
  const email = document.getElementById("login-email").value.trim()
  const senha = document.getElementById("login-senha").value
  const resposta = document.getElementById("resposta-login")
  const usuariosSalvos = JSON.parse(localStorage.getItem("usuarios")) || []
  const usuarioEncontrado = usuariosSalvos.find(user => user.email === email && user.senha === senha)
  if (usuarioEncontrado) {
    resposta.style.color = "#2e7d32" 
    resposta.innerHTML = `✅ Login efetuado com sucesso! Bem-vindo, ${usuarioEncontrado.nome}`
  } else {
    resposta.style.color = "#d32f2f" 
    resposta.innerHTML = "❌ E-mail ou senha inválidos."
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
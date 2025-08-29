function enviaFormulario(){
  const nome = document.getElementById("nome").value
  const email = document.getElementById("email").value
  const cpf = document.getElementById("cpf").value
  const senha = document.getElementById("senha").value
  const senharepetida = document.getElementById("senha-repetida").value
  const resultado = document.getElementById("resposta")

  if(nome === ""){
    resultado.innerHTML = "Nome incorreto"
  } else if(!email.includes('@') || !email.includes(".com")){
    resultado.innerHTML = "Email inválido"
  } else if(cpf.length !== 11){
    resultado.innerHTML = "CPF deve ter 11 dígitos"
  } else if(
    senha === "" ||
    senha !== senharepetida ||
    !/[a-z]/.test(senha) ||   
    !/[A-Z]/.test(senha) ||  
    !/[^A-Za-z0-9]/.test(senha)
  ) {
    resultado.innerHTML = "Senha incorreta (deve conter letras minúsculas, maiúsculas e um caractere especial)"
  } else {
    const novoUsuario = { nome, email, cpf, senha }

    const usuariosSalvos = JSON.parse(localStorage.getItem("usuarios")) || []
    usuariosSalvos.push(novoUsuario)
    localStorage.setItem("usuarios", JSON.stringify(usuariosSalvos))

    resultado.innerHTML = "Formulário enviado!"
    console.log("Usuários cadastrados:", usuariosSalvos)
  }
}

function fazerLogin() {
  const email = document.getElementById("login-email").value
  const senha = document.getElementById("login-senha").value
  const resposta = document.getElementById("resposta-login")

  const usuariosSalvos = JSON.parse(localStorage.getItem("usuarios")) || [];
  const usuarioEncontrado = usuariosSalvos.find(user => user.email === email && user.senha === senha)

  if (usuarioEncontrado) {
    resposta.innerHTML = `Login bem-sucedido! Bem-vindo, ${usuarioEncontrado.nome}`
    console.log("Usuário logado:", usuarioEncontrado)
  } else {
    resposta.innerHTML = "E-mail ou senha inválidos."
  }
}

function mostrarLogin() {
  document.getElementById("cadastro-section").style.display = "none"
  document.getElementById("login-section").style.display = "block"
}

function mostrarCadastro() {
  document.getElementById("cadastro-section").style.display = "block"
  document.getElementById("login-section").style.display = "none"
}
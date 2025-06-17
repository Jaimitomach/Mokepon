// Objeto que contiene las rutas de imagen para cada mascota
const mascotas = {
  hipodoge: "img/hipodoge.png",
  capipepo: "img/capipepo.png",
  ratigueya: "img/ratigueya.png"
};

let ataqueJugador = ""
let ataqueEnemigo = ""
let vidasJugador = 3
let vidasEnemigo = 3

// Inicia el juego al cargar la página
window.addEventListener("load", iniciarJuego)

function iniciarJuego() {
  // Agrega evento a los inputs para mostrar vista previa al seleccionar mascota
  const inputs = document.querySelectorAll('input[name="mascota"]')
  inputs.forEach(input => {
    input.addEventListener("change", mostrarVistaPrevia)
  })

  // Agrega eventos a los botones
  document.getElementById("boton-mascota").addEventListener("click", seleccionarMascotaJugador)
  document.getElementById("boton-fuego").addEventListener("click", () => seleccionarAtaque("FUEGO"))
  document.getElementById("boton-agua").addEventListener("click", () => seleccionarAtaque("AGUA"))
  document.getElementById("boton-tierra").addEventListener("click", () => seleccionarAtaque("TIERRA"))
  document.getElementById("boton-reiniciar").addEventListener("click", () => location.reload())
}

function mostrarVistaPrevia() {
  const seleccion = document.querySelector('input[name="mascota"]:checked')
  if (!seleccion) return

  const nombre = seleccion.id
  const previewImg = document.getElementById("preview-img")
  const previewNombre = document.getElementById("preview-nombre")

  // Actualiza vista previa con imagen y nombre de la mascota
  previewImg.src = mascotas[nombre]
  previewNombre.textContent = capitalizar(nombre)
  document.getElementById("vista-previa").classList.remove("oculto")
}

function seleccionarMascotaJugador() {
  const seleccion = document.querySelector('input[name="mascota"]:checked')
  if (!seleccion) return alert("Selecciona una mascota")

  const nombre = seleccion.id
  document.getElementById("mascota-jugador").textContent = capitalizar(nombre)
  document.getElementById("img-jugador").src = mascotas[nombre]

  // Asigna mascota al enemigo de forma aleatoria
  seleccionarMascotaEnemigo()

  // Muestra la sección de ataques y oculta selección
  document.getElementById("seleccionar-mascota").classList.add("oculto")
  document.getElementById("seleccionar-ataque").classList.remove("oculto")
}

function seleccionarMascotaEnemigo() {
  const nombres = Object.keys(mascotas)
  const aleatorio = nombres[Math.floor(Math.random() * nombres.length)]

  document.getElementById("mascota-enemigo").textContent = capitalizar(aleatorio)
  document.getElementById("img-enemigo").src = mascotas[aleatorio]
}

function seleccionarAtaque(tipo) {
  ataqueJugador = tipo
  ataqueEnemigoAleatorio()
  combate()
}

function ataqueEnemigoAleatorio() {
  const ataques = ["FUEGO", "AGUA", "TIERRA"]
  ataqueEnemigo = ataques[Math.floor(Math.random() * ataques.length)]
}

function combate() {
  let resultado = ""
  if (ataqueJugador === ataqueEnemigo) {
    resultado = "Empate"
  } else if (
    (ataqueJugador === "FUEGO" && ataqueEnemigo === "TIERRA") ||
    (ataqueJugador === "AGUA" && ataqueEnemigo === "FUEGO") ||
    (ataqueJugador === "TIERRA" && ataqueEnemigo === "AGUA")
  ) {
    resultado = "Ganaste"
    vidasEnemigo--
  } else {
    resultado = "Perdiste"
    vidasJugador--
  }

  actualizarVidas()
  mostrarMensaje(`Tu ataque: ${ataqueJugador} - Enemigo: ${ataqueEnemigo} - ${resultado}`)

  if (vidasJugador === 0 || vidasEnemigo === 0) {
    finalizarJuego()
  }
}

function actualizarVidas() {
  document.getElementById("vidas-jugador").textContent = vidasJugador
  document.getElementById("vidas-enemigo").textContent = vidasEnemigo
  document.getElementById("barra-vida-jugador").style.width = `${vidasJugador * 20}px`
  document.getElementById("barra-vida-enemigo").style.width = `${vidasEnemigo * 20}px`
}

function mostrarMensaje(texto) {
  const seccionMensajes = document.getElementById("mensajes")
  seccionMensajes.innerHTML = "" // Limpia mensajes anteriores
  const p = document.createElement("p")
  p.textContent = texto
  seccionMensajes.appendChild(p)
}

function finalizarJuego() {
  const mensajes = document.getElementById("mensajes")

  // Mostrar mensaje de victoria o derrota
  const mensajeFinal = document.createElement("h2")
  mensajeFinal.textContent = vidasJugador > 0 ? "🎉 GANASTE EL JUEGO 🎉" : "😔 PERDISTE EL JUEGO 😔"
  mensajeFinal.classList.add(vidasJugador > 0 ? "animacion-ganar" : "animacion-perder")
  mensajes.appendChild(mensajeFinal)

  // Mostrar mensaje de reinicio con cuenta regresiva
  const mensajeReinicio = document.createElement("p")
  let contador = 4
  mensajeReinicio.textContent = `Reiniciando en ${contador} segundos...`
  mensajes.appendChild(mensajeReinicio)

  const intervalo = setInterval(() => {
    contador--
    if (contador > 0) {
      mensajeReinicio.textContent = `Reiniciando en ${contador} segundos...`
    }
  }, 1000)

  setTimeout(() => {
    clearInterval(intervalo)
    location.reload()
  }, 4000)


}

// Capitaliza el primer carácter de un string
function capitalizar(texto) {
  return texto.charAt(0).toUpperCase() + texto.slice(1)
}

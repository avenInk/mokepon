
let ataqueJugador = []// Aquí se guarda el nombre del ataque que haya seleccionado el jugador.
let ataqueEnemigo = []
let ataquesMokeponEnemigo
let resultado // guarda el resultado de los ataques entre enemigo y jugador.

let mokeponesEnemigos = []
let enemigoId = null

let opcionDeMokepones

let hipodoge_id 
let capipepo_id 
let ratigueya_id

let mascota_enemigo

let nombre_mascota_jugador

let ataques_mokepon  //guarda la estructura de nuestros botones de ataques

let boton_fuego 
let boton_agua 
let boton_tierra

let botones = [] //guarda los botones que se usarán para los ataques del mokepon seleccionado

let indexAtaqueEnemigo 
let indexAtaqueJugador 

let victoriasJugador = 0
let victoriasEnemigo = 0

const contenedorTarjetas = document.getElementById("contenedor-tarjetas")
const boton_seleccion = document.getElementById("boton-seleccion-mascotas")
const boton_reiniciar = document.getElementById("boton-reiniciar")
const Spanvida_jugador = document.getElementById("vida-jugador")
const Spanvida_enemigo = document.getElementById("vida-enemigo")
const ataques_del_jugador = document.getElementById("ataques-del-jugador")
const ataques_del_enemigo = document.getElementById("ataques-del-enemigo")
const mascota_display = document.getElementById("Mascota")
const resultados = document.getElementById("resultado")
const ataque = document.getElementById("Ataque")
const mascota_jugador = document.getElementById("mascota_jugador")
const mascota_enemigo_get = document.getElementById("mascota_enemigo")
const contenedorAtaques = document.getElementById("contenedor-ataques")

const sectionVerMapa = document.getElementById("ver-mapa")
const mapa = document.getElementById("mapa")

let lienzo = mapa.getContext("2d")
let intervalo 

let background = new Image()
background.src = "./sprites/mokemap.webp"

let mascotaDeljugadorObeto

let alturaQueBuscamos
let anchoDelMapa = window.innerWidth - 20

const anchoMaximoDelMapa = 550

if (anchoDelMapa > anchoMaximoDelMapa) {
    anchoDelMapa = anchoMaximoDelMapa - 20
}

alturaQueBuscamos = anchoDelMapa*600/800

mapa.width = anchoDelMapa
mapa.height = alturaQueBuscamos

class Mokepon{
    constructor(nombre, foto, vida, fotoMapa, id=null) {
        this.nombre = nombre
        this.foto = foto
        this.vida = vida
        this.ataques = []
        this.alto = 80
        this.ancho = 80
        this.x = aleatorio(0,mapa.width - this.ancho)
        this.y = aleatorio(0, mapa.height - this.alto)
        this.mapaFoto = new Image()
        this.mapaFoto.src = fotoMapa
        this.velocidadY = 0
        this.velocidadX = 0
        this.id = id
    }

    pintarMokepon(){    
        lienzo.drawImage(
            this.mapaFoto,
            this.x,
            this.y,
            this.alto,
            this.ancho)
    }
}

let mokepones = []

let hipodoge = new Mokepon ("Hipodoge", "./sprites/complete-animal-gato-cachorro-@2x-.png", 5, "./sprites/hipodoge.png")

let capipepo = new Mokepon ("Capipepo", "./sprites/cyber-gatunos-min.png", 5, "./sprites/capipepo.webp")

let ratigueya = new Mokepon ("Ratigueya", "./sprites/noesterilizado_adulto.png", 5, "./sprites/ratigueya.png") 


let jugadorId = null

const HIPODOGE_ATAQEUS = [
        {nombre: "💧", id: "boton-agua"},
    {nombre: "💧", id: "boton-agua"},
    {nombre: "💧", id: "boton-agua"},
    {nombre: "🔥", id: "boton-fuego"},
    {nombre: "🌍", id: "boton-tierra"}
]

const CAPIPEPO_ATAQUES = [
    {nombre: "🌍", id: "boton-tierra"},
    {nombre: "🌍", id: "boton-tierra"},
    {nombre: "🌍", id: "boton-tierra"},
    {nombre: "💧", id: "boton-agua"},
    {nombre: "🔥", id: "boton-fuego"}
]

const RATIGUEYA_ATAQUES = [
    {nombre: "🔥", id: "boton-fuego"},
    {nombre: "🔥", id: "boton-fuego"},
    {nombre: "🔥", id: "boton-fuego"},
    {nombre: "💧", id: "boton-agua"},
    {nombre: "🌍", id: "boton-tierra"}
]

hipodoge.ataques.push(...HIPODOGE_ATAQEUS)

capipepo.ataques.push(...CAPIPEPO_ATAQUES)

ratigueya.ataques.push(...RATIGUEYA_ATAQUES)


mokepones.push(hipodoge, capipepo, ratigueya)



function iniciarJuego(){

    mokepones.forEach((mokepon)=> {
        opcionDeMokepones = `
        <input type="radio" name="mascotas" id=${mokepon.nombre} /> 
        <label for=${mokepon.nombre} class="tarjeta-de-mokepon">
            <p>${mokepon.nombre}</p>
            <img src=${mokepon.foto} class= "img-other" alt=${mokepon.nombre}>
        </label>
        `
        contenedorTarjetas.innerHTML+=opcionDeMokepones
    })
    hipodoge_id = document.getElementById("Hipodoge")
    capipepo_id = document.getElementById("Capipepo")
    ratigueya_id = document.getElementById("Ratigueya")


    boton_seleccion.addEventListener("click", seleccionalMascotaJugador)
    boton_reiniciar.addEventListener("click", reiniciar)
    ataque.style.display = "none"

    sectionVerMapa.style.display = "none"
    unirseAlJuego()
}

function unirseAlJuego(){
    fetch("http://192.168.100.5:8080/unirse")
        .then(function(res){
            console.log(res)
            if (res.ok){ // if (res.ok == true){}
                res.text() //res.text también es una función promesa por lo que llevá then
                    .then(function(respuesta){
                    //el then manda como parametro de function la repuesta de res.text
                        console.log(respuesta) //"respuesta" es el resultado de res.text
                        jugadorId = respuesta
                    })
            }
        })
}

function reiniciar(){
    location.reload()
}


function indexAmbosOponentes(selector){
    indexAtaqueJugador = ataqueJugador[selector]
    indexAtaqueEnemigo = ataqueEnemigo[selector]
}


function combate(){
    for (let i = 0; i < ataqueJugador.length ; i++){
        if (ataqueJugador[i] == ataqueEnemigo[i]){
            resultado = "EMPATE"
        }else if (ataqueJugador[i] == "FUEGO" && ataqueEnemigo[i] == "TIERRA"){
            resultado = "Ganaste"
            victoriasJugador++
            Spanvida_jugador.innerHTML = victoriasJugador
        }else if (ataqueJugador[i] == "AGUA" && ataqueEnemigo[i] == "FUEGO"){
            resultado = "Ganaste"
            victoriasJugador++
            Spanvida_jugador.innerHTML = victoriasJugador
        }else if (ataqueJugador[i] == "TIERRA" && ataqueEnemigo[i] == "AGUA"){
            resultado = "Ganaste"
            victoriasJugador++
            Spanvida_jugador.innerHTML = victoriasJugador
        }else {
            resultado = "Perdiste"
            victoriasEnemigo++
            Spanvida_enemigo.innerHTML = victoriasEnemigo
        }
    indexAmbosOponentes(i)
    crear_mensaje()
    }
    revisarVidas() //Se ejecuta al final del bucle e imprime si ganamos o perdimos. 
}

function revisarVidas(){
    if (victoriasEnemigo == victoriasJugador){
        resultados.innerHTML = "empate"
    }else if (victoriasEnemigo > victoriasJugador){
        resultados.innerHTML = "perdiste"
    }else {
        resultados.innerHTML = "ganaste"
    }
}


function crear_mensaje(){

    let ataqueJugador1 = document.createElement("p")
    let ataqueEnemigo1 = document.createElement("p")

    resultados.innerHTML = resultado
    ataqueEnemigo1.innerHTML = indexAtaqueEnemigo
    ataqueJugador1.innerHTML = indexAtaqueJugador
    ataques_del_jugador.appendChild(ataqueJugador1)
    ataques_del_enemigo.appendChild(ataqueEnemigo1)
    
}

function mostrar_elementos(){

    sectionVerMapa.style.display = "flex"
    

    iniciarMapa()


    boton_seleccion.disabled = true // quita el boton de seleccionar.

    //aquí ocultamos la parte anterior
    
    mascota_display.style.display = "none"
    
}



function seleccionalMascotaJugador(){   //función para comprobar el estado de los botones
    
    let seleccion = ""

    if (hipodoge_id.checked==true){
        seleccion=hipodoge_id.id
        
    }else if (capipepo_id.checked==true){
        seleccion=capipepo_id.id

    }else  if (ratigueya_id.checked==true){
        seleccion=ratigueya_id.id
        
    }else {
        alert("No has seleccionado alguna opción elegible, intentalo nuevamnete.")
    }

    seleccionarMokepon(seleccion)

    nombre_mascota_jugador = seleccion
    mascota_jugador.innerHTML=(seleccion+" ")  //Esta parte del codigo cambia el nombre de la mascota seleccionada en la parte de abajo del html
    extraerAtaques(nombre_mascota_jugador)
    mostrar_elementos()
}

function seleccionarMokepon(mascotaJugador){ //mandamos el id y el nombre del mokepon con un fetch POST
    fetch(`http://192.168.100.5:8080/mokepon/${jugadorId}`, {//fetch por defecto es GET
        method:"post", //cambiamos de GET a POST
        headers: {
            "Content-Type": "application/json" //definimos el tipo de contenido como json
        },
        body: JSON.stringify({ //tiene que ser una cadena de texto, con esto lo transformamos a string
            mokepon: mascotaJugador 
        })//body es el contenido (en string) del fetch POST
    })
} 

function extraerAtaques(mascota){
    let ataques
    for (let i = 0; i < mokepones.length; i++) {
        if (mokepones[i].nombre == mascota){
            ataques = mokepones[i].ataques
        }

    }
    mostrarAtaques(ataques)
}

function mostrarAtaques(ataques){
    
    
    ataques.forEach( (ataques) => {
        ataques_mokepon = `
        <button id=${ataques.id} class="ataques-boton BAtaque"> ${ataques.nombre}</button>
        `
        contenedorAtaques.innerHTML+=ataques_mokepon
    })
    
    botones = document.querySelectorAll(".BAtaque") 


}

function secuenciaAtaques(){
    botones.forEach((boton) =>{
    boton.addEventListener("click", (e)=> {
        if (e.target.textContent == " 🔥"){
            ataqueJugador.push("FUEGO")
            boton.style.background = "#112f58"
        }else if (e.target.textContent == " 💧"){
            ataqueJugador.push("AGUA")
            boton.style.background = "#112f58"
        }else {
            ataqueJugador.push("TIERRA")
            boton.style.background = "#112f58"
        }
        boton.disabled = true //para deshabilitar el boton que ya ha sido seleccionado. 
        console.log(ataqueJugador)
        if (ataqueJugador.length == 5){//cada boton que oprimamos se va a ejecutar esto. 
            enviarAtaques()
        } 
    })
    })
}

function enviarAtaques(){
    fetch(`http://192.168.100.5:8080/mokepon/${jugadorId}/ataques`, {
        method: "post",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify({
            ataques: ataqueJugador
        })
    })
    intervalo = setInterval (obtenerAtaques, 16)//se ejecutará constantemente aunque no esté corriendo la función enviarAtaques
}

function obtenerAtaques(){
    fetch(`http://192.168.100.5:8080/mokepon/${enemigoId}/ataques`).then((res)=>{
        if (res.ok){
            res.json().then(function({ataques}){
                if (ataques.length == 5){
                    ataqueEnemigo = ataques
                    combate()
                    clearInterval(intervalo)
                }
            })
        }
    })
}

function ataqueAleatorioEnemigo(){
    let ataqueAleatorio = aleatorio(0,ataquesMokeponEnemigo.length-1)

    if (ataqueAleatorio == 0 || ataqueAleatorio == 1){
        ataqueEnemigo.push("FUEGO")
    }else if (ataqueAleatorio == 3 || ataqueAleatorio == 4){
        ataqueEnemigo.push("AGUA")
    }else {
        ataqueEnemigo.push("TIERRA")
    }
    console.log(ataqueEnemigo)
    // combate()
    iniciarPelea()
}

function iniciarPelea(){
    if (ataqueEnemigo.length == 5){
        combate()
    }
}


function seleccionarMascotaEnemigo(enemigo){    
    mascota_enemigo = enemigo.nombre
    ataquesMokeponEnemigo = enemigo.ataques
    mascota_enemigo_get.innerHTML=(mascota_enemigo)
    secuenciaAtaques()

}
function aleatorio(min, max){
    return Math.floor(Math.random()* (max-min+1) + min)
}

let iterador = 0
function pintarCanvas(){
    mascotaDeljugadorObeto.x += mascotaDeljugadorObeto.velocidadX
    mascotaDeljugadorObeto.y += mascotaDeljugadorObeto.velocidadY
    lienzo.clearRect (0,0, mapa.width, mapa.height)
    lienzo.drawImage(
        background,
        0,
        0,
        mapa.width,
        mapa.height
    )
    enviarPosicion(mascotaDeljugadorObeto.x, mascotaDeljugadorObeto.y)


    mascotaDeljugadorObeto.pintarMokepon()
    
    mokeponesEnemigos.forEach((mokepon) => {
        iterador += 1
        mokepon.pintarMokepon()
        if (iterador > 2){
            revisarColisión(mokepon)
        }
    })


}

function enviarPosicion(x,y){
    fetch(`http://192.168.100.5:8080/mokepon/${jugadorId}/posicion`, {
        method : "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
                x,
                y
        })
    }).then(function(res){
        if (res.ok){
            res.json() //function para leer el json de res  (función promesa)
                .then(function({enemigos}){
                    console.log(enemigos)
                    
                    mokeponesEnemigos = enemigos.map(function(enemigo){
                        let mokeponEnemigo = null
                        const mokeponNombre = enemigo.mokepon.nombre || ""
                        if (mokeponNombre == "Hipodoge"){
                            mokeponEnemigo = new Mokepon ("Hipodoge", "./sprites/complete-animal-gato-cachorro-@2x-.png", 5, "./sprites/hipodoge.png", enemigo.id)
                        }else if (mokeponNombre == "Capipepo"){
                            mokeponEnemigo = new Mokepon ("Capipepo", "./sprites/cyber-gatunos-min.png", 5, "./sprites/capipepo.webp", enemigo.id)
                        }else {
                            mokeponEnemigo = new Mokepon ("Ratigueya", "./sprites/noesterilizado_adulto.png", 5, "./sprites/ratigueya.png", enemigo.id) 
                        }
                        mokeponEnemigo.x = enemigo.x
                        mokeponEnemigo.y = enemigo.y        
                        return mokeponEnemigo
                    })
                    
                })
        }
    })
}

function moverDerecha(){
    mascotaDeljugadorObeto.velocidadX = 5
}
function moverIzquierda(){
    mascotaDeljugadorObeto.velocidadX = -5
}
function moverAbajo(){
    mascotaDeljugadorObeto.velocidadY = 5
}
function moverArriba(){
    mascotaDeljugadorObeto.velocidadY = -5
}                                         

function detenerMovimiento(){
    mascotaDeljugadorObeto.velocidadX = 0
    mascotaDeljugadorObeto.velocidadY = 0
}

function teclaOprimida(event){
    switch (event.key){
        case "ArrowUp":
            moverArriba()
            break
        case "ArrowDown": 
            moverAbajo()
            break
        case "ArrowRight": 
            moverDerecha()
            break
        case "ArrowLeft": 
            moverIzquierda()
            break
        default: 
            break
    }
}

function iniciarMapa(){
    mascotaDeljugadorObeto = obtenerObjetoMascota(nombre_mascota_jugador)


    window.addEventListener("keydown", teclaOprimida)
    window.addEventListener("keyup", detenerMovimiento)
    intervalo = setInterval (pintarCanvas, 16)
}


function obtenerObjetoMascota(){
    for (let i = 0; i < mokepones.length; i++) {
        if (mokepones[i].nombre == nombre_mascota_jugador){
            return mokepones[i]
        }
    }
}

function revisarColisión(enemigo){
    const arribaEnemigo = enemigo.y
    const abajoEnemigo = enemigo.y + enemigo.alto
    const derechaEnemigo = enemigo.x + enemigo.ancho
    const izquierdaEnemigo = enemigo.x

    const arribaMascota = mascotaDeljugadorObeto.y
    const abajoMascota = mascotaDeljugadorObeto.y + mascotaDeljugadorObeto.alto
    const derechaMascota = mascotaDeljugadorObeto.x + mascotaDeljugadorObeto.ancho
    const izquierdaMascota = mascotaDeljugadorObeto.x

    if (
        abajoMascota < arribaEnemigo || 
        arribaMascota > abajoEnemigo ||
        derechaMascota < izquierdaEnemigo ||
        izquierdaMascota > derechaEnemigo
    ){
        return; 
    }else{
        detenerMovimiento()
        clearInterval(intervalo)
        alert("se inicia un ataque")
        enemigoId = enemigo.id
        sectionVerMapa.style.display = "none"
        ataque.style.display = "flex"
        seleccionarMascotaEnemigo(enemigo)
    }
}

window.addEventListener("load", iniciarJuego)
const cors = require("cors")
const express = require("express") 
// usamos "express" como nombre de la librería "express" importada con require 

const app = express() //le pasamos todos los metodos de express al objeto "app"

app.use(express.static('public'))
app.use(cors())
app.use(express.json()) //habilita recibir POST con json.

let jugadores = []

class Jugador {
    constructor(id){
        this.id = id
    }

    asignarMokepon(mokepon){
        this.mokepon = mokepon
    }

    actualizarPosicion (x, y){
        this.x = x
        this.y = y 
    }
    asignarAtaques(ataques){
        this.ataques = ataques
    }
}

class Mokepon{
    constructor(nombre){
        this.nombre = nombre
    }
}

app.get("/unirse", (req, res) => {
    const id = `${Math.random()}` //temprate para que los numeros sean cadenas de texto

    const jugador = new Jugador(id)

    jugadores.push(jugador)

    res.setHeader("Access-Control-Allow-Origin", '*')

    res.send(id)
})

app.post("/mokepon/:jugadorId", (req, res) => {
    const jugadorId = req.params.jugadorId || ""
    const nombre = req.body.mokepon || ""
    const mokepon = new Mokepon(nombre)
    const jugadorIndex = (jugadores.findIndex((jugador) => jugadorId == jugador.id))
    if (jugadorIndex>=0){
        jugadores[jugadorIndex].asignarMokepon(mokepon)
    }
    console.log(jugadores)
    console.log(jugadorId)
    res.end() // al parecer siempre tiene que haber una respuesta (res) por eso en esta finalizamos sin respuesta. 
})

app.post("/mokepon/:jugadorId/posicion", (req, res) => {
    const jugadorId = req.params.jugadorId || ""
    const x = req.body.x || 0
    const y = req.body.y || 0
    const jugadorIndex = (jugadores.findIndex((jugador) => jugadorId == jugador.id))
    if (jugadorIndex>=0){
        jugadores[jugadorIndex].actualizarPosicion(x, y)
    }




    const enemigos = jugadores.filter((jugador) => jugador.id !== jugadorId)

    res.send({
        enemigos
    })
})

app.post("/mokepon/:jugadorId/ataques", (req, res) => {
    const jugadorId = req.params.jugadorId || ""
    const ataques = req.body.ataques || []

    const jugadorIndex = (jugadores.findIndex((jugador) => jugadorId == jugador.id))
    if (jugadorIndex>=0){
        jugadores[jugadorIndex].asignarAtaques(ataques)
    }

    res.end() // al parecer siempre tiene que haber una respuesta (res) por eso en esta finalizamos sin respuesta. 
})

app.get("/mokepon/:jugadorId/ataques", (req, res) => {
    const jugadorId = req.params.jugadorId || ""
    const jugador = jugadores.find((jugador) => jugador.id == jugadorId) //para saber si el jugador existe
    res.send({
        ataques: jugador.ataques || []
    })
})

app.listen(8080, ()=> {
    console.log("El servidor está en funcionamiento")
})


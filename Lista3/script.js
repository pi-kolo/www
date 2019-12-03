let canvas = document.querySelector("#canvas")
let ctx = canvas.getContext("2d");  
let image = document.querySelector("img")
let gallery = document.querySelectorAll(".gallery img")

if(screen.orientation.type=="landscape-primary"){
    canvas.width = (screen.width)*0.35
}
if(screen.orientation.type=="portrait-primary"){
    canvas.width = (screen.width)*0.9
}

canvas.height = canvas.width

let canvasWidth = canvas.width
let imgWidth = image.naturalHeight
// console.log(image.width)
let SIZE = 4

let squareWidth = canvasWidth/SIZE

let squares = [[]]
let idToImageSquare = new Map()

class Square {
    constructor(x, y, size){
        this.x = x
        this.y = y
        this.size = squareWidth
        this.id = -1
    }
}

// mapa id squarea na kawałek obrazka? (dwie wspolrzedne wystarcza ) 

function init(){
    console.log(`SIZE: ${SIZE}`)
    ctx.clearRect(0,0,canvasWidth, canvasWidth)
    squares = [[]]
    idToImageSquare.clear()
    console.log(idToImageSquare)
    for(let i=0; i<SIZE; i++ ){
        squares[i] = []
        for(let j=0; j<SIZE; j++){
            squares[i][j]=(new Square(j*canvasWidth/SIZE, i*canvasWidth/SIZE, canvasWidth/SIZE))
            squares[i][j].id = SIZE*i+j
            idToImageSquare.set(SIZE*i+j, SIZE*i+j)
        }
    }
    console.log(idToImageSquare)
    shuffle()
    imgWidth = image.naturalHeight
    let last = getBlank()
    // console.log(`${last}!!`)
    for(let i=0; i<SIZE; i++){
        for(let j=0; j<SIZE; j++){
            ctx.drawImage(image, 
                getXfromId(idToImageSquare.get(squares[i][j].id))*imgWidth/canvasWidth,
                getYfromId(idToImageSquare.get(squares[i][j].id))*imgWidth/canvasWidth, 
                imgWidth/SIZE, 
                imgWidth/SIZE,  
                squares[i][j].x,
                squares[i][j].y, 
                squareWidth,    
                squareWidth)
            ctx.fillStyle="#FFF"
            ctx.fillRect(getXfromId(last), getYfromId(last), squareWidth, squareWidth)
        }
    }
}


function getSquare(event){
    let x = event.offsetX
    let y = event.offsetY

    let i = Math.floor(x/squareWidth)
    let j = Math.floor(y/squareWidth)
    console.log(idToImageSquare.get(squares[j][i].id))
    return (squares[j][i].id)
}

function getXfromId(id){
    return id%SIZE*(canvasWidth/SIZE)
}

function getYfromId(id){
    return Math.floor(id/SIZE)*(canvasWidth/SIZE)
}

function getNeighbours(id){
    let neighbours = []
    if (Math.floor((id+1)/SIZE)===Math.floor(id/SIZE)) {
        neighbours.push(id+1)   
    }
    if (Math.floor((id-1)/SIZE)===Math.floor(id/SIZE)) {
        neighbours.push(id-1)
    }
    if (Math.floor((id+SIZE))<SIZE*SIZE) {
        neighbours.push((id+SIZE))
    }
    if (Math.floor((id-SIZE))>=0) {
        neighbours.push((id-SIZE))
    }
    return neighbours
}

function doMove(event){
    //id of square
    let id = getSquare(event)
    console.log(`Kliknąłem na ${id}, które przedstawia ${idToImageSquare.get(id)}`)
    
    //list of neighbours of square
    let neighbours = getNeighbours(id)

    //what neighbours show
    let neighboursFragments = neighbours.map(x=>idToImageSquare.get(x))
    
    //if one of neighbour is blank
    if(neighboursFragments.includes(SIZE*SIZE-1)){
        //id of blank square
        let id2 = neighbours[neighboursFragments.indexOf(SIZE*SIZE-1)]

        let imgFragment1 = idToImageSquare.get(id)

        idToImageSquare.set(id, SIZE*SIZE-1)
        idToImageSquare.set(id2, imgFragment1)

        ctx.drawImage(image, 
            getXfromId(imgFragment1)*imgWidth/canvasWidth,
            getYfromId(imgFragment1)*imgWidth/canvasWidth, 
            imgWidth/SIZE, 
            imgWidth/SIZE, 
            getXfromId(id2),
            getYfromId(id2), 
            squareWidth, 
            squareWidth)

        ctx.fillRect(getXfromId(id), getYfromId(id), squareWidth,squareWidth)
    }
    if(hasWon()){
        alert("GRATKI!")
    }
}

canvas.addEventListener('click', e=>doMove(e))

function shuffle(){
    let neighbours, toSwapId, atSwap
    let blank = SIZE*SIZE-1
    console.log(`SIZEe: ${SIZE}`)
    for(let i=0; i<3**SIZE; i++){
        neighbours = getNeighbours(blank)
        // console.log(neighbours)
        toSwapId = neighbours[Math.floor(Math.random()*(neighbours.length))]
        atSwap = idToImageSquare.get(toSwapId)
        // console.log(`blank: ${blank}, toswapid:${toSwapId}`)
        idToImageSquare.set(blank, atSwap)
        idToImageSquare.set(toSwapId, SIZE*SIZE-1)
        blank = toSwapId

    }
  
}

function getBlank(){
    for(let i=0; i<SIZE*SIZE; i++){
        if(idToImageSquare.get(i)===SIZE*SIZE-1){
            return i
        }
    }
}
// console.log(getYfromId(idToImageSquare.get(squares[1][2].id)))

image.addEventListener('load', e => {
    init()
  });

let hoverId
function hover(event){
    let square = getSquare(event)
    let neighbours = getNeighbours(square)
    let neighboursFragments = neighbours.map(x=>idToImageSquare.get(x))
    if(hoverId!=square && idToImageSquare.get(hoverId)!=SIZE*SIZE-1){
        ctx.drawImage(image, 
            getXfromId(idToImageSquare.get(hoverId))*imgWidth/canvasWidth,
            getYfromId(idToImageSquare.get(hoverId))*imgWidth/canvasWidth, 
            imgWidth/SIZE, 
            imgWidth/SIZE, 
            getXfromId((hoverId)),
            getYfromId((hoverId)), 
            squareWidth, 
            squareWidth)
    }
    if(neighboursFragments.includes(SIZE*SIZE-1)){
        if(hoverId!=square){
            hoverId=square
            ctx.globalAlpha=0.4
            ctx.fillRect(getXfromId(square), getYfromId(square), squareWidth, squareWidth)
            ctx.globalAlpha=1
        }   
    }
    hoverId=square
}

canvas.addEventListener('mousemove', e=>hover(e))

function loadIMG(id){
    let promise = new Promise((resolve, reject)=>{
        console.log(id)
        let element = document.querySelector(`#im${id}`)
        element.src = `photo${id}.jpg`
        element.onload= ()=> {resolve()}
        element.onerror = () => {reject()}
    })
}

Promise.all([loadIMG(2),loadIMG(1),loadIMG(9), loadIMG(3), loadIMG(4), loadIMG(5), loadIMG(6), loadIMG(7), loadIMG(8)]).then(()=>{
    console.log(`alles gut`)
}).catch(()=>{
    console.log("coś kaputt")
})
document.querySelectorAll(".gallery img").forEach(img => {
    img.addEventListener('click', e=>{
        image.src = img.src
        imgWidth = img.naturalWidth
        SIZE = parseInt(document.querySelector("input").value)
        squareWidth=canvasWidth/SIZE
        init()
})})


function hasWon(){
    // console.log(idToImageSquare)
    let won = true
    for(let i=0; i<SIZE*SIZE-1; i++){
        console.log(`${i} -> ${idToImageSquare.get(i)}`)
        if(idToImageSquare.get(i)!=i){
            return false
        }
    }
    return won
}
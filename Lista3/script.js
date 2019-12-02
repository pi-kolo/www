let canvas = document.querySelector("#canvas")
let ctx = canvas.getContext("2d");  
let image = document.querySelector("img")
let canvasWidth = canvas.width
let imgWidth = image.naturalHeight
// console.log(image.width)
let SIZE = 5

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
    squares = [[]]
    idToImageSquare.clear()
    for(let i=0; i<SIZE; i++ ){
        squares[i] = []
        for(let j=0; j<SIZE; j++){
            squares[i][j]=(new Square(j*canvasWidth/SIZE, i*canvasWidth/SIZE, canvasWidth/SIZE))
            squares[i][j].id = SIZE*i+j
            idToImageSquare.set(SIZE*i+j, SIZE*i+j)
        }
    }
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
    // console.log(idToImageSquare.get(squares[j][i].id))
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
        neighbours.push(id+SIZE)
    }
    if (Math.floor((id-SIZE))>=0) {
        neighbours.push(id-SIZE)
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
}

canvas.addEventListener('click', e=>doMove(e))

function shuffle(){
    let neighbours, toSwapId, atSwap
    let blank = SIZE*SIZE-1

    for(let i=0; i<3**SIZE; i++){
        neighbours = getNeighbours(blank)
        toSwapId = neighbours[Math.floor(Math.random()*(neighbours.length))]
        atSwap = idToImageSquare.get(toSwapId)
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

document.querySelectorAll(".gallery img").forEach(img => {
    img.addEventListener('click', e=>{
        image.src = img.src
        init()
})})
   
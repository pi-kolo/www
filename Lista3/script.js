let canvas = document.querySelector("#canvas")
let ctx = canvas.getContext("2d");  
let image = document.querySelector("img")
let canvasWidth = canvas.width
let imgWidth = image.naturalHeight
// console.log(image.width)
let SIZE = 4

let squareWidth = canvasWidth/SIZE

let blank = new Image()
blank.src = "test2.png"


class Square {
    constructor(x, y, size){
        this.x = x
        this.y = y
        this.size = squareWidth
        this.id = -1
    }
}

// mapa id squarea na kawałek obrazka? (dwie wspolrzedne wystarcza ) 
let idToImageSquare = new Map()

let squares = [[]]
for(let i=0; i<SIZE; i++ ){
    squares[i] = []
    for(let j=0; j<SIZE; j++){
        squares[i][j]=(new Square(j*canvasWidth/SIZE, i*canvasWidth/SIZE, canvasWidth/SIZE))
        squares[i][j].id = SIZE*i+j
        idToImageSquare.set(SIZE*i+j, SIZE*i+j)//[j*canvasWidth/SIZE, i*canvasWidth/SIZE])
    }
}

// for(let i=0; i<SIZE ** 2; i++){

// }


// console.log(squares)

function getSquare(event){
    let x = event.offsetX
    let y = event.offsetY

    let i = Math.floor(x/squareWidth)
    let j = Math.floor(y/squareWidth)
    console.log(idToImageSquare.get(squares[j][i].id))
    return (squares[j][i].id)
}

// canvas.addEventListener('click', e => getSquare(e))

function getXfromId(id){
    return id%SIZE*(canvasWidth/SIZE)
}

function getYfromId(id){
    return Math.floor(id/SIZE)*(canvasWidth/SIZE)
}
// console.log(getXfromId(9))
// console.log(image.naturalHeight)   


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
    if(neighboursFragments.includes(15)){
        //id of blank square
        let id2 = neighbours[neighboursFragments.indexOf(15)]

        let imgFragment1 = idToImageSquare.get(id)

        idToImageSquare.set(id, 15)
        idToImageSquare.set(id2, imgFragment1)

        // console.log(idToImageSquare)
        // console.log(`współrzędne: ${id} <-> ${id2}`)

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
    let blank = 15
    // let neighbours = getNeighbours(blank)
    // let toSwapId = neighbours[Math.floor(Math.random()*(neighbours.length-0.5))]
    // let atSwap = idToImageSquare.get(toSwapId)

    for(let i=0; i<100; i++){
        neighbours = getNeighbours(blank)
        // console.log(neighbours)
        toSwapId = neighbours[Math.floor(Math.random()*(neighbours.length-0.5))]
        // console.log(toSwapId)
        atSwap = idToImageSquare.get(toSwapId)
        // console.log(atSwap)
        idToImageSquare.set(blank, atSwap)
        idToImageSquare.set(toSwapId, 15)
        blank = toSwapId
        // console.log("next")
    }
  
}

function getBlank(){
    for(let i=0; i<16; i++){
        if(idToImageSquare.get(i)===15){
            return i
        }
    }
}
// console.log(getYfromId(idToImageSquare.get(squares[1][2].id)))

image.addEventListener('load', e => {
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
            ctx.fillStyle="#12D3E2"
            ctx.fillRect(getXfromId(last), getYfromId(last), squareWidth, squareWidth)
              
        }
    }
    console.log(idToImageSquare)
  });

 
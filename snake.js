const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
const w = 40
canvas.width = 1000
canvas.height = 560
const CANVAS_HEIGHT = canvas.height
const CANVAS_WIDTH = canvas.width
const vertical = ["up", "down"]
const horizontal = ["right", "left"]
let playing = false
let score = 0
const isColliding = (head, food) => (head.x === food.pos.x-food.radius) && (head.y === food.pos.y - food.radius) 
const checkSelfCollision = s => s.nodes.some(node => (node.type !== "head") && ((s.head.x === node.x) && (s.head.y === node.y)))
c.beginPath()
c.strokeStyle = "white"
c.lineWidth=3
c.strokeRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
c.closePath()

let scoreArea = document.querySelector('.score')
let instructionArea = document.querySelector('.instruction')
let tipArea = document.querySelector('.tip')

playing ? instructionArea.style.display = "none" : instructionArea.style.display = "block"
playing ? tipArea.style.display = "block" : tipArea.style.display = "none"

function getFoodCoordinates(s) {
    allX = [0, 40, 80, 120, 160, 200, 240, 280, 320, 360, 400, 440, 480, 520, 560, 600, 640, 680, 720, 760, 800, 840, 880, 920, 960]
    allY = [0, 40, 80, 120, 160, 200, 240, 280, 320, 360, 400, 440, 480, 520]

    let x = allX[Math.floor(Math.random()*allX.length)]
    let y = allY[Math.floor(Math.random()*allY.length)]

    while(s.nodes.some(node => node.x === x || node.y === y)) {
        console.log(`x: ${x} y: ${y} (FAILED)`)
        x = allX[Math.floor(Math.random()*allX.length)]
        y = allY[Math.floor(Math.random()*allY.length)]
    }

    return {x, y}
}


function getNodeDirection(n1, n2) {
    if(n1.x === n2.x) { // they are vertical
        if(n1.y > n2.y) { // n1 is going up
            return "up"
        } else if(n1.y < n2.y) { // n1 is going down
            return "down"
        }
    } else if(n1.y === n2.y) { // they are horizontal
        if(n1.x > n2.x) { // n1 is going left
            return "left"
        } else if(n1.x < n2.x) { // n1 is going right
            return "right"
        } 
    }
}


// function drawGrid() {
//     for(let i = w; i <= CANVAS_WIDTH; i += w) {
//         c.beginPath()
//         c.lineWidth = 2
//         c.moveTo(i, 0)
//         c.lineTo(i, CANVAS_HEIGHT)
//         c.stroke()
//         c.closePath()
        
//     }
    
//     for(let i = w; i <= CANVAS_HEIGHT; i += w) {
//         c.beginPath()
//         c.lineWidth = 2
//         c.moveTo(0, i)
//         c.lineTo(CANVAS_WIDTH, i)
//         c.stroke()
//         c.closePath()
        
//     }
// }


class Food {
    constructor(position) {
        this.radius = w/2
        this.pos = {
            x: position.x + this.radius,
            y: position.y + this.radius,
        }
        this.color = "green"
    }

    spawn() {
        c.beginPath()
        c.fillStyle = this.color
        c.arc(this.pos.x, this.pos.y, this.radius-4, 0, Math.PI*2);
        c.fill()
        c.closePath()
    }
}


class Snake {
    constructor() {
        this.nodes = [new Node(280, 320), new Node(240, 320), new Node(200, 320)]
        this.head = this.nodes[0]
        this.direction = this.head.direction
        this.tail = this.nodes[this.nodes.length-1]
        this.x = this.head.x
        this.y = this.head.y
    }

    drawEyes() {
        // LEFT EYE
        c.beginPath()
        c.fillStyle = "white"
        switch (this.head.direction) {
            case "right":    
                c.arc(this.head.x-12+w, this.head.y+11, 8, 0, Math.PI*2);
                break;
            case "up":
                c.arc(this.head.x+11, this.head.y+12, 8, 0, Math.PI*2);
                break;
            case "left":
                c.arc(this.head.x+12, this.head.y+11, 8, 0, Math.PI*2);
                break;
            case "down":
                c.arc(this.head.x+11, this.head.y-12+w, 8, 0, Math.PI*2);
                break;
            default:
                break;
        }
        c.fill()
        c.closePath()
        // LEFT EYE PUPIL
        c.beginPath()
        c.fillStyle = "black"
        switch (this.head.direction) {
            case "right":    
                c.arc(this.head.x-9+w, this.head.y+11, 5, 0, Math.PI*2);
                break;
            case "up":
                c.arc(this.head.x+11, this.head.y+9, 5, 0, Math.PI*2);
                break;
            case "left":
                c.arc(this.head.x+9, this.head.y+11, 5, 0, Math.PI*2);
                break;
            case "down":
                c.arc(this.head.x+11, this.head.y-9+w, 5, 0, Math.PI*2);
                break;
            default:
                break;
        }
        c.fill()
        c.closePath()



        // RIGHT EYE
        c.beginPath()
        c.fillStyle = "white"
        switch (this.head.direction) {
            case "right":    
                c.arc(this.head.x-12+w, this.head.y+29, 8, 0, Math.PI*2);
                break;
            case "up":
                c.arc(this.head.x+29, this.head.y+12, 8, 0, Math.PI*2);
                break;
            case "left":
                c.arc(this.head.x+12, this.head.y+29, 8, 0, Math.PI*2);
                break;
            case "down":
                c.arc(this.head.x+29, this.head.y-12+w, 8, 0, Math.PI*2);
                break;
            default:
                break;
        }
        c.fill()
        
        c.closePath()
        // RIGHT EYE PUPIL
        c.beginPath()
        c.fillStyle = "black"
        switch (this.head.direction) {
            case "right":    
                c.arc(this.head.x-9+w, this.head.y+29, 5, 0, Math.PI*2);
                break;
            case "up":
                c.arc(this.head.x+29, this.head.y+9, 5, 0, Math.PI*2);
                break;
            case "left":
                c.arc(this.head.x+9, this.head.y+29, 5, 0, Math.PI*2);
                break;
            case "down":
                c.arc(this.head.x+29, this.head.y-9+w, 5, 0, Math.PI*2);
                break;
            default:
                break;
        }
        c.fill()
        c.closePath()

    }

    setNodesDirection() {
        this.nodes.forEach((node, i) => {
            if(node.type !== "head") {
                node.direction = getNodeDirection(node, this.nodes[i-1])
            } else if(node.type === "head") {
                node.direction = this.direction
            }
        })
    }

    draw() {
        this.head.color = "red"
        this.head.type = "head"
        this.tail.type = "tail"
        this.nodes.forEach(node => node.draw(this))
        this.drawEyes()
    }
    
    move() {
        this.head.color = "red"
        this.head.type = "head"
        this.tail.type = "tail"

        for(let i=this.nodes.length; i > 0; i-=1) {
            if(this.nodes[i-1].type !== "head") {
                this.nodes[i-1].x = this.nodes[i-2].x
                this.nodes[i-1].y = this.nodes[i-2].y
            }
        }
    }

    grow() { 
        this.tail.type = "normal"
        let coordinates = {x: 0, y: 0}
        let newPart
        switch (this.tail.direction) {
            case "left":    
                coordinates.x = this.tail.x+w
                coordinates.y = this.tail.y
                newPart = new Node(coordinates.x, coordinates.y)
                newPart.direction = this.tail.direction
                newPart.type = "tail"
                break;
            case "up":
                coordinates.x = this.tail.x
                coordinates.y = this.tail.y+w
                newPart = new Node(coordinates.x, coordinates.y)
                newPart.direction = this.tail.direction
                newPart.type = "tail"
                break;
            case "right":
                coordinates.x = this.tail.x-w
                coordinates.y = this.tail.y
                newPart = new Node(coordinates.x, coordinates.y)
                newPart.direction = this.tail.direction
                newPart.type = "tail"
                break;
            case "down":
                coordinates.x = this.tail.x
                coordinates.y = this.tail.y-w
                newPart = new Node(coordinates.x, coordinates.y)
                newPart.direction = this.tail.direction
                newPart.type = "tail"
                break;
            default:
                break;
        }
        this.tail = newPart
        this.nodes.push(newPart)
        newPart.draw(this)
    }
}

class Node {
    constructor(x, y) {
        this.height = w
        this.width = w 
        this.x = x
        this.y = y 
        this.type = "normal"
        this.color = "yellow"
        this.direction = "right"
        this.position = 0
    }

    next = (s) => s.nodes.find(node => s.nodes.indexOf(this) - s.nodes.indexOf(node) === 1)
    previous = (s) => s.nodes.find(node => s.nodes.indexOf(this) - s.nodes.indexOf(node) === -1)

    draw(s) {
        c.beginPath()
        c.fillStyle = this.color

        if(this.type !== "head" && this.direction === "right" && vertical.includes(this.next(s).direction)) {
            c.fillRect(this.x, this.y+2, this.width+2, this.height-4)
        } else if(this.type !== "head" && this.direction === "left" && vertical.includes(this.next(s).direction)) {
            c.fillRect(this.x-2, this.y+2, this.width+2, this.height-4)
        } else if(this.type !== "head" && this.direction === "up" && horizontal.includes(this.next(s).direction)) {
            c.fillRect(this.x+2, this.y-2, this.width-4, this.height+2)
        } else if(this.type !== "head" && this.direction === "down" && horizontal.includes(this.next(s).direction)) {
            c.fillRect(this.x+2, this.y, this.width-4, this.height+2)
        } else if(this.type !== "tail" && this.direction === "up" && horizontal.includes(this.previous(s).direction)) {
            c.fillRect(this.x+2, this.y, this.width-4, this.height-2)
        } else if(this.type !== "tail" && this.direction === "down" && horizontal.includes(this.previous(s).direction)) {
            c.fillRect(this.x+2, this.y+2, this.width-4, this.height-2)
        } else if(this.type !== "tail" && this.direction === "right" && vertical.includes(this.previous(s).direction)) {
            c.fillRect(this.x+2, this.y+2, this.width-2, this.height-4)
        } else if(this.type !== "tail" && this.direction === "left" && vertical.includes(this.previous(s).direction)) {
            c.fillRect(this.x, this.y+2, this.width-2, this.height-4)
        } else if(horizontal.includes(this.direction)) {
            c.fillRect(this.x, this.y+2, this.width, this.height-4)
        } else if(vertical.includes(this.direction)) {
            c.fillRect(this.x+2, this.y, this.width-4, this.height)
        }

        c.fill()
        c.closePath()
    }
}



let snake = new Snake()
snake.draw(snake)

let food = new Food(getFoodCoordinates(snake))
food.spawn()

let gameLoop = setInterval(() => {
    if(playing) {
        console.log(snake.head.direction)
        let selfColliding = snake.nodes.some(node => (node.type !== "head") && ((snake.head.x === node.x) && (snake.head.y === node.y)))
        let upWallCollision = (snake.head.y < 0)
        let rightWallCollision = (snake.head.x+w-1 > CANVAS_WIDTH)
        let downWallCollision = (snake.head.y+w-1 > CANVAS_HEIGHT)
        let leftWallCollision = (snake.head.x < 0)
        let collided = rightWallCollision || leftWallCollision || upWallCollision || downWallCollision || selfColliding
        if(collided) {
            console.log('YOU HIT SOMETHING');
            instructionArea.textContent = "PRESS SPACE TO PLAY AGAIN"
            instructionArea.style.display = "block"
            score = 0
            score.textContent = score
            snake = new Snake()
            snake.draw(snake)
            instructionArea.textContent = "PRESS SPACE TO PLAY"
            playing = false
        } else {
            changeDirection(snake.head.direction)
        }
    }
}, 200)


addEventListener('keyup', e => {
    console.log(e.keyCode);
    
    switch(e.keyCode) {
        case 32:
            playing = !playing
            console.log(playing);
            
            playing ? instructionArea.style.display = "none" : instructionArea.style.display = "block"
            playing ? tipArea.style.display = "block" : tipArea.style.display = "none"
            break
        case 37: //LEFT
            if(snake.head.direction !== "right") {
                snake.head.direction = "left"
            }
            break
        case 38: //UP
            if(snake.head.direction !== "down") {    
                snake.head.direction = "up"
            }
            break
        case 39: //RIGHT
            if(snake.head.direction !== "left") {
                snake.head.direction = "right"
            }
            break
        case 40: //DOWN
            if(snake.head.direction !== "up") {
                snake.head.direction = "down"
            }
            break
        default:
            break
    }
  
})

function changeDirection(direction) {
    c.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    
    switch (direction) {
        case "left":    
            snake.direction = "left"
            snake.move()
            snake.head.x -= w
            break;
        case "up":
            snake.direction = "up"
            snake.move()
            snake.head.y -= w
            break;
        case "right":
            snake.direction = "right"
            snake.move()
            snake.head.x += w
            break;
        case "down":
            snake.direction = "down"
            snake.move()
            snake.head.y += w
            break;
        default:
            break;
    }
    snake.setNodesDirection()
    snake.draw(snake)
    // console.log(...snake.nodes)


    if(isColliding(snake.head, food)) {
        food = new Food(getFoodCoordinates(snake))
        food.spawn()
        snake.grow()
        score += 10
        scoreArea.textContent = `SCORE: ${score}`
        console.log("EATEN")
    } else {
        food.spawn()
    }
    c.strokeRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
}
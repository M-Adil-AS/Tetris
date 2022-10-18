let gameStarted = false
let arrowLeftPressed = false
let arrowRightPressed = false
let arrowDownPressed = false
let spaceAllowed = false
let rotationAllowed = false
let activeBlock
let activeBlockType
let freeFallID
let controlID
let delay = 1000
let zIndex = 1

document.addEventListener('keydown', async(e)=>{
    if(e.key=='Enter' && !gameStarted){
        startGame()
    }
    else if(e.key=='ArrowLeft'){
        arrowLeftPressed = true
    }
    else if(e.key=='ArrowRight'){
        arrowRightPressed = true
    }
    else if(e.key=='ArrowDown'){
        arrowDownPressed = true
    }
    else if(e.keyCode=='32' && !e.repeat && spaceAllowed){
        let distances = []

        activeBlock.forEach((square_A)=>{
            Array.from(document.querySelectorAll('#play-board img')).slice(4).forEach((square_B)=>{
                if(marginLeft(square_A)==marginLeft(square_B) && marginTop(square_B)>marginTop(square_A)){
                    distances.push(marginTop(square_B)-marginTop(square_A)-26)
                }
            })
        })

        let marginTopValues = activeBlock.map(square => marginTop(square))
        let maxMarginTopValue = Math.max.apply(Math,marginTopValues)
        distances.push(494-maxMarginTopValue)

        let shortestDistance = Math.min.apply(Math,distances)
        activeBlock.forEach(square => square.style.marginTop = `${marginTop(square)+shortestDistance}px`)
        new Audio('hard drop.mp3').play()
        document.querySelector('#score').innerHTML = Number(document.querySelector('#score').innerHTML) + 50
        await afterLanding()
    }
    else if(e.key=='ArrowUp' && !e.repeat && rotationAllowed){
        let marginTopValues = activeBlock.map(square => marginTop(square))
        let marginLeftValues = activeBlock.map(square => marginLeft(square))
        let ref = {x:Math.min.apply(Math,marginLeftValues), y:Math.min.apply(Math,marginTopValues)}
        
        let rotateData = [
            {type:'I', newCoords: [{x:ref.x+26,y:ref.y-26},{x:ref.x+26,y:ref.y},{x:ref.x+26,y:ref.y+26},{x:ref.x+26,y:ref.y+52}], newType:'IR1'},
            {type:'IR1', newCoords: [{x:ref.x-26,y:ref.y+26},{x:ref.x,y:ref.y+26},{x:ref.x+26,y:ref.y+26},{x:ref.x+52,y:ref.y+26}], newType:'I'},
            {type:'Z', newCoords: [{x:ref.x+26,y:ref.y},{x:ref.x+26,y:ref.y+26},{x:ref.x,y:ref.y+26},{x:ref.x,y:ref.y+52}], newType:'ZR1'},
            {type:'ZR1', newCoords: [{x:ref.x,y:ref.y},{x:ref.x+26,y:ref.y},{x:ref.x+26,y:ref.y+26},{x:ref.x+52,y:ref.y+26}], newType:'Z'},
            {type:'S', newCoords: [{x:ref.x,y:ref.y},{x:ref.x,y:ref.y+26},{x:ref.x+26,y:ref.y+26},{x:ref.x+26,y:ref.y+52}], newType:'SR1'},
            {type:'SR1', newCoords: [{x:ref.x+26,y:ref.y},{x:ref.x+52,y:ref.y},{x:ref.x,y:ref.y+26},{x:ref.x+26,y:ref.y+26}], newType:'S'},
            {type:'T', newCoords: [{x:ref.x+26,y:ref.y},{x:ref.x+26,y:ref.y+26},{x:ref.x+26,y:ref.y+52},{x:ref.x+52,y:ref.y+26}], newType:'TR1'},
            {type:'TR1', newCoords: [{x:ref.x-26,y:ref.y+26},{x:ref.x,y:ref.y+26},{x:ref.x+26,y:ref.y+26},{x:ref.x,y:ref.y+52}], newType:'TR2'},
            {type:'TR2', newCoords: [{x:ref.x+26,y:ref.y-26},{x:ref.x+26,y:ref.y},{x:ref.x,y:ref.y},{x:ref.x+26,y:ref.y+26}], newType:'TR3'},
            {type:'TR3', newCoords: [{x:ref.x+26,y:ref.y},{x:ref.x,y:ref.y+26},{x:ref.x+26,y:ref.y+26},{x:ref.x+52,y:ref.y+26}], newType:'T'},
            {type:'L', newCoords: [{x:ref.x+26,y:ref.y},{x:ref.x+26,y:ref.y+26},{x:ref.x+26,y:ref.y+52},{x:ref.x+52,y:ref.y+52}], newType:'LR1'},
            {type:'LR1', newCoords: [{x:ref.x-26,y:ref.y+26},{x:ref.x-26,y:ref.y+52},{x:ref.x,y:ref.y+26},{x:ref.x+26,y:ref.y+26}], newType:'LR2'},
            {type:'LR2', newCoords: [{x:ref.x,y:ref.y-26},{x:ref.x+26,y:ref.y-26},{x:ref.x+26,y:ref.y},{x:ref.x+26,y:ref.y+26}], newType:'LR3'},
            {type:'LR3', newCoords: [{x:ref.x,y:ref.y+26},{x:ref.x+26,y:ref.y+26},{x:ref.x+52,y:ref.y+26},{x:ref.x+52,y:ref.y}], newType:'L'},
            {type:'J', newCoords: [{x:ref.x+26,y:ref.y},{x:ref.x+26,y:ref.y+26},{x:ref.x+26,y:ref.y+52},{x:ref.x+52,y:ref.y}], newType:'JR1'},
            {type:'JR1', newCoords: [{x:ref.x-26,y:ref.y+26},{x:ref.x,y:ref.y+26},{x:ref.x+26,y:ref.y+26},{x:ref.x+26,y:ref.y+52}], newType:'JR2'},
            {type:'JR2', newCoords: [{x:ref.x,y:ref.y+26},{x:ref.x+26,y:ref.y+26},{x:ref.x+26,y:ref.y},{x:ref.x+26,y:ref.y-26}], newType:'JR3'},
            {type:'JR3', newCoords: [{x:ref.x,y:ref.y},{x:ref.x,y:ref.y+26},{x:ref.x+26,y:ref.y+26},{x:ref.x+52,y:ref.y+26}], newType:'J'},
        ]

        for(let i=0; i<rotateData.length; i++){
            if(activeBlockType==rotateData[i].type && newCoordsInRange(rotateData[i].newCoords)){
                if(!overlapTest(Array.from(document.querySelectorAll('#play-board img')).slice(4),rotateData[i].newCoords)){
                    activeBlock.forEach((square,j)=>{
                        square.style.marginLeft = `${rotateData[i].newCoords[j].x}px`
                        square.style.marginTop = `${rotateData[i].newCoords[j].y}px`
                    })
                    activeBlockType = rotateData[i].newType
                    new Audio('rotate.mp3').play()
                    break
                }
            }
        }
    }
})

document.addEventListener('keyup',(e)=>{
    if(e.key=='ArrowLeft'){
        arrowLeftPressed = false
    }
    else if(e.key=='ArrowRight'){
        arrowRightPressed = false
    }
    else if(e.key=='ArrowDown'){
        arrowDownPressed = false
    }
})

document.addEventListener('click',(e)=>{
    if(e.target.id=='replay'){
        window.location.reload()
    }
})

function startGame(){
    gameStarted = true
    spaceAllowed = true
    rotationAllowed = true
    document.querySelector('#bgMusic').play()

    let type = randomBlockType()
    generateBlock(type) 
    activeBlock = Array.from(document.querySelectorAll('#play-board img')).slice(0,4)
    activeBlockType = type

    document.querySelector('#score-board p').remove()
    document.querySelector('#score-board').insertAdjacentHTML('beforeend', `
        <p>Level: <span id='level'>1</span></p>
        <p>Score: <span id='score'>0</span></p>
        <p>Lines: <span id='lines'>0</span></p>
        <p>Next Block:</p>
        <img src='${randomBlockType()} block.png'>
    `)
    freeFall()
    control()
}

function control(){
    controlID = setInterval(async()=>{
        if(arrowLeftPressed){
            !hitTest('left') && activeBlock.forEach(square => square.style.marginLeft = `${marginLeft(square)-26}px`)
        }
        if(arrowRightPressed){
            !hitTest('right') && activeBlock.forEach(square => square.style.marginLeft = `${marginLeft(square)+26}px`)
        }
        if(arrowDownPressed){
            document.querySelector('#score').innerHTML = Number(document.querySelector('#score').innerHTML) + 2
            if(hitTest('down')){
                new Audio('hit.mp3').play()
                await afterLanding()
            }
            else{
                activeBlock.forEach(square => square.style.marginTop = `${marginTop(square)+26}px`)
            }
        }
    },50)
}

function freeFall(){
    freeFallID = setInterval(async()=>{
        if(hitTest('down')){
            new Audio('hit.mp3').play()
            await afterLanding()
        }
        else{
            activeBlock.forEach(square => square.style.marginTop = `${marginTop(square)+26}px`)
        }
    },delay)
}

function afterLanding(){
    return new Promise(async(resolve,reject)=>{
        clearInterval(freeFallID)
        clearInterval(controlID)
        spaceAllowed = false
        rotationAllowed = false
        await lineClear() 
        changeActiveBlock()  
        if(!overlapTest(Array.from(document.querySelectorAll('#play-board img')),[])){
            freeFall()
            control()
            spaceAllowed = true
            rotationAllowed = true
        }
        else{
            gameOver()
        } 
        resolve()
    })
}

function newCoordsInRange(newCoords){
    let inRange = true
    newCoords.forEach((coord)=>{
        if(coord.x<0 || coord.x>234 || coord.y<0 || coord.y>494){
            inRange = false
        }
    })
    return inRange
}

function gameOver(){
    document.querySelector('#bgMusic').pause()
    new Audio('game over.mp3').play()
    document.querySelector('body').insertAdjacentHTML('beforeend',`
        <div id='cover'>
            <img id='replay' src='replay.jpg'>
        </div>
    `)
}

function overlapTest(firstArray, secondArray){    
    let data = [
        ...firstArray.map(square => `${marginLeft(square)} ${marginTop(square)}`),
        ...secondArray.map(coord => `${coord.x} ${coord.y}`)
    ]
    return (new Set(data)).size !== data.length
}

function lineClear(){
    return new Promise(async(resolve,reject)=>{
        let lineValues = getLineValues()
        if(lineValues.length){
            for(i=0; i<lineValues.length; i++){
                document.querySelector('#lines').innerHTML = Number(document.querySelector('#lines').innerHTML) + 1
                if(Number(document.querySelector('#lines').innerHTML)%10==0){
                    document.querySelector('#level').innerHTML = (Number(document.querySelector('#level').innerHTML)) + 1
                    delay -= 50
                }
                document.querySelector('#score').innerHTML = Number(document.querySelector('#score').innerHTML) + (lineValues.length*100)
            }

            new Audio('line clear.mp3').play()

            for(let i=0; i<3; i++){
                document.querySelectorAll('#play-board img').forEach((square)=>{
                    if(lineValues.includes(marginTop(square))){
                        square.style.filter = 'brightness(200%)'
                    }
                })
                await new Promise(resolve => setTimeout(resolve,50))

                document.querySelectorAll('#play-board img').forEach((square)=>{
                    if(lineValues.includes(marginTop(square))){
                        square.style.filter = 'brightness(100%)'
                    }
                })
                await new Promise(resolve => setTimeout(resolve,50))
            }

            document.querySelectorAll('#play-board img').forEach((square)=>{
                if(lineValues.includes(marginTop(square))){
                    square.remove()
                }
            })
            await new Promise(resolve => setTimeout(resolve,100))

            for(let i=494; i>=26; i-=26){
                let marginTopValues = Array.from(document.querySelectorAll('#play-board img')).map(square => marginTop(square))
                if(!marginTopValues.includes(i)){
                    for(let j=i-26; j>=0; j-=26){
                        if(marginTopValues.includes(j)){
                            document.querySelectorAll('#play-board img').forEach((square)=>{
                                if(marginTop(square)==j){
                                    square.style.marginTop = `${i}px`
                                }
                            })
                            break    
                        }
                    }
                }
            } 
        }
        resolve()
    })
}

function getLineValues(){
    let lineValues = []
    let countArray = new Array(20).fill(0)
    document.querySelectorAll('#play-board img').forEach(square => countArray[marginTop(square)/26] += 1)
    countArray.forEach((count,i)=>{
        if(count==10){
            lineValues.push(i*26)
        }
    })
    return lineValues
}

function changeActiveBlock(){
    let nextBlock = document.querySelector('#score-board img')
    let nextBlockType = nextBlock.getAttribute('src')[0]
    generateBlock(nextBlockType) 
    activeBlock = Array.from(document.querySelectorAll('#play-board img')).slice(0,4)
    activeBlockType = nextBlockType
    activeBlock.forEach(square => square.style.zIndex = `${zIndex + 1}`)
    zIndex++
    nextBlock.src = `${randomBlockType()} block.png`
}

function hitTest(direction){
    let hit = false
    activeBlock.forEach((square_A)=>{
        if(direction=='down'){
            if(marginTop(square_A)==494){
                hit = true
            }
            Array.from(document.querySelectorAll('#play-board img')).slice(4).forEach((square_B)=>{
                if(marginTop(square_A)+26==marginTop(square_B) && marginLeft(square_A)==marginLeft(square_B)){
                    hit = true
                }
            })  
        }  
        else{
            let valueA = (direction=='left') ? 0 : 234
            let valueB = (direction=='left') ? -26 : 26

            if(marginLeft(square_A)==valueA){
                hit = true
            } 
            Array.from(document.querySelectorAll('#play-board img')).slice(4).forEach((square_B)=>{
                if(marginLeft(square_A)+valueB==marginLeft(square_B) && marginTop(square_A)==marginTop(square_B)){
                    hit = true
                }
            })  
        }
    })
    return hit
}

function marginLeft(square){
    return Number(square.style.marginLeft.split('px')[0])
}

function marginTop(square){
    return Number(square.style.marginTop.split('px')[0])
}

function generateBlock(type){
    let blockData = [
        {type:'I', squares:[{x:78, y:0},{x:104, y:0}, {x:130, y:0}, {x:156, y:0}], sqrColor:'lightblue'},
        {type:'S', squares:[{x:78, y:26},{x:104, y:26}, {x:104, y:0}, {x:130, y:0}], sqrColor:'green'},
        {type:'Z', squares:[{x:78, y:0},{x:104, y:0}, {x:104, y:26}, {x:130, y:26}], sqrColor:'red'},
        {type:'L', squares:[{x:78, y:26},{x:104, y:26}, {x:130, y:26}, {x:130, y:0}], sqrColor:'orange'},
        {type:'J', squares:[{x:130, y:26},{x:104, y:26}, {x:78, y:26}, {x:78, y:0}], sqrColor:'darkblue'},
        {type:'O', squares:[{x:104, y:0},{x:104, y:26}, {x:130, y:0}, {x:130, y:26}], sqrColor:'yellow'},
        {type:'T', squares:[{x:78, y:26},{x:104, y:26}, {x:130, y:26}, {x:104, y:0}], sqrColor:'purple'}
    ]

    blockData.forEach((block)=>{
        if(block.type==type){
            let html = ''
            for(let i=0; i<=3; i++){
                let style = `margin-left:${block.squares[i].x}px; margin-top:${block.squares[i].y}px;`
                html += `<img src='${block.sqrColor} square.png' style='${style}'>`
            }
            document.querySelector('#play-board').insertAdjacentHTML('afterbegin', html)
        }
    })
}

function randomBlockType(){
    let types = ['I','J','S','Z','L','O','T']
    let randomType = types[Math.floor(Math.random() * types.length)]
    return randomType
}
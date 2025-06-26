let resumeButton = document.getElementById('Resume');
let pauseButton = document.getElementById('Pause');
let canvas = document.getElementById('Canvas');
let canvasContainer = document.getElementById('drawing');

let settingsDiv = document.getElementById('settings');
let octavesIn = document.getElementById('octaves');
let persistenceIn = document.getElementById('persistence');
let rotationIn = document.getElementById('rotation');
let seedIn = document.getElementById('seed');
let movementIn = document.getElementById('movement');

let octaves = octavesIn.value;
let persistence = persistenceIn.value;
let seed = Math.floor(Math.random() * 100);
let rotateSpeed = rotationIn.value / 1000;
let movement = movementIn.value / 1000;
let ctx = canvas.getContext('2d');

seedIn.value = seed;

let angle = 75;
let size = 9;
let xOffset, yOffset;
let tileWidth, tileHeight;
let pixelOffset = { x: 0, y: 0};

let play = true;

let simplex = new SimplexNoise(seed);
let noiseMap = generate2DNoise();
let rMatrix = generateMatrix();

resizeCanvas();
requestAnimationFrame(drawFrame);

resumeButton.addEventListener('click', function() {
    resizeCanvas();

    play = true;
    rMatrix = generateMatrix();
    requestAnimationFrame(drawFrame);
})

pauseButton.addEventListener('click', function() {
    play = false;
})

settingsDiv.addEventListener('input', function(e){
    if (e.target.tagName.toLowerCase() === 'input'){
        octaves = octavesIn.value;
        persistence = persistenceIn.value;
        rotateSpeed = rotationIn.value / 1000;
        movement = movementIn.value / 1000;
        seed = seedIn.value;
        simplex = new SimplexNoise(seed);
        noiseMap = generate2DNoise();
        if (play)
            requestAnimationFrame(drawFrame);
    }
})

function drawFrame(){
    if (!play)
        return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    /*
        draw waves
    */
    
    noiseMap = generate2DNoise();
    angle+= rotateSpeed;
    pixelOffset.x += movement
    rMatrix = generateMatrix(angle);
    for (let i = 0; i < size - 1; i++){
        for (let j = 0; j < size - 1; j++){
            let points = [
                pointCalc({ x: i, y: j }),
                pointCalc({ x: i + 1, y: j }),
                pointCalc({ x: i + 1, y: j + 1 }),
                pointCalc({ x: i, y: j + 1 })
            ];
            ctx.beginPath();
            ctx.moveTo(points[0].x , points[0].y);
            for (let k = 1; k < points.length; k++){
                ctx.lineTo(points[k].x, points[k].y);
            }
            ctx.closePath();
            ctx.stroke();
        }
    }

    requestAnimationFrame(drawFrame);
}

function generate2DNoise(){
    let array = Array.from({length: size}, () => Array.from({length: size}, () => 0.5));
    for (let i = 0; i < size; i++){
        for (let j = 0; j < size; j++){
            array[i][j] = simplex.fractalNoise2D((i + pixelOffset.x) / 10,
             (j + pixelOffset.y) / 10, octaves, persistence);
        } 
    }
    return array;
}

function pointCalc(V, half = size / 2) {
    let xVec = V.x - half;
    let yVec = V.y - half;

    let transformedX = xVec * rMatrix.m11 + yVec * rMatrix.m21;
    let transformedY = xVec * rMatrix.m12 + yVec * rMatrix.m22;

    // Apply second transformation to scale and offset
    let X = transformedX * tileWidth * 0.5 + xOffset;
    let Y = transformedY * tileHeight * 0.25 + yOffset - noiseMap[V.x][V.y] * 100;

    return { x: X, y: Y };
}

function generateMatrix(newangle = 75){
    let rad = newangle / (2 * Math.PI);
    return {
        m11: Math.cos(rad), m21: Math.sin(rad),
        m12: -Math.sin(rad), m22: Math.cos(rad)
    };
}

function resizeCanvas(){
    let bounds = canvasContainer.getBoundingClientRect();
    canvas.style.width = bounds.width + 'px';
    canvas.style.height = bounds.height + 'px';
    let scale = window.devicePixelRatio || 1.5;

    canvas.width = bounds.width * scale;
    canvas.height = bounds.height * scale;

    ctx.setTransform(scale, 0, 0, scale, 0, 0);

    tileWidth = canvas.width / (2 * size);
    tileHeight = tileWidth / 2;
    xOffset = canvas.width / 2;
    yOffset = canvas.height / 2;
}
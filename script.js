let resumeButton = document.getElementById('Resume');
let pauseButton = document.getElementById('Pause');
let canvas = document.getElementById('Canvas');

let settingsDiv = document.getElementById('settings');
let octavesIn = document.getElementById('octaves');
let persistenceIn = document.getElementById('persistence');

let octaves = octavesIn.value;
let persistence = persistenceIn.value;
let ctx = canvas.getContext('2d');

let size = 9;
let tileWidth = 500 / (2 * size);
let tileHeight = tileWidth / 2;
let play = false;

let simplex = new SimplexNoise();
let noiseMap = generate2DNoise();

resumeButton.addEventListener('click', function() {
    play = true;
    requestAnimationFrame(drawFrame);
})

pauseButton.addEventListener('click', function() {
    play = false;
})

settingsDiv.addEventListener('input', function(e){
    if (e.target.tagName.toLowerCase() === 'input'){
        octaves = octavesIn.value;
        persistence = persistenceIn.value;
        if (play)
            requestAnimationFrame(drawFrame);
    }
})

function drawFrame(){
    if (!play)
        return;
    
    /*
        draw waves
    */

    
    requestAnimationFrame(drawFrame);
}

function generate2DNoise(){
    let array = Array.from({length: size}, () => Array.from({length: size}, () => 0.5));
    for (let i = 0; i < size; i++){
        for (let j = 0; j < size; j++){
            array[i][j] = simplex.fractalNoise2D(i / 10, j / 10, octaves, persistence);
            console.log(array[i][j]);
        } 
    }
    return array;
}

function pointCalc(V, rMatrix, half = size / 2) {
    let xVec = V.x - half;
    let yVec = V.z - half;

    let transformedX = xVec * rMatrix.m11 + yVec * rMatrix.m21;
    let transformedY = xVec * rMatrix.m12 + yVec * rMatrix.m22;

    // Apply second transformation to scale and offset
    let X = transformedX * tileWidth * 0.5 + xOffset;
    let Y = transformedY * tileHeight * 0.25 + yOffset - V.y;

    return { x: X, y: Y };
}

function generateMatrix(angle = 75){
    let rad = angle / (2 * Math.PI);
    return {
        Math.cos(rad), }
}
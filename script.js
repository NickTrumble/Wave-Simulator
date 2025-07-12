import Renderer from './Renderer.js';
import Settings from './Settings.js';
import SimplexNoise from './simplex.js';

let resumeButton = document.getElementById('Resume');
let pauseButton = document.getElementById('Pause');
let canvas = document.getElementById('Canvas');
let canvasContainer = document.getElementById('drawing');
let settingsDiv = document.getElementById('settings');

export const settings = new Settings();
export let ctx = canvas.getContext('2d');
export const state = {
    angle: 75,
    xOffset: 0,
    yOffset: 0,
    tileWidth: 0,
    tileHeight: 0,
    pixelOffset: { x: 0, y: 0 },
    play: true,
    simplex: null,
    rMatrix: null,
    noiseMap: []
};

let renderer = new Renderer(ctx, state, settings, canvas);
requestAnimationFrame(renderer.drawFrame);

function init(){
    state.simplex = new SimplexNoise(settings.seed);
    state.rMatrix = renderer.generateMatrix();
    state.noiseMap = renderer.generate2DNoise();
    resizeCanvas();
    requestAnimationFrame(renderer.drawFrame);
}

window.addEventListener('resize', () => resizeCanvas());

resumeButton.addEventListener('click', function() {
    state.play = true;
    state.rMatrix = renderer.generateMatrix();
    requestAnimationFrame(renderer.drawFrame);
})

pauseButton.addEventListener('click', () => state.play = false);

settingsDiv.addEventListener('input', function(e){
    if (e.target.tagName.toLowerCase() === 'input'){
        updateSettings();
        resizeCanvas();
    }
})

function updateSettings(){
    state.simplex = new SimplexNoise(settings.seed);
    state.noiseMap = renderer.generate2DNoise();
}


function resizeCanvas(){
    let bounds = canvasContainer.getBoundingClientRect();
    let scale = window.devicePixelRatio || 1.5;

    canvas.width = bounds.width * scale;
    canvas.height = bounds.height * scale;

    ctx.setTransform(scale, 0, 0, scale, 0, 0);

    state.tileWidth = canvas.width / settings.size;
    state.tileHeight = state.tileWidth / 3;

    state.xOffset = canvas.width / 2;
    state.yOffset = canvas.height / 2;
}

init();


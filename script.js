let resumeButton = document.getElementById('Resume');
let pauseButton = document.getElementById('Pause');
let canvas = document.getElementById('Canvas');

let settingsDiv = document.getElementById('settings');
let octavesIn = document.getElementById('octaves');
let persistenceIn = document.getElementById('persistence');

let octaves = octavesIn.value;
let persistence = persistenceIn.value;
let ctx = canvas.getContext('2d');

let play = false;

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
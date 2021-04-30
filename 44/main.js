

const AudioContext = window.AudioContext || window.webkitAudioContext,
    context      = new AudioContext()

const oscillator = context.createOscillator();
oscillator.type = "sine";
oscillator.frequency.value = 596;


const gainNode = context.createGain();

var volume = context.createGain();
volume.connect(context.destination);
volume.gain.value = 1;

oscillator.connect(gainNode);
gainNode.connect(volume);
volume.connect(context.destination);

var active = false;
var started = true;

var play = function(){
    if(started){
        oscillator.start(0);
        started = false;
    }
    volume.gain.value = 1;
    active = true;
}

var stop = function(){
    volume.gain.value = 0;
    active = false;
}


document.body.addEventListener("mousedown",play);
document.body.addEventListener("mouseup",stop);

document.body.addEventListener("keydown",play);
document.body.addEventListener("keyup",stop);

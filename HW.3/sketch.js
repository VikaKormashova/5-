let sound;
let isInitialised = false;
let isLoaded = false;
let amplitude;
let amplitudes = [];

let fft;

function preload() {
    soundFormats('mp3', 'wav');
    sound = loadSound('assets/yee-king_track.mp3', () => {
        console.log("sound is loaded!");
        isLoaded = true;
    });
    sound.setVolume(0.2);
}

function setup() {
    createCanvas(1024, 1024);
    textAlign(CENTER);
    textSize(32);
    amplitude = new p5.Amplitude();

    for (let i = 0; i < 512; i++) {
        amplitudes.push(0);
    }
    fft = new p5.FFT();
}

function draw() {
    background(0);
    fill(255);

    if (isInitialised && !sound.isPlaying())
        text("Press any key to play sound", width / 2, height / 2);
    else if (sound.isPlaying()) {
        let level = amplitude.getLevel();
        amplitudes.push(level);
        amplitudes.shift();
        text(level, width / 2, 40);
        let size = map(level, 0, 0.20, 100, 200);
        ellipse(width / 2, height / 2, size, size);

        let freqs = fft.analyze();
        let barWidth = width / freqs.length;

        for (let i = 0; i < freqs.length; i++) {
            let avgEnergy = 0;
            let count = 0;

            // Считаем среднее значение энергии для 5 Гц
            for (let j = -2; j <= 2; j++) {
                if (i + j >= 0 && i + j < freqs.length) {
                    avgEnergy += freqs[i + j];
                    count++;
                }
            }
            avgEnergy /= count;

            // Отрисовываем столбцы
            let h = map(avgEnergy, 0, 255, 0, height * 0.5);
            fill(map(i, 0, freqs.length, 0, 255), 100, 150);
            rect(i * barWidth, height, barWidth - 2, -h);
        }
    }
}

function keyPressed() {
    if (!isInitialised) {
        isInitialised = true;
        let r = map(mouseX, 0, width, 0.5, 4.0);
        if (isLoaded) {
            sound.loop(0, r);
        }
    } else {
        if (key == ' ') {
            if (sound.isPaused()) sound.play();
            else sound.pause();
        }
    }
}

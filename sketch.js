let song;
let fft;
let amplitudeSlider, frequencyRangeSlider;

function preload() {
  song = loadSound("audio/visualization-sample.mp3"); 
}

function setup() {
  createCanvas(400, 400);
  
  // set FFT
  fft = new p5.FFT();
  song.connect(fft);

  // sliders for user control
  amplitudeSlider = createSlider(0, 1, 0.5, 0.01);
  amplitudeSlider.position(10, height - 30);
  frequencyRangeSlider = createSlider(10, 100, 60, 1);
  frequencyRangeSlider.position(10, height - 60);

  // button
  let playButton = createButton("Play/Pause");
  playButton.position(10, height - 90);
  playButton.mousePressed(togglePlay);
}

function draw() {
  background(0);

  // FFT Analysis
  let spectrum = fft.analyze();
  
  // Adjust song amplitude
  song.amp(amplitudeSlider.value());

  let radius = width / 4; 
  let binNum = frequencyRangeSlider.value();
  let angle = TWO_PI / binNum;

  push();
  translate(width / 2, height / 2);
  for (let i = 0; i < binNum; i++) {
    let amp = spectrum[i];
    let movingColor = color(map(amp, 0, 255, 0, 255), 255, 255 - map(amp, 0, 255, 0, 255));
    let baseColor = color(100, 100, 100);
    fill(song.isPlaying() ? movingColor : baseColor); // 当歌曲在播放时改变颜色，否则为基础色
    
    let offset = map(amp, 0, 255, 0, radius);
    let x = (radius + offset) * cos(angle * i);
    let y = (radius + offset) * sin(angle * i);

    let ballDiameter = map(amp, 0, 255, 2, 15);  // 当幅度增加时，直径也增加
    ellipse(x, y, ballDiameter);
  }
  pop();
  
  // Display control info
  fill(220);
  text("Amplitude", amplitudeSlider.x * 2 + amplitudeSlider.width, height - 15);
  text("Frequency Range", frequencyRangeSlider.x * 2 + frequencyRangeSlider.width, height - 45);
}

function togglePlay() {
  if (song.isPlaying()) {
    song.pause();
  } else {
    song.play();
  }
}

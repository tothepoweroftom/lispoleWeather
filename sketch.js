var weather;

//background image
var img; // Declare variable 'img'.

//Audio
var players = [];



//CLOUD SYSTEM
var clouds = [];
var cnvs;
var cloudToggle = false;

//Rain System
var rainSystem;
var rainToggle = false;

var mistToggle=false;

var clearToggle=false;


function Cloud(img, canvas) {
  this.image = loadImage(img);
  this.x = 0;
  this.y = 0;
  this.location = createVector(this.x, this.y);
  this.velocity = createVector(0.001, 0);
  this.acceleration = createVector(-0.01, 0.001);
  Cloud.prototype.display = function() {
    image(this.image, this.location.x, this.location.y);

  };
  Cloud.prototype.update = function() {
    this.velocity.add(this.acceleration);
    this.location.add(this.velocity);
    if (this.location.y > 0) {
      this.acceleration = createVector(random(0.0001), random(-0.001, 0));
    } else if (this.location.y < canvas.height / 6) {
      this.acceleration = createVector(random(-0.0001), random(0.001));

    } else if (this.location.x <= 0) {
      this.velocity = createVector(random(0.1), 0)

    } else if (this.location.x >= canvas.width) {
      this.velocity = createVector(-0.01, 0)
    }
  };
  Cloud.prototype.run = function() {
    this.update();
    this.display();
  };
}

function Particle(_location, type) {
    this.location = _location;
    this.velocity = createVector(0, random(-2, 0));
    this.acceleration = createVector(0, 0.25);
    this.lifespan = 255.0;
    this.size = [random(1,4), random(3,7)];
    Particle.prototype.display = function() {
      stroke(0, this.lifespan);
      strokeWeight(2);
      noStroke();

      if(type === 1) {
      fill(50, 16, 250, this.lifespan);
      ellipse(this.location.x, this.location.y, this.size[0], this.size[1]);
      }
      if(type === 2){
        this.velocity = createVector(random(-1,1), random(-1,1));
        fill(random(150,240), this.lifespan);
        ellipse(this.location.x, this.location.y, 3, 3);

      }
    };
    Particle.prototype.update = function() {
      this.velocity.add(this.acceleration);
      this.location.add(this.velocity);
      this.lifespan -= 1.0;
    };
    Particle.prototype.run = function() {
      this.update();
      this.display();
    };

    Particle.prototype.isDead = function() {
      if (this.lifespan < 0.0) {
        return true;
      } else {
        return false;
      }
    };




  }

function ParticleSystem(_location, _width, type) {
    this.origin = _location;
    this.particles = [];
    this.wind = createVector(random(-0.15, 0.15), random(0.1, 0.35));

    ParticleSystem.prototype.addParticle = function() {

      if(type === 1){
      this.particles.push(new Particle(createVector(random(0, _width), -10), type));
      this.particles.push(new Particle(createVector(random(0, _width), -100), type));
      this.particles.push(new Particle(createVector(random(0, _width), -50), type));
    }

    if(type === 2) {
      this.particles.push(new Particle(createVector(random(0, _width), random(0, _width)), type));
      this.particles.push(new Particle(createVector(random(0, _width), random(0, _width)), type));
      this.particles.push(new Particle(createVector(random(0, _width), random(0, _width)), type));


    }

    }

    ParticleSystem.prototype.run = function() {
      for (var i = this.particles.length - 1; i >= 0; i--) {
        var p = this.particles[i];
        // p.acceleration = this.wind;
        p.run();
        if (p.isDead()) {
          this.particles.splice(i, 1);
        }
      }

    }


  }



function preload() {
    players[0] = new Tone.Player({
      "url": "./assets/audio/rain.mp3",
      "loop": true,
    }).toMaster();

    players[1] = new Tone.Player({
      "url": "./assets/audio/cloud.mp3",
      "loop": true,
    }).toMaster();

    players[2] = new Tone.Player({
      "url": "./assets/audio/figmist.mp3",
      "loop": true,
    }).toMaster();

    players[3] = new Tone.Player({
      "url": "./assets/audio/sun.mp3",
      "loop": true,
    }).toMaster();


    img = loadImage("./assets/background.png");



    if(window.innerHeight > window.innerWidth){
    alert("Please use Landscape!");
    }


//
// var frames = document.getElementsByClassName('mask');
// var frame = frames[0];
cnvs = createCanvas(windowWidth, windowHeight);
cnvs.style('z-index:0');
// cnvs.id('weather');
centreCanvas();
for (var i = 0; i < 12; i++) {
  var string = String((i % 6 + 1));
  clouds[i] = new Cloud("./assets/cloud" + string + ".png", cnvs);



}


  }

  function setup() {

    background(255);
    // cnvs.size(windowWidth*0.5, windowHeight*0.5);

    loadJSON('http://api.openweathermap.org/data/2.5/weather?q=Lispole&APPID=857ab91dfeea0158a9fc8003204c4643', gotData);
    var gap = cnvs.width/clouds.length;

    for (var i = 0; i < clouds.length; i++) {

      clouds[i].location = createVector(-100 + i * gap, random(100));

    }


      rainSystem = new ParticleSystem(createVector(width / 2, 50), cnvs.width, 1);
      mistSystem = new ParticleSystem(createVector(width / 2, height/2), cnvs.width, 2);



  }

  // function canvasResized(){
  //   can

  // }

  function gotData(data) {

    if(data){
        print(data);
        weather = data;
        print(weather.weather[0].id);


        if (weather.weather[0].id >= 800 && weather.weather[0].id < 900) {
          cloudToggle = true;
        }
        if (weather.weather[0].id >= 300 && weather.weather[0].id < 600) {
          rainToggle = true;
          cloudToggle = true;
          mistToggle = false;

        }
        if (weather.weather[0].id >= 700 && weather.weather[0].id < 800) {
          cloudToggle=false;
          rainToggle=false;
          mistToggle= true;
        }
        if (weather.weather[0].id === 800) {
          clearToggle=true;
        }


  }
  }

  function printWeather(){
    if(weather){
      var elt = document.getElementById("weatherText");
      var string = "There is currently " + weather.weather[0].main + " in Lispole.";
      elt.innerHTML = string;
    }

  }

  function draw() {
    //background(230);
    noStroke();
    if(clearToggle){
    fill(102, 204, 255, 150);
  } else {
    fill(240,150);
  }
    rect(0, 0, cnvs.width, cnvs.height);
    printWeather();
  //  image(img, 0, 0);




    if (cloudToggle) {
      for (var i = 0; i < clouds.length; i++) {
        clouds[i].run();

      }
      players[0].mute = true;
      players[1].start();

    }

    if (rainToggle) {
      rainSystem.addParticle();
      rainSystem.run();
      players[0].start();

    }

    if (mistToggle) {
      mistSystem.addParticle();
      mistSystem.run();
      players[2].start();
    }



  }


  function centreCanvas(){


    var x = (windowWidth- cnvs.width)/2;
    var y = (windowHeight - cnvs.height)/2;
    cnvs.position(x,y);
  }

  function windowResize(){

    centreCanvas();

  }

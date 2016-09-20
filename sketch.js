var weather;

//background image
var img; // Declare variable 'img'.



//CLOUD SYSTEM
var clouds = [];
var cnvs;
var cloudToggle = true;

//Rain System
var rainSystem;
var rainSet = true;

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

  function Particle(_location) {
    this.location = _location;
    this.velocity = createVector(0, random(-3, 0));
    this.acceleration = createVector(0, 0.25);
    this.lifespan = 255.0;
    this.size = [random(1,4), random(3,7)];
    Particle.prototype.display = function() {
      stroke(0, this.lifespan);
      strokeWeight(2);
      noStroke();

      fill(50, 16, 250, this.lifespan);
      ellipse(this.location.x, this.location.y, this.size[0], this.size[1]);
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

  function ParticleSystem(_location, _width) {
    this.origin = _location;
    this.particles = [];
    this.wind = createVector(random(-0.15, 0.15), random(0.1, 0.35));

    ParticleSystem.prototype.addParticle = function() {
      this.particles.push(new Particle(createVector(random(0, _width), -10)));
      this.particles.push(new Particle(createVector(random(0, _width), -100)));
      this.particles.push(new Particle(createVector(random(0, _width), -50)));

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

    if (rainSet) {
      rainSystem = new ParticleSystem(createVector(width / 2, 50), cnvs.width);
    }



  }

  // function canvasResized(){
  //   can

  // }

  function gotData(data) {
    print(data);
    weather = data;
    print(weather.weather[0].id);
    if (weather.weather[0].id >= 800 && weather.weather[0].id < 900) {
      cloudToggle = true;
    }
  }

  function draw() {
    //background(230);
    noStroke();
    fill(240, 150);
    rect(0, 0, cnvs.width, cnvs.height);
  //  image(img, 0, 0);




    if (cloudToggle) {
      for (var i = 0; i < clouds.length; i++) {
        clouds[i].run();

      }
    }

    if (rainSet) {
      rainSystem.addParticle();
      rainSystem.run();
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

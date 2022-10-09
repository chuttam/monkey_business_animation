var sketchProc = function(processingInstance) {
    with (processingInstance) {
      size(600, 600); 
      frameRate(60);    
      smooth();
      
  Object.constructor.prototype.new = function() {
      var obj = Object.create(this.prototype);
      this.apply(obj, arguments);
      return obj;
  };
  
  var Cactus = (function() {
      Cactus = function(args) {
          this.x = args.x || 100; //100 is just off the right of the screen
          this.y = args.y || 0; //10 is pot on the ground
          this.colors = args.colors || {
              pot: color(123, 206, 246),
              cactus: color(100, 189, 107),
              shadow: color(40, 40, 40, 20)
          };
          this.anim = {
              cactus: { // bezier(541, 449, 541, 469, 541, 488, 541, 507);
                  x1: 541,
                  y1: 449,
                  x2: 541,
                  y2: 469,
                  x3: 541,
                  y3: 488,
                  x4: 541,
                  y4: 507,
                  xoff: 0
              },
              feet: {
                  y1: 0,
                  y2: 0,
                  speed: 25
              }
          };
          this.timer = args.timer || 0;
          this.state = args.state || 0;
      };
      Cactus.prototype = {
          draw: function() {
              pushMatrix();
                  translate(this.x, this.y);
                  
                  //cactus
                  noFill();
                  stroke(this.colors.cactus);
                  strokeWeight(21);
                  // bezier(541, 449, 541, 469, 541, 488, 541, 507);
                  bezier( this.anim.cactus.x1 + this.anim.cactus.xoff, this.anim.cactus.y1, 
                          this.anim.cactus.x2 + this.anim.cactus.xoff * 0.75, this.anim.cactus.y2, 
                          this.anim.cactus.x3 + this.anim.cactus.xoff * 0.5, this.anim.cactus.y3, 
                          this.anim.cactus.x4, this.anim.cactus.y4);
                  
                  //branches
                  strokeWeight(10);
                  //left branch
                  bezier( 541 + this.anim.cactus.xoff, 470, 
                          529 + this.anim.cactus.xoff, 470, 
                          520 + this.anim.cactus.xoff, 475, 
                          520 + this.anim.cactus.xoff, 459);
                  //right branch
                  bezier( 540 + this.anim.cactus.xoff, 481, 
                          552 + this.anim.cactus.xoff, 482, 
                          561 + this.anim.cactus.xoff, 484, 
                          561 + this.anim.cactus.xoff, 473);
                  
                  //feet
                  strokeWeight(8);
                  line(533, 536, 533, 550 + this.anim.feet.y1);
                  line(546, 536, 546, 550 + this.anim.feet.y2);
                  strokeWeight(1);
                  
                  //pot
                  noStroke();
                  fill(this.colors.pot);
                  quad(517, 500, 562, 500, 554, 545, 525, 545);
                  fill(this.colors.shadow);
                  quad(540, 500, 562, 500, 554, 545, 540, 545);
              popMatrix();
          },
          update: function() {
              this.timer = (this.timer + 1) % 210;
              
              switch(this.state) {
                  case 0: //walk in
                      this.x = constrain(this.x - 2, 0, this.x);
                      
                      if(this.x > 0) {
                          var s = sin(radians(this.timer * this.anim.feet.speed)) * 5;
                          this.anim.feet.y1 = constrain(s, -5, 0);
                          this.anim.feet.y2 = constrain(-s, -5, 0);
                      }
                      else {
                          this.anim.feet.y1 = ~~lerp(this.anim.feet.y1, 0, 0.10);
                          this.anim.feet.y2 = ~~lerp(this.anim.feet.y2, 0, 0.10);
                          
                          this.anim.cactus.xoff = lerp(this.anim.cactus.xoff, 0, 0.15);
                      }
  
                      if(this.timer >= 90) {
                          this.state++;
                      }
                      
                      break;
                  case 1: //sit
                      this.y = constrain(this.y + 2.0, this.y, 10);
                      this.anim.feet.y1 = constrain(this.anim.feet.y1 - 2, -10, this.anim.feet.y1);
                      this.anim.feet.y2 = constrain(this.anim.feet.y2 - 2, -10, this.anim.feet.y2);
                      
                      if(this.timer >= 150) {
                          this.state++;
                      }
                      
                      break;
                  case 2: //slide out
                      this.x = constrain(this.x + 4, 0, 100);
                      
                      this.anim.cactus.xoff = lerp(this.anim.cactus.xoff, -10, 0.20);
                      
                      if(this.timer === 0) {
                          this.y = 0;
                          this.anim.feet.y1 = 0;
                          this.anim.feet.y2 = 0;
                          this.anim.cactus.xoff = 15;
                          this.state = 0;
                      }
                      
                      break;
              }
          },
          go: function() {
              this.draw();
              this.update();
          }
      };
      return Cactus;
  })();
  
  var Cup = (function() {
      Cup = function(args) {
          this.x = args.x || 0;
          this.y = args.y || 0;
          this.timer = args.timer || 0;
          this.move = 0;
          this.colors = args.colors || {
              cup: color(247, 132, 32),
              bag: color(254, 156, 48),
              shadow: color(40, 40, 40, 20),
              face: color(255, 231, 239)
          };
          this.steam = [
              {
                  x: 404,
                  y: 335,
                  vy: -0.15,
                  vx: 1.05,
                  opacity: 255,
                  bx: 404,
                  by: 360,
                  diameter: 5
              },
              {
                  x: 411,
                  y: 335,
                  vy: -0.12,
                  vx: 1.00,
                  opacity: 255,
                  bx: 411,
                  by: 355,
                  diameter: 4
              },
              {
                  x: 419,
                  y: 335,
                  vy: -0.18,
                  vx: 1.10,
                  opacity: 255,
                  bx: 419,
                  by: 360,
                  diameter: 5
              }
          ];
          this.teabag = {
              angle: 0,
              one: 0,
              two: 30,
              three: -15
          };
      };
      Cup.prototype = {
          draw: function() {
              pushMatrix();
                  translate(this.x, this.y + sin(radians(this.move * 3)) * 5);
                  translate(442, 368);
                  rotate(radians(-2));
                  translate(-442, -368);
                  
                  //steam (animated)
                  noStroke();
                  for(var i = 0; i < this.steam.length; i++) {
                      var item = this.steam[i];
                      fill(255, item.opacity);
                      ellipse(item.x, item.y, item.diameter, item.diameter);
                  }
                  
                  //handle
                  noFill();
                  stroke(this.colors.cup);
                  strokeWeight(5);
                  ellipse(432, 358, 20, 20);
                  strokeWeight(1);
                  
                  //cup
                  noStroke();
                  fill(this.colors.cup);
                  rect(394, 343, 35, 42, 3);
                  //shading
                  fill(this.colors.shadow);
                  rect(411, 343, 18, 42, 0, 3, 3, 0);
                  
                  //teabag
                  pushMatrix();
                      translate(409, 343);
                      rotate(radians(this.teabag.angle));
                      translate(-409, -343);
                      
                      strokeWeight(2);
                      stroke(this.colors.bag);
                      bezier(409, 343, 405, 347, 405, 351, 405, 360);
                      strokeWeight(1);
                      noStroke();
                      fill(this.colors.bag);
                      rect(400, 356, 10, 10, 3);
                  popMatrix();
                  
                  //monkey hand over the handle
                  noStroke();
                  fill(this.colors.face);
                  ellipse(449, 358, 30, 30);
                  
              popMatrix();
          },
          update: function() {
              this.timer = (this.timer + 1) % 210;
              this.move++;
              
              //move the steam
              for(var i = 0; i < this.steam.length; i++) {
                  var item = this.steam[i];
                  
                  if(this.timer > 30 && this.timer < 60) {
                      item.opacity-= 8;
                      item.x+= item.vx;
                  }
                  if(this.timer < 240) {
                      item.y+= item.vy;
                  }
                  if(this.timer === 60) {
                      item.opacity = 255;
                      item.x = item.bx;
                      item.y = item.by;
                  }
              }
              
              //rotate teabag
              if(this.timer > 5 && this.timer < 15) {
                  this.teabag.angle = lerp(this.teabag.angle, this.teabag.two, 0.3);
              }
              else if(this.timer > 15 && this.timer < 30) {
                  this.teabag.angle = lerp(this.teabag.angle, this.teabag.three, 0.2);
              }
              
              else {
                  this.teabag.angle = lerp(this.teabag.angle, this.teabag.one, 0.2);
              }
          },
          go: function() {
              this.draw();
              this.update();
          }
      };
      return Cup;
  })();
  
  var Phone = (function() {
      Phone = function(args) {
          this.x = args.x || 0;
          this.y = args.y || 0;
          this.w = args.w || 16;
          this.h = args.h || 50;
          this.angle = args.angle || 0;
          this.timer = args.timer || 0;
          this.move = 0;
          this.colors = args.colors || {
              phone: color(255, 255, 255),
              antenna: color(164, 164, 164),
              shadow: color(231, 231, 231),
              face: color(255, 231, 239)
          };
      };
      Phone.prototype = {
          draw: function() {
              pushMatrix();
                  translate(this.x, this.y + sin(radians(this.move * 3)) * 5);
                  
                  pushMatrix();
                      translate(310 + this.w/2, 343 + this.h/2);
                      rotate(radians(this.angle));
  
                      //phone
                      noStroke();
                      fill(this.colors.phone);
                      rect(2, -30, this.w, this.h, 4);
                      fill(this.colors.shadow);
                      rect(12, -30, this.w - 10, this.h, 0, 8, 8, 0);
                      //antenna
                      strokeWeight(3);
                      stroke(this.colors.antenna);
                      line(8, -this.h * 0.5, 8, -this.h * 0.75);
                      strokeWeight(1);
                  popMatrix();
  
                  //monkey hand over the handle
                  noStroke();
                  fill(this.colors.face);
                  ellipse(314, 370, 30, 30);
              popMatrix();
          },
          update: function() {
              this.timer = (this.timer + 1) % 210;
              this.move++;
  
              //rotate phone
              if(this.timer < 45) {
                  this.angle = lerp(this.angle, 30, 0.3);
              }
              else if(this.timer >= 45 && this.timer < 60) {
                  this.angle = random(25, 35);
              }
              else if(this.timer >= 60 && this.timer < 80) {
                  this.angle = lerp(this.angle, 30, 0.3);
              }
              else {
                  this.angle = lerp(this.angle, -10, 0.2);
              }
          },
          go: function() {
              this.draw();
              this.update();
          }
      };
      return Phone;
  })();
  
  var Paper = (function() {
      Paper = function(args) {
          this.x = args.x || 400;
          this.y = args.y || -100;
          this.w = args.w || 100;
          this.h = args.h || 134;
          this.angle = args.angle || 0;
          this.timer = args.timer || 0;
          this.move = 0;
          this.colors = args.colors || {
              paper: color(255, 255, 255),
              lines: color(214, 214, 214),
              body: color(234, 82, 82),
              face: color(255, 231, 239)
          };
          this.anim = {
              paper: {
                  x: 0,
                  y: 0,
                  angle: 0,
                  one: {
                      x: 183,
                      y: 188,
                      angle: 40
                  },
                  two: {
                      x: -100,
                      y: 200,
                      angle: 0
                  },
                  three: {
                      x: 400,
                      y: -100,
                      angle: 0
                  }
              },
              leg: {
                  x: 195,
                  y: 282,
                  one: {
                      x: 183,
                      y: 188
                  },
                  two: {
                      x: 231,
                      y: 296
                  },
                  three: {
                      x: 195,
                      y: 282
                  }
              },
              arms: {
                  top: {
                      x1: 70,
                      y1: -100,
                      x2: 120,
                      y2: -80,
                      x3: 170,
                      y3: -60,
                      x4: 220,
                      y4: -40,
                      one: {
                          x1: 70,
                          y1: -100,
                          x2: 120,
                          y2: -80,
                          x3: 170,
                          y3: -60,
                          x4: 220,
                          y4: -40, 
                      },
                      two: {
                          x1: 70,
                          y1: -20,
                          x2: 80,
                          y2: 50,
                          x3: 90,
                          y3: 90,
                          x4: 110,
                          y4: 125
                      }
                  },
                  left: {
                      x1: -10,
                      y1: 400,
                      x2: -60,
                      y2: 400,
                      x3: -40,
                      y3: 400,
                      x4: -20,
                      y4: 395,
                      one: {
                          x1: -10,
                          y1: 400,
                          x2: 40,
                          y2: 380,
                          x3: 70,
                          y3: 360,
                          x4: 105,
                          y4: 335 
                      },
                      two: {
                          x1: -20,
                          y1: 400,
                          x2: -20,
                          y2: 380,
                          x3: -20,
                          y3: 360,
                          x4: -20,
                          y4: 265 
                      },
                      three: {
                          x1: -10,
                          y1: 400,
                          x2: -60,
                          y2: 400,
                          x3: -40,
                          y3: 400,
                          x4: -20,
                          y4: 395 
                      }
                  }
              }
          };
      };
      Paper.prototype = {
          draw: function() {
              pushMatrix();
                  translate(this.x, this.y + sin(radians(this.move * 3)) * 5);
                  rotate(radians(this.anim.paper.angle));
                  
                  //paper
                  noStroke();
                  fill(this.colors.paper);
                  rect(-this.w, -this.h * 0.5, this.w, this.h);
                  
                  //lines on paper
                  stroke(this.colors.lines);
                  strokeWeight(4);
                  for(var i = 0; i < 4; i++) {
                      line(-this.w * 0.87, -this.h * 0.38 + i*28, -this.w * 0.2, -this.h * 0.38 + i*28);
                      line(-this.w * 0.87, -this.h * 0.32 + i*28, -this.w * 0.5, -this.h * 0.32 + i*28);
                  }
                  strokeWeight(1);
              popMatrix();
              
              //left arm
              noFill();
              strokeWeight(15);
              stroke(this.colors.body);
              bezier( this.anim.arms.left.x1, this.anim.arms.left.y1,
                      this.anim.arms.left.x2, this.anim.arms.left.y2,
                      this.anim.arms.left.x3, this.anim.arms.left.y3,
                      this.anim.arms.left.x4, this.anim.arms.left.y4);
              strokeWeight(1);
              noStroke();
              fill(this.colors.face);
              ellipse(this.anim.arms.left.x4, this.anim.arms.left.y4, 30, 30);
              
              //top arm
              noFill();
              strokeWeight(15);
              stroke(this.colors.body);
              bezier( this.anim.arms.top.x1, this.anim.arms.top.y1,
                      this.anim.arms.top.x2, this.anim.arms.top.y2,
                      this.anim.arms.top.x3, this.anim.arms.top.y3,
                      this.anim.arms.top.x4, this.anim.arms.top.y4 + sin(radians(this.move * 3)) * 5);
              strokeWeight(1);
              noStroke();
              fill(this.colors.face);
              ellipse(this.anim.arms.top.x4, this.anim.arms.top.y4 + sin(radians(this.move * 3)) * 5, 30, 30);
          },
          updateLimbs: function(from, to, speed) {
              from.x2 = lerp(from.x2, to.x2, speed);
              from.y2 = lerp(from.y2, to.y2, speed);
              from.x3 = lerp(from.x3, to.x3, speed);
              from.y3 = lerp(from.y3, to.y3, speed);
              from.x4 = lerp(from.x4, to.x4, speed);
              from.y4 = lerp(from.y4, to.y4, speed);
          },
          update: function() {
              this.timer = (this.timer + 1) % 210;
              this.move++;
              
              //left arm
              if(this.timer < 165) {
                  this.updateLimbs(this.anim.arms.left, this.anim.arms.left.three, 0.1);
              }
              else if(this.timer < 195) {
                  this.updateLimbs(this.anim.arms.left, this.anim.arms.left.one, 0.2);
              }
              else {
                  this.updateLimbs(this.anim.arms.left, this.anim.arms.left.two, 0.2);
              }
              
              //top arm
              if(this.timer > 5 && this.timer < 70) {
                  this.updateLimbs(this.anim.arms.top, this.anim.arms.top.two, 0.12);
              }
              else {
                  this.updateLimbs(this.anim.arms.top, this.anim.arms.top.one, 0.1);
              }
  
              //calculate position of arm/hand
              if(this.timer < 60) {
                  this.anim.leg.x = lerp(this.anim.leg.x, this.anim.leg.one.x, 0.1);
                  this.anim.leg.y = lerp(this.anim.leg.y, this.anim.leg.one.y, 0.1);
              }
              else if(this.timer < 180) {
                  this.anim.leg.x = lerp(this.anim.leg.x, this.anim.leg.two.x, 0.1);
                  this.anim.leg.y = lerp(this.anim.leg.y, this.anim.leg.two.y, 0.1);
              }
              else {
                  this.anim.leg.x = lerp(this.anim.leg.x, this.anim.leg.three.x, 0.2);
                  this.anim.leg.y = lerp(this.anim.leg.y, this.anim.leg.three.y, 0.2);
              }
              
              //move/rotate paper
              if(this.timer < 60) {
                  this.x = lerp(this.x, this.anim.paper.one.x, 0.1);
                  this.y = lerp(this.y, this.anim.paper.one.y, 0.1);
                  this.anim.paper.angle = lerp(this.anim.paper.angle, this.anim.paper.one.angle, 0.1);
              }
              else if(this.timer < 180) {
                  this.x = this.anim.leg.x;
                  this.y = this.anim.leg.y;
                  this.anim.paper.angle = lerp(this.anim.paper.angle, -50, 0.1);
              }
              else if(this.timer < 195) {
                  this.x = this.anim.leg.x;
                  this.y = this.anim.leg.y;
                  this.anim.paper.angle = lerp(this.anim.paper.angle, -30, 0.1);
              }
              else if(this.timer < 209) {
                  this.x = lerp(this.x, this.anim.paper.two.x, 0.1);
                  this.y = lerp(this.y, this.anim.paper.two.y, 0.1);
                  this.anim.paper.angle = lerp(this.anim.paper.angle, this.anim.paper.two.angle, 0.1);
              }
              else {
                  this.x = this.anim.paper.three.x;
                  this.y = this.anim.paper.three.y;
                  this.anim.paper.angle = 0;
              }
          },
          go: function() {
              this.draw();
              this.update();
          }
      };
      return Paper;
  })();
  
  var Monkey = (function() {
      Monkey = function(args) {
          this.x = args.x || 0;
          this.y = args.y || 0;
          this.timer = args.timer || 0;
          this.move = 0;
          this.speed = args.speed || 2;
          this.state = args.state || 0;
          this.colors = args.colors || {
              body: color(234, 82, 82),
              face: color(255, 231, 239),
              shadow: color(40, 40, 40, 20),
              black: color(67)
          };
          this.anim = {
              body: {
                  x: 0,
                  y: 0
              },
              face: {
                  x: 0,
                  y: 0
              },
              eyes: {
                  x: 0,
                  y: 0
              },
              mouth: {
                  x: 0,
                  diameter: 5
              },
              tail: {
                  x1: 433,
                  y1: -10,
                  x2: 443,
                  y2: 120,
                  x3: 392,
                  y3: 60,
                  x4: 400,
                  y4: 177
              },
              arms: {
                  right: { // bezier(361, 240, 251, 264, 234, 362, 328, 327);
                      x1: 361,
                      y1: 240,
                      x2: 251,
                      y2: 230,
                      x3: 234,
                      y3: 346,
                      x4: 323,
                      y4: 366,
                      one: {
                          x1: 361,
                          y1: 240,
                          x2: 251,
                          y2: 230,
                          x3: 234,
                          y3: 346,
                          x4: 323,
                          y4: 366
                      },
                      two: {
                          x1: 361,
                          y1: 240,
                          x2: 251,
                          y2: 264,
                          x3: 234,
                          y3: 362,
                          x4: 333,
                          y4: 327 
                      },
                      timer: 0
                  },
                  left: { // bezier(435, 307, 492, 375, 504, 445, 437, 504);
                      x1: 435,
                      y1: 307,
                      x2: 492,
                      y2: 375,
                      x3: 504,
                      y3: 445,
                      x4: 437,
                      y4: 504,
                      one: {
                          x1: 435,
                          y1: 307,
                          x2: 492,
                          y2: 375,
                          x3: 504,
                          y3: 445,
                          x4: 437,
                          y4: 504
                      },
                      two: {
                          x1: 435,
                          y1: 307,
                          x2: 492,
                          y2: 375,
                          x3: 504,
                          y3: 445,
                          x4: 437,
                          y4: 530
                      },
                      three: {
                          x1: 435,
                          y1: 307,
                          x2: 492,
                          y2: 375,
                          x3: 504,
                          y3: 445,
                          x4: 461,
                          y4: 530
                      },
                      four: {
                          x1: 435,
                          y1: 307,
                          x2: 512,
                          y2: 345,
                          x3: 544,
                          y3: 425,
                          x4: 585,
                          y4: 490
                      },
                      timer: 0
                  }
              },
              legs: {
                  right: { // bezier(366, 184, 293, 174, 234, 241, 195, 282);
                      x1: 366,
                      y1: 184,
                      x2: 293,
                      y2: 174,
                      x3: 234,
                      y3: 241,
                      x4: 195,
                      y4: 282,
                      one: {
                          x1: 366,
                          y1: 184,
                          x2: 293,
                          y2: 144,
                          x3: 234,
                          y3: 171,
                          x4: 183,
                          y4: 188
                      },
                      two: {
                          x1: 366,
                          y1: 184,
                          x2: 293,
                          y2: 174,
                          x3: 249,
                          y3: 241,
                          x4: 231,
                          y4: 296
                      },
                      three: {
                          x1: 366,
                          y1: 184,
                          x2: 293,
                          y2: 174,
                          x3: 234,
                          y3: 241,
                          x4: 195,
                          y4: 282
                      },
                      timer: 0
                  },
                  left: { // bezier(421, 186, 522, 247, 535, 304, 459, 377);
                      x1: 421,
                      y1: 186,
                      x2: 522,
                      y2: 247,
                      x3: 535,
                      y3: 304,
                      x4: 459,
                      y4: 377,
                      one: {
                          x1: 421,
                          y1: 186,
                          x2: 522,
                          y2: 247,
                          x3: 535,
                          y3: 304,
                          x4: 459,
                          y4: 377
                      },
                      two: {
                          x1: 421,
                          y1: 186,
                          x2: 522,
                          y2: 227,
                          x3: 535,
                          y3: 284,
                          x4: 449,
                          y4: 357
                      },
                      timer: 0
                  }
              }
          };
      };
      Monkey.prototype = {
          draw: function() {
              pushMatrix();
                  translate(0, sin(radians(this.move * 3)) * 5);
                  
                  //tail
                  noFill();
                  stroke(this.colors.body);
                  strokeWeight(15);
                  pushMatrix();
                      translate(0, cos(radians(this.move * 3)) * 5);
                      bezier(433, -20, 443, 125, 388, 40, 400, 182);
                      popMatrix();
                  strokeWeight(1);
                  
                  //right arm
                  noFill();
                  stroke(this.colors.body);
                  strokeWeight(15);
                  bezier( this.anim.arms.right.x1, this.anim.arms.right.y1,
                          this.anim.arms.right.x2, this.anim.arms.right.y2,
                          this.anim.arms.right.x3, this.anim.arms.right.y3,
                          this.anim.arms.right.x4, this.anim.arms.right.y4);
                  //right hand
                  noStroke();
                  fill(this.colors.face);
                  ellipse(this.anim.arms.right.x4, this.anim.arms.right.y4, 30, 30);
                  
                  //left arm
                  noFill();
                  stroke(this.colors.body);
                  strokeWeight(15);
                  bezier( this.anim.arms.left.x1, this.anim.arms.left.y1,
                          this.anim.arms.left.x2, this.anim.arms.left.y2,
                          this.anim.arms.left.x3, this.anim.arms.left.y3,
                          this.anim.arms.left.x4, this.anim.arms.left.y4 - sin(radians(this.move * 3)) * 5);
                  //left hand
                  noStroke();
                  fill(this.colors.face);
                  ellipse(this.anim.arms.left.x4, this.anim.arms.left.y4 - sin(radians(this.move * 3)) * 5, 30, 30);
                  
                  //legs
                  noFill();
                  stroke(this.colors.body);
                  strokeWeight(15);
                  //right leg
                  bezier( this.anim.legs.right.x1, this.anim.legs.right.y1,
                          this.anim.legs.right.x2, this.anim.legs.right.y2,
                          this.anim.legs.right.x3, this.anim.legs.right.y3,
                          this.anim.legs.right.x4, this.anim.legs.right.y4);
                  //right foot
                  noStroke();
                  fill(this.colors.face);
                  ellipse(this.anim.legs.right.x4, this.anim.legs.right.y4, 30, 30);
                  
                  //left leg
                  noFill();
                  stroke(this.colors.body);
                  strokeWeight(15);
                  bezier( this.anim.legs.left.x1, this.anim.legs.left.y1,
                          this.anim.legs.left.x2, this.anim.legs.left.y2,
                          this.anim.legs.left.x3, this.anim.legs.left.y3,
                          this.anim.legs.left.x4, this.anim.legs.left.y4);
                  //left foot
                  noStroke();
                  fill(this.colors.face);
                  ellipse(this.anim.legs.left.x4, this.anim.legs.left.y4, 30, 30);
                  strokeWeight(1);
                  
                  //body
                  fill(this.colors.body);
                  rect(348, 199, 96, 100);
                  fill(this.colors.shadow);
                  rect(348 + 48, 199, 96 - 48, 100);
                  //arcs
                  fill(this.colors.body);
                  arc(348 + 48, 200, 96, 89, radians(180), radians(360));
                  fill(this.colors.shadow);
                  arc(348 + 48, 200, 96, 89, radians(270), radians(360));
                  
                  //right ear
                  fill(this.colors.body);
                  ellipse(339, 285, 30, 30);
                  fill(this.colors.face);
                  ellipse(341, 286, 21, 20);
                  
                  //left ear
                  fill(this.colors.body);
                  ellipse(454, 285, 30, 30);
                  fill(this.colors.face);
                  ellipse(452, 286, 21, 20);
                  fill(this.colors.shadow);
                  ellipse(454, 285, 30, 30);
                  
                  //head
                  noStroke();
                  fill(this.colors.body);
                  ellipse(397, 303, 104, 104);
                  fill(this.colors.shadow);
                  arc(397, 303, 104, 104, radians(-90), radians(90));
                  
                  //face
                  pushMatrix();
                      translate(this.anim.face.x, this.anim.face.y);
       
                      //face
                      //right eye
                      fill(this.colors.face);
                      ellipse(380, 299, 46, 46);
                      
                      //left eye
                      fill(this.colors.face);
                      ellipse(412, 299, 46, 46);
                      fill(this.colors.shadow);
                      ellipse(412, 299, 46, 46);
                      fill(this.colors.face);
                      rect(389, 283, 8, 15);
                      
                      //nose
                      fill(this.colors.face);
                      ellipse(397, 316, 41, 41);
                      fill(this.colors.shadow);
                      arc(397, 316, 41, 41, radians(-90), radians(90));
                      
                      //nostrils
                      fill(this.colors.black);
                      ellipse(393, 311, 4, 4);
                      ellipse(400, 311, 4, 4);
      
                      //right eye ball
                      fill(this.colors.black);
                      ellipse(380 + this.anim.eyes.x, 299 + this.anim.eyes.y, 9, 9);
                      
                      //left eye ball
                      fill(this.colors.black);
                      ellipse(412 + this.anim.eyes.x, 299 + this.anim.eyes.y, 9, 9);
                      
                      //mouth
                      fill(this.colors.black);
                      ellipse(397 + this.anim.mouth.x, 323, this.anim.mouth.diameter, this.anim.mouth.diameter);
                  popMatrix();
              popMatrix();
          },
          updateLimbs: function(from, to, speed) {
              from.x2 = lerp(from.x2, to.x2, speed);
              from.y2 = lerp(from.y2, to.y2, speed);
              from.x3 = lerp(from.x3, to.x3, speed);
              from.y3 = lerp(from.y3, to.y3, speed);
              from.x4 = lerp(from.x4, to.x4, speed);
              from.y4 = lerp(from.y4, to.y4, speed);
          },
          updateLeftLeg: function() {
              this.anim.legs.left.timer = (this.anim.legs.left.timer + 1) % 210;
              
              if(this.anim.legs.left.timer < 90) {
                  this.updateLimbs(this.anim.legs.left, this.anim.legs.left.two, 0.2);
              }
              else {
                  this.updateLimbs(this.anim.legs.left, this.anim.legs.left.one, 0.2);
              }
          },
          updateRightLeg: function() {
              this.anim.legs.right.timer = (this.anim.legs.right.timer + 1) % 210;
              
              if(this.anim.legs.right.timer < 60) {
                  this.updateLimbs(this.anim.legs.right, this.anim.legs.right.one, 0.1);
              }
              else if(this.anim.legs.right.timer < 180) {
                  this.updateLimbs(this.anim.legs.right, this.anim.legs.right.two, 0.1);
              }
              else {
                  this.updateLimbs(this.anim.legs.right, this.anim.legs.right.three, 0.2);
              }
          },
          updateRightArm: function() {
              this.anim.arms.right.timer = (this.anim.arms.right.timer + 1) % 210;
              
              if(this.anim.arms.right.timer < 80) {
                  this.updateLimbs(this.anim.arms.right, this.anim.arms.right.one, 0.2);
              }
              else {
                  this.updateLimbs(this.anim.arms.right, this.anim.arms.right.two, 0.2);
              }
          },
          updateLeftArm: function() {
              this.anim.arms.left.timer = (this.anim.arms.left.timer + 1) % 210;
              
              if(this.anim.arms.left.timer < 10) {
                  this.updateLimbs(this.anim.arms.left, this.anim.arms.left.one, 0.2);
              }
              else if(this.anim.arms.left.timer < 20) {
                  this.updateLimbs(this.anim.arms.left, this.anim.arms.left.two, 0.2);
              }
              else if(this.anim.arms.left.timer < 30) {
                  this.updateLimbs(this.anim.arms.left, this.anim.arms.left.one, 0.2);
              }
              else if(this.anim.arms.left.timer < 40) {
                  this.updateLimbs(this.anim.arms.left, this.anim.arms.left.two, 0.2);
              }
              else if(this.anim.arms.left.timer < 50) {
                  this.updateLimbs(this.anim.arms.left, this.anim.arms.left.one, 0.2);
              }
              else if(this.anim.arms.left.timer < 60) {
                  this.updateLimbs(this.anim.arms.left, this.anim.arms.left.two, 0.2);
              }
              else if(this.anim.arms.left.timer < 70) {
                  this.updateLimbs(this.anim.arms.left, this.anim.arms.left.one, 0.2);
              }
              else if(this.anim.arms.left.timer < 80) {
                  this.updateLimbs(this.anim.arms.left, this.anim.arms.left.three, 0.2);
              }
              else if(this.anim.arms.left.timer < 90) {
                  this.updateLimbs(this.anim.arms.left, this.anim.arms.left.one, 0.2);
              }
              else if(this.anim.arms.left.timer < 100) {
                  this.updateLimbs(this.anim.arms.left, this.anim.arms.left.two, 0.2);
              }
              else if(this.anim.arms.left.timer < 145) {
                  this.updateLimbs(this.anim.arms.left, this.anim.arms.left.one, 0.2);
              }
              else if(this.anim.arms.left.timer < 190) {
                  this.updateLimbs(this.anim.arms.left, this.anim.arms.left.four, 0.11);
              }
              else {
                  this.updateLimbs(this.anim.arms.left, this.anim.arms.left.one, 0.2);
              }
          },
          updateFace: function() {
              //face/nostrils
              if(this.timer < 60) {
                  this.anim.face.x = lerp(this.anim.face.x, -2, 0.2);
                  this.anim.face.y = lerp(this.anim.face.y, -2, 0.2);
              }
              else if(this.timer < 120) {
                  this.anim.face.x = lerp(this.anim.face.x, -2, 0.2);
                  this.anim.face.y = lerp(this.anim.face.y, 3, 0.2);
              }
              else if(this.timer < 180) {
                  this.anim.face.x = lerp(this.anim.face.x, 2, 0.2);
                  this.anim.face.y = lerp(this.anim.face.y, 3, 0.2);
              }
              else {
                  this.anim.face.x = lerp(this.anim.face.x, 0, 0.2);
                  this.anim.face.y = lerp(this.anim.face.y, 0, 0.2);
              }
                  
              //eyes
              if(this.timer < 20) {
                  this.anim.eyes.x = lerp(this.anim.eyes.x, 2, 0.2);
                  this.anim.eyes.y = lerp(this.anim.eyes.y, 4, 0.2);
              }
              else if(this.timer < 80) {
                  this.anim.eyes.x = lerp(this.anim.eyes.x, 2, 0.2);
                  this.anim.eyes.y = lerp(this.anim.eyes.y, 4, 0.2);
              }
              else if(this.timer < 100) {
                  this.anim.eyes.x = lerp(this.anim.eyes.x, -2, 0.2);
                  this.anim.eyes.y = lerp(this.anim.eyes.y, 0, 0.2);
              }
              else if(this.timer < 160) {
                  this.anim.eyes.x = lerp(this.anim.eyes.x, 4, 0.2);
                  this.anim.eyes.y = lerp(this.anim.eyes.y, 3, 0.2);
              }
              else if(this.timer < 200) {
                  this.anim.eyes.x = lerp(this.anim.eyes.x, -3, 0.2);
                  this.anim.eyes.y = lerp(this.anim.eyes.y, 1, 0.2);
              }
              else {
                  this.anim.eyes.x = lerp(this.anim.eyes.x, 0, 0.2);
                  this.anim.eyes.y = lerp(this.anim.eyes.y, 0, 0.2);
              }
              
              //mouth
              if(this.timer > 10 && this.timer < 30) {
                  this.anim.mouth.x = lerp(this.anim.mouth.x, 8, 0.2);
                  this.anim.mouth.diameter = lerp(this.anim.mouth.diameter, 10, 0.2);
              }
              else if(this.timer < 50) {
                  this.anim.mouth.x = lerp(this.anim.mouth.x, 7, 0.2);
                  this.anim.mouth.diameter = lerp(this.anim.mouth.diameter, 6, 0.2);
              }
              else if(this.timer < 90) {
                  this.anim.mouth.x = lerp(this.anim.mouth.x, 0, 0.2);
                  this.anim.mouth.diameter = lerp(this.anim.mouth.diameter, 5, 0.2);
              }
              else if(this.timer < 140) {
                  this.anim.mouth.x = lerp(this.anim.mouth.x, -6, 0.2);
                  this.anim.mouth.diameter = lerp(this.anim.mouth.diameter, 5, 0.2);
              }
              else if(this.timer < 180) {
                  this.anim.mouth.x = lerp(this.anim.mouth.x, -6, 0.2);
                  this.anim.mouth.diameter = lerp(this.anim.mouth.diameter, 4, 0.2);
              }
              else {
                  this.anim.mouth.x = lerp(this.anim.mouth.x, -4, 0.2);
                  this.anim.mouth.diameter = lerp(this.anim.mouth.diameter, 5, 0.2);
              }
          },
          update: function() {
              this.timer = (this.timer + 1) % 210;
              this.move++;
              
              this.updateFace();
              this.updateLeftLeg();
              this.updateRightLeg();
              this.updateRightArm();
              this.updateLeftArm();
          },
          go: function() {
              this.draw();
              this.update();
          }
      };
      return Monkey;
  })();
  
  var App = (function() {
      App = function() {
          this.timer = 0;
          this.monkey = Monkey.new({});
          this.cactus = Cactus.new({});
          this.cup = Cup.new({});
          this.phone = Phone.new({});
          this.paper = Paper.new({});
          this.keys = { //animated keys on keyboard
              one: 0,
              two: 0
          };
          this.colors = {
              light: color(255, 247, 225),
              medium: color(255, 247, 172),
              dark: color(255, 239, 130)
          };
          this.font = createFont("Courier", 20);
      };
      App.prototype = {
          office: function() {
              //ground
              noStroke();
              fill(239, 123, 34);
              rect(0, 555, width, 10);
              
              //bottom book
              noStroke();
              fill(90);
              rect(60, 530, 110, 5);
              rect(60, 550, 110, 5);
              rect(60, 530, 10, 25);
              fill(255);
              rect(70, 535, 95, 15);
              
              //middle book
              fill(90, 180, 235);
              rect(70, 510, 94, 5);
              rect(70, 525, 94, 5);
              rect(155, 510, 9, 20);
              fill(255);
              rect(75, 515, 80, 10);
              
              //top book
              fill(125, 205, 245);
              rect(70, 490, 87, 5);
              rect(70, 505, 87, 5);
              rect(70, 490, 7, 20);
              fill(255);
              rect(77, 495, 76, 10);
              
              //pencils
              strokeWeight(5);
              stroke(90, 180, 235);
              line(98, 422, 106, 449);
              stroke(125, 205, 245);
              line(105, 414, 112, 449);
              stroke(100, 190, 100);
              line(134, 409, 126, 449);
              strokeWeight(1);
              
              //pencil holder
              noStroke();
              fill(255);
              rect(98, 440, 35, 50);
              fill(230);
              rect(115, 440, 18, 50);
              
              //keyboard keys
              fill(145);
              for(var i = 0; i < 4; i++) {
                  rect(319 + i * 27, 540, 15, 10, 3);
              }
              
              //last two keys that are animated
              rect(427, 540 + this.keys.one, 15, 10, 3);
              rect(454, 540 + this.keys.two, 15, 10, 3);
              
              //keyboard
              fill(255);
              rect(295, 545, 197, 10);
              
              //computer monitor
              fill(90);
              rect(195, 400, 192, 130, 5);
              //computer stand
              fill(230);
              quad(269, 550, 277, 479, 305, 479, 315, 550);
              //computer base
              fill(214);
              rect(257, 548, 69, 7);
              //logo on computer
              pushStyle();
                  textFont(this.font);
                  textAlign(CENTER, CENTER);
                  fill(214, 50);
                  text(":p", 291, 450);
              popStyle();
          },
          scene: function() {
              background(254, 219, 91);
              
              noStroke();
              fill(this.colors.dark);
              rect(0, 0, 60, 28, 4);
              rect(-20, 40, 60, 28, 4);
              rect(250, 120, 80, 28, 4);
              rect(550, 60, 60, 28, 4);
              rect(40, 325, 65, 28, 4);
              
              fill(this.colors.medium);
              rect(250, 155, 65, 28, 4);
              
              fill(this.colors.light);
              rect(47, 36, 70, 28, 4);
              rect(207, 120, 35, 28, 4);
              
          },
          draw: function() {
              this.scene();
              
              this.paper.go();
              
              this.office();
              
              this.cactus.go();
  
              this.monkey.go();
              
              this.cup.go();
              
              this.phone.go();
          },
          updateKeys: function() {
              if(this.timer > 20 && this.timer < 25) { //first key
                  this.keys.one = lerp(this.keys.one, 3, 0.5);
              }
              else if(this.timer < 35) {
                  this.keys.one = lerp(this.keys.one, 0, 0.5);
              }
              else if(this.timer < 45) { //first key
                  this.keys.one = lerp(this.keys.one, 3, 0.5);
              }
              else if(this.timer < 55) {
                  this.keys.one = lerp(this.keys.one, 0, 0.5);
              }
              else if(this.timer < 65) { //first key
                  this.keys.one = lerp(this.keys.one, 3, 0.5);
              }
              else if(this.timer < 75) {
                  this.keys.one = lerp(this.keys.one, 0, 0.5);
              }
              else if(this.timer < 85) { //second key
                  this.keys.two = lerp(this.keys.two, 3, 0.5);
              }
              else if(this.timer < 95) {
                  this.keys.two = lerp(this.keys.two, 0, 0.5);
              }
              else if(this.timer < 105) { //first key
                  this.keys.one = lerp(this.keys.one, 3, 0.5);
              }
              else {
                  this.keys.one = lerp(this.keys.one, 0, 0.5);
                  this.keys.two = lerp(this.keys.two, 0, 0.5);
              }
          },
          update: function() {
              this.timer = (this.timer + 1) % 210;
              
              this.updateKeys();
  
              this.cup.x = this.monkey.anim.legs.left.x4 - 449;
              this.cup.y = this.monkey.anim.legs.left.y4 - 358;
              
              this.phone.x = this.monkey.anim.arms.right.x4 - 314;
              this.phone.y = this.monkey.anim.arms.right.y4 - 370;
          },
          go: function() {
            this.draw();
            this.update();
          }
      };
      return App;
  })();
  
  var app = new App();
  
  draw = function() {
      app.go();
  };
      
    }
  }
  
  var canvas = document.getElementById("canvas"); 
  var processingInstance = new Processing(canvas, sketchProc);
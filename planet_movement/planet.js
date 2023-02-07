// eden

// The coordinate origin of the moving point in the available area.
var originX;
var originY;

var movingAreaEdgeLength = 600;
var movingAreaLeftUpperX;
var movingAreaLeftUpperY = 65;

var FR = 50;  // Frame rate
var dt;
var simulating = 0;
var type = 0;
// About the GUI
let gui;
let button_reset;
let button_start;
let button_move;

// About the controlling block size.
var controllBlockEdgeLength = 150;
var controlCenterPointXY = controllBlockEdgeLength / 2;

// variables
var G=20000;
var x1, y1, x2, y2;
var m1, m2;
var v1x, v1y, v2x, v2y;
var lastx, lasty;

function in_region(x,y) {
  return (x>-movingAreaEdgeLength/2 && x<movingAreaEdgeLength/2 && y > -movingAreaEdgeLength/2 && y<movingAreaEdgeLength/2);
}
function init_variables() {
  x1=0.0;
  y1=-100.0;
  x2=0.0;
  y2=0.0;
  m1=30.0;
  m2=100.0;
  v1x=100.0;
  v1y=0.0;
  v2x=-30.0;
  v2y=0.0;
  if(type==1){
    v1x=130.0;
    v2x=0;
  }
  lastx=x1;
  lasty=y1;
  massSlider.val = m1;
}


let buffer;  // Image buffer


function setup() {
  createCanvas(800, 1040);
  frameRate(FR);
  dt = 1 / FR;
  originX = width / 2;
  originY = movingAreaLeftUpperY + movingAreaEdgeLength / 2;
  movingAreaLeftUpperX = (width - movingAreaEdgeLength) / 2;

  // Create the GUI.
  gui = createGui();
  button_reset = createButton("重置", originX+200, height-180, 80, 40);
  button_start = createButton("开始", originX+100, height-180, 80, 40);
  button_move = createButton("切换到红球系", originX-80, height-180, 150, 40)

  massSlider = createSlider("mass Slider", movingAreaLeftUpperX+220, 760, 350, 8, 1, 100);
  
  //init variables
  init_variables()

  // Create the buffer for drawing the trajactory.
  buffer = createGraphics(width, height);
  buffer.background(255);
}

function calculate_e(){
  var mu=1.0*m1*m2/(m1+m2);
  var rx=x1-x2;
  var ry=y1-y2;
  
  var vx=(v1x*m1+v2x*m2)/(m1+m2);
  var vy=(v1y*m1+v2y*m2)/(m1+m2);
  var vx=v1x-vx;
  var vy=v1y-vy;
  vx=vx*(m1+m2)/m2;
  vy=vy*(m1+m2)/m2;

  var L=abs(rx*mu*vy-ry*mu*vx);
  var r=sqrt(rx*rx+ry*ry)
  var E=mu*(vx*vx+vy*vy)/2-G*m1*m2/r;
  var e=sqrt(1.0+2.0*L*L*E/mu/(G*m1*m2*G*m1*m2))
  return e
}

function draw() {
  clear();
  background(220);

  // Draw the tittle.
  push()
  textSize(25);
  //textFont("Time New Roman");
  textFont("黑体");
  textStyle(BOLD)
  var textStr = "行星运动模型";
  text(textStr, width*2/5, 40);
  pop()

  textSize(20);

  // Draw the canvas area.
  push();
    rect(movingAreaLeftUpperX, movingAreaLeftUpperY, movingAreaEdgeLength, movingAreaEdgeLength, 0);
  pop();

  // Synthesize the image buffer of the trajectory.
  imageMode(CORNER);
  blendMode(DARKEST);
  image(buffer, 0, 0, width, height);
  
  blendMode(BLEND);
  push();
    translate(originX, originY);
    noStroke();
    if(in_region(x1,y1)){
      fill(23, 158, 205);
      circle(x1, y1, 10+m1/10);
    }
    if(in_region(x2,y2)){
      fill(205, 71, 71);
      circle(x2, y2, 20);
    }
  pop();

  push();
    translate(movingAreaLeftUpperX+70, 600);
    textFont("楷体");
    textSize(20);
    fill(23, 158, 205);
    textStr = "质量 m1=";
    textStr += round(m1);
    text(textStr, -55, 0);
  pop();
  push();
    translate(movingAreaLeftUpperX+70, 630);
    textFont("楷体");
    textSize(20);
    fill(205, 71, 71);
    textStr = "质量 m2=";
    textStr += round(m2);
    text(textStr, -55, 0);
  pop();



  ////////////
  // Draw the controlling pannel.
  ////////////
  // Draw the text.
  push();
    translate(100, 670);
    rect(0, 0, 600, 260, 20);
    textStr = "控制面板";
    text(textStr, 25, 40);
    
    translate(80, 0);
    textStyle(NORMAL)
    fill(23,158,205)
    textStr = "：调节蓝色星球的物理参数";
    text(textStr, 25, 40);
  pop();


  // Draw the GUI


  drawGui();
  var e=calculate_e();
  push();
    translate(originX-20, 800);
    textFont("楷体");
    textSize(20);
    fill(0);
    textStr = "离心率 e=";
    textStr += round(calculate_e(),2);
    text(textStr, -55, 0);
  pop();
  if(0.97<e && e<1.03){
    push();
      translate(originX-20, 820);
      textFont("楷体");
      textSize(20);
      fill(255,80,80);
      textStr = "警告：离心率接近 1 时数值模拟的效果\n通常不好。";
      text(textStr, -55, 0);
    pop();
  }

  push();
    translate(originX-20, 740);
    textFont("楷体");
    textSize(20);
    fill(0);
    textStr = "质量 m1=";
    textStr += round(m1);
    text(textStr, -55, 0);
  pop();
  var v1=sqrt(v1x*v1x+v1y*v1y)
  push();
    translate(movingAreaLeftUpperX+90, 740);
    textFont("楷体");
    textSize(20);
    fill(0);
    textStr = "初速度 v1=";
    textStr += round(v1);
    text(textStr, -55, 0);
  pop();
  push();
    fill(255);
    stroke(0);
    var tempStr;

    // Draw the velocity controlling frame and handler.
    translate(movingAreaLeftUpperX+30, 750);
    rect(0, 0, controllBlockEdgeLength, controllBlockEdgeLength, 0);
    push();  // Draw the controlling handlers.
      stroke(251, 130, 51);
      strokeWeight(4);
      fill(251, 130, 51);
      translate(controlCenterPointXY, controlCenterPointXY);
      //line(0, 0, v1x, v1y);
      rotate(compute_theta(v1x,v1y))
      //rotate(thetaV);
      line(0, 0, v1/5, 0);
      triangle(v1/5, -4*v1/v1, v1/5+10*v1/v1, 0, v1/5, 4*v1/v1);
    pop();
  pop()
  
  //change variable
  m1=massSlider.val

  if (simulating){
    for (i=0;i<10;i+=1){
      for(j=0;j<10;j+=1)
        evolve(dt/100);
      buffer.push()
        buffer.translate(originX, originY);
        if ( in_region(lastx,lasty) && in_region(x1,y1) ) buffer.line(lastx,lasty, x1, y1);
      buffer.pop()
      lastx=x1;
      lasty=y1;
    }
  }

  

  // Restored button pressed.
  if (button_reset.isPressed) {
    on_button_reset_pressed();
  }
  if (button_start.isPressed) {
    on_button_start_pressed();
  }
  if (button_move.isPressed) {
    buffer.clear()
    if(type==0){
      type=1;
      x1-=x2;y1-=y2;
      x2=0;y2=0;
      v1x-=v2x;v1y-=v2y;
      v2x=0;v2y=0;
      lastx=x1;lasty=y1;
      button_move = createButton("切换到质心系", originX-80, height-180, 150, 40)
    }else {
      type=0;
      var vx=(v1x*m1+v2x*m2)/(m1+m2);
      var vy=(v1y*m1+v2y*m2)/(m1+m2);
      v1x-=vx;v2x-=vx;
      v1y-=vy;v2y-=vy;
      var x=(x1*m1+x2*m2)/(m1+m2);
      var y=(y1*m1+y2*m2)/(m1+m2);
      x1-=x;x2-=x;
      y1-=y;y2-=y;
      lastx=x1;lasty=y1;
      button_move = createButton("切换到红球系", originX-80, height-180, 150, 40)
    }
  }
}
function compute_theta(x,y) {
  var thetaF = atan(y/x);
  if (x < 0) {
    thetaF = thetaF + PI;
  }
  return thetaF
}

function evolve(dt){
  if(type==0){
    var dis=sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2))
    if(dis>5){
      var F=G*m1*m2/dis/dis;
      var a1x=F/m1/dis*(x2-x1)
      var a1y=F/m1/dis*(y2-y1)
      v1x=v1x+a1x*dt
      v1y=v1y+a1y*dt
      var a2x=F/m2/dis*(x1-x2)
      var a2y=F/m2/dis*(y1-y2)
      v2x=v2x+a2x*dt
      v2y=v2y+a2y*dt
    }
    x1=x1+v1x*dt
    y1=y1+v1y*dt 
    x2=x2+v2x*dt
    y2=y2+v2y*dt
    var vx=(v1x*m1+v2x*m2)/(m1+m2);
    var vy=(v1y*m1+v2y*m2)/(m1+m2);
    v1x-=vx;v2x-=vx;
    v1y-=vy;v2y-=vy;
    var x=(x1*m1+x2*m2)/(m1+m2);
    var y=(y1*m1+y2*m2)/(m1+m2);
    x1-=x;x2-=x;
    y1-=y;y2-=y;
    lastx=x1;lasty=y1;
  }else{
    var dis=sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2))
    if(dis>5){
      var mu=m1*m2/(m1+m2)
      var F=G*(m1*m2)/dis/dis;
      var a1x=F/mu/dis*(x2-x1)
      var a1y=F/mu/dis*(y2-y1)
      v1x=v1x+a1x*dt
      v1y=v1y+a1y*dt
      x1=x1+v1x*dt
      y1=y1+v1y*dt 
    }
  }
}

function on_button_reset_pressed() {
  simulating=0;
  init_variables();
  buffer.clear();
  button_start = createButton("开始", originX+100, height-180, 80, 40);
}
function on_button_start_pressed() {
  simulating=1;
  button_start = createButton("开始", originX+100, height-180, 80, 40);
}

function mousePressed() {
  change_velocity()
}
function mouseDragged() {
  change_velocity()
}
function change_velocity(){
  var x0=movingAreaLeftUpperX+30;
  var y0=750;
  if (mouseX >= x0 && mouseX <= x0+controllBlockEdgeLength && mouseY > y0 && mouseY <= y0+controllBlockEdgeLength) {
    simulating=0;
    v1x = (mouseX - (x0 + controllBlockEdgeLength / 2)) * 5;
    v1y = -((y0 + controllBlockEdgeLength / 2) - mouseY) * 5;
    if(type==0){
      v2x = -v1x*m1/m2;
      v2y = -v1y*m1/m2;
    }
    button_start = createButton("继续", originX+100, height-180, 80, 40);
    
    var delta=(compute_theta(v1x,v1y)-compute_theta(x2-x1,y2-y1))
    while(delta>PI-0.1) delta-=PI;
    while(delta<-PI+0.1) delta+=PI
    var theta1=compute_theta(v1x,v1y)
    if(delta>-0.2&&delta<0) theta1-=0.1
    if(delta>=0&&delta<0.2) theta1+=0.1
    var v1=sqrt(v1x*v1x+v1y*v1y)
    v1x=v1*cos(theta1)
    v1y=v1*sin(theta1)
  }
}

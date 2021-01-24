var PLAY = 1;
var END = 0;
var WAIT = 2;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score=0;

var gameOver, restart, continu;

var h1,h2,h3,h4,h5,healthImg;

var health = [], index;

var healthS = 0;


localStorage["HighestScore"] = 0;

function preload(){
  trex_running =   loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");

  healthImg = loadImage("health.png");
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
  continuImg = loadImage("Continue.jpg");
}

function setup() {
  createCanvas(displayWidth, displayHeight/1.25);
  
  trex = createSprite(50,180,20,50);
  camera.position.x = trex.x;
  camera.position.y =displayHeight/4

  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;
  
  ground = createSprite(displayWidth/2-635,180,displayWidth,20);
  ground.addImage("ground",groundImage);
  ground.x = displayWidth /2;
  ground.velocityX = -(6 + 3*score/100);
  
  gameOver = createSprite(displayWidth/2-635,60);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(displayWidth/2-635,100);
  restart.addImage(restartImg);

  continu = createSprite(displayWidth/2-635,60);
  continu.addImage(continuImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  continu.scale = 0.7;

  gameOver.visible = false;
  restart.visible = false;
  continu.visible = false;
  
  invisibleGround = createSprite(displayWidth/2-635,190,displayWidth,10);
  invisibleGround.visible = false;
  
  h1 = createSprite(displayWidth/2-705, -50,30,30);
  h1.addImage(healthImg);
  h1.scale = 0.08;

  h2 = createSprite(displayWidth/2-675, -50,30,30);
  h2.addImage(healthImg);
  h2.scale = 0.08;

  h3 = createSprite(displayWidth/2-645, -50,30,30);
  h3.addImage(healthImg);
  h3.scale = 0.08;

  h4 = createSprite(displayWidth/2-615, -50,30,30);
  h4.addImage(healthImg);
  h4.scale = 0.08;

  h5 = createSprite(displayWidth/2-585, -50,30,30);
  h5.addImage(healthImg);
  h5.scale = 0.08;

  health.push(h1,h2,h3,h4,h5);

  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
  //trex.debug = true;
  background(180);
  text("Score: "+ score, 10,0);
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
  
    if(keyDown("space") && trex.y >= 159) {
      trex.velocityY = -12;
    }
  
    trex.velocityY = trex.velocityY + 0.8
  
    if (ground.x < -230){
      ground.x = displayWidth/2-635;
    }
  
    trex.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
  
    if( obstaclesGroup.isTouching(trex)){
      gameState = WAIT;
      health.pop();
      reducingHealth();
    }

    if(health.length===0 && obstaclesGroup.isTouching(trex)){
      gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  else if(gameState === WAIT){
    restart.visible = true;
    continu.visible = true;

    //set velocity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(continu)) {
      wait();
    }

    if(mousePressedOver(restart)) {
      reset();
    }

  }

  console.log(health);
  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(800,120,40,10);
    cloud.y = Math.round(random(30,80));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 440;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(800,165,10,40);
    //obstacle.debug = true;
    obstacle.velocityX = -(7 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  continu.visible = false;
  

 /* h1 = createSprite(displayWidth/2-705, -50,30,30);
  h1.addImage(healthImg);
  h1.scale = 0.08;

  h2 = createSprite(displayWidth/2-675, -50,30,30);
  h2.addImage(healthImg);
  h2.scale = 0.08;

  h3 = createSprite(displayWidth/2-645, -50,30,30);
  h3.addImage(healthImg);
  h3.scale = 0.08;

  h4 = createSprite(displayWidth/2-615, -50,30,30);
  h4.addImage(healthImg);
  h4.scale = 0.08;

  h5 = createSprite(displayWidth/2-585, -50,30,30);
  h5.addImage(healthImg);
  h5.scale = 0.08;

  health.push();
  */
  //refill();
  if(health[4]===undefined){
    health.push(h5);
    h5.visible = true;
  }

  if(health[3]===undefined){
    health.push(h4,h5);
    h4.visible = true;
    h5.visible = true;
  }

  if(health[2]===undefined){
    health.push(h3,h4,h5);
    h3.visible = true;
    h4.visible = true;
    h5.visible = true;
  }
  if(health[1]===undefined){
    health.push(h2,h3,h4,h5);
    h2.visible = true;
    h3.visible = true;
    h4.visible = true;
    h5.visible = true;
  }
  if(health[0]===undefined){
    health.push(h1,h2,h3,h4,h5);
    h1.visible = true;
    h2.visible = true;
    h3.visible = true;
    h4.visible = true;
    h5.visible = true;
  }

  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
  
  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"] = score;
  }
  console.log(localStorage["HighestScore"]);
  
  score = 0;
  
}

function wait(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  continu.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
  
  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"] = score;
  }
  console.log(localStorage["HighestScore"]);
}

function reducingHealth(){
  if(health[0] != undefined){
    h1.visible = true;
  }
  else{
    h1.visible = false;
  }

  if(health[1] != undefined){
    h2.visible = true;
  }
  else{
    h2.visible = false;
  }

  if(health[2] != undefined){
    h3.visible = true;
  }
  else{
    h3.visible = false;
  }

  if(health[3] != undefined){
    h4.visible = true;
  }
  else{
    h4.visible = false;
  }

  if(health[4] != undefined ){
    h5.visible = true;
  }
  else{
    h5.visible = false;
  }
}

function refill(){
  if(health[4]===undefined){
    health.push(h5);
    h5.visible = true;
  }

  if(health[3]===undefined){
    health.push(h5);
    h4.visible = true;
  }

  if(health[2]===undefined){
    health.push(h5);
    h3.visible = true;
  }
  if(health[1]===undefined){
    health.push(h5);
    h2.visible = true;
  }
  if(health[0]===undefined){
    health.push(h5);
    h1.visible = true;
  }
}
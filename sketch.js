var PLAY = 1;
var END = 0;
var gameState = PLAY;

var Rick, Rick_running, Rick_collided;
var ground, invisibleground, backgroundImage;

var blocksGroup, blockImage,blockImage1;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound

function preload(){
  Rick_running = loadAnimation("rick 1.png","rick 2.png","rick 3.png","Rick 4.png");
 // Rick_collided = loadAnimation("Rick_collided.png");
  
  backgroundImage = loadImage("background.jpg");
  
  blockImage = loadImage("block1.png");
  blockImage1 = loadImage("block3.png")
  
  obstacle1 = loadImage("ant1.png");
  obstacle2 = loadImage("ant2.png");

  restartImg = loadImage("reset.png")
  gameOverImg = loadImage("game over.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(1000, 600);

  
  
  Rick = createSprite(120,450,20,50);
  Rick.addAnimation("running", Rick_running);
  

  Rick.scale = 0.5;
  
  ground = createSprite(600,300);
  ground.addImage("background",backgroundImage);
  ground.scale=4.5;
  //ground.x =1200;
  
  
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
 
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  invisibleground = createSprite(50,500,1005,10);
  invisibleground.visible = false;
  
  //create Obstacle and block Groups
  obstaclesGroup = createGroup();
  blocksGroup = createGroup();

  
  Rick.setCollider("rectangle",0,0,20,30);
  Rick.debug = true
  
  score = 0;
  
}

function draw() {
  
  background(180);
  //displaying score
  text("Score: "+ score, 500,50);
  //stop Rick from falling down
  Rick.collide(invisibleground); 
  
  if(gameState === PLAY){
    
    Rick.changeAnimation("running",Rick_running);
    
    gameOver.visible = false;
    restart.visible = false;
    
    ground.velocityX = -3
    //scoring
    score = score + Math.round(getFrameRate()/60);
    
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
    
    if (ground.x < 400){
      ground.x =600;
    }
    
    //jump when the space key is pressed
    if(keyDown("space")&& Rick.y >= 100) {
        Rick.velocityY = -12;
        jumpSound.play();
    }
    
    //add gravity
    Rick.velocityY = Rick.velocityY + 0.8
  
    //spawn the blocks
    spawnblocks();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(Rick)){
        //Rick.velocityY = -12;
        gameState = END;
        dieSound.play()
      
    }
  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
     
     //change the Rick animation
     // Rick.changeAnimation("collided", Rick_collided);
    
     if(mousePressedOver(restart)) {
      reset();
    }
     
      ground.velocityX = 0;
      Rick.velocityY = 0
      
     
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    blocksGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     blocksGroup.setVelocityXEach(0);    
   }
  
 
 
  
  

  drawSprites();
}

function reset(){
  gameState = PLAY;
  obstaclesGroup.destroyEach();
  blocksGroup.destroyEach();
  score = 0
  
}


function spawnObstacles(){
 if (frameCount % 100 === 0){
   var obstacle = createSprite(600,500,10,40);
   obstacle.velocityX = -(6 + score/100);
   obstacle.addImage(obstacle1);
    //generate random obstacles
   
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnblocks() {
  //write code here to spawn the blocks
  if (frameCount % 140 === 0) {
    var block = createSprite(1400,320,40,10);
    block.y = Math.round(random(80,120));

    var bl = Math.round(random(1,2))
     if (bl === 1){  
       block.addImage(blockImage);
     } else { 
         block.addImage(blockImage1)

     }
    
   
    block.scale = 0.5;
    block.velocityX = -3;
    
     //assign lifetime to the variable
    block.lifetime = 200;
    
    //adjust the depth
    block.depth = Rick.depth;
    Rick.depth = Rick.depth + 1;
    
    //add each block to the group
    blocksGroup.add(block);
  }
}


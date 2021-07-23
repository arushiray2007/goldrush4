class Game {
  constructor(){

  }

  getState(){
    var gameStateRef  = database.ref('gameState');
    gameStateRef.on("value",function(data){
       gameState = data.val();
    })

  }

  update(state){
    database.ref('/').update({
      gameState: state
    });
  }

  async start(){
    if(gameState === 0){
      player = new Player();
      var playerCountRef = await database.ref('playerCount').once("value");
      if(playerCountRef.exists()){
        playerCount = playerCountRef.val();
        player.getCount();
      }
      form = new Form()
      form.display();
    }

    player1 = createSprite(100,200);
    player1.addAnimation("running_red",player1Img);
    player1.scale=0.3;
    player2 = createSprite(100,400);
    player2.addAnimation("running_black",player2Img);
    player2.scale=0.3;
    
    player3 = createSprite(100,600);
    player3.addAnimation("running_green",player3Img);
    player3.scale=0.3;
    
    player4 = createSprite(100,800);
    player4.addAnimation("running_yellow",player4Img);
    player4.scale=0.3;
    runners = [player1, player2, player3, player4];
  }

  play(){
    form.hide();

    Player.getPlayerInfo();
    player.getCarsAtEnd();
    
    if(allPlayers !== undefined){
      var display_position = 100;
      background(ground);
      image(ground,displayWidth*4,0,displayWidth*5,displayHeight);
      //index of the array
      var index = 0;

      //x and y position of the cars
      var x = 0;
      var y=200;

      for(var plr in allPlayers){
        //add 1 to the index for every loop
        index = index + 1 ;
        display_position+=200;
        //position the cars a little away from each other in x direction
        //y = y + 150;
        //use data form the database to display the cars in y direction
       
        x = 100 + allPlayers[plr].distance;
        y+=allPlayers[plr].y;
        runners[index-1].x = x;
        runners[index-1].y = y;

        if (index === player.index){
          stroke(10);
          fill("red");
          ellipse(x,y,60,60);
          //runners[index - 1].shapeColor = "red";
          camera.position.x = runners[index-1].x;
          camera.position.y = displayHeight/2;
        }
      
        textSize(15);
        text(allPlayers[plr].name + ": " + allPlayers[plr].score, display_position,50);

        for(var i=0; i<coinGroup.length; i++){
          if(coinGroup.get(i).isTouching(runners)){
            
            //player1score++;
            player.score+=1;
            player.update();
            coinGroup.get(i).destroy();
          }
        }
    
        for(var i=0; i<obstaclesGroup.length; i++){
          if(obstaclesGroup.get(i).isTouching(runners)){
            runners[index-1].x-=500;
          }
        }
        /*for(var i=0; i<blackCoinGroup.length; i++){
          if(blackCoinGroup.get(i).isTouching(player2)){
            
            player2score++;
            player.score=player2score;
            player.update();
            blackCoinGroup.get(i).destroy();
          }
        }
    
        for(var i=0; i<yellowCoinGroup.length; i++){
          if(yellowCoinGroup.get(i).isTouching(player4)){
            
            player4score++;
            player.score=player4score;
            player.update();
            yellowCoinGroup.get(i).destroy();
          }
        }
    
        for(var i=0; i<greenCoinGroup.length; i++){
          if(greenCoinGroup.get(i).isTouching(player3)){
            
            player3score++;
            player.score=player3score;
            player.update();
            greenCoinGroup.get(i).destroy();
          }
        }*/
    
      }

    }

    if(keyIsDown(RIGHT_ARROW) && player.index !== null){
      player.distance +=30
      player.update();
      console.log(player.distance);
    }

    if(keyIsDown(UP_ARROW) && player.index!==null){
      player.y -=10
      player.update();
      
    }

    if(keyIsDown(DOWN_ARROW) && player.index!==null){
      player.y +=10
      player.update();
      
    }
    
    if(player.distance>3500){
      gameState=2;
      player.rank+=1;
      Player.updateCarsAtEnd(player.rank);
    }
    
    
    drawSprites();
  }
  end(){
    console.log("game ended");
    console.log(player.rank);
  }
}

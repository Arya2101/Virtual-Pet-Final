var dog;
var sadDog;
var happyDog;
var foodObj;
var foodS;
var foodStock;
var fedTime;
var lastFed;
var feed;
var addFood; 
var db;   

function preload(){
  sadDog=loadImage("Dog.png");
  happyDog=loadImage("happyDog.png");

}

function setup() {
  db = firebase.database()
  createCanvas(1000,400);
  
  foodObj = new Food();

  foodStock = db.ref('Food');
  foodStock.on("value", readStock);

  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;

  feed = createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

  var input = createInput("Enter your Dog's Name");
  input.position(900,95);
  var button = createButton('Submit');
  button.position(1100,95);
  var greeting = createElement('h4');
  button.mousePressed(function(){
      input.hide();
      button.hide();
      var name = input.value();
      greeting.html(name+" is thirsty, feed him");
      greeting.position(250,75);
  })
 
}

function draw() {
  background(46,139,87);

  foodObj.display();

  fedTime = db.ref('FeedTime');
  fedTime.on("value", function (data){
    lastFed = data.val();
  })

  fill(255,255,254);
  textSize(15);
  if (lastFed >= 12) {
    text("Last Feed: " + lastFed %12 + "PM", 350, 30);
  }
  else if(lastFed == 0) {
    text("Last Feed: 12AM ", 350, 30);
  }
  else {
    text("Last Feed:  " + lastFed + "AM", 350, 30);
  }

  drawSprites();

}

function readStock(data){
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}

 function feedDog() {
    dog.addImage(happyDog);

    foodObj.updateFoodStock(foodObj.getFoodStock()-1);
    db.ref('/').update({
      Food: foodObj.getFoodStock(),
      FeedTime : hour()
    })
  }



function addFoods(){
  foodS++;
  db.ref('/').update({
    Food: foodS
  })
}



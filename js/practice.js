var canvas1;
var canvas2;

var ctx1;
var ctx2;

var lastTime;
var deltaTime;

var canvasWidth;
var canvasHeight;

var bg;

var ane;

var fruit;

var orange;
var blue;

document.body.onload=game;
function game(){
	init();
	lastTime=Date.now();
	gameloop();
}
function init(){
	canvas1=document.querySelector("#canvas1");
	canvas2=document.querySelector("#canvas2");

	canvasWidth=canvas1.width;
	canvasHeight=canvas1.height;


	ctx1=canvas1.getContext("2d");//fish
	ctx2=canvas1.getContext("2d");//background

	ane=new aneObj();
	ane.init();

	fruit=new fruitObj();
	fruit.init();




}
function gameloop(){
	requestAnimationFrame(gameloop);

	var now=Date.now();
	deltaTime=now-lastTime;
	lastTime=now;

	drawbg();

	ane.draw();

	fruit.draw();

	fruitMonitor();
}

// 画背景
function drawbg(){
	bg=new Image();
	bg.src="img/background.jpg";
	ctx2.drawImage(bg, 0 , 0 , canvasWidth , canvasHeight);
}

// 画海葵
var aneObj=function(){
	this.x=[];
	this.len=[];
}
aneObj.prototype.num=50;
aneObj.prototype.init=function  () {
	for(var i=0;i<this.num;i++){
		this.x[i]=i*16+Math.random()*30;
		this.len[i]=200+Math.random()*30;
	}
}
aneObj.prototype.draw=function  () {
		ctx2.globalAlpha=0.7;
		ctx2.strokeStyle="purple";
		ctx2.lineWidth=20;
		ctx2.lineCap="round";
		for(var i=0;i<this.num;i++){
			ctx2.save();
			ctx2.beginPath();
			ctx2.moveTo(this.x[i],canvasWidth);
			ctx2.lineTo(this.x[i],canvasHeight-this.len[i]);
			ctx2.stroke();
			ctx2.closePath();
			ctx2.restore();
			
		}
		
}
// 画食物
var fruitObj=function  () {
	this.alive=[];
	this.x=[];
	this.y=[];
	this.l=[];
	this.speed=[];
	this.orange=new Image();
	this.blue=new Image();
	this.fruitType=[];
	
}
fruitObj.prototype.num=30;
fruitObj.prototype.init=function  () {
	for(var i=0;i<this.num;i++){
		this.alive[i]=false;
		this.x[i]=0;
		this.y[i]=0;
		this.l[i]=0;
		this.speed[i]=Math.random()*0.017+0.003;
		this.fruitType[i]="";
		
	}
	this.orange.src="img/fruit.png";
	this.blue.src="img/blue.png";
}
fruitObj.prototype.draw=function  () {
	for(var i=0;i<this.num;i++){
		if(this.alive[i]==true){
			if(this.fruitType[i]=="blue"){
				var pic=this.blue;
			}
			else{
				var pic=this.orange;
			}
			if(this.l[i]<14){
				this.l[i]+=this.speed[i]*deltaTime;
			}
			else{
				this.y[i]-=this.speed[i]*7*deltaTime;
			}
			ctx2.drawImage(pic,this.x[i]-this.l[i]*0.5,this.y[i]-this.l[i]*0.5,this.l[i],this.l[i]);
			if(this.y[i]<10){
				this.alive[i]=false;
			}
		}
	}
}
fruitObj.prototype.born=function  (i) {
	var aneid=Math.floor(Math.random()*ane.num);
	this.x[i]=ane.x[aneid];
	this.y[i]=canvasHeight-ane.len[aneid];
	this.l[i]=0;
	this.alive[i]=true;
	var ran=Math.random();
	if(ran>0.3){
		this.fruitType[i]="orange";
	}
	else{
		this.fruitType[i]="blue";
	}
}
function fruitMonitor() {
	var num=0;
	for(var i=0;i<fruit.num;i++){
		if(fruit.alive[i]){
			num++;
		}
	}
	if(num<=15){
		for(var i=0;i<fruit.num;i++){
			if(!fruit.alive[i]){
				fruit.born(i);
				return;
			}
		}
		return;
	}
}
var canvas1,canvas2,ctx1,ctx2;

var lastTime,deltaTime;
// 上一贞的时间，两个时间的时间间隔
var  bg=new Image();

var canvasWidth,canvasHeight;

var ane;

var fruit;

var mom;

var mx;
var my;

var baby;

var babyTail=[];

var babyEye=[];

var babyBody=[];

var momTail=[];

var momEye=[];

var momBodyOrange=[];

var momBodyBlue=[];

var date;

var wave;

var halo;

var dust;

var dustPic=[];

document.body.onload=game;

function  game() {
	init();

	lastTime=Date.now();
	deltaTime=0;

	gameloop();
}

function init(){
	canvas1=document.getElementById('canvas1');//鱼
	canvas2=document.getElementById('canvas2');//海葵
	ctx1=canvas1.getContext("2d");
	ctx2=canvas2.getContext("2d");
	canvasWidth=canvas1.width;
	canvasHeight=canvas1.height;
	bg.src="img/background.jpg";

	ane=new aneObj();
	ane.init();

	fruit=new fruitObj();
	fruit.init();

	mom=new momObj();
	mom.init();

	mx=canvasWidth*0.5;
	my=canvasHeight*0.5;

	baby=new babyObj();
	baby.init();

	date=new dateObj();

	canvas1.addEventListener("mousemove",onMousemove,false);

	for(var i=0;i<8;i++){
		babyTail[i]=new Image();
		babyTail[i].src="img/babyTail" + i +".png";
	}

	for(var i=0;i<2;i++){
		babyEye[i]=new Image();
		babyEye[i].src="img/babyEye" + i +".png";
	}

	for(var i=0;i<20;i++){
		babyBody[i]=new Image();
		babyBody[i].src="img/babyFade" + i +".png";
	}

	for(var i=0;i<8;i++){
		momTail[i]=new Image();
		momTail[i].src="img/bigTail"+i+".png";
	}

	for(var i=0;i<2;i++){
		momEye[i]=new Image();
		momEye[i].src="img/bigEye"+i+".png";
	}

	for(var i=0;i<8;i++){
		momBodyOrange[i]=new Image();
		momBodyBlue[i]=new Image();
		momBodyOrange[i].src="img/bigSwim"+i+".png";
		momBodyBlue[i].src="img/bigSwimBlue"+i+".png";
	}

	
	ctx1.font="30px Arial";
	ctx1.textAlign="center";

	wave=new waveObj();
	wave.init();

	halo=new haloObj();
	halo.init();

	for(var i=0;i<7;i++){
		dustPic[i]=new Image();
		dustPic[i].src="img/dust"+i+".png";
	}

	dust=new dustObj();
	dust.init();


}

function gameloop(){
	requestAnimationFrame(gameloop);
	var now=Date.now();
	deltaTime=now-lastTime;
	lastTime=now;

	if(deltaTime>40){
		deltaTime=40;
	}

	drawBg();
	ane.draw();

	fruit.draw();
	fruitMonitor();

	ctx1.clearRect(0,0,canvasWidth,canvasHeight);
	mom.draw();

	momFruitP();
	momBabyP();
	baby.draw();

	date.draw();

	wave.draw();

	halo.draw();

	dust.draw();

}
//1``` 画背景
function drawBg(){
	ctx2.drawImage(bg,0,0,canvasWidth,canvasHeight);
}
//2``` 画海葵
var aneObj=function(){
	// start point ,control point,end point(sin)
	this.rootx=[];
	this.headx=[];
	this.heady=[];
	this.amp=[];
	this.alpha=0;
}
aneObj.prototype.num=50;
aneObj.prototype.init=function(){
	for(var i=0;i<this.num;i++){
		this.rootx[i]=i*16+Math.random()*20;
		this.headx[i]=this.rootx[i];
		this.heady[i]=canvasHeight-200+Math.random()*50;
		this.amp[i]=50+Math.random()*50;
	}
}	
aneObj.prototype.draw=function(){
	this.alpha+=deltaTime*0.0008;
	var l=Math.sin(this.alpha);
	ctx2.save();
	ctx2.globalAlpha=0.7;
	ctx2.lineWidth=20;
	ctx2.lineCap="round";
	ctx2.strokeStyle="#3b154e";
	for(var i=0;i<this.num;i++){
		// beginPath,closePath,lineTo,moveTo,stroke,strokeStyle,lineWidth,lineCap,globalAlpha
		ctx2.beginPath();
		ctx2.moveTo(this.rootx[i],canvasHeight);
		this.headx[i]=this.rootx[i]+l*this.amp[i];
		ctx2.quadraticCurveTo(this.rootx[i],canvasHeight-100,this.headx[i],this.heady[i]);
		ctx2.stroke();
		ctx2.closePath();
	}
	ctx2.restore();
}
//3``` 画果实
		// 从无到有，从小到大，飘。池子里面有果实，闲着，排队等着，有任务，去长大、去飘
var fruitObj=function(){
	this.alive=[];//boolern
	this.orange=new Image();
	this.blue=new Image();
	this.x=[];
	this.y=[];
	this.l=[];
	this.aneNo=[];
	this.speed=[];
	this.fruitType=[];

}
fruitObj.prototype.num=30;
fruitObj.prototype.init=function(){
	for(var i=0;i<this.num;i++){
		this.alive[i]=false;
		this.x[i]=0;
		this.y[i]=0;
		this.aneNo[i]=0;
		this.speed[i]=Math.random()*0.017+0.003;
		this.fruitType[i]=" ";
	}
	this.orange.src="img/fruit.png";
	this.blue.src="img/blue.png";
}
fruitObj.prototype.draw=function(){
	for(var i=0;i<this.num;i++){
		if(this.alive[i]==true){
			if(this.fruitType[i]=="blue"){
				var pic=this.blue;
			}
			else{
				var pic =this.orange;
			}
			if(this.l[i]<14){//grow
				var No=this.aneNo[i];
				this.x[i]=ane.headx[No];
				this.y[i]=ane.heady[No];
				this.l[i]+= this.speed[i]*deltaTime;
				ctx2.drawImage(pic,this.x[i]-this.l[i]*0.5,this.y[i]-this.l[i]*0.5,this.l[i],this.l[i]);
			}
			else{
				this.y[i]-=this.speed[i]*7*deltaTime;
				ctx2.drawImage(pic,this.x[i]-this.l[i]*0.5,this.y[i]-this.l[i]*0.5,this.l[i],this.l[i]);
			}
			if(this.y[i]<10){
				this.alive[i]=false;
			}
			
		}
	}
}
fruitObj.prototype.dead=function(i){
	this.alive[i]=false;
}
fruitObj.prototype.burn=function(i){
	// var aneid=Math.floor(Math.random()*ane.num);
	this.aneNo[i]=Math.floor(Math.random()*ane.num);
	// this.x[i]=ane.headx[aneid];
	// this.y[i]=ane.heady[aneid];
	this.l[i]=0;
	this.alive[i]=true;
	var ran=Math.random();
	if(ran<0.8){
		this.fruitType[i]="orange";
	}
	else{
		this.fruitType[i]="blue";
	}
}
	// 保持屏幕上有一定的果实，加一个监视功能，所以，初始化的时候，不应该让所有的果实都出生，加一个判断
function fruitMonitor(){
	var num=0;
	for(var i=0;i<fruit.num;i++){
		if(fruit.alive[i]){
			num++;
		}
	}
	if(num<15){
		sendFruit()
		return;
	}
}
function sendFruit(){
	for(var i=0;i<fruit.num;i++){
		if(!fruit.alive[i]){
			fruit.burn(i);
			return;
		}
	}
}
//4``` 画大鱼
var momObj=function  () {
	this.x=[];
	this.y=[];
	this.angle=[];
	this.bigEye=new Image();
	this.bigBody=new Image();
	this.bigTail=new Image();

	this.momTailTimer=0;
	this.momTailCount=0;

	this.momEyeTimer=0;
	this.momEyeCount=0;
	this.momEyeInterval=1000;

	this.mombodyCount=0;
}
momObj.prototype.init=function(){
	this.x=canvasWidth*0.5;
	this.y=canvasHeight*0.5;
	// this.bigEye.src="img/bigEye0.png";
	// this.bigBody.src="img/bigSwim0.png";
	// this.bigTail.src="img/bigTail0.png";
	this.angle=0;
}
momObj.prototype.draw=function(){
	// lerp  让一个值不停的趋近另一个数；

	this.x=lerpDistance(mx,this.x,0.97);
	this.y=lerpDistance(my,this.y,0.97);

	// delta angle
	var deltaY=my-this.y;
	var deltaX=mx-this.x;
	beta=Math.atan2(deltaY,deltaX)+Math.PI;

	this.angle=lerpAngle(beta,this.angle,0.6);

	// mom tail
	this.momTailTimer+=deltaTime;
	if(this.momTailTimer>50){
		this.momTailCount=(this.momTailCount+1)%8;
		this.momTailTimer%=50;
		
	}

	// mom eye
	this.momEyeTimer+=deltaTime;
	if(this.momEyeTimer>this.momEyeInterval){
		this.momEyeCount=(this.momEyeCount+1)%2;
		this.momEyeTimer%=this.momEyeInterval;
		if(this.momEyeCount==0){
			this.momEyeInterval=Math.random()*1500+2000;
		}
		if(this.momEyeCount==1){
			this.momEyeInterval=200;
		}
	}



	ctx1.save();
	ctx1.translate(this.x,this.y);
	ctx1.rotate(this.angle);
	var momTailCount=this.momTailCount;
	ctx1.drawImage(momTail[momTailCount],-momTail[momTailCount].width*0.5+30,-momTail[momTailCount].height*0.5)
	var mombodyCount=this.mombodyCount;
	if(date.double==1){
		ctx1.drawImage(momBodyOrange[mombodyCount],-momBodyOrange[mombodyCount].width*0.5,-momBodyOrange[mombodyCount].height*0.5);
	}
	else{
		ctx1.drawImage(momBodyBlue[mombodyCount],-momBodyBlue[mombodyCount].width*0.5,-momBodyBlue[mombodyCount].height*0.5);

	}
	var momEyeCount=this.momEyeCount;
	ctx1.drawImage(momEye[momEyeCount],-momEye[momEyeCount].width*0.5,-momEye[momEyeCount].height*0.5)
	ctx1.restore();
}
//5``` 大鱼随着鼠标移动
function onMousemove(e){
	if(!date.gameOver){
		if(e.offSetX||e.layerX){
			mx=e.offSetX==undefined?e.layerX:e.offSetX;
			my=e.offSetY==undefined?e.layerY:e.layerY;
		}
		
	}
}


	// lerp
function lerpDistance(aim,cur,ratio){
	var delta=cur-aim;
	return aim+delta*ratio
}
function lerpAngle(a,b,t){
	var d=b-a;
	if(d>Math.PI){
		d=d-2*Math.PI;
	}
	if(d<-Math.PI){
		d=d+2*Math.PI;
	}
	return a+d*t;
}
// 6```大鱼与果实的碰撞检测
	// 判断大鱼跟果实的距离
function momFruitP(){
	if(!date.gameOver){
		for(var i=0;i<fruit.num;i++){
			if(fruit.alive[i]){
				var l=power(fruit.x[i],fruit.y[i],mom.x,mom.y);
				if(l<900){
					fruit.dead(i);
					date.fruitNum++;
					mom.mombodyCount++;
					if(mom.mombodyCount>7){
						mom.mombodyCount=7;
					}
					if(fruit.fruitType[i]=="blue"){
						date.double=2;
					}
					wave.born(fruit.x[i],fruit.y[i]);
				}
			}
		}
	}
	
}


function momBabyP(){
	if(date.fruitNum>0&& !date.gameOver){
		var l=power(mom.x,mom.y,baby.x,baby.y);
		if(l<900){
			baby.babyBodyCount=0;
			// date.reset();
			mom.mombodyCount=0;
			// score update;
			date.addScore();
			halo.born(baby.x,baby.y);
		}
		
	}
}
function power(x1,y1,x2,y2){
	return Math.pow(x1-x2,2)+Math.pow(y1-y2,2);
}

// 7```画小鱼
var babyObj=function(){
	this.x=[];
	this.y=[];
	this.angle=[];
	this.babyEye=new Image();
	this.babyBody=new Image();
	this.babyTail=new Image();

	this.babyTailTimer=0;//计时器
	this.babyTailCount=0;//记录现在到哪一阵了

	this.babyEyeTimer=0;
	this.babyEyeCount=0;
	this.babyEyeInterval=1000;

	this.babyBodyTimer=0;
	this.babyBodyCount=0;

}
babyObj.prototype.init=function(){
	this.x=canvasWidth*0.5-50;
	this.y=canvasHeight*0.5+50;
	this.angle=0;
	// this.babyEye.src="img/babyEye0.png";
	// this.babyBody.src="img/babyFade0.png";
	// this.babyTail.src="img/babyTail0.png";
}
babyObj.prototype.draw=function(){
	this.x=lerpDistance(mom.x,this.x,0.97);
	this.y=lerpDistance(mom.y,this.y,0.97);
	var deltaY=mom.y-this.y;
	var deltaX=mom.x-this.x;
	var beta=Math.atan2(deltaY,deltaX)+Math.PI;
	this.angle=lerpAngle(beta,this.angle,0.6);

	// baby tail
	this.babyTailTimer+=deltaTime;
	if(this.babyTailTimer>50){
		this.babyTailCount=(this.babyTailCount+1)%8;//0-7之间循环
		this.babyTailTimer%=50;//计时器复原。
	}

	// baby eye
	this.babyEyeTimer+=deltaTime;
	if(this.babyEyeTimer>this.babyEyeInterval){
		this.babyEyeCount=(this.babyEyeCount+1)%2;
		this.babyEyeTimer%=this.babyEyeInterval;
		if(this.babyEyeCount==0){
			this.babyEyeInterval=2000+Math.random()*1500;
		}
		if(this.babyEyeCount==1){
			this.babyEyeInterval=200;
		}

	}

	// baby body
	this.babyBodyTimer+=deltaTime;
	if(this.babyBodyTimer>300){
		this.babyBodyCount=this.babyBodyCount+1;
		this.babyBodyTimer%=300;
		if(this.babyBodyCount>19){
			// baby die
			this.babyBodyCount=19;
			date.gameOver=true;
		}
	}
	

	ctx1.save();
	ctx1.translate(this.x,this.y);	
	ctx1.rotate(this.angle);
	var babyTailCount=this.babyTailCount;
	ctx1.drawImage(babyTail[babyTailCount],-babyTail[babyTailCount].width*0.5+23,-babyTail[babyTailCount].height*0.5);
	var babyBodyCount=this.babyBodyCount;
	ctx1.drawImage(babyBody[babyBodyCount],-babyBody[babyBodyCount].width*0.5,-babyBody[babyBodyCount].height*0.5);
	var babyEyeCount=this.babyEyeCount;
	ctx1.drawImage(babyEye[babyEyeCount],-babyEye[babyEyeCount].width*0.5,-babyEye[babyEyeCount].height*0.5);
	ctx1.restore();
}
	// 趋向于大鱼的坐标
//8``` 鱼眼睛、身体、尾巴摇起来
//9``` 鱼妈妈喂！(#`O′)鱼宝宝
//10```分值计算
var dateObj=function(){
	this.fruitNum=0;
	this.double=1;
	this.score=0;
	this.gameOver=false;
	this.alpha=0;
}
/*dateObj.prototype.reset=function(){
	this.fruitNum=0;
	this.double=1;
}*/
dateObj.prototype.draw=function(){
	var w=canvasWidth;
	var h=canvasHeight;
	ctx1.save();
	ctx1.shadowBlur=10;
	ctx1.shadowColor="#fff";
	ctx1.fillStyle="#fff";
	// ctx1.fillText("num "+this.fruitNum,w*0.5,h-50);
	// ctx1.fillText("double "+this.double,w*0.5,h-80);
	ctx1.fillText("score:"+this.score,w*0.5,h-20);
	if(this.gameOver){
		ctx1.fillStyle="rgba(255,255,255,"+this.alpha+")";
		this.alpha+=deltaTime*0.0005;
		if(this.alpha>1){
			this.alpha=1;
		}
		ctx1.fillText("GAMEOVER",w*0.5,h*0.5);
	}
	ctx1.restore();
}
dateObj.prototype.addScore=function(){
	this.score+=this.fruitNum*100*this.double;
	this.fruitNum=0;
	this.double=1;
}
// 11```大鱼吃果实动效；
	// 物体池 pool 存储---------检测是否有闲着的物体----半径逐渐增大，颜色逐渐减弱，反比关系---绘图API
var waveObj=function(){
	this.x=[];
	this.y=[];
	this.alive=[];
	this.r=[];
}
waveObj.prototype.num=10;
waveObj.prototype.init=function(){
	for(var i=0;i<this.num;i++){
		this.alive[i]=false;
		this.r[i]=0;
	}
}
waveObj.prototype.draw=function(){
	ctx1.save();
	// ctx1.lineWidth=2;
	ctx1.shadowBlur=8;
	ctx1.shadowColor="#fff";
	for(var i=0;i<this.num;i++){
		if(this.alive[i]){
			// draw
			this.r[i]+=deltaTime*0.04;
			if(this.r[i]>80){
				this.alive[i]=false;
				break;
			}
			var alpha=1-this.r[i]/80;
			ctx1.beginPath();
			ctx1.arc(this.x[i],this.y[i],this.r[i],0,Math.PI*2);
			ctx1.strokeStyle="rgba(255,255,255,"+alpha+")";
			ctx1.stroke();
			ctx1.closePath();
		}
	}
	ctx1.restore();
}
waveObj.prototype.born=function(x,y){
	for(var i=0;i<this.num;i++){
		if(!this.alive[i]){
			this.alive[i]=true;
			this.r[i]=10;
			this.x[i]=x;
			this.y[i]=y;
			// born
			return;
		}
	}
}
// 12```大鱼喂！(#`O′)小鱼的特效

var haloObj=function(){
	this.x=[];
	this.y=[];
	this.alive=[];
	this.r=[];

}
haloObj.prototype.num=10;
haloObj.prototype.init=function(){
	for(var i=0;i<this.num;i++){
		this.alive[i]=false;
		this.r[i]=0;
	}
}
haloObj.prototype.draw=function(){
	ctx1.save();
	// ctx1.lineWidth=2;
	ctx1.shadowBlur=8;
	ctx1.shadowColor="rgb(203,91,0)";
	for(var i=0;i<this.num;i++){
		if(this.alive[i]){
			// draw
			this.r[i]+=deltaTime*0.04;
			if(this.r[i]>80){
				this.alive[i]=false;
				break;
			}
			var alpha=1-this.r[i]/80;
			ctx1.beginPath();
			ctx1.arc(this.x[i],this.y[i],this.r[i],0,Math.PI*2);
			ctx1.strokeStyle="rgba(203,91,0,"+alpha+")";
			ctx1.stroke();
			ctx1.closePath();
		}

	}
	
	ctx1.restore();
}
haloObj.prototype.born=function(x,y){
	for(var i=0;i<this.num;i++){
		if(!this.alive[i]){
			this.alive[i]=true;
			this.r[i]=10;
			this.x[i]=x;
			this.y[i]=y;
			return;
		}
	}
}
// 13```绘制海葵
	// 贝塞尔曲线、正弦函数

// 14```dust
var dustObj=function(){
	this.x=[];
	this.y=[];
	this.amp=[];
	this.No=[];
	this.alpha;
}
dustObj.prototype.num=30;
dustObj.prototype.init=function(){
	for(var i=0;i<this.num;i++){
		this.x[i]=Math.random()*canvasWidth;
		this.y[i]=Math.random()*canvasHeight;
		this.amp[i]=Math.random()*25+20;
		this.No[i]=Math.floor(Math.random()*7);
	}
		this.alpha=0;
}	
dustObj.prototype.draw=function(){
	this.alpha+=deltaTime*0.0008;
	var l=Math.sin(this.alpha);
	for(var i=0;i<this.num;i++){
		var no=this.No[i];
		ctx1.drawImage(dustPic[no],this.x[i]+this.amp[i]*l,this.y[i]);
	}
}
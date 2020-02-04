function noise(change,amp=100)
{
	var arr=[];
	var M = 4294967296,
			A = 1664525,
			C = 1;
	var Z = Math.floor(Math.random() * M);
	function rand(){
		Z = (A * Z + C) % M;
		return Z / M - 0.5;
	};
	function interpolate(pa, pb, px){
		var ft = px * Math.PI,
			f = (1 - Math.cos(ft)) * 0.5;
		return pa * (1 - f) + pb * f;
	}
	var x = 0,
		y = 0,
		amp = amp, //amplitude
		wl = change, //wavelength
		fq = 1 / wl, //frequency
		a = rand(),
		b = rand();
	while(x < 10000){
		if(x % wl === 0){
			a = b;
			b = rand();
			y = a * amp;
		}else
			y = interpolate(a, b, (x % wl) / wl) * amp;
		arr[x]= y;
		x += 1;
	}
	return arr;
}

var PI=Math.PI,MIN_INT=Number.MIN_SAFE_INTEGER,MAX_INT=Number.MAX_SAFE_INTEGER;
function map(m,x,y,nx,ny){return nx+(m-x)*(ny-nx)/(y-x);}
function distance(x1,y1,x2,y2){ return Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2)); }
function round(a,n=0){
		var temp=1;
		for(var i=0;i<n;i++)temp*=10;
		return Math.round(temp*a)/temp;
}
function random(a='abc',n='abc'){
		if(a==='abc')
		return Math.random();
		else if(n==='abc')
		return Math.random()*a;
		else
		return Math.random()*(n-a)+a;
}
function log(x,b=Math.E){return Math.log(x)/Math.log(b);}
function log10(x){return Math.log(x)/Math.log(10);}
function exp(x){return Math.exp(x);}
function sin(ang){return Math.sin(ang*PI/180);}
function cos(ang){return Math.cos(ang*PI/180);}
function tan(ang){return Math.tan(ang*PI/180);}
function asin(vl){return Math.asin(vl)*180/PI;}
function acos(vl){return Math.acos(vl)*180/PI;}
function atan(vl){return Math.atan(vl)*180/PI;}
function degree(rad){return rad*180/PI;}
function radian(deg){return deg*PI/180;}
function sqrt(x){return Math.sqrt(x);}
function power(n,p){return Math.pow(n,p);}
function max(ar){
	var abcdefg=MIN_INT;
	for(var xykzmw=0;xykzmw<ar.length;xykzmw++){
		if(ar[xykzmw]>abcdefg)abcdefg=ar[xykzmw];
	}
	return abcdefg;
}
function min(ar){
	var abcdefg=MAX_INT;
	for(var xykzmw=0;xykzmw<ar.length;xykzmw++){
		if(ar[xykzmw]<abcdefg)abcdefg=ar[xykzmw];
	}
	return abcdefg;
}
function abs(x){return Math.abs(x);}
function floor(x){return Math.floor(x);}
function ceil(x){return Math.ceil(x);}

var harsh,frameRate=100,strk=true,fll=true,width,height,mouse={x:100,y:100};
var clrmod='rgb';
var docwidth=-1;
var docheight=-1;
var defaultscreen=false;
window.onresize=resizing;
window.onload=resizing;
function resizing(){
	if(defaultscreen){
		harsh.canvas.width=width=window.innerWidth;
		harsh.canvas.height=height=window.innerHeight;
	}
};
document.onmousemove=function(e){mouse.x=e.clientX-harsh.canvas.getBoundingClientRect().left;mouse.y=e.clientY-harsh.canvas.getBoundingClientRect().top};
function createCanvas(wt=docwidth,ht=docheight){
	if(wt===docwidth&&ht===docheight)defaultscreen=true;
	if (typeof(wt)=="object")
		wt.innerHTML='<canvas id="harshcanvas"/>'
	else
	document.write('<canvas id="harshcanvas"/>');
	harsh=document.getElementById('harshcanvas').getContext('2d');
	if (typeof(wt)=="object"){
		harsh.canvas.width=wt.offsetWidth;
		harsh.canvas.height=wt.offsetHeight;
	}else{
		harsh.canvas.width=wt;
		harsh.canvas.height=ht;
	}
	width=harsh.canvas.width;
	height=harsh.canvas.height;
	if(wt==-1&&ht==-1)resizing();
	fill(0);
	stroke(0);
}
window.onload=function(){
	originalFrame();
}
function World(g,t){
	this.gravity=g;
	this.frameRate=t;
	createCanvas();
	this.objs=[];
	this.update=function(){
		for (var i = 0; i < this.objs.length; i++){
			var o=this.objs[i];
			if (!o.static) {
				o.vy+=this.gravity;
				o.x+=o.vx;
				o.y+=o.vy;
				for (var j=i+1;j<this.objs.length;j++){
					var e=this.objs[j];
					if (o instanceof Ball){
						if (e instanceof Block){
							var p=e.points();
							var data=detectCircleLine(o.x,o.y,o.radius,o.vx,o.vy,e.x-e.width/2,e.y-1-e.height/2,e.x+e.width/2,e.y-e.height/2);
							if (data){
								o.vx=data[0];
								o.vy=data[1];
							}
						}
					}
				}
			}
			o.show();
		}
	}
	this.add=function(obj){
		this.objs.push(obj);
	}
}
function Ball(x,y,r){
	this.x=x;
	this.y=y;
	this.vx=0;
	this.vy=0;
	this.radius=r;
	this.show=function(){
		circle(this.x,this.y,this.radius);
	}
}
function Block(x,y,w,h,option){
	this.x=x;
	this.y=y;
	this.width=w;
	this.height=h;
	this.vx=0;
	this.vy=0;
	if (option && option.static){
		this.static=option.static;
	}
	this.points=function(){
		return [{x:this.x-this.width/2,y:this.y-this.height/2},
		{x:this.x+this.width/2,y:this.y-this.height/2},
		{x:this.x+this.width/2,y:this.y+this.height/2},
		{x:this.x-this.width/2,y:this.y+this.height/2}];
	}
	this.show=function(){
		rect(this.x-this.width/2,this.y-this.height/2,this.width,this.height);
	}
}
function createWorld(){
	var w=new World(1,30);
	noStroke();
	fill(255,0,0);
	window.originalFrame=function(){
		background(255);
		w.update();
		setTimeout(originalFrame,w.frameRate);
	}
	return w;
}
function originalFrame(){
	draw();
	setTimeout(originalFrame,frameRate);
}
function hsbToRgb(hsb){
	var rgb = { };
	var h = Math.round(hsb.h);
	var s = Math.round(hsb.s * 255 / 100);
	var v = Math.round(hsb.b * 255 / 100);
			if (s == 0) {
			rgb.r = rgb.g = rgb.b = v;
			} else {
			var t1 = v;
			var t2 = (255 - s) * v / 255;
			var t3 = (t1 - t2) * (h % 60) / 60;
					if (h == 360) h = 0;
							if (h < 60) { rgb.r = t1; rgb.b = t2; rgb.g = t2 + t3 }
							else if (h < 120) { rgb.g = t1; rgb.b = t2; rgb.r = t1 - t3 }
							else if (h < 180) { rgb.g = t1; rgb.r = t2; rgb.b = t2 + t3 }
							else if (h < 240) { rgb.b = t1; rgb.r = t2; rgb.g = t1 - t3 }
							else if (h < 300) { rgb.b = t1; rgb.g = t2; rgb.r = t2 + t3 }
							else if (h < 360) { rgb.r = t1; rgb.g = t2; rgb.b = t1 - t3 }
							else { rgb.r = 0; rgb.g = 0; rgb.b = 0 }
			}
	return { r: Math.round(rgb.r), g: Math.round(rgb.g), b: Math.round(rgb.b) };
}
function colorMode(s){clrmod=s;}
function noStroke(){strk=false;}
function noFill(){fll=false;}
function font(s){harsh.font=s;}
function lineCap(vl){harsh.lineCap=vl;}
function lineJoint(vl){harsh.lineJoin=vl;}
function lineDash(ar){harsh.setLineDash(ar);}
function lineDashOffset(vl){harsh.lineDashOffset=vl;}
function Text(s,x,y){
	if(fll)harsh.fillText(s,x,y);
	else harsh.strokeText(s,x,y);}
function clear(x=-width*500,y=-height*500,w=width*1000,h=height*1000){harsh.clearRect(x,y,w,h);}
function setTime(t){
	frameRate=1000/t;
}
function circle(xx,yy,rr){
	harsh.beginPath();
	harsh.arc(xx,yy,rr,0,Math.PI*2,true);
	if(fll)harsh.fill();
	if(strk)harsh.stroke();
	harsh.closePath();
}
function rect(xx,yy,w,h){
	harsh.beginPath();
	harsh.rect(xx,yy,w,h);
	if(strk)harsh.stroke();
	if(fll)harsh.fill();
	harsh.closePath();
}
function line(x1,y1,x2,y2){
	harsh.beginPath();
	harsh.moveTo(x1,y1);
	harsh.lineTo(x2,y2);
	if(strk)harsh.stroke();
	harsh.closePath();
}
function shape(ar){
	harsh.beginPath();
	harsh.moveTo(ar[0],ar[1]);
	for(var xyz=2;xyz<ar.length;xyz+=2)
		harsh.lineTo(ar[xyz],ar[xyz+1]);
	if(fll)harsh.fill();
	if(strk)harsh.stroke();
	harsh.closePath();
}
function strokeWidth(x){harsh.lineWidth=x;}
function save(){harsh.save();}
function restore(){harsh.restore();}
function stroke(x=-1,y=-1,z=-1,a=-1){
	strk=true;
	if(typeof(x)==='string')harsh.strokeStyle=x;
	else{
	if(x===-1)harsh.strokeStyle="white";
	else if(x>=0&&y===-1)harsh.strokeStyle="rgb("+x+","+x+","+x+")";
	else if(x>=0&&y>=0&&z===-1)harsh.strokeStyle="rgba("+x+","+x+","+x+","+y+")";
	else if(x>=0&&y>=0&&z>=0&&a===-1){harsh.strokeStyle="rgba("+x+","+y+","+z+",1)";}
	else if(x>=0&&y>=0&&z>=0&&a>=0)harsh.strokeStyle="rgba("+x+","+y+","+z+","+a+")";
	}
}
function fill(x=-1,y=-1,z=-1,a=-1){
	fll=true;
	if(typeof(x)==='string')harsh.fillStyle=x;
	else{
	if(clrmod==='rgb'){
		if(x===-1)harsh.fillStyle="white";
		else if(x>=0&&y===-1)harsh.fillStyle="rgb("+x+","+x+","+x+")";
		else if(x>=0&&y>=0&&z===-1)harsh.fillStyle="rgba("+x+","+x+","+x+","+y+")";
		else if(x>=0&&y>=0&&z>=0&&a===-1){harsh.fillStyle="rgba("+x+","+y+","+z+",1)";}
		else if(x>=0&&y>=0&&z>=0&&a>=0)harsh.fillStyle="rgba("+x+","+y+","+z+","+a+")";
	}else if(clrmod==='hsl'){
		if(x===-1)harsh.fillStyle="white";
		else if(y===-1)harsh.fillStyle="hsl("+x+",50%,50%)";
		else if(z!=-1)harsh.fillStyle="hsl("+x+","+y+"%,"+z+"%)";
	}
	else console.log('error colormode:'+clrmod);
	}
}
function background(x=-1,y=-1,z=-1,a=-1){
	var temp=harsh.fillStyle;
	if(typeof(x)==='string'){harsh.fillStyle=x;
		harsh.fillRect(-width*500,-height*500,width*1000,height*1000);
	}
	else{
	if(x===-1){harsh.fillStyle="white";
		harsh.fillRect(-width*500,-height*500,width*1000,height*1000);}
	else if(x>=0&&y===-1){harsh.fillStyle="rgb("+x+","+x+","+x+")";     harsh.fillRect(-width*500,-height*500,width*1000,height*1000);}
	else if(x>=0&&y>=0&&z===-1){harsh.fillStyle="rgba("+x+","+x+","+x+","+y+")"; harsh.fillRect(-width*500,-height*500,width*1000,height*1000);}
	else if(x>=0&&y>=0&&z>=0&&a===-1){harsh.fillStyle="rgba("+x+","+y+","+z+",1)"; harsh.fillRect(-width*500,-height*500,width*1000,height*1000);}
	else if(x>=0&&y>=0&&z>=0&&a>=0){harsh.fillStyle="rgba("+x+","+y+","+z+","+a+")";harsh.fillRect(-width*500,-height*500,width*1000,height*1000);}
	}
	harsh.fillStyle=temp;
}
function rotate(deg){
	harsh.rotate(deg*Math.PI/180);
}
function translate(x,y){
	harsh.translate(x,y);
}
function drawImg(img,x=0,y=0,w=100,h=100){
	harsh.drawImage(img,x,y,w,h);
}



function detectBalls(x1,y1,r1,m1,x2,y2,r2,m2,vx1,vy1,vx2,vy2){
	var dist=distance(x1,y1,x2,y2);
	if((dist)<(r1+r2))
	{
		var tempx=(x2-x1)*(r1+r2-dist)/dist;
		var tempy=(y2-y1)*(r1+r2-dist)/dist;

		var nx = round((x1-x2)/dist,2);
		var ny = round((y1-y2)/dist,2);
		
		var tx=-ny;
		var ty=nx;

		var dpt1= round(vx1*tx + vy1*ty,2);
		var dpt2= round(vx2*tx + vy2*ty,2);
		var dpn1= round(vx1*nx + vy1*ny,2);
		var dpn2= round(vx2*nx + vy2*ny,2);

		var mo1 = round((dpn1*(m1-m2)+2*m2*dpn2)/(m1+m2),2);
		var mo2 = round((dpn2*(m2-m1)+2*m1*dpn1)/(m1+m2),2);

		vx1= round(tx*dpt1 + nx*mo1,2);
		vy1= round(ty*dpt1 + ny*mo1,2);
		vx2= round(tx*dpt2 + nx*mo2,2);
		vy2= round(ty*dpt2 + ny*mo2,2);

		x1=x1-tempx/2;
		x2=x2+tempx/2;
		y1=y1-tempy/2;
		y2=y2+tempy/2;
		var t={vx1:vx1,vy1:vy1,vx2:vx2,vy2:vy2,x1:x1,y1:y1,x2:x2,y2:y2};
		return t;
	}
	return undefined;
}
function detectCircleLine(cx,cy,radius,vx,vy,x1,y1,x2,y2){
	var m=(y2-y1)/(x2-x1);
	var tx=(m*(cy-y1)+x1*m*m+cx)/(1+m*m);
	var ty=(m*(cx-x1)+cy*m*m+y1)/(1+m*m);
	var dist=distance(tx,ty,cx,cy);
	var ux1=(x2-x1)/Math.abs(x1-x2);
	var uy1=(y2-y1)/Math.abs(y1-y2);
	var ux2=(tx-x1)/Math.abs(x1-tx);
	var uy2=(ty-y1)/Math.abs(y1-ty);
	var templength=distance(x1,y1,tx,ty);
	var realength=distance(x1,y1,x2,y2);
	var point1=(distance(x1,y1,cx,cy));
	var point2=(distance(x2,y2,cx,cy));
	if((dist<radius && ux1==ux2 && uy1==uy2 && templength<realength)||(point1<=radius)||(point2<radius)){
		var tempx;
		var tempy;
		if(dist<radius && ux1==ux2 && uy1==uy2 && templength<realength){
			tempx=x2-x1;
			tempy=y2-y1;
		}else{
			if(point1<=radius){
				var vactx=(x1-cx)*radius;
				var vacty=(y1-cy)*radius;
			}
			else if(point2<=radius){
				var vactx=(x2-cx)*radius;
				var vacty=(y2-cy)*radius;
			}
			tempx=-vacty;
			tempy=vactx;
		}
		var tempx1=vx;
		var tempy1=vy;

		var temp=tempx;
		tempx=-tempy;
		tempy=temp;
		var dot=tempx*tempx1+tempy*tempy1;
		var nvalue=tempx*tempx+tempy*tempy;
		tempx1=(tempx1-2*tempx*dot/nvalue);
		tempy1=(tempy1-2*tempy*dot/nvalue);
		vx=tempx1;
		vy=tempy1;
		return [vx,vy];
	}
	else return undefined;
}

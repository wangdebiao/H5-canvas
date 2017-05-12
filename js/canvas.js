$(function(){
	$("html,body").css({"width":$(window).width(),"height":$(window).height()})
		//模块->文件->模块化开发
		//mvc model view controller->路由
		var canvas=document.querySelector("canvas");
		var cobj=canvas.getContext("2d");//绘制2d图形
		//拖拽动作			按下-移动-抬起
		//不同的图形来做处理		线，矩形，圆，点，多边形
		//不同的算法，接收用户的意图
		//对象的封装、继承、多态的三大特性
		function shape(canvas,cobj){
			if(canvas===undefined||cobj===undefined){
				console.error("参数传入有误！")
				return false;
			}
			this.canvas=canvas;
			this.cobj=cobj;
			this.type="line";
			this.style="stroke";
			this.history=[];
			this.strokeStyle="#000";
			this.fillStyle="#000";
			this.lineWidth=1;
			this.bianNum=5;
			this.jiaoNum=5;
		}
		shape.prototype={
			init:function(){
				this.cobj.strokeStyle=this.strokeStyle;
				this.cobj.fillStyle=this.fillStyle;
				this.cobj.lineWidth=this.lineWidth;
			},
			draw:function(){
				this.init();
				var that=this;
				that.canvas.onmousedown=function(e){
					var eve=e||window.event;
					var startX=eve.offsetX;
					var startY=eve.offsetY;
					that.canvas.onmousemove=function(e){
						var eve=e||window.event;
						var endX=eve.offsetX;
						var endY=eve.offsetY;
						that.cobj.clearRect(0,0,that.canvas.width,that.canvas.height);
						if(that.history.length>0){
							that.cobj.putImageData(that.history[that.history.length-1],0,0);
						}
						that[that.type](startX,startY,endX,endY);
					}
					that.canvas.onmouseup=function(){
						that.history.push(that.cobj.getImageData(0,0,that.canvas.width,that.canvas.height));
						that.canvas.onmousemove=null;
						that.canvas.onmouseup=null;
					}
				}
			},
			line:function(x1,y1,x2,y2){//画线
				this.cobj.beginPath();
				this.cobj.moveTo(x1,y1);
				this.cobj.lineTo(x2,y2);
				this.cobj.stroke();
			},
			rect:function(x1,y1,x2,y2){//画矩形
				this.cobj.beginPath();
				this.cobj.rect(x1,y1,x2-x1,y2-y1)
				this.cobj[this.style]();
			},
			arc:function(x1,y1,x2,y2){//画圆
				this.cobj.beginPath();
				var r=Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));
				this.cobj.arc(x1,y1,r,0,2*Math.PI);
				this.cobj[this.style]();
			},
			bian:function(x1,y1,x2,y2){//画多边形
				this.cobj.beginPath();
				var angle=360/this.bianNum*Math.PI/180;
				var r=Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));
				for (var i=0;i<this.bianNum;i++) {
					var x=x1+Math.cos(i*angle)*r;
					var y=y1+Math.sin(i*angle)*r;
					this.cobj.lineTo(x,y);
				}
				this.cobj.closePath();//形成一个封闭的图形
				this.cobj[this.style]();
			},
			jiao:function(x1,y1,x2,y2){//画多角形
				this.cobj.beginPath();
				var angle=360/(this.jiaoNum*2)*Math.PI/180;
				var r=Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));
				var r1=r/2;
				for (var i=0;i<this.jiaoNum*2;i++) {
					if(i%2==0){
						var rr=r;
					}else{
						var rr=r1;
					}
					var x=x1+Math.cos(i*angle)*rr;
					var y=y1+Math.sin(i*angle)*rr;
					this.cobj.lineTo(x,y);
				}
				this.cobj.closePath();
				this.cobj[this.style]();
			},
			pen:function(){//钢笔
				this.init()
				var that=this;
				that.canvas.onmousedown=function(e){
					var eve=e||window.event;
					var startX=eve.offsetX;
					var startY=eve.offsetY;
					that.cobj.beginPath();
					that.cobj.moveTo(startX,startY);
					that.canvas.onmousemove=function(e){
						var eve=e||window.event;
						var endX=eve.offsetX;
						var endY=eve.offsetY;
						that.cobj.lineTo(endX,endY);
						that.cobj.stroke();
					}
					that.canvas.onmouseup=function(){
						that.history.push(that.cobj.getImageData(0,0,that.canvas.width,that.canvas.height));
						that.canvas.onmousemove=null;
						that.canvas.onmouseup=null;
					}
				}
			},
			back:function(){//撤销，返回上一步
                this.history.pop();
                if(this.history.length>0){
                    this.cobj.putImageData(this.history[this.history.length-1],0,0);
                }else{
                	this.cobj.clearRect(0,0,this.canvas.width,this.canvas.height);
                	alert("没有上一步了")
                }
	        },
	        none:function(){
	        	if(this.history.length>0){
	        		var yes=confirm("是否保存");
	        		if(yes){
	        			location.href=canvas.toDataURL().replace("data:image/png","data:stream/octet")
	        		}
	        	}
	        	this.cobj.clearRect(0,0,this.canvas.width,this.canvas.height);
	        	this.history.splice(0,this.history.length); 
	        },
	        save:function(){
	        	location.href=canvas.toDataURL().replace("data:image/png","data:stream/octet")
	        }
		}
		//实例化对象
		var obj=new shape(canvas,cobj);
		//橡皮
		$(".xpbtn").click(function(){
			$(this).addClass("first");
		})
		$(".xpbox").mouseout(function(){
			$(".xpbtn").removeClass("first")
		})
		//操作
		$(".caozuo li").click(function(){
			$(".caozuo li").removeClass("first").eq($(this).index()).addClass("first");
			obj[$(this).attr("attr")]();
			if($(this).attr("attr")=="begin"){
				obj.type="line";
				obj.style="stroke";
				obj.history=[];
				obj.strokeStyle="#000";
				obj.fillStyle="#000";
				obj.lineWidth=1;
				obj.bianNum=5;
				obj.jiaoNum=5;
			}
		})
		$(".caozuo li").mouseout(function(){
			$(".caozuo li").removeClass("first")
		})
		//填充or描边
		$(".lei li").click(function(){
			$(".lei li").removeClass("first").eq($(this).index()).addClass("first");
			obj.style=$(this).attr("attr");
		})
		//颜色
		$(".color").change(function(){
			obj.fillStyle=$(".color").val();
			obj.strokeStyle=$(".color").val();
			aaa()
		})
		//线宽
		$(".lineWidth").change(function(){
			obj.lineWidth=$(".lineWidth").val();
			aaa();
		})
		//确定当前所选的形状
		function aaa(){
			$(".draw li").each(function(){
				if($(this).hasClass("first")){
					if($(this).attr("attr")=="pen"){
						obj.pen();
					}else{
						obj.type=$(this).attr("attr");
						obj.draw();
					}
				}
			})
		}
		//默认值
		aaa()
		//选择要绘制的形状
		$(".draw li").click(function(){
			$(".draw li").removeClass("first").eq($(this).index()).addClass("first");
			if($(this).attr("attr")=="bian"){
				var bianNum=prompt('请输入边数',5);
				obj.bianNum=bianNum;
			}
			if($(this).attr("attr")=="jiao"){
				var jiaoNum=prompt('请输入角数',5);
				obj.jiaoNum=jiaoNum;
			}
			if($(this).attr("attr")=="pen"){
				obj.pen();
			}else{
				obj.type=$(this).attr("attr");
				obj.draw();
			}
		})
		
		function warp(text,initx,inity,width,height){
			var text=text;
			var width=width;
			var height=height;
			var initx=initx;
			var inity=inity;
			cobj.textBaseline="top";
			cobj.font="44px 黑体";
			
			for(var i=0;i<text.length;i++){
				cobj.fillText(text[i],initx,inity)
				initx+=cobj.measureText(text[i]).width;
				if(initx>width){
					initx=0;
					inity+=height;
				}
				
			}
		}
		// warp("我们都有一个家，名字叫中国",0,0,50,30)
})
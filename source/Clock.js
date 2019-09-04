import  { Sprite, emit, on }  from "./kontra.js"
import  { rotatePoint }  from "./Util.js"
const roman = [null,"Ⅰ","Ⅱ","Ⅲ","Ⅳ","Ⅴ","Ⅵ","Ⅶ","Ⅷ","Ⅸ","Ⅹ","Ⅺ","Ⅻ"];
export function Clock (game,x,y,radius = 100){
    let clock;

    on('bug_hitground',(bugRotationDeg,bugSpeed)=>{

         const deg = 2*Math.PI * (bugRotationDeg+90) / 360;

         clock.offsetSpeed = {x: 2*Math.abs(bugSpeed) * Math.cos(deg),y: 2*Math.abs(bugSpeed) * Math.sin(deg)};
         clock.offsetAcceleration = {x: -0.05 * Math.cos(deg),y: -0.05 * Math.sin(deg)};
              

    })
   
    clock  =  Sprite({
           x: 0,
           y: 0,
           offset: {x:0,y:0},
           offsetSpeed: null,         
           offsetAcceleration:null,

           radius: null,
           numbersRadius: null,
           minRadius:null,
           maxRadius:null,
           scaleUp:false,
           scaleSpeed: null,
           scaleAcceleration: 0.08,
           hideNumbers: false,
           numbersHidingSpeed: 1/25,
           
           numbersOpacity: 1,

           anchor: {x:0.5,y:0.5},

           resize: function (radius){
 
              this.radius=radius;
              this.minRadius = radius;
              this.maxRadius = radius*1.5;
              this.scaleSpeed = (this.maxRadius-this.minRadius)/30;
              this.numbersRadius=2*radius;
              emit("clock_resize",radius);
              return this;

           },
           reposition: function (x,y){
 
              this.x= x || 0;
              this.y= y || 0;
              emit("clock_reposition",x,y);
              return this;

           }, 

           update(){
             if(this.hideNumbers){
                if(this.numbersOpacity>0){
                   this.numbersOpacity-=this.numbersHidingSpeed;
                   if(this.numbersOpacity<0) this.numbersOpacity=0;
                }
             }else{
                if(this.numbersOpacity<1){
                   this.numbersOpacity+=this.numbersHidingSpeed;
                   if(this.numbersOpacity>1) this.numbersOpacity=1;
                }
             }
             if(this.scaleUp){
                if(this.radius<this.maxRadius){
                   this.radius+=this.scaleSpeed;
                //   this.scaleSpeed+=this.scaleAcceleration;
                   if(this.radius>this.maxRadius)
                       this.radius = this.maxRadius,
                       this.scaleSpeed = 1;
                   this.numbersRadius=2*this.radius;
                   emit("clock_resize",this.radius);
                }
             }else{
                if(this.radius>this.minRadius){
                   this.radius-=this.scaleSpeed;
                //   this.scaleSpeed+=this.scaleAcceleration;
                   if(this.radius<this.minRadius)
                       this.radius = this.minRadius,
                       this.scaleSpeed = 1;
                   this.numbersRadius=2*this.radius;
                   emit("clock_resize",this.radius);
                }
             }

             if(this.offsetSpeed)
             {

                const before = {x:Math.sign(this.offset.x),y:Math.sign(this.offset.y)};

                this.offset.x += this.offsetSpeed.x;
                this.offset.y += this.offsetSpeed.y;
                
                this.offsetSpeed.x += this.offsetAcceleration.x;
                this.offsetSpeed.y += this.offsetAcceleration.y;
                
                const after = {x:Math.sign(this.offset.x),y:Math.sign(this.offset.y)};

                if( -1*before.x == after.x || -1*before.y == after.y){
                   this.offsetSpeed = this.offsetAcceleration = null;
                   this.offset = {x:0,y:0};
                }
            
             
             }

           },
           draw: function(){
             this.context.fillStyle = game.colorScheme.clock;
             this.context.beginPath();
             this.context.arc(this.x+this.offset.x, this.y+this.offset.y, this.radius, 0, 2  * Math.PI);
             this.context.fill();


             this.context.globalAlpha = this.numbersOpacity;
             for(let i = 1;i<=12;i++){
                 const point = rotatePoint({x:0,y:-this.numbersRadius}, 2*Math.PI*(30*i) / 360 );
                 this.context.fillStyle= game.colorScheme.numbers;
                 this.context.font = ' italic bold '+this.radius/2+'px sans-serif';
                 this.context.textBaseline = 'middle';
                 this.context.textAlign = 'center';
                 this.context.fillText  (roman[i], this.x+point.x, this.y+point.y);

             }
             this.context.globalAlpha = 1;

           }
      })

      clock.resize(radius).reposition(x,y);

      
       return clock;
 
 





}

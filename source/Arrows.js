import { Sprite, on } from "./kontra.js"
import { rotatePoint } from "./Util.js"

export function Arrows (game){
      if(!game) throw new Error("game is not defined");
      let arrow1,arrow2, defSize, defPosition;
      on("clock_reposition", defPosition = (x,y)=>{
          arrow1.x = arrow2.x = x;
          arrow1.y = arrow2.y = y;
      })
      on("clock_resize", defSize = (radius)=>{
          arrow1.width = arrow2.width = radius/4
          arrow1.height = radius*1.4;
          arrow2.height = radius*1.3;
      })
      
      arrow1 = Sprite({

           x: null,
           y: null,
           width: null,
           height: null,
          
           anchor: {x:0.5,y:1},
           rotationDeg: null,
           rotationSpeed: 1,
           idleDeg:null,
           idleDirection:1,
           direction: 1,
          
           randomDirectionChange:function (){
                let a = Math.random() > .5? this.direction: -1*this.direction;
                this.direction = a;                 

           },
           updateIdleDeg(){
                let date = new Date(),
                    mins = date.getMinutes(),
                    minsAngle = 360/(60) * mins;
                this.idleDeg = minsAngle;
           },
           update: function (){

              this.rotationDeg %= 360;
              if(this.rotationDeg<0) this.rotationDeg+=360;
              this.rotation = 2*Math.PI*(this.rotationDeg)/360;

              if(game.gameOver){

                  this.updateIdleDeg();
                  this.rotationSpeed = 1;
                  this.direction = this.idleDirection;
  
                  let shortest_dir = Math.sign(this.idleDeg - this.rotationDeg)  ;
                  if(Math.abs(this.idleDeg - this.rotationDeg)>180) shortest_dir*=-1;          

                  if(this.rotationDeg > this.idleDeg){ 
                        this.rotationDeg += shortest_dir *  2;
                        if(this.rotationDeg < this.idleDeg) this.rotationDeg = this.idleDeg;
                  }

                  if(this.rotationDeg < this.idleDeg){ 
                        this.rotationDeg += shortest_dir *  2;
                        if(this.rotationDeg > this.idleDeg) this.rotationDeg = this.idleDeg;
                  }

                 
              }else 
                  this.rotationDeg += this.rotationSpeed*this.direction;
                                  
              
           },
           calculatePath: function (){
               return   [  {x:0,             y:this.width},
                           {x:this.width/2,  y:0},
                           {x:this.width,    y:this.width},
                           {x:2*this.width/3,y:this.width},
                           {x:2*this.width/3,y:this.height},
                           {x:this.width/3,  y:this.height},
                           {x:this.width/3,  y:this.width},
                           {x:0,             y:this.width},
                         ];


           }, 
           calculateTransformedPath: function (){
              let path = this.calculatePath(),
                  anchorWidth = this.width * this.anchor.x,
                  anchorHeight = this.height * this.anchor.y;

              path = path.map((point)=>{
                          point.x -= anchorWidth;
                          point.y -= anchorHeight;
                          return rotatePoint(point,this.rotation);                  
                     });
              return path;
           },
           draw: function (){
              const anchorWidth = this.width * this.anchor.x,
                    anchorHeight = this.height * this.anchor.y;

              this.context.save();
              this.context.translate(this.x, this.y);

              if (this.rotation) this.context.rotate(this.rotation);
              
              this.context.fillStyle = game.colorScheme.arrows;
              const path = this.calculatePath();
              this.context.beginPath();
              this.context.moveTo(path[0].x,path[0].y);
              for(let {x,y} of path){
                  this.context.lineTo(x-anchorWidth,y-anchorHeight);
              }
              this.context.closePath();
              this.context.fill();
              this.context.restore();
           }       
      })
      arrow2 = Sprite({
           
           x: null,
           y: null,
           width: null,
           height: null,

           anchor: {x:0.5,y:1},
           rotationDeg: null,
           rotationSpeed: 1.8,
           idleDeg:null,
           idleDirection:-1,
           direction: -1,


           randomDirectionChange: arrow1.randomDirectionChange,
           updateIdleDeg(){
                 let date = new Date(),
                     mins = date.getMinutes(),
                     hours = date.getHours()%12,
                     hoursAngle = 360/12 * hours + 360/60/12 * mins;
                 this.idleDeg = hoursAngle;

           },
           update: arrow1.update,
           calculatePath: arrow1.calculatePath,
           calculateTransformedPath: arrow1.calculateTransformedPath,
           draw: arrow1.draw,      
      }) 

      defSize(game.clock.radius);
      defPosition(game.clock.x,game.clock.y);

      arrow1.updateIdleDeg();
      arrow2.updateIdleDeg();

      arrow1.rotationDeg = arrow1.idleDeg;
      arrow2.rotationDeg = arrow2.idleDeg;


      return [ arrow1, arrow2 ];


}

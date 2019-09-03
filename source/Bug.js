import { Sprite, on, emit }  from "./kontra.js"
import { rotatePoint } from "./Util.js"
import { Sound } from "./Sound.js"

export function  Bug (game, animations){
     if(!game) throw new Error("game is not defined");
    
     let bug,defSize,defPosition;
     on("clock_reposition",defPosition = (x,y)=>{
           bug.x = x;
           bug.y = y;
     });
     on("clock_resize",defSize = (radius)=>{
           let size = 1.4*radius/4,
               groundedAnchorY = (size+radius)/size;

           bug.width = size;
           bug.height = size;
           bug.groundedAnchorY = groundedAnchorY;
           if(!bug.isFlying) bug.anchor.y = groundedAnchorY;
     });
            
     bug = Sprite({
           x: null,
           y: null,
           width: null,
           height:null,
           groundedAnchorY: null,
           anchor: {x:0.5,y: null},
           animations: animations,
           currentState: "idle",
           color: "gray",
           rotationDeg:0,
           idleDeg:null,
           direction: 1,
           rotationSpeed: 1,
           isFlying:0,
           gravity:-0.0045,
           jumpSpeed:0,

           wereOverArrow: false,
           isOverArrow: function (){
              const speed = Math.max(game.arrow1.rotationSpeed, game.arrow2.rotationSpeed)+this.rotationSpeed;
              let res = [];
              if(this.isFlying){
                for(let arrow of [game.arrow1,game.arrow2])
                  if(arrow.rotationDeg>this.rotationDeg-speed && arrow.rotationDeg<this.rotationDeg+speed)

                   res.push(arrow);
                   
              }
              return res;

           },
           updateIdleDeg: function (){
              const arrow1 = game.arrow1.idleDeg,
                    arrow2 = game.arrow2.idleDeg;
  

              let p1 = Math.min(arrow1,arrow2)+Math.abs(arrow1-arrow2)/2;
              let p2 = p1+180;

              p1%=360;
              p2%=360;

              if(Math.abs(p1-game.arrow1.idleDeg) > Math.abs(p2-game.arrow1.idleDeg)) this.idleDeg = p1;
              else this.idleDeg = p2;
             

           },
           update:function (){
              this.playAnimation(this.currentState+this.directionToString());
 
              this.rotationDeg %= 360;
              if(this.rotationDeg<0) this.rotationDeg+=360;
              this.rotation = 2*Math.PI*(this.rotationDeg)/360;

              if(game.gameOver){  
                  this.updateIdleDeg(); 

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

                  if(this.rotationDeg === this.idleDeg){
                       this.currentState = "idle";
                       this.direction = 1;
                  }
                      
                         
              }else

                  this.rotationDeg += this.rotationSpeed*this.direction;
              
              
              this.currentAnimation.update();

              if(this.jumpSpeed) this.jumpSpeed+=this.gravity;
              this.anchor.y+=this.jumpSpeed;
              if(this.anchor.y<this.groundedAnchorY){
                this.anchor.y = this.groundedAnchorY;
                this.jumpSpeed = 0;
                this.isFlying = 0;
                if(!game.gameOver) //may be killed on the fly
                        this.currentState = "idle";
              }


              const arrows = this.isOverArrow();
              if(arrows.length){
                   if(!this.wereOverArrow)
                        for(let a of arrows)
                          emit("bug_overarrow",a);                   
                   this.wereOverArrow = true;   
              }else
                   this.wereOverArrow = false;
       
           },
           calculatePath: function (){
              return [{x:0,         y:0},
                      {x:this.width,y:0},
                      {x:this.width,y:this.height},
                      {x:0,         y:this.height}, 
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
           jump: function (){
               if(this.isFlying < 2){
                 Sound["jump"]()
                 this.currentState = "jump";
                 this.jumpSpeed=0.1;
                 this.isFlying ++;
               };
           }, 
           die: function (){
                 this.currentState = "idle";
           },
           switchDirection: function (){
               this.direction *= -1;
           },
           directionToString:function(){
                if(this.direction == -1) return  "left";
                return "right";
           }   
      }) 
 
      defSize(game.clock.radius);
      defPosition(game.clock.x,game.clock.y);

      bug.updateIdleDeg();


      return bug;

}




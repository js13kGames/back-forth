
import  { GameLoop, SpriteSheet, imageAssets, load, on, init as initKontra }  from "./kontra.js"
import  { Clock }  from "./Clock.js"
import  { Bug }  from "./Bug.js"
import  { Sound }  from "./Sound.js"
import  { TouchControls }  from "./TouchControls.js"
import  { ScoreBar }  from "./ScoreBar.js"
import  { rotatePoint, isMobile }  from "./Util.js"
import  { SATCollision }  from "./Collision.js"
import  { Arrows }  from "./Arrows.js"
import  { ColorSchemes }  from "./ColorSchemes.js"


let  {canvas, context} = initKontra();

const mobile = isMobile();

export class Game extends EventTarget{

    constructor(){
         super();

         this.gameOver = true;

         this.colorSchemeIdx = 1;
         this.colorScheme = ColorSchemes.get(0);
         this.transitionColorScheme = ColorSchemes.transition(0,1);;

         on("scorebar_add",(score)=>{
              if(score % 5 == 0)
              {
                 const previous = this.colorSchemeIdx;
                 do{
                    this.colorSchemeIdx++;
                    this.colorSchemeIdx%=ColorSchemes.length;
                 }while(this.colorSchemeIdx==0)//because 0-th is a complete darkness;
                 this.transitionColorScheme = ColorSchemes.transition(previous,this.colorSchemeIdx);
              }
         });
         this.clock = Clock(this,270,270);

         this.scoreBar = ScoreBar(this);
   
         let arrows = Arrows(this); 
         this.arrow1 = arrows[0];
         this.arrow2 = arrows[1];

         on("scorebar_add",(score)=>{
            if(score%10 == 0)
              this.arrow1.rotationSpeed+=0.1,
              this.arrow2.rotationSpeed+=0.1;
         })

         const ssheet = SpriteSheet({
                 image: imageAssets["BUG"],
                 frameWidth: 50,
                 frameHeight: 50,

                 animations: {
                    idleright: { frames: ['0..4','4..0'], frameRate: 10 },
                    jumpright: { frames: 5 },
                    idleleft: { frames: ['11..7','7..11'], frameRate: 10 },
                    jumpleft: { frames: 6 }
                 }
         });
          
         this.bug = Bug(this,ssheet.animations); 
         on("bug_overarrow",(arrow)=>{
               this.scoreBar.add(1);
               arrow.randomDirectionChange();
         })

 
         
     
         this.onresize();      
         window.addEventListener("resize",this.onresize.bind(this));

         if(mobile){
            document.addEventListener("touchstart",(e)=>{
               if(this.gameOver) return;
               const w = window.innerWidth,
                     h = window.innerHeight;
 
               const touch = e.touches.item(0);
               if(touch.pageX>w/2) this.bug.jump();
               else this.bug.switchDirection();
            })    
         }else{
            document.addEventListener("keydown",(e)=>{
                if(this.gameOver) return;
                switch(e.keyCode){
                   case 38: this.bug.jump(); break;
                   case 32: this.bug.switchDirection(); break;
                }
            });
         }
         document.addEventListener(mobile?"touchstart":"keydown",()=>{
          if(this.bug.idleDeg === this.bug.rotationDeg && 
             this.arrow1.idleDeg === this.arrow1.rotationDeg &&
             this.arrow2.idleDeg === this.arrow2.rotationDeg)

            this.start();


         })
    }
    
    start(){ 
          this.gameOver = false;
          this.clock.scaleUp = true;
          this.clock.hideNumbers = true;
    }
    finish(){
          Sound["crash"](); 
          this.bug.die();
          this.gameOver = true;
          this.clock.scaleUp = false;
          this.clock.hideNumbers = false;

          this.transitionColorScheme = ColorSchemes.transition(this.colorSchemeIdx,1);
          this.colorSchemeIdx = 1;

    }
    onresize(){
         const w = window.innerWidth,
               h = window.innerHeight;

         canvas.width = w;
         canvas.height = h;

         console.log(canvas);
         const radius = mobile?w/6:h/10;

         this.clock.resize(radius);
         this.clock.reposition(w/2,h/2);

    } 
    collidedBugArrows(){ 
 
      const arrow1 = this.arrow1.calculateTransformedPath().slice(0,3),
            arrow2 = this.arrow2.calculateTransformedPath().slice(0,3),
            bug = this.bug.calculateTransformedPath();
        
      return ( SATCollision(arrow1,bug) || SATCollision(arrow2,bug));

    }
    update(){
      if(this.transitionColorScheme){
          let obj = this.transitionColorScheme.next();
          this.colorScheme = obj.value || this.colorScheme;
          if(obj.done) this.transitionColorScheme = null;
      }
      this.clock.update();
      this.scoreBar.update();
      this.arrow1.update();
      this.arrow2.update();
      this.bug.update();
      if(!this.gameOver && this.collidedBugArrows()) this.finish();
    }
    render(){
      const w = window.innerWidth,
            h = window.innerHeight;
      let grd = context.createRadialGradient(w/2,h/2, 0,w/2,h/2, Math.max(w,h));
      grd.addColorStop(0, this.colorScheme.background);
      grd.addColorStop(1, "#000");
      context.fillStyle = grd;
      context.fillRect(0,0,w,h);

      this.arrow1.render();
      this.arrow2.render();
      this.clock.render();      
      this.bug.render();
      this.scoreBar.render();
      if(this.touchControls) this.touchControls.render();
    }
}

export default function (){
     return new Promise((res,rej)=>{
       
        load('BUG.png').then(()=>{
            
             res(new Game());

        }).catch(err=>{

             rej(err);

        });
                        

     })

}








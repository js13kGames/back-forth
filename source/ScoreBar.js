import  {Sprite, on, emit, setStoreItem, getStoreItem }  from "./kontra.js"
import  { isMobile }  from "./Util.js"
const mobile = isMobile();

export function ScoreBar  (game){

      if(!game) throw new Error("game is not defined");
      let scoreBar, defSize, defPosition;
      on("clock_reposition", defPosition = (x,y)=>{
          scoreBar.x = x;
          scoreBar.y = y;
      })
      on("clock_resize", defSize = (radius)=>{
          scoreBar.size = radius/2;
      })
      scoreBar = Sprite({
           x: null,
           y: null,
           size: null,
           anchor: {x:0.5,y:1},
           score: 0,
           hiScore:0,

           primaryTxt:'',
           secondaryTxt:'',

           add:function (earned){
              this.score+=earned;
              if(this.score>this.hiScore){
                  this.hiScore = this.score;
                  setStoreItem("hiScore",this.hiScore);
              }             
              emit("scorebar_add", this.score); 

           },
           update: function (){ 
             if(game.gameOver){



               this.score = 0;
               this.primaryTxt = ""+this.hiScore;
               this.secondaryTxt = mobile?"Tap to play":"Press a key";
             }else{
               this.primaryTxt = ""+this.score;
               this.secondaryTxt = "hi "+this.hiScore;
             }
           },
           draw: function (){
                 this.context.globalAlpha = .8;
                 this.context.fillStyle= game.colorScheme.scorebar;
                 this.context.font = ' bold '+this.size+'px sans-serif';
                 this.context.textBaseline = 'middle';
                 this.context.textAlign = 'center';
                 this.context.fillText  (this.primaryTxt, this.x, this.y-this.size*0.2);
                 this.context.font = 'bold '+this.size/2+'px sans-serif';
                 this.context.globalAlpha = .3;
                 this.context.fillText(this.secondaryTxt, this.x, this.y+this.size/2);
                 this.context.globalAlpha = 1;
           },    
      }) 

      defSize(game.clock.radius);
      defPosition(game.clock.x,game.clock.y);
      scoreBar.hiScore = getStoreItem("hiScore") || 0;


      return scoreBar;
}

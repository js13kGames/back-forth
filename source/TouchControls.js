import  {Sprite}  from "./kontra.js"

export function  TouchControls (game){
 
    document.addEventListener("touchstart",(e)=>{
        const w = window.innerWidth,
          h = window.innerHeight;
 
        const touch = e.touches.item(0);
        if(touch.pageX>w/2) game.bug.jump();
        else game.bug.switchDirection();
    })    

    let controls = Sprite({
 
       draw: function (){
           const w = window.innerWidth,
                 h = window.innerHeight;
 
           this.context.globalAlpha = .4;
           this.context.fillStyle="#000000";
           this.context.font = ' bold '+h/5+'px sans-serif';
           this.context.textBaseline = 'middle';
           this.context.textAlign = 'center';
           this.context.fillText  ("⬌",w/4, h/4 * 3);
           this.context.fillText  ("⬆",w/4*3, h/4 * 3);
           this.context.globalAlpha = 1;
 
       }

    })

    return controls;
}

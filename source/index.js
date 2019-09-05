
import  { GameLoop, setStoreItem, getStoreItem } from "./kontra.js"
import   Game   from "./Game.js"
import  { isMobile, localStoragePrefix as prefix } from "./Util.js"


const mobile = isMobile();


const greeting_close = document.getElementById("greeting_close"),
      greeting_open = document.getElementById("greeting_open"),
      greeting = document.getElementById("greeting"),
      bob_img = document.getElementById("bob"),
      tips_mobile = document.getElementById("tips_mobile"),
      tips_desktop = document.getElementById("tips_desktop");
      

greeting_open.onclick = (e)=>{ greeting.style.display = "block";e.stopPropagation();};
greeting_close.onclick = (e)=>{ greeting.style.display = "none";e.stopPropagation();};
greeting.onclick = (e)=>e.stopPropagation();
greeting.addEventListener("touchstart",(e)=>e.stopPropagation());
greeting_close.addEventListener("touchstart",(e)=>e.stopPropagation());


let displayGreeting = ()=>{

  
    if(bob_img.complete) greeting.style.display = 'block';
    else bob_img.onload = ()=>{greeting.style.display = 'block';};

    
}

const start = ()=>{
    if(mobile) tips_mobile.style.display = 'block';
    else tips_desktop.style.display = 'block';

  
    if(!getStoreItem(prefix+"visited")){
         greeting_close.addEventListener("click",launchGame,{once:true});
         displayGreeting();
    }else{
         launchGame();
    }

    setStoreItem(prefix+"visited",true);

    function launchGame(){      
        Game().then(function (game){
          let loop = GameLoop({  
              update:  game.update.bind(game),
              render:  game.render.bind(game)
          });
          loop.start();
        });
    }
}

start();
















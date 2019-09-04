
let rotatePoint = (point,rad)=>{
           const x = point.x, y = point.y;
           if(!rad) return {x:x,y:y};
           return {x:x*Math.cos(rad)-y*Math.sin(rad) ,y: x*Math.sin(rad)+y*Math.cos(rad)};
   }
let isMobile = ()=> /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);  

const localStoragePrefix = 'back-and-forth-js13k-2019-';

export { rotatePoint,isMobile, localStoragePrefix };




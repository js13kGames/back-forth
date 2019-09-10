
const b = "#000000",
      w = "#ffffff";
class ColorScheme{
   constructor(background=b,scorebar=w,arrows=b,clock=b,numbers=b){
      this.background = background;
      this.scorebar = scorebar;
      this.arrows = arrows;
      this.clock = clock;
      this.numbers = numbers;
   }
}

const blue = new ColorScheme("#0260E8"),
      green = new ColorScheme("#41B619"),
      yellow = new ColorScheme("#FFD600"),
      red = new ColorScheme("#F6522E"),
      violet = new ColorScheme("#6E36CA"),
      complete_darkness = new ColorScheme("#000000","#000000");

const pool = [complete_darkness,blue,green,yellow,violet,red];

const ColorSchemes = {
     get: function(index){
          return Object.assign({},pool[index]);
     },
     transition: function (index1,index2){
          const scheme1 = this.get(index1),
                scheme2 = this.get(index2);
          return transitionColorScheme(scheme1,scheme2);
     },
     length: pool.length
};


function* transitionColorScheme(from,to){
    const generator = {
         background: transitionColor(from.background,to.background),
         scorebar: transitionColor(from.scorebar,to.scorebar),
         arrows: transitionColor(from.arrows,to.arrows),
         clock: transitionColor(from.clock,to.clock),
         numbers: transitionColor(from.numbers,to.numbers),
    }
    const colorScheme = Object.assign({},from);
    while(true){
       let done = true;
       for(let a of Object.keys(colorScheme)){
             
             let obj = generator[a].next();
             colorScheme[a] = obj.value || colorScheme[a];
             if(obj.value) done = false;

       }
       if(done) break;
       else yield colorScheme;
    }
}

function* transitionColor(from,to){
     const step = 2;
     let f  = [ parseInt(from.slice(1,3),16),
                parseInt(from.slice(3,5),16),
                parseInt(from.slice(5,7),16) ] ,
         t  = [ parseInt(to.slice(1,3),16),
                parseInt(to.slice(3,5),16),
                parseInt(to.slice(5,7),16) ] ;

     let done = [false,false,false]
     while(!done[0] || !done[1] || !done[2]){
        for(let i = 0;i<3;i++){
            const dir = Math.sign(t[i]-f[i]);
            f[i] += step * dir ;
            if(dir == -1)
               if(f[i] < t[i]) f[i] = t[i];
               
            if(dir == 1)
               if(f[i] > t[i]) f[i] = t[i];

            if(dir == 0) done[i] = true;
               
        }
        let r = f[0].toString(16), g = f[1].toString(16), b = f[2].toString(16);
        if(r.length == 1) r = "0"+r;
        if(g.length == 1) g = "0"+g;
        if(b.length == 1) b = "0"+b;
        yield "#"+r+g+b;
   
     }
}



export { ColorSchemes };
















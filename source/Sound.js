import { jsfxr } from "./jsfxr.js"

let crashURL = jsfxr([/*1,0.0335,0.2,0.1165,0.2335,0.2915,,-0.0999,-0.633,0.05,0.025,,0.0085,0.2415,,0.0335,0.05,,0.8665,-0.35,,,,0.575*/1,,0.01,,0.4855,0.3389,,-0.0109,-0.359,,,-0.2859,,0.009,,,,,1,,,,,0.5]); 
let jumpURL = jsfxr([/*0,,0.1932,,0.1987,0.3715,,0.1929,,,,,,0.1099,,,,,0.8566,,,0.2921,,0.575*/0,,0.2655,,0.2362,0.3324,,0.1715,,,,,,0.3217,,,,,0.9182,,,,,0.5]);
let player = new Audio();
const Sound  = {
   jump:()=>{
      player.src = jumpURL;
      player.play();
   },
   crash:()=>{
      player.src = crashURL;
      player.play();
   },

};

export {  Sound };
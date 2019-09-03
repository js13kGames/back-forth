
./node_modules/google-closure-compiler-linux/compiler \
./source/index.js \
./source/Game.js \
./source/Arrows.js \
./source/Bug.js \
./source/Collision.js \
./source/ScoreBar.js \
./source/Util.js \
./source/Clock.js \
./source/ColorSchemes.js  \
./source/Sound.js \
./source/TouchControls.js \
./source/kontra.js \
./source/jsfxr.js \
--language_in ECMASCRIPT_2016 --language_out ECMASCRIPT_2016 --compilation_level SIMPLE --js_output_file bundle.js

rm zipped.zip

zip zipped index.html bundle.js Bob.png BUG.png

ls -l zipped.zip


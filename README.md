# polyfillPromise
## A polyfill for Browsers not supporting ECMAScript 6 Promise

Tests for existence of a Promise object in the browser and if doesnt exist adds a window.Promise which meets the ES6 specification.

```
  <script src="js/polyFillPromise.js"></script>
```
### Typical Use
```
  <script>
	var mp3='music/test.mp3', 
		player=document.getElementById('audio-player')
		data={},
		
		audioPromise = new Promise(function (resolve, reject) {
            d3.select('#audioPlayer').on('canplay', function(e) {
                player.play();
                resolve(data);
            }).attr('src', mp3);
        });
        
        audioPromise.then(function(data){
        
        	// Proceed with the app once the audio is loaded 
        
        }).catch(function(err){
       
       		// handle errors
        
        });
  
  </script>
```

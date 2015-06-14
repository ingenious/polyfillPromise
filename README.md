# polyfillPromise
<blockquote><strong> A polyfill for Browsers not supporting ECMAScript 6 Promise</strong></blockquote>

Tests for existence of a Promise constructor in the browser and if doesn't exist adds a window.Promise which meets the ES6 specification.

```
  <script src="js/polyFillPromise.js"></script>
```
Using requirejs

```
 require(['../polyfillPromise-0.1'], function(Promise) {

        var promise = new Promise(function(resolve) {
        
        });

        promise.then(function(data){
        
        };
    });
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

```
  <script>
	 require(['../polyfillPromise-0.1'], function(Promise) {

        'use strict';

        var promise = new Promise(function(resolve) {
            setTimeout(function(){
                resolve({hello:'world'});
            },1500);
        });

        promise.then(function(data){
            if (console && console.log) {
                console.log(data);
            }
            document.getElementsByTagName("pre"[0].innerHTML=JSON.stringify(data);
        });
    });
      
  </script>
```


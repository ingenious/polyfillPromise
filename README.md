# polyfillPromise
<blockquote><strong> A polyfill for Browsers not supporting ECMAScript 6 Promise</strong></blockquote>


Tests for existence of a Promise constructor in the browser and if doesn't exist adds a window.Promise which meets the ES6 specification.

[Browser support for Promises](http://caniuse.com/#feat=promises)


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
## Promise API

The polyfill supports the following methods of the ES6 Promise API

### Methods of the Promise constructor

[MDN Promise](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise)

**Promise.all(iterable)**

Returns a promise that resolves when all of the promises in the iterable argument have resolved.

**Promise.race(iterable)**

Returns a promise that resolves or rejects as soon as one of the promises in the iterable resolves or rejects, with the value or reason from that promise.

**Promise.reject(reason)**

Returns a Promise object that is rejected with the given reason.

**Promise.resolve(value)**

Returns a Promise object that is resolved with the given value. If the value is a thenable (i.e. has a then method), the returned promise will "follow" that thenable, adopting its eventual state; otherwise the returned promise will be fulfilled with the value.

## Methods of an instantiated Promise object

**Promise.prototype.catch(onRejected)**

Appends a rejection handler callback to the promise, and returns a new promise resolving to the return value of the callback if it is called, or to its original fulfilment value if the promise is instead fulfilled.

**Promise.prototype.then(onFulfilled, onRejected)**<br/>**Promise.prototype.then(onFulfilled)**

Appends fulfillment and rejection handlers to the promise, and returns a new promise resolving to the return value of the called handler.

##Test Suite

```
Polyfill Unit tests
    instantiation
      ✓ should throw error if argument is not a function
      ✓ should have a constructor with name Promise
      ✓ should have a methods all, race, resolve and reject
      ✓ instantiated object should have a methods then and catch


Polyfill Functional tests - Promise methods
    resolve() & .then()
      ✓ then() should receive resolved value
      ✓ A second then() should receive resolved value
      ✓ then() should return new Promise
    reject() and .catch()
      ✓ catch() should receive rejected value
      ✓ A second catch() should receive rejected value
      ✓ catch() should return new Promise
    Promise.race()
      ✓ .race() should resolve when first Promise resolves
      ✓ .race() should reject when first Promise rejects
    Promise.all()
      ✓ .all() should resolve when last Promise resolves with array of returned values
      ✓ .all() should reject when first Promise rejects
    Promise.resolve() use cases
      ✓ Promise.resolve(promise) returns promise
      ✓ Promise.resolve(thenable) returns Promise that follows thenable
      ✓ Promise.resolve(value) returns Promise that resolves to value
    Promise.reject() 
      ✓ Promise.resolve(value) should return promise that rejects to value

 ```
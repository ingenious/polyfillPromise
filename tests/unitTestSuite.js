(function(){ 


    module.exports=function(promiseType) {
    var root=this, Promise,  assert = require("assert"), nativePromise=root.Promise;
         switch (promiseType) {
        case 'Polyfill':
            root.Promise = undefined;
            Promise = require('../polyfillPromise-0.1.js');
            root.Promise = nativePromise;
            break;
        case 'Minified Polyfill':
            root.Promise = undefined;
            Promise = require('../polyfillPromise-0.1.min.js');
            root.Promise = nativePromise;
            break;
        default:
            root.Promise = nativePromise;
            Promise = nativePromise;

    }

        describe(promiseType + ' Unit tests', function() {
            describe('instantiation', function() {
                it('should throw error if argument is not a function', function(done) {
                    assert.throws(
                        function() {
                            new Promise();
                        },
                        Error
                    );
                    done();
                });
                it('should have a constructor with name Promise', function(done) {
                    assert.equal(new Promise(function() {}).constructor.name, 'Promise');
                    done();
                });
                it('should have a methods all, race, resolve and reject', function(done) {
                    assert.equal(typeof Promise.reject, 'function');
                    assert.equal(typeof Promise.resolve, 'function');
                    assert.equal(typeof Promise.all, 'function');
                    assert.equal(typeof Promise.race, 'function');
                    done();
                });
                it('instantiated object should have a methods then and catch', function(done) {
                    assert.equal(typeof new Promise(function() {})['catch'], 'function');
                    assert.equal(typeof new Promise(function() {}).then, 'function');
                    done();

                });
            });
        });

    };


})();
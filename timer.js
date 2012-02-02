(function(define){
define([],function(){

	var
		bind = function(ctx, func){
			if(typeof(func) == "string"){
				if(!func){ func = ctx; ctx = window; }
				return function(){
					ctx[func].apply(ctx, arguments); }
			}else{
				var method = !!func ? ctx.func || func : ctx;
				var scope = !!func ? ctx : window;
				return function(){ method.apply(scope, arguments); }
			}
		},
		uids = 0,
		uid = function(){
			return 'TMR_'+(uids++);
		},
		DUR = 100,
		INC = 20,
		DELAY = 100,
		_uidInt = 0,
		time = function(){ return (new Date()).getTime(); }


	var timer = function(/* ?Object|Function */objectOrFunc, /* ?Function|String */ stringOrFunc, /* ?Number|Object */ durationOrOptions, /* ?Number */ interval, /* Function|Number*/ delayOrEase){

		var
			o = {},
			args = arguments,
			i,	// increment
			ease, //ease
			d,	// duration
			delay, 	// delay to start timer
			onEnd,	// bind onEnd
			cb,	// bind callback
			h, 	// timer handle
			id,	// identifier for ref
			format, // return integer, float, milliseconds|ms (default), number:toFixed
			paused = false; // if true, does not start until prompted

		// if used like a tradition setTimeout:
		if(typeof args[0] == 'function'){
			if(typeof args[1] == "object"){
				o = args[1];
			}else{
				o.dur = args[1];
				if(args[2]) o.inc = args[2];
				if(args[3]){
					if(typeof args[3] == 'number'){
						o.delay = args[3];
					}else{
						o.ease = args[3];
					}
				}
			}
			o.callback = args[0];

		}

		// if used like a tradition setTimeout with context:
		if(typeof args[1] == 'function'){
			if(typeof args[2] == "object"){
				o = args[2];
			}else{
				o.dur = args[2];
				if(args[3]) o.inc = args[3];
				if(args[4]){
					if(typeof args[4] == 'number'){
						o.delay = args[4];
					}else{
						o.ease = args[4];
					}
				}
			}
			o.ctx = args[0]
			o.callback = args[1];
		}

		// options
		d = o.dur || o.duration || o.d || Infinity;
		i = o.inc || o.increment || o.i || 0;
		ease = o.ease || function(n){ return n; }
		delay = o.delay===true ? DELAY : o.delay ? o.delay : 0;
		var f = o.callback || o.method;
		var ctx = o.ctx || window;

		cb = !!f ? bind(ctx, f) : null;
		onEnd = o.onEnd;
		id = o.id || uid();
		pausedAtStart = o.paused || false;
		format = o.format || o.fmt || "ms";

		console.log("timer options:", id, d, i, delay, cb);

		var
			stopped = false,
			playing = false,

			starttime=0, startinc=0, pausetime=0, pausetick=0, elapsed=0, tick=0,
			increment=0, pausedelay=0, resumedelay=0;

		var formatTime = function(n){ return n; };
		if(format == "integer"){
			formatTime = function(n){ return Math.ceil(n*.001); }
		}else if(format == "float"){
			formatTime = function(n){ return n*.001; }
		}else if(typeof format == "number"){
			formatTime = function(n){ return Number(n.toFixed(format)); }
		}


		var handle = {
			// methods
			pause:function(_delay){
				if(_delay){
					setTimeout(function(){
						console.log('paused delay', _delay);
						pause()
					}, _delay);
					//console.log('paused delay', _delay);
					//setTimeout(pause, _delay);
				}else{
					pause();
				}
				return getEvent();
			},
			resume: function(_delay){
				if(_delay){
					setTimeout(function(){
						console.log('resumed delay', _delay);
						resume()
					}, _delay);
				}else{
					resume();
				}
				return getEvent();
			},
			start: function(_delay){
				// this delay can be overwritten
				start(_delay);
				return getEvent();
			},
			stop:stop,
			remove:stop,

			// properties
			time:0,
			playtime:0,
			elapsed:0,
			pausetime:0,
			increment:0,
			percentage:0,
			playing:false
		};

		var callback = function(){}, endback = function(){};

		var getEvent = function(){
			handle.time = 		formatTime(tick);
			handle.playtime = 	formatTime(tick);
			handle.elapsed = 	formatTime(elapsed);
			handle.pausetime = 	formatTime(pausetime);
			handle.increment = 	formatTime(increment);
			handle.percentage = 0;
			handle.playing = 	playing;
			handle.then = 		callback;

			if(!!d) handle.percentage = ease(tick/d<0 ? 0 : tick/d>1 ? 1 : tick/d);

			return handle;
		}

		if(!!cb && !!i){
			callback = function(){
				if(increment >= i){
					cb(getEvent());
					startinc = time();
				}
			}
		}

		if(!!d && !!onEnd){
			endback = function(){
				if(tick >= d){
					stopTimer();
					onEnd(getEvent());
				}
			}
		}else if(!!d && !!cb){
			endback = function(){
				if(tick >= d){
					stopTimer();
					cb(getEvent());
				}
			}
		}else if(!!d){
			endback = function(){
				if(tick >= d){
					stopTimer();
				}
			}
		}else{
			//console.warn("infinite timer")
		}

		// The actual timer happens here
		var startTimer = function(){
			playing = true;
			h = setInterval(function(){
				tick = time() - starttime - pausetime;
				increment = Math.max(0, time() - startinc);
				elapsed = time()-starttime;
				callback();
				endback();
			}, 1);
		}

		var stopTimer = function(){
			playing = false;
			clearInterval(h);
		}

		// controlling methods
		var pause = function(){
			console.log('pause!!!!');
			stopTimer();
			pausetick = time();
			return getEvent();
		}

		var resume = function(){
			console.log('resume!!!!');
			if(stopped){
				start();
			}else{
				pausetime += time() - pausetick;
				startTimer();
			}
			return getEvent();
		}

		var stop = function(){
			// stop cannot be delayed because
			// it needs to happen syncronously
			stopped = true;
			stopTimer();
			var event = getEvent();
			pausetime = 0;
			pausetick = 0;
			elapsed = 0;
			tick = 0;
			increment = 0;
			return event;
		}

		var start = function(_delay){
			if(_delay !== undefined) delay = _delay;
			if(pausedAtStart){
				pausedAtStart = false;
				stopped = true;
				return;
			}
			stopped = false;
			setTimeout(function(){
				stop(); // reset
				stopped = false;
				starttime = startinc = time();
				startTimer();
			}, delay);
		}

		start();

		return handle;
	}

	return timer;

});
})(typeof define == "undefined" ? function(deps, factory){
	timer = factory();
} : define);

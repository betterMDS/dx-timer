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
		eases = {
			// all are "quad"
			easeIn: function(/* Decimal? */n){
				return Math.pow(n, 2);
			},

			easeOut: function(/* Decimal? */n){
				return n * (n - 2) * -1;
			},

			easeInOut: function(/* Decimal? */n){
				n = n * 2;
				if(n < 1){ return Math.pow(n, 2) / 2; }
				return -1 * ((--n) * (n - 2) - 1) / 2;
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
		time = function(){ return (new Date()).getTime(); };


	var timer = function(/* ?Object|Function */objectOrFunc, /* ?Function|String */ stringOrFunc, /* ?Number|Object */ durationOrOptions, /* ?Number */ interval, /* Function|Number*/ delayOrEase){

		var
			actx = 1,
			afn = 1,
			adur = 1,
			aint = 1,
			adelay = 1,
			aform = 1,
			aease = 1,
			apause = 1
			aoptions = 1;

		var
			INTEGER = 'integer',
			SECONDS = 'seconds',
			FLOAT = 'float',

			o = {},
			args = arguments,

			ctx,
			cb,	// bind callback
			d,	// duration
			i,	// increment
			delay, 	// delay to start timer
			format, // return integer, float, milliseconds|ms (default), number:toFixed
			ease, //ease
			pausedAtStart = false; // if true, does not start until prompted

			// 2000, 100, "100"

		var argList = Array.prototype.slice.call(arguments);

		console.log('..')
		while(argList.length){

			var a = argList.shift();

			//console.log(' --> a:', typeof a, typeof a != 'function', a)

			if(actx){
				actx = 0;
				if(typeof a == 'object' && typeof a != 'function'){
					ctx = a;
					continue;
				}

			}

			if(afn){
				afn = 0;
				if(typeof a == 'function'){
					cb = !!ctx ? bind(ctx, a) : a;
					continue;
				}
			}

			if(adur){
				adur = 0;
				if(typeof a == 'number'){
					d = a;
					continue;
				}
			}

			if(aint){
				aint = 0;
				if(typeof a == 'number'){
					i = a;
					continue;
				}
			}

			if(adelay){
				adelay = 0;
				if(typeof a == 'number' || Number(a) == a){ // allow stringified delay
					d = Number(a);
					continue;
				}
			}

			if(aform){
				aform = 0;
				if(typeof a == 'string' && (a == INTEGER || a == FLOAT || a == SECONDS )){
					format = a;
					continue;
				}
			}

			if(aease){
				aease = 0;
				if(typeof a == 'string' && eases[a]){
					ease = eases[a];
					continue;
				}
			}

			if(apause){
				apause = 0;
				if(typeof a === true){
					pausedAtStart = 1;
					continue;
				}
			}

			if(aoptions){
				if(a.ctx) ctx = a.ctx;
				if(a.callback) fn = !!ctx ? bind(ctx, a.callback) : a.callback;
				if(a.i) i = a.i;
				if(a.d) d = a.d;
				if(a.delay) delay = a.delay;
				if(a.format) format = a.format;
				if(a.ease) ease = typeof a.ease == 'string' ? eases[a.ease] : a.ease;
				if(a.paused) pausedAtStart = 1;
			}
		} // end while

		if(!ease) ease = function(n){ return n; }
		if(!d) d = Infinity;

		/*var
			o = {},
			args = arguments,
			i,	// increment
			ease, //ease
			d,	// duration
			delay, 	// delay to start timer
			//onEnd,	// bind onEnd
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

		// options (declared above)
		d = o.dur || o.duration || o.d || Infinity;
		i = o.inc || o.increment || o.i || 0;
		ease = o.ease || function(n){ return n; }
		delay = o.delay===true ? DELAY : o.delay ? o.delay : 0;
		var f = o.callback || o.method;
		var ctx = o.ctx || window;

		cb = !!f ? bind(ctx, f) : null;
		//onEnd = o.onEnd;
		id = o.id || uid();
		pausedAtStart = o.paused || false;
		format = o.format || o.fmt || "ms";*/

		console.log("timer options:", d, i, delay, cb);

		var
			h; // timer handle

		var
			thenList = [],
			addThen = function(c, f){
				thenList.push(bind(c,f));
				return getEvent();
			},
			thenCallback = function(evt){
				for(var i=0;i<thenList.length;i++){
					thenList[i](evt);
				}
				thenList = [];
			},
			formatTime = function(n){ return n; };
			if(format == INTEGER){
				formatTime = function(n){ return Math.ceil(n*.001); }
			}else if(format == FLOAT){
				formatTime = function(n){ return n*.001; }
			}else if(typeof format == "number"){ // this ain't gonna happen
				formatTime = function(n){ return Number(n.toFixed(format)); }
			}

		var
			stopped = false,
			playing = false,

			starttime=0, startinc=0, pausetime=0, pausetick=0, elapsed=0, tick=0,
			increment=0, pausedelay=0, resumedelay=0,
			callback = function(){},
			endback = function(){};


		if(!!cb && !!i){
			callback = function(){

				if(increment >= i){
					cb(getEvent());
					startinc = time();
				}
			}
		}

		/*if(!!d && !!onEnd){
			endback = function(){
				if(tick >= d){
					stopTimer();
					//onEnd(getEvent());
					thenCallback(getEvent());
				}
			}
		}else */
		if(!!d && !!cb){
			endback = function(){
				if(tick >= d){
					stopTimer();
					cb(getEvent());
					thenCallback(getEvent());
				}
			}
		}else if(!!d){
			endback = function(){
				if(tick >= d){
					stopTimer();
					thenCallback(getEvent());
				}
			}
		}else{
			// infinite timer
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
			then: addThen,

			// properties
			time:0,
			playtime:0,
			elapsed:0,
			pausetime:0,
			increment:0,
			percentage:0,
			playing:false
		};
		var getEvent = function(){
			handle.time = 		formatTime(tick);
			handle.playtime = 	formatTime(tick);
			handle.elapsed = 	formatTime(elapsed);
			handle.pausetime = 	formatTime(pausetime);
			handle.increment = 	formatTime(increment);
			handle.percentage = 0;
			handle.playing = 	playing;

			if(!!d) handle.percentage = ease(tick/d<0 ? 0 : tick/d>1 ? 1 : tick/d);

			return handle;
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

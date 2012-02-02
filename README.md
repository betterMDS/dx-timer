A SUPER timer that simplifies timer usage by allowing for context, as well as returning an object handle from which the timer can be further controlled.

Description
-----------

The timer allows for 0, 1, 2, 3, 4 or 5 arguments. While this may seem "magic" it allows for versatility in your preferred method of calling a timer. It can be done traditionally with:

	timer(function, duration),

or a context can be added as:

	timer(object, function, duration).

An additional argument makes it act as a setTimeout:

	timer(object, function, duration, interval).

And the fifth argument, if a number, will be treated as a delay. If it is a function, it will be treated as an easing function.

	timer(object, function, duration, interval, quadInOut).

Additonally, if the last argument passed is an object, it will be treated as the options argument, which allows for all of the following:

* **i** - increment
* **d** - duration
* **ease** - easing function
* **delay** - the amount to postpone the timer in milliseconds
* **format** - Option to return "integer", "float", "milliseconds" or "ms" (default). Or, if a number is passed, it will be treated as a decimal place request, as: _time.toFixed(number)_
* **paused** - if true, the timer does not start until prompted


Timer Event
-----------

Unlike a traditional setTimeout, timer passes an event:

	timer(function(TimerEvent){}, 10);

This event contains all information that has occurred up until that point in time:

* **time** - The time that has elapsed since starting, minus any time when the timer was paused.
* **pausetime** - The time in which the timer was paused, which would happen between _timerInstance.pause()_ and _timerInstance.resume()_. This is accumulative, so if there are multiple pauses it will represent the total. 
* **playtime** - Same as _time_. Included to clarify it's relative importance to _pausetime_.
* **elapsed** - The amount of time that has elapsed since the timer was started. If there was no pause, this may not be the time you set in the duration, but it should be close. Otherwise this is the total of playtime and pausetime.
* **increment** - The amount of time since the last callback.  This may not be the time you set in the increment, but it should be close.
* **percentage** - A float in the range of 0 - 1, this represents the percentage of the time elapsed (not including pauses). Useful for animations.

The Handle
----------

The traditional setTimeout is turned off by clearing the returned integer:

	var handle = setTimeout(function(){}, 10);
	clearTimeout(handle);

This is not only verbose, but it lacks versatility. The setTimeout can only be destroyed, not paused or resumed. The timer returns an object that contains multiple controls:

* **pause** - Pauses the timer.
* **resume** - Resumes a paused timer or starts it.
* **start** - Starts or restarts a timer from the beginning.
* **stop** - Stops a timer, but does not destroy it. Subsequent calls to _start_ or _resume_ will restart the timer.
* **remove** - Destroys the timer.
* **getEvent** - Takes no action on the timer, but returns a TimerEvent (see above) with the current status.

<img src="http://clubajax.org/wp-content/uploads/2010/02/Mike125x150.jpg" />

<script type="text/javascript" src="https://gist.github.com/1396395.js?file=AdvancedBrokenContext.js"></script>

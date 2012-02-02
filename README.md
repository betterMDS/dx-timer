A versatile timer that simplifies timer usage by allowing for context and other options, as well as returning a handle from which the timer can be further controlled.

Acknowledgements
----------------

Author: Mike Wilcox

Email: anm9tr@gmail.com

Website: [http://clubajax.org](http://clubajax.org)

Twitter: [https://twitter.com/#!/clubajax](@clubajax)

The timer is freely available under the same dual BSD/AFLv2 license as the Dojo Toolkit.

Description
-----------

The timer allows for 0, 1, 2, 3, 4 or 5 arguments. While this may seem "magic" it allows for versatility in your preferred method of calling a timer. It can be done traditionally, context can be added (you can use *this*), and duration, increment, and delay can be used. An easing function can also be added, so animation effects can be easily achieved. An object handle is returned that contains several methods so the timer can be paused, stopped, resumed, started, or removed.

Installation
------------

Download the dx-timer package, and install it in the same directory as your project. It is AMD compatible, so it can be loaded as:

```javascript
require('timer', function(timer){
	timer(function, duration);	
});
```
But AMD is not required, and if so, the timer will be installed as a global object.

Usage
-----

The timer allows for 0, 1, 2, 3, 4 or 5 arguments. While this may seem "magic" it allows for versatility in your preferred method of calling a timer. It can be done traditionally with:

```javascript
timer(function, duration);
```

or a context can be added as:

```javascript
timer(object, function, duration).
```

An additional argument makes it act as a setTimeout:

```javascript
timer(object, function, duration, interval).
```

And the fifth argument, if a number, will be treated as a delay. If it is a function, it will be treated as an easing function.

```javascript
timer(object, function, duration, interval, quadInOut).
```

Additionally, if the last argument passed is an object, it will be treated as the options argument, which allows for all of the following:

* **i** - increment
* **d** - duration
* **ease** - easing function
* **delay** - the amount to postpone the timer in milliseconds
* **format** - Option to return "integer", "float", "milliseconds" or "ms" (default). Or, if a number is passed, it will be treated as a decimal place request, as: _time.toFixed(number)_
* **paused** - if true, the timer does not start until prompted


Timer Event
-----------

Unlike a traditional setTimeout, timer passes an event:

```javascript
timer(function(TIMER_EVENT){}, 10);
```

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

```javascript
var handle = setTimeout(function(){}, 10);
clearTimeout(handle);
```

This is not only verbose, but it lacks versatility. The setTimeout can only be destroyed, not paused or resumed. The timer returns an object that contains multiple controls:

* **pause** - Pauses the timer.
* **resume** - Resumes a paused timer or starts it.
* **start** - Starts or restarts a timer from the beginning.
* **stop** - Stops a timer, but does not destroy it. Subsequent calls to _start_ or _resume_ will restart the timer.
* **remove** - Destroys the timer.
* **getEvent** - Takes no action on the timer, but returns a TimerEvent (see above) with the current status.

License
-------

The timer is available via Academic Free License >= 2.1 OR the
modified BSD license. see: [http://dojotoolkit.org/license]
(http://bugs.dojotoolkit.org/browser/dojo/trunk/LICENSE) for details
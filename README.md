A versatile timer that simplifies timer usage by allowing for context and other options, as well as returning a handle from which the **timer** can be further controlled.

Acknowledgements
----------------

Author: Mike Wilcox

Email: mike.wilcox@bettervideo.com

Website: http://bettervideo.com

The timer is freely available under the same dual BSD/AFLv2 license as the Dojo Toolkit.

Description
-----------

The timer can be used traditionally, or context can be added (you can use *this*),
plus duration, and an increment can be added to act as setInterval. Other options
include delay(s), easing functions, and formatting the event times.

Unlike a normal setTimeout, the **timer** passes an event that indicates the time
elapsed, plus, play time, paused time, and the percentage of time elapsed. It
also a "playing" property.

An object handle (which is also the event object) is returned that contains
several methods so the **timer** can be paused, stopped, resumed, started, or removed.

Installation
------------

Download the dx-timer package, and install it in the same directory as your
project. It is AMD compatible, so it can be loaded as:

```javascript
require('timer', function(timer){
	timer(function, duration);
});
```
But AMD is not required, and if so, the **timer** will be installed as a global object.

Usage
-----

The timer allows for multiple arguments. While this may seem "magic" it allows
for versatility in your preferred method of calling a timer. All of the following
arguments are optional, and it generally can be determined based on the order and
type of argument. The exception is the delay, which is not a problem unless the
increment is not used. If you wish to skip the increment, indicate the delay as
a string.

```javascript
timer(function, duration);
```

Context can be added:

```javascript
timer(this, function, duration);
```

An additional argument makes it act as a setInterval:

```javascript
timer(object, function, duration, interval);
```

The next argument, if a number, will be treated as a delay. If it is acting
as a setTimeout (with no interval) set it as a stringified number:

```javascript
timer(object, function, duration, "500");
```

Next could be a string indicating the format for the numbers in the event object.
The options are "integer", which rounds to the nearest second, "float" which
returns seconds and three decimal places (unguaranteed). Otherwise it will be
the default, miliseconds.

```javascript
timer(object, function, duration, "integer");
```

The next argument can be a an easing function, or a string to use one of the
built-in easing functions: "easeIn", "easeOut", or "easeInOut":

```javascript
timer(object, function, duration, "easeIn");
```

Finally, if the next argument is the Boolean *true*, the **timer** will be paused and
not run until prompted:

```javascript
timer(object, function, duration, true);
```

Additionally, if the last argument passed is an object, it will be treated as the
options argument. Note this can be the last argument, or the only argument.

```javascript
timer({
	ctx:this,
	callback:this.myFunction,
	d:2000,
	i:100,
	delay:200,
	format:'seconds',
	ease:'easeOut',
	paused:true
});
```

* **ctx** - context (this)
* **callback** - the function to call on increments or on end
* **d** - duration
* **i** - increment
* **delay** - the amount to postpone the **timer** in milliseconds
* **format** - Option to return "integer", "float", "milliseconds" or "ms" (default).
* **ease** - easing function
* **paused** - if true, the **timer** does not start until prompted

The timer can even operate with no arguments. The timer is created and started
and can be controlled and tested through the handle:

```javascript
var handle = timer();
handle.pause();
console.log(handle.time);
```


Timer Event
-----------

Unlike a traditional setTimeout, timer passes an event:

```javascript
timer(function(TIMER_EVENT){}, 10);
```

This event contains all information that has occurred up until that point in time:

* **time** - The time that has elapsed since starting, minus any time when the
timer was paused.
* **pausetime** - The time in which the **timer** was paused, which would happen
between _timerInstance.pause()_ and _timerInstance.resume()_. This is
accumulative, so if there are multiple pauses it will represent the total.
* **playtime** - Same as _time_. Included to clarify it's relative importance to
_pausetime_.
* **elapsed** - The amount of time that has elapsed since the **timer** was started.
If there was no pause, this may not be the time you set in the duration, but it
should be close. Otherwise this is the total of playtime and pausetime.
* **increment** - The amount of time since the last callback.  This may not be
the time you set in the increment, but it should be close.
* **percentage** - A float in the range of 0 - 1, this represents the percentage
of the time elapsed (not including pauses). Useful for animations.

The Handle
----------

The traditional setTimeout is turned off by clearing the returned integer:

```javascript
var handle = setTimeout(function(){}, 10);
clearTimeout(handle);
```

This is not only verbose, but it lacks versatility. The setTimeout can only be
destroyed, not paused or resumed. The timer returns an object that contains
multiple controls:

* **pause()** - Pauses the **timer**.
* **resume()** - Resumes a paused timer or starts it.
* **start()** - Starts or restarts a timer from the beginning.
* **stop()** - Stops a timer, but does not destroy it. Subsequent calls to
_start_ or _resume_ will restart the **timer**.
* **remove()** - Destroys the **timer**. (Techinally just stops it)
* **getEvent()** - Takes no action on the **timer**, but returns a TimerEvent (see
above) with the current status.

Chaining
--------

The timer has a promise-like chaining ability, by adding *then()* to the end of
it:

```javascript
var t = timer(function(){
	console.log('simple timer complete.');
}, 200).then(function(){console.log('simple timer then done!')});
```

License
-------

The timer is available via Academic Free License >= 2.1 OR the
modified BSD license. see: [http://dojotoolkit.org/license]
(http://bugs.dojotoolkit.org/browser/dojo/trunk/LICENSE) for details

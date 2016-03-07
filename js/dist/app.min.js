(function(){

	var Clock = {
		init: function init() {
			this.cache.breakAmount.innerHTML = this.cache.breakTime;
			this.cache.sessionAmount.innerHTML = this.cache.sessionTime;
			this.cache.minuteHand.innerHTML = this.cache.sessionTime;
			this.cache.breakIncrease.addEventListener('click', this.changeSetting);
			this.cache.breakDecrease.addEventListener('click', this.changeSetting);
			this.cache.sessionIncrease.addEventListener('click', this.changeSetting);
			this.cache.sessionDecrease.addEventListener('click', this.changeSetting);
			this.cache.clock.addEventListener('click', this.startTimer);
			this.cache.reset.addEventListener('click', this.resetTimer);
		},

		cache: {
			clock: 					        document.getElementById('clock'),
			timerStarted: 			    false,
			sessionCurrentTime: 	  false,
			breakCurrentTime: 		  false,
			seconds: 				        60,
			breakTime: 				      5,
			sessionTime: 			      25,
			breakIndicatorLevel: 	  0,
			sessionIndicatorLevel: 	0,
			alarmSound: 			      'http://soundbible.com/grab.php?id=1599&type=wav',
			breakAmount: 			      document.getElementById('break-amount'),
			sessionAmount: 			    document.getElementById('session-amount'),
			breakIncrease: 			    document.getElementById('break-increase'),
			breakDecrease: 			    document.getElementById('break-decrease'),
			sessionIncrease: 		    document.getElementById('session-increase'),
			sessionDecrease: 		    document.getElementById('session-decrease'),
			breakIndicator: 		    document.getElementById('break-indicator'),
			sessionIndicator: 		  document.getElementById('session-indicator'),
			clockType: 				      document.getElementById('clock-type'),
			minuteHand: 			      document.getElementById('minutes'),
			secondHand: 			      document.getElementById('seconds'),
			reset: 					        document.getElementById('reset'),
		},
		
		changeSetting: function () {
			var button = this.id;
			var c = Clock.cache;
      
      Clock.resetTimer();
			switch (button) {
				case 'break-increase':
					c.breakTime += c.breakTime !== 60 ? 1 : 0;
					c.breakAmount.innerHTML = c.breakTime;
					break;
				case 'break-decrease':
					c.breakTime -= c.breakTime !== 1 ? 1 : 0;
					c.breakAmount.innerHTML = c.breakTime;
					break;
				case 'session-increase':
					c.sessionTime += c.sessionTime !== 120 ? 1 : 0;
					c.sessionAmount.innerHTML = c.sessionTime;
					c.minuteHand.innerHTML = c.sessionTime;
					break;
				case 'session-decrease':
					c.sessionTime -= c.sessionTime !== 1 ? 1 : 0;
					c.sessionAmount.innerHTML = c.sessionTime;
					c.minuteHand.innerHTML = c.sessionTime;
					break;
			}
		},

		startTimer: function () {
			var c = Clock.cache;
			var alarm = new Audio(c.alarmSound);

			// Get the initial value of session/break time to calculate indicator level
			if ( c.sessionCurrentTime === false || c.breakCurrentTime === false ) {
				c.sessionCurrentTime = c.sessionTime;
				c.breakCurrentTime = c.breakTime;
			}

			// If timer isn't counting down, start countdown
			if ( c.timerStarted === false ) {
				 if ( c.sessionTime === parseInt(c.sessionAmount.innerHTML ) ) {
				 	c.sessionTime -= 1;
				 }
				 if ( c.breakTime === parseInt(c.breakAmount.innerHTML) ) {
				 	c.breakTime -= 1;
				 }
				 // Start countdown
				 c.timerStarted = setInterval(function() {
				 	c.seconds -= 1;
				 	c.secondHand.innerHTML = ":" + c.seconds;

				 	if ( c.seconds < 10 ) {
				 		c.secondHand.innerHTML = ':0' + c.seconds;
				 	}

				 	// Start Session
				 	if ( c.clockType.innerHTML === 'Session' ) {
				 		c.sessionIndicatorLevel += 182 / (c.sessionCurrentTime * 60);
				 		c.sessionIndicator.setAttribute('style', 'height:' + c.sessionIndicatorLevel + 'px;');
				 		c.minuteHand.innerHTML = c.sessionTime;

				 		if ( c.seconds === 0 ) {
				 			c.sessionTime -= 1;
				 			c.secondHand.innerHTML = ':0' + c.seconds;
				 			// Switch to Break
				 			if ( c.sessionTime < 0 ) {
				 				alarm.play();
				 				c.minuteHand.innerHTML = c.breakTime + 1;
				 				c.clockType.innerHTML = 'Break!';
				 				c.sessionTime = parseInt(c.sessionAmount.innerHTML) - 1;
				 			}
				 			c.seconds = 60;
				 		}
				 	} else { 
				 		// Start Break
				 		c.breakIndicatorLevel += 182 / (c.breakCurrentTime * 60);
				 		c.breakIndicator.setAttribute('style', 'height:' + c.breakIndicatorLevel + 'px;');
				 		c.minuteHand.innerHTML = c.breakTime;

				 		if ( c.seconds === 0 ) {
				 			c.breakTime -= 1;
				 			c.secondHand.innerHTML = ':0' + c.seconds;
				 			// Switch to Session
				 			if ( c.breakTime < 0 ) {
				 				alarm.play();
				 				c.sessionIndicator.setAttribute('style', 'height: 0px;');
				 				c.breakIndicator.setAttribute('style', 'height: 0px;');
				 				c.sessionIndicatorLevel = 0;
				 				c.breakIndicatorLevel = 0;
				 				c.clockType.innerHTML = 'Session';
				 				c.minuteHand.innerHTML = c.sessionTime + 1;
				 				c.breakTime = parseInt(c.breakAmount.innerHTML) - 1;
				 			}
				 			c.seconds = 60;
				 		}
				 	}
				 }, 1000);
			} else {
				// If timer is counting down, stop timer
				Clock.stopTimer();
			}
		},

		stopTimer: function () {
			clearInterval(Clock.cache.timerStarted);
			Clock.cache.timerStarted = false;
		},

		resetTimer: function () {
			var c = Clock.cache;

			Clock.stopTimer();
			c.sessionTime = parseInt(c.sessionAmount.innerHTML);
			c.breakTime = parseInt(c.breakAmount.innerHTML);
			c.seconds = 60;
			c.sessionIndicatorLevel = 0;
			c.breakIndicatorLevel = 0;
			c.sessionCurrentTime = false;
			c.breakCurrentTime = false;
			c.sessionIndicator.setAttribute('style', 'height: 0px;');
			c.breakIndicator.setAttribute('style', 'height: 0px;');
			c.sessionAmount.innerHTML = c.sessionTime;
			c.clockType.innerHTML = 'Session';
			c.breakAmount.innerHTML = c.breakTime;
			c.sessionAmount.innerHTML = c.sessionTime;
			c.minuteHand.innerHTML = c.sessionTime;
			c.secondHand.innerHTML = '';
		}
	};

	Clock.init();

})();
'use strict';

document.addEventListener('DOMContentLoaded', function() {
	let elBg = document.getElementById('bg');
	let elBucket = document.getElementById('bucket');
	let elBrick = document.querySelector('.brick');
	let rec = document.getElementById('record');
	let recNumber = 0;
	let brickSet = [];
	const startPos = -100;
	let screenWidth = document.documentElement.offsetWidth;
	let screenHeight = document.documentElement.offsetHeight;
	let workWidth = screenWidth - elBrick.offsetWidth;
	let workHeight = screenHeight + elBrick.offsetHeight;

	elBucket.addEventListener('animationend', function() {
		// Move Bucket
		function moveBucket() {
			elBucket.addEventListener('mousedown', function(e) {
				let backetCoords = getCoords(elBucket);
				let shiftX = e.pageX - backetCoords.left;
				let bgCoords = getCoords(elBg);
				
				document.onmousemove = function(e) {
					let newLeft = e.pageX - shiftX - bgCoords.left;
					let rightEdge = elBg.offsetWidth - elBucket.offsetWidth;
			
					if (newLeft < 0) {
						newLeft = 0;
					}
					if (newLeft > rightEdge) {
						newLeft = rightEdge;
					}
					elBucket.style.left = newLeft + 'px';
				};

				document.onmouseup = function() {
					document.onmousemove = document.onmouseup = null;
				};
				return false;
			});

			elBucket.ondragstart = function() {
				return false;
			};

			function getCoords(elem) {
				var box = elem.getBoundingClientRect();

				return {
					top: box.top + pageYOffset,
					left: box.left + pageXOffset
				};
			}
		}
		moveBucket();

		// Randomizer
		function mtRand(min, max) {
			return Math.floor(Math.random() * (max - min + 1) + min);
		} 

		// Animate
		function animate({timing, draw, duration}) {
			let start = performance.now();
			
			requestAnimationFrame(function animate(time) {
				let timeFraction = (time - start) / duration;
				if (timeFraction > 1) timeFraction = 1;
			
				let progress = timing(timeFraction);
			
				draw(progress);
			
				if (timeFraction < 1) {
					requestAnimationFrame(animate);
				}
			});
		}

		elBrick.style.left = mtRand(0, workWidth) + 'px';

		//Fall Bricks
		function fall() {
			let elBricks = document.querySelectorAll('.brick');
			let lengthBricks = elBricks.length;

			for (let i = 0; i < elBricks.length; i++) {
				let thisBrick = elBricks[i];
				animate({
					duration: mtRand(2500, 9000),
					timing: function linear(timeFraction) {
						return timeFraction;
					},
					draw: function(progress) {
						thisBrick.style.top = progress * workHeight  + 'px';
						
						if (parseInt(thisBrick.style.top) >= workHeight) {
							brickTop.call(thisBrick);
							cloneBrick.call(lengthBricks);		
						}
					}
				});
			}
		}
		fall();

		function brickTop() {
			this.style.top = startPos + 'px';
			this.style.left = mtRand(0, workWidth) + 'px';
		}

		function cloneBrick() {
						
			if (this <= 2) {
				console.log(this);
				let newBrick = document.createElement('div');
				newBrick.className = 'brick';
				elBg.appendChild(newBrick);
				fall();
			}
		}
			
	});

	
});

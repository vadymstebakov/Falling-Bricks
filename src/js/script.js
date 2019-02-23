'use strict';

document.addEventListener('DOMContentLoaded', function() {
	let elBg = document.getElementById('bg');
	let elBucket = document.getElementById('bucket');
	let elBrick = elBg.querySelectorAll('.brick')[0];
	let brickSet = [];
	let i = 0;
	let rec = document.getElementById('record');
	let recSum = 0;
	let life = elBg.querySelector('.attempts');
	let lifeSum = 3;
	let screenWidth = document.documentElement.offsetWidth;
	let screenHeight = document.documentElement.offsetHeight;
	let workWidth = screenWidth - elBrick.offsetWidth;
	let workHeight = screenHeight + elBrick.offsetHeight;
	const startPos = '-100px';
	let removed = false;

	elBucket.addEventListener('animationend', function() {
		// Open score ---------------
		rec.parentNode.classList.add('active');

		// Move Bucket --------------
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

		// Randomizer --------------
		function mtRand(min, max) {
			return Math.floor(Math.random() * (max - min + 1) + min);
		} 

		// Animate --------------
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

		// Animate init -----------
		function animateInt(briks) {
			animate({
				duration: mtRand(2500, 9000),
				timing: function linear(timeFraction) {
					return timeFraction;
				},
				draw: function(progress) {						
					briks.style.top = progress * workHeight  + 'px';
				}
			});
		}

		// Fall init --------------
		let brickInterval = setInterval(function() { 
			fall();
		}, 3000);
		
		// Fall -------------
		function brickFall(brick) {

			animateInt(brick);

			let falling = setInterval(function() {
				if (checkCatch(brick)) {
					// console.log('catch');
					clearInterval(falling);
					brick.parentNode.removeChild(brick);
					recSum++;
					rec.innerHTML = recSum;

					if (recSum % 10 == 0) {
						lifeSum++;
						life.innerHTML = lifeSum;
					}
				}
				if (checkFail(brick)) {
					// console.log('fail');
					clearInterval(falling);
					brick.parentNode.removeChild(brick);
					lifeSum--;
					life.innerHTML = lifeSum;

					if (lifeSum <= 0) {
						lifeSum = 0;
						life.innerHTML = lifeSum;
					}
				} 
			}, 15);
		}

		// Catch ----------------
		function checkCatch(brick) {
			let elBrickX = brick.getBoundingClientRect().left;
			let elBrickY = brick.getBoundingClientRect().top;
			let elBucketX = elBucket.getBoundingClientRect().left;
			let elBucketY = elBucket.getBoundingClientRect().top;			

			return (elBrickY > elBucketY && elBrickX > elBucketX && elBrickX < elBucketX + parseInt(elBucket.width));
		}

		// Fail --------------
		function checkFail(brick) {			
			return (parseInt(brick.style.top) >= screenHeight);
		}

		// Brick clone --------------
		function fall() {
			brickSet[i] = elBrick.cloneNode();
			brickSet[i].style.left = mtRand(0, workWidth) + 'px';
			elBg.appendChild(brickSet[i]);
			brickFall(brickSet[i]);
			i++;

			if (!removed) {
				elBrick.parentNode.removeChild(elBrick);
				removed = true;
			}
		}

		// Pause --------------------
		window.onblur = function() {
			console.log('pause');
		};

		// Continue -----------------
		window.onfocus = function() {
			for (let i = 0; i < brickSet.length; i++) {
				let brick = brickSet[i];
				let style = getComputedStyle(brick);
				
				if (style.top == startPos) brick.parentNode.removeChild(brick);
			}
		};
			
	});
	
});

'use strict';

document.addEventListener('DOMContentLoaded', function() {
	let elBg = document.getElementById('bg');
	let elBucket = document.getElementById('bucket');
	let elBrick = elBg.querySelectorAll('.brick')[0];
	let brickSet = [];
	const widthBuket = elBucket.offsetWidth;
	const minFromHeightBuket = 75;
	const widthBrick = elBrick.offsetWidth;
	const heightBrick = elBrick.offsetHeight;
	let i = 0;
	let rec = document.getElementById('record');
	let recSum = 0;
	let btnPause = elBg.querySelector('.btn');
	let life = elBg.querySelector('.attempts');
	let lifeSum = 3;
	let wrapPause = elBg.querySelector('.popup_pause'); 
	let wrapGameOver = elBg.querySelector('.popup_end'); 
	let screenWidth = document.documentElement.offsetWidth;
	let screenHeight = document.documentElement.offsetHeight;
	let workWidth = screenWidth - widthBrick;
	let workHeight = screenHeight + heightBrick;
	const startPos = '-100px';
	let removed = false;

	function initPopups() {
		let popups = elBg.querySelectorAll('.popup');
		let btnShow = elBg.querySelectorAll('.show-popup');
		let btnClose = elBg.querySelectorAll('.close-popup');

		let popupRemove = function() {
			for (let i = 0; i < popups.length; i++) {
				popups[i].classList.remove('active');
			}
		};

		let showPopup = function() {
			for (let i = 0; i < btnShow.length; i++) {
				btnShow[i].addEventListener('click', function(e) {
					e.preventDefault();
					popupRemove();
					let popupClass = `.${this.getAttribute('data-popup')}`;
					elBg.querySelector(popupClass).classList.add('active');
				}, false);
			}
			closePopup();
		};

		let closePopup = function() {
			for (let i = 0; i < btnClose.length; i++) {
				btnClose[i].addEventListener('click', function(e) {
					e.preventDefault();
					popupRemove();
				}, false);
			}
		};

		showPopup();
	}
	initPopups();

	elBucket.addEventListener('animationend', function() {
		// Start Game ----------------
		life.parentNode.classList.add('active');
		btnPause.classList.add('active');
		rec.parentNode.classList.add('active');

		// Move Bucket --------------
		function moveBucket() {
			elBucket.addEventListener('mousedown', function(e) {
				let backetCoords = getCoords(elBucket);
				let shiftX = e.pageX - backetCoords.left;
				let bgCoords = getCoords(elBg);
				
				document.onmousemove = function(e) {
					let newLeft = e.pageX - shiftX - bgCoords.left;
					let rightEdge = elBg.offsetWidth - widthBuket;
			
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
		
		// Animate fall init -----------
		function animateFallInt(bricks) {
			animate({
				duration: mtRand(2500, 9000),
				timing: function linear(timeFraction) {
					return timeFraction;
				},
				draw: function(progress) {					
					bricks.style.top = progress * workHeight  + 'px';
				}
			});
		}

		// Fall init --------------
		let brickInterval = setInterval(function() { 
			fall();
		}, 3000);
		
		// Fall -------------
		function brickFall(brick) {
			animateFallInt(brick);

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
					brick.remove();
					lifeSum--;
					life.innerHTML = lifeSum;

					if (lifeSum <= 0) {
						lifeSum = 0;
						life.innerHTML = lifeSum;
						gameOver();
					}
				}				

				if (wrapGameOver.classList.contains('active')) {
					clearInterval(falling);					
					return brick.remove();
				}

			}, 15);
		}

		// Catch ----------------
		function checkCatch(brick) {
			let elBrickL = Math.floor(brick.getBoundingClientRect().left);
			let elBrickR = Math.floor(brick.getBoundingClientRect().right);
			let elBrickT = Math.floor(brick.getBoundingClientRect().top);
			let elBucketL = Math.floor(elBucket.getBoundingClientRect().left);
			let elBucketR = Math.floor(elBucket.getBoundingClientRect().right);
			let elBucketT = Math.floor(elBucket.getBoundingClientRect().top);
			let elBucketB = Math.floor(elBucket.getBoundingClientRect().bottom);	
			return (
				elBrickT > elBucketT &&
				(elBucketB - minFromHeightBuket) > elBrickT &&
				elBrickL > elBucketL && 
				elBrickR < elBucketR);
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

		// Game Over --------------
		function gameOver() {
			clearInterval(brickInterval);
			wrapGameOver.classList.add('active');
		}

		// Pause ------------------
		function addPause() {
			for (let i = 0; i < brickSet.length; i++) {
				let brick = brickSet[i];
				brick.classList.add('stop');
			}
			
			wrapPause.classList.add('active');
		}

		function removePause() {
			for (let i = 0; i < brickSet.length; i++) {
				let brick = brickSet[i];
				let style = getComputedStyle(brick);
				if (style.top == startPos) brick.remove();
			}
		}

		// Pause blur --------------------
		window.onblur = function() {
			console.log('pause');
			addPause();
		};

		// Continue focus -----------------
		window.onfocus = function() {
			console.log('play');
			removePause();
		};
			
	});
	
});

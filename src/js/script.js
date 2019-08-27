'use strict';

document.addEventListener('DOMContentLoaded', function() {
	const popupStart = document.getElementById('popup-start');
	const popupEnd = document.getElementById('popup-end');
	const sectionGame = document.getElementById('game');
	const elBucket = sectionGame.querySelector('.bucket');
	const elBrick = sectionGame.querySelector('.brick');
	const brickSet = [];
	const widthBuket = elBucket.offsetWidth;
	const minFromHeightBuket = 75;
	const widthBrick = elBrick.offsetWidth;
	const heightBrick = elBrick.offsetHeight;
	const score = sectionGame.querySelector('.record');
	const life = document.querySelector('.attempts');
	const finalScore = popupEnd.querySelector('.score-final');
	let screenWidth = document.documentElement.offsetWidth;
	let screenHeight = document.documentElement.offsetHeight;
	let workWidth = screenWidth - widthBrick;
	let workHeight = screenHeight + heightBrick;
	let removed = false;
	let i = 0;
	let scoreSum, lifeSum;

	// Save name
	(function saveName() {
		const form = popupStart.querySelector('.user-name');
		const btn = form.querySelector('.btn');

		popupStart.classList.add('active');

		if (localStorage.getItem('userName')) {
			popupStart.classList.remove('popup--first-start');
			return form.remove();
		}

		btn.addEventListener('click', function(e) {
			e.preventDefault();
			let self = this;
			let inputVal = self.previousElementSibling.value;
			
			if (inputVal !== '') {
				localStorage.setItem('userName', inputVal);
				popupStart.classList.remove('popup--first-start');
				form.remove();
			}
		}, false);
	}) ();

	// Init popups--------------
	(function initPopups() {
		let popups = document.querySelectorAll('.popup');
		let btnShow = document.querySelectorAll('.show-popup');
		let btnClose = document.querySelectorAll('.close-popup');

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
					document.querySelector(popupClass).classList.add('active');
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
	}) ();

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
	function initAnimateFall(bricks) {
		animate({
			timing: timeFraction => timeFraction,
			draw: progress => {					
				bricks.style.top = `${progress * workHeight}px`;
			},
			duration: mtRand(2500, 9000)
		});
	}

	// Move Bucket --------------
	(function moveBucket() {
		elBucket.addEventListener('mousedown', function(e) {
			let backetCoords = getCoords(elBucket);
			let shiftX = e.pageX - backetCoords.left;
			let bgCoords = getCoords(sectionGame);
			
			document.onmousemove = function(e) {
				let newLeft = e.pageX - shiftX - bgCoords.left;
				let rightEdge = sectionGame.offsetWidth - widthBuket;
		
				if (newLeft < 0) newLeft = 0;
				if (newLeft > rightEdge) newLeft = rightEdge;
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
	}) ();

	// Start Game ----------------
	document.addEventListener('click', function(e) {
		let btnStart = e.target.closest('.start-game');
		
		if (!btnStart) return;

		sectionGame.classList.add('active');
		life.parentNode.classList.add('active');
		lifeSum = 3;
		life.textContent = lifeSum;
		scoreSum = 0;
		score.textContent = scoreSum;

		// Clone init --------------
		let initBrickFall = setTimeout(function fnFall() { 
			cloneBrick();
			initBrickFall = setTimeout(fnFall, 3000);
		}, 3000);
		
		// Fall -------------
		function brickFall(brick) {
			initAnimateFall(brick);

			// Catch ----------------
			const checkCatch = brick => {
				let elBrickL = Math.floor(brick.getBoundingClientRect().left);
				let elBrickR = Math.floor(brick.getBoundingClientRect().right);
				let elBrickT = Math.floor(brick.getBoundingClientRect().top);
				let elBucketL = Math.floor(elBucket.getBoundingClientRect().left);
				let elBucketR = Math.floor(elBucket.getBoundingClientRect().right);
				let elBucketT = Math.floor(elBucket.getBoundingClientRect().top);
				let elBucketB = Math.floor(elBucket.getBoundingClientRect().bottom);

				return Boolean(
					elBrickT > elBucketT &&
					(elBucketB - minFromHeightBuket) > elBrickT &&
					elBrickL > elBucketL && 
					elBrickR < elBucketR
				);
			};

			// Fail --------------
			const checkFail = brick => Boolean(parseInt(brick.style.top) >= screenHeight);

			let initChecking = setInterval(function() {
				if (checkCatch(brick)) {
					clearInterval(initChecking);
					brick.parentNode.removeChild(brick);
					scoreSum++;
					score.textContent = scoreSum;

					if (scoreSum % 10 === 0) {
						lifeSum++;
						life.textContent = lifeSum;
					}
				}

				if (checkFail(brick)) {
					clearInterval(initChecking);
					brick.remove();
					lifeSum--;
					life.textContent = lifeSum;

					if (lifeSum <= 0) {
						lifeSum = 0;
						life.textContent = lifeSum;
						gameOver();
					}
				}				

				if (popupEnd.classList.contains('active')) {
					clearInterval(initChecking);					
					brick.remove();
				}

			}, 15);
		}

		// Brick clone --------------
		function cloneBrick() {
			brickSet[i] = elBrick.cloneNode();
			brickSet[i].style.left = `${mtRand(0, workWidth)}px`;
			sectionGame.appendChild(brickSet[i]);
			brickFall(brickSet[i]);
			i++;

			if (!removed) {
				elBrick.remove();
				removed = true;
			}	
		}

		// Game Over --------------
		function gameOver() {
			clearTimeout(initBrickFall);
			popupEnd.classList.add('active');
			sectionGame.classList.remove('active');
			life.parentNode.classList.remove('active');
			finalScore.textContent = scoreSum;
		}

	}, false);	
});

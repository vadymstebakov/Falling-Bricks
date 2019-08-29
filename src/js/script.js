'use strict';

document.addEventListener('DOMContentLoaded', function() {
	const popupStart = document.getElementById('popup-start');
	const popupEnd = document.getElementById('popup-end');
	const popupRecord = document.getElementById('popup-record');
	const recordName = popupRecord.querySelector('.table__name');
	const recordScore = popupRecord.querySelector('.table__score');
	const sectionGame = document.getElementById('game');
	const elBucket = sectionGame.querySelector('.bucket');
	const elBrick = sectionGame.querySelector('.brick');
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
	let removedBrick = false;
	let scoreSum, lifeSum, newBrick, oldScore;

	// Save name
	(function saveName() {
		const form = popupStart.querySelector('.user-name');
		const btn = form.querySelector('.btn');

		popupStart.classList.add('active');

		if (localStorage.getItem('score')) recordScore.textContent = localStorage.getItem('score');

		if (localStorage.getItem('userName')) {
			recordName.textContent = localStorage.getItem('userName');
			popupStart.classList.remove('popup--first-start');
			return form.remove();
		}

		btn.addEventListener('click', function(e) {
			e.preventDefault();
			let self = this;
			let inputVal = self.previousElementSibling.value;
			
			if (inputVal !== '') {
				localStorage.setItem('userName', inputVal);
				recordName.textContent = localStorage.getItem('userName');
				popupStart.classList.remove('popup--first-start');
				form.remove();
			}
		}, false);
	}) ();

	// Init popups--------------
	(function initPopups() {
		const popups = document.querySelectorAll('.popup');
		const btnShow = document.querySelectorAll('.show-popup');
		const btnClose = document.querySelectorAll('.close-popup');
		const btnBack = popupRecord.querySelector('.popup__back');

		const popupRemove = () => {
			for (let i = 0; i < popups.length; i++) {
				popups[i].classList.remove('active');
			}
		};

		const showPopup = () => {
			for (let i = 0; i < btnShow.length; i++) {
				btnShow[i].addEventListener('click', function(e) {
					e.preventDefault();
					popupRemove();
					
					if (btnShow[i].classList.contains('record-end')) btnBack.setAttribute('data-popup', 'popup--end');

					let popupClass = `.${this.getAttribute('data-popup')}`;
					document.querySelector(popupClass).classList.add('active');
				}, false);
			}
			closePopup();
		};

		const closePopup = () => {
			for (let i = 0; i < btnClose.length; i++) {
				btnClose[i].addEventListener('click', function(e) {
					e.preventDefault();
					popupRemove();
				}, false);
			}
		};

		showPopup();
	}) ();

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

	// Randomizer --------------
	const mtRand = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

	// Animate --------------
	const animate = ({timing, draw, duration}) => {
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
	};

	// Animate fall init -----------
	const initAnimateFall = bricks => {
		animate({
			timing: timeFraction => timeFraction,
			draw: progress => {					
				bricks.style.top = `${progress * workHeight}px`;
			},
			duration: mtRand(2500, 9000)
		});
	};

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
	
	// Start Game ----------------
	document.addEventListener('click', function(e) {
		let btnStart = e.target.closest('.start-game');
		let speedAppearing = 3000;
		
		if (!btnStart) return;

		sectionGame.classList.add('active');
		life.parentNode.classList.add('active');
		lifeSum = 3;
		life.textContent = lifeSum;
		scoreSum = 0;
		score.textContent = scoreSum;

		// Set score ---------------
		const setScore = (score) => {		
			if (!localStorage.getItem('score')) {
				localStorage.setItem('score', score);
				recordScore.textContent = localStorage.getItem('score');
			}

			oldScore = localStorage.getItem('score');
			
			if (oldScore < score) {
				localStorage.setItem('score', score);
				recordScore.textContent = localStorage.getItem('score');
			}
		};

		// Game Over --------------
		const gameOver = () => {
			clearTimeout(initBrickFall);
			popupEnd.classList.add('active');
			sectionGame.classList.remove('active');
			life.parentNode.classList.remove('active');
			finalScore.textContent = scoreSum;
			setScore(scoreSum);
		};
		
		// Fall -------------
		const brickFall = brick => {
			initAnimateFall(brick);

			let initChecking = setTimeout(function fnCheck() {
				if (checkCatch(brick)) {
					brick.remove();
					scoreSum++;
					score.textContent = scoreSum;

					if (scoreSum % 10 === 0) {
						lifeSum++;
						life.textContent = lifeSum;
						speedAppearing -= 100;
					}

					return;
				}

				if (checkFail(brick)) {
					brick.remove();
					lifeSum--;
					life.textContent = lifeSum;

					if (lifeSum <= 0) {
						lifeSum = 0;
						life.textContent = lifeSum;
						gameOver();
						return clearTimeout(initChecking);
					}

					return;
				}				

				if (popupEnd.classList.contains('active')) return brick.remove();

				initChecking = setTimeout(fnCheck, 0);
			}, 0);
		};

		// Brick clone --------------
		const cloneBrick = () => {
			newBrick = elBrick.cloneNode();
			newBrick.style.left = `${mtRand(0, workWidth)}px`;
			sectionGame.appendChild(newBrick);
			brickFall(newBrick);
			
			if (!removedBrick) elBrick.remove();
		};

		// Clone init --------------
		let initBrickFall = setTimeout(function fnFall() { 
			cloneBrick();
			initBrickFall = setTimeout(fnFall, speedAppearing);
		}, speedAppearing);

	}, false);	
});

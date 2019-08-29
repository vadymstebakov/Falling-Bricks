'use strict';

document.addEventListener('DOMContentLoaded', function () {
  var popupStart = document.getElementById('popup-start');
  var popupEnd = document.getElementById('popup-end');
  var popupRecord = document.getElementById('popup-record');
  var recordName = popupRecord.querySelector('.table__name');
  var recordScore = popupRecord.querySelector('.table__score');
  var sectionGame = document.getElementById('game');
  var elBucket = sectionGame.querySelector('.bucket');
  var elBrick = sectionGame.querySelector('.brick');
  var widthBuket = elBucket.offsetWidth;
  var minFromHeightBuket = 75;
  var widthBrick = elBrick.offsetWidth;
  var heightBrick = elBrick.offsetHeight;
  var score = sectionGame.querySelector('.record');
  var life = document.querySelector('.attempts');
  var finalScore = popupEnd.querySelector('.score-final');
  var screenWidth = document.documentElement.offsetWidth;
  var screenHeight = document.documentElement.offsetHeight;
  var workWidth = screenWidth - widthBrick;
  var workHeight = screenHeight + heightBrick;
  var removedBrick = false;
  var scoreSum, lifeSum, newBrick, oldScore;

  // Save name
  (function saveName() {
    var form = popupStart.querySelector('.user-name');
    var btn = form.querySelector('.btn');

    popupStart.classList.add('active');

    if (localStorage.getItem('score')) recordScore.textContent = localStorage.getItem('score');

    if (localStorage.getItem('userName')) {
      recordName.textContent = localStorage.getItem('userName');
      popupStart.classList.remove('popup--first-start');
      return form.remove();
    }

    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var self = this;
      var inputVal = self.previousElementSibling.value;

      if (inputVal !== '') {
        localStorage.setItem('userName', inputVal);
        recordName.textContent = localStorage.getItem('userName');
        popupStart.classList.remove('popup--first-start');
        form.remove();
      }
    }, false);
  })();

  // Init popups--------------
  (function initPopups() {
    var popups = document.querySelectorAll('.popup');
    var btnShow = document.querySelectorAll('.show-popup');
    var btnClose = document.querySelectorAll('.close-popup');
    var btnBack = popupRecord.querySelector('.popup__back');

    var popupRemove = function popupRemove() {
      for (var i = 0; i < popups.length; i++) {
        popups[i].classList.remove('active');
      }
    };

    var showPopup = function showPopup() {var _loop = function _loop(
      i) {
        btnShow[i].addEventListener('click', function (e) {
          e.preventDefault();
          popupRemove();

          if (btnShow[i].classList.contains('record-end')) btnBack.setAttribute('data-popup', 'popup--end');

          var popupClass = ".".concat(this.getAttribute('data-popup'));
          document.querySelector(popupClass).classList.add('active');
        }, false);};for (var i = 0; i < btnShow.length; i++) {_loop(i);
      }
      closePopup();
    };

    var closePopup = function closePopup() {
      for (var i = 0; i < btnClose.length; i++) {
        btnClose[i].addEventListener('click', function (e) {
          e.preventDefault();
          popupRemove();
        }, false);
      }
    };

    showPopup();
  })();

  // Move Bucket --------------
  (function moveBucket() {
    elBucket.addEventListener('mousedown', function (e) {
      var backetCoords = getCoords(elBucket);
      var shiftX = e.pageX - backetCoords.left;
      var bgCoords = getCoords(sectionGame);

      document.onmousemove = function (e) {
        var newLeft = e.pageX - shiftX - bgCoords.left;
        var rightEdge = sectionGame.offsetWidth - widthBuket;

        if (newLeft < 0) newLeft = 0;
        if (newLeft > rightEdge) newLeft = rightEdge;
        elBucket.style.left = newLeft + 'px';
      };

      document.onmouseup = function () {
        document.onmousemove = document.onmouseup = null;
      };
      return false;
    });

    elBucket.ondragstart = function () {
      return false;
    };

    function getCoords(elem) {
      var box = elem.getBoundingClientRect();

      return {
        top: box.top + pageYOffset,
        left: box.left + pageXOffset };

    }
  })();

  // Randomizer --------------
  var mtRand = function mtRand(min, max) {return Math.floor(Math.random() * (max - min + 1) + min);};

  // Animate --------------
  var animate = function animate(_ref) {var timing = _ref.timing,draw = _ref.draw,duration = _ref.duration;
    var start = performance.now();

    requestAnimationFrame(function animate(time) {
      var timeFraction = (time - start) / duration;
      if (timeFraction > 1) timeFraction = 1;

      var progress = timing(timeFraction);

      draw(progress);

      if (timeFraction < 1) {
        requestAnimationFrame(animate);
      }
    });
  };

  // Animate fall init -----------
  var initAnimateFall = function initAnimateFall(bricks) {
    animate({
      timing: function timing(timeFraction) {return timeFraction;},
      draw: function draw(progress) {
        bricks.style.top = "".concat(progress * workHeight, "px");
      },
      duration: mtRand(2500, 9000) });

  };

  // Catch ----------------
  var checkCatch = function checkCatch(brick) {
    var elBrickL = Math.floor(brick.getBoundingClientRect().left);
    var elBrickR = Math.floor(brick.getBoundingClientRect().right);
    var elBrickT = Math.floor(brick.getBoundingClientRect().top);
    var elBucketL = Math.floor(elBucket.getBoundingClientRect().left);
    var elBucketR = Math.floor(elBucket.getBoundingClientRect().right);
    var elBucketT = Math.floor(elBucket.getBoundingClientRect().top);
    var elBucketB = Math.floor(elBucket.getBoundingClientRect().bottom);

    return Boolean(
    elBrickT > elBucketT &&
    elBucketB - minFromHeightBuket > elBrickT &&
    elBrickL > elBucketL &&
    elBrickR < elBucketR);

  };

  // Fail --------------
  var checkFail = function checkFail(brick) {return Boolean(parseInt(brick.style.top) >= screenHeight);};

  // Start Game ----------------
  document.addEventListener('click', function (e) {
    var btnStart = e.target.closest('.start-game');
    var speedAppearing = 3000;

    if (!btnStart) return;

    sectionGame.classList.add('active');
    life.parentNode.classList.add('active');
    lifeSum = 3;
    life.textContent = lifeSum;
    scoreSum = 0;
    score.textContent = scoreSum;

    // Set score ---------------
    var setScore = function setScore(score) {
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
    var gameOver = function gameOver() {
      clearTimeout(initBrickFall);
      popupEnd.classList.add('active');
      sectionGame.classList.remove('active');
      life.parentNode.classList.remove('active');
      finalScore.textContent = scoreSum;
      setScore(scoreSum);
    };

    // Fall -------------
    var brickFall = function brickFall(brick) {
      initAnimateFall(brick);

      var initChecking = setTimeout(function fnCheck() {
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
    var cloneBrick = function cloneBrick() {
      newBrick = elBrick.cloneNode();
      newBrick.style.left = "".concat(mtRand(0, workWidth), "px");
      sectionGame.appendChild(newBrick);
      brickFall(newBrick);

      if (!removedBrick) elBrick.remove();
    };

    // Clone init --------------
    var initBrickFall = setTimeout(function fnFall() {
      cloneBrick();
      initBrickFall = setTimeout(fnFall, speedAppearing);
    }, speedAppearing);

  }, false);
});
//# sourceMappingURL=maps/script.js.map

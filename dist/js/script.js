'use strict';

document.addEventListener('DOMContentLoaded', function () {
  var popupStart = document.getElementById('popup-start');
  var btnStart = popupStart.querySelector('.start-game');
  var sectionGame = document.getElementById('game');
  var elBucket = sectionGame.querySelector('.bucket');
  var elBrick = sectionGame.querySelectorAll('.brick')[0];
  var brickSet = [];
  var widthBuket = elBucket.offsetWidth;
  var minFromHeightBuket = 75;
  var widthBrick = elBrick.offsetWidth;
  var heightBrick = elBrick.offsetHeight;
  var i = 0;
  var rec = sectionGame.querySelector('.record');
  var recSum = 0;
  var life = document.querySelector('.attempts');
  var lifeSum = 3;
  var wrapGameOver = document.querySelector('.popup--end');
  var screenWidth = document.documentElement.offsetWidth;
  var screenHeight = document.documentElement.offsetHeight;
  var workWidth = screenWidth - widthBrick;
  var workHeight = screenHeight + heightBrick;
  var startPos = '-100px';
  var removed = false;

  // Save name
  (function saveName() {
    var form = popupStart.querySelector('.user-name');
    var btn = form.querySelector('.btn');

    popupStart.classList.add('active');

    if (localStorage.getItem('userName')) {
      popupStart.classList.remove('popup--first-start');
      return form.remove();
    }

    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var self = this;
      var inputVal = self.previousElementSibling.value;

      if (inputVal !== '') {
        localStorage.setItem('userName', inputVal);
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

    var popupRemove = function popupRemove() {
      for (var _i = 0; _i < popups.length; _i++) {
        popups[_i].classList.remove('active');
      }
    };

    var showPopup = function showPopup() {
      for (var _i2 = 0; _i2 < btnShow.length; _i2++) {
        btnShow[_i2].addEventListener('click', function (e) {
          e.preventDefault();
          popupRemove();
          var popupClass = ".".concat(this.getAttribute('data-popup'));
          document.querySelector(popupClass).classList.add('active');
        }, false);
      }
      closePopup();
    };

    var closePopup = function closePopup() {
      for (var _i3 = 0; _i3 < btnClose.length; _i3++) {
        btnClose[_i3].addEventListener('click', function (e) {
          e.preventDefault();
          popupRemove();
        }, false);
      }
    };

    showPopup();
  })();

  // Randomizer --------------
  function mtRand(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  // Animate --------------
  function animate(_ref) {var timing = _ref.timing,draw = _ref.draw,duration = _ref.duration;
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
  }

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

  // Start Game ----------------
  btnStart.addEventListener('click', function () {
    sectionGame.classList.add('active');
    life.parentNode.classList.add('active');
    rec.parentNode.classList.add('active');

    // Animate fall init -----------
    function initAnimateFall(bricks) {
      animate({
        timing: function timing(timeFraction) {return timeFraction;},
        draw: function draw(progress) {
          bricks.style.top = "".concat(progress * workHeight, "px");
        },
        duration: mtRand(2500, 9000) });

    }

    // Fall init --------------
    var brickInterval = setInterval(function () {
      fall();
    }, 3000);

    // Fall -------------
    function brickFall(brick) {
      initAnimateFall(brick);

      var falling = setInterval(function () {
        if (checkCatch(brick)) {
          // console.log('catch');
          clearInterval(falling);
          brick.parentNode.removeChild(brick);
          recSum++;
          rec.textContent = recSum;

          if (recSum % 10 == 0) {
            lifeSum++;
            life.textContent = lifeSum;
          }
        }

        if (checkFail(brick)) {
          // console.log('fail');
          clearInterval(falling);
          brick.remove();
          lifeSum--;
          life.textContent = lifeSum;

          if (lifeSum <= 0) {
            lifeSum = 0;
            life.textContent = lifeSum;
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
      var elBrickL = Math.floor(brick.getBoundingClientRect().left);
      var elBrickR = Math.floor(brick.getBoundingClientRect().right);
      var elBrickT = Math.floor(brick.getBoundingClientRect().top);
      var elBucketL = Math.floor(elBucket.getBoundingClientRect().left);
      var elBucketR = Math.floor(elBucket.getBoundingClientRect().right);
      var elBucketT = Math.floor(elBucket.getBoundingClientRect().top);
      var elBucketB = Math.floor(elBucket.getBoundingClientRect().bottom);

      return (
        elBrickT > elBucketT &&
        elBucketB - minFromHeightBuket > elBrickT &&
        elBrickL > elBucketL &&
        elBrickR < elBucketR);

    }

    // Fail --------------
    function checkFail(brick) {
      return parseInt(brick.style.top) >= screenHeight;
    }

    // Brick clone --------------
    function fall() {
      brickSet[i] = elBrick.cloneNode();
      brickSet[i].style.left = "".concat(mtRand(0, workWidth), "px");
      sectionGame.appendChild(brickSet[i]);
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
      sectionGame.classList.remove('active');
    }

  }, false);
});
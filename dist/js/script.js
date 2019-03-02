'use strict';

document.addEventListener('DOMContentLoaded', function () {
  var elBg = document.getElementById('bg');
  var elBucket = document.getElementById('bucket');
  var elBrick = elBg.querySelectorAll('.brick')[0];
  var brickSet = [];
  var widthBuket = elBucket.offsetWidth;
  var minFromHeightBuket = 75;
  var widthBrick = elBrick.offsetWidth;
  var heightBrick = elBrick.offsetHeight;
  var i = 0;
  var rec = document.getElementById('record');
  var recSum = 0;
  var btnPause = elBg.querySelector('.btn');
  var life = elBg.querySelector('.attempts');
  var lifeSum = 3;
  var wrapPause = elBg.querySelector('.popup_pause');
  var wrapGameOver = elBg.querySelector('.popup_end');
  var screenWidth = document.documentElement.offsetWidth;
  var screenHeight = document.documentElement.offsetHeight;
  var workWidth = screenWidth - widthBrick;
  var workHeight = screenHeight + heightBrick;
  var startPos = '-100px';
  var removed = false;

  function initPopups() {
    var popups = elBg.querySelectorAll('.popup');
    var btnShow = elBg.querySelectorAll('.show-popup');
    var btnClose = elBg.querySelectorAll('.close-popup');

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
          elBg.querySelector(popupClass).classList.add('active');
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
  }
  initPopups();

  elBucket.addEventListener('animationend', function () {
    // Start Game ----------------
    life.parentNode.classList.add('active');
    btnPause.classList.add('active');
    rec.parentNode.classList.add('active');

    // Move Bucket --------------
    function moveBucket() {
      elBucket.addEventListener('mousedown', function (e) {
        var backetCoords = getCoords(elBucket);
        var shiftX = e.pageX - backetCoords.left;
        var bgCoords = getCoords(elBg);

        document.onmousemove = function (e) {
          var newLeft = e.pageX - shiftX - bgCoords.left;
          var rightEdge = elBg.offsetWidth - widthBuket;

          if (newLeft < 0) {
            newLeft = 0;
          }
          if (newLeft > rightEdge) {
            newLeft = rightEdge;
          }
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
    }
    moveBucket();

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

    // Animate fall init -----------
    function animateFallInt(bricks) {
      animate({
        duration: mtRand(2500, 9000),
        timing: function linear(timeFraction) {
          return timeFraction;
        },
        draw: function draw(progress) {
          bricks.style.top = progress * workHeight + 'px';
        } });

    }

    // Fall init --------------
    var brickInterval = setInterval(function () {
      fall();
    }, 3000);

    // Fall -------------
    function brickFall(brick) {
      animateFallInt(brick);

      var falling = setInterval(function () {
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
      for (var _i4 = 0; _i4 < brickSet.length; _i4++) {
        var brick = brickSet[_i4];
        brick.classList.add('stop');
      }

      wrapPause.classList.add('active');
    }

    function removePause() {
      for (var _i5 = 0; _i5 < brickSet.length; _i5++) {
        var brick = brickSet[_i5];
        var style = getComputedStyle(brick);
        if (style.top == startPos) brick.remove();
      }
    }

    // Pause blur --------------------
    window.onblur = function () {
      console.log('pause');
      addPause();
    };

    // Continue focus -----------------
    window.onfocus = function () {
      console.log('play');
      removePause();
    };

  });

});
'use strict';

document.addEventListener('DOMContentLoaded', function () {
  var elBg = document.getElementById('bg');
  var elBucket = document.getElementById('bucket');
  var elBrick = elBg.querySelectorAll('.brick')[0];
  var brickSet = [];
  var i = 0;
  var rec = document.getElementById('record');
  var recSum = 0;
  var life = elBg.querySelector('.attempts');
  var lifeSum = 3;
  var screenWidth = document.documentElement.offsetWidth;
  var screenHeight = document.documentElement.offsetHeight;
  var workWidth = screenWidth - elBrick.offsetWidth;
  var workHeight = screenHeight + elBrick.offsetHeight;
  var startPos = '-100px';
  var removed = false;

  elBucket.addEventListener('animationend', function () {
    // Open score ---------------
    rec.parentNode.classList.add('active');

    // Move Bucket --------------
    function moveBucket() {
      elBucket.addEventListener('mousedown', function (e) {
        var backetCoords = getCoords(elBucket);
        var shiftX = e.pageX - backetCoords.left;
        var bgCoords = getCoords(elBg);

        document.onmousemove = function (e) {
          var newLeft = e.pageX - shiftX - bgCoords.left;
          var rightEdge = elBg.offsetWidth - elBucket.offsetWidth;

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

    // Animate init -----------
    function animateInt(briks) {
      animate({
        duration: mtRand(2500, 9000),
        timing: function linear(timeFraction) {
          return timeFraction;
        },
        draw: function draw(progress) {
          briks.style.top = progress * workHeight + 'px';
        } });

    }

    // Fall init --------------
    var brickInterval = setInterval(function () {
      fall();
    }, 3000);

    // Fall -------------
    function brickFall(brick) {

      animateInt(brick);

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
      var elBrickX = brick.getBoundingClientRect().left;
      var elBrickY = brick.getBoundingClientRect().top;
      var elBucketX = elBucket.getBoundingClientRect().left;
      var elBucketY = elBucket.getBoundingClientRect().top;

      return elBrickY > elBucketY && elBrickX > elBucketX && elBrickX < elBucketX + parseInt(elBucket.width);
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

    // Pause --------------------
    window.onblur = function () {
      console.log('pause');
    };

    // Continue -----------------
    window.onfocus = function () {
      for (var _i = 0; _i < brickSet.length; _i++) {
        var brick = brickSet[_i];
        var style = getComputedStyle(brick);

        if (style.top == startPos) brick.parentNode.removeChild(brick);
      }
    };

  });

});
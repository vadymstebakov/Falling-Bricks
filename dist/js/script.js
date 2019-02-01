'use strict';

document.addEventListener('DOMContentLoaded', function () {
  var elBg = document.getElementById('bg');
  var elBucket = document.getElementById('bucket');
  var elBrick = document.querySelector('.brick');
  var rec = document.getElementById('record');
  var recNumber = 0;
  var brickSet = [];
  var startPos = -100;
  var screenWidth = document.documentElement.offsetWidth;
  var screenHeight = document.documentElement.offsetHeight;
  var workWidth = screenWidth - elBrick.offsetWidth;
  var workHeight = screenHeight + elBrick.offsetHeight;

  // Move Bucket
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

  // Randomizer
  function mtRand(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  // Animate
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

  function makeLinear(timing) {
    return function (timeFraction) {
      return 1 - timing(1 - timeFraction);
    };
  }

  function linear(timeFraction) {
    return timeFraction;
  }

  var anLinear = makeLinear(linear);

  elBrick.style.left = mtRand(0, workWidth) + 'px';

  //Fall Bricks
  elBucket.addEventListener('animationend', function () {
    function fall() {
      var elBricks = document.querySelectorAll('.brick');
      var lengthBricks = elBricks.length;var _loop = function _loop(

      i) {
        var thisBrick = elBricks[i];
        animate({
          duration: mtRand(2500, 9000),
          timing: anLinear,
          draw: function draw(progress) {
            thisBrick.style.top = progress * workHeight + 'px';

            if (parseInt(thisBrick.style.top) >= workHeight) {

              if (lengthBricks <= 3) {
                // cloneBrick();
              }

              brickTop.call(thisBrick);
              fall();
            }
          } });};for (var i = 0; i < elBricks.length; i++) {_loop(i);

      }
    }
    fall();

    function brickTop() {
      this.style.top = startPos + 'px';
      this.style.left = mtRand(0, workWidth) + 'px';
    }

    function cloneBrick() {
      var newBrick = document.createElement('div');
      newBrick.className = 'brick';
      elBg.appendChild(newBrick);
    }

  });


});
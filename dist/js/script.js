'use strict';

document.addEventListener('DOMContentLoaded', function () {
  var elBg = document.getElementById('bg');
  var elBucket = document.getElementById('bucket');
  var elBricks = document.querySelectorAll('.brick');
  var rec = document.getElementById('record');
  var recNumber = 0;
  var brickSet = [];
  var startPos = -100;
  var screenWidth = document.documentElement.offsetWidth - elBricks[0].offsetWidth;
  var screenHeight = document.documentElement.offsetHeight + elBricks[0].offsetHeight;

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

  //Fall Bricks
  window.onload = function () {var _loop = function _loop(
    i) {
      var fall = function fall() {
        elBricks[i].style.left = mtRand(0, screenWidth) + 'px';
        animate({
          duration: mtRand(2500, 9000),
          timing: anLinear,
          draw: function draw(progress) {
            elBricks[i].style.top = progress * screenHeight + 'px';

            if (parseInt(elBricks[i].style.top) >= screenHeight) {
              elBricks[i].style.top = startPos + 'px';
              fall();
            }
          } });

      };
      fall();};for (var i = 0; i < elBricks.length; i++) {_loop(i);
    }

  };

  // Randomizer
  function mtRand(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

});
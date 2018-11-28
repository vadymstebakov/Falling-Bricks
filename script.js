document.addEventListener('DOMContentLoaded', function() {
    var elBg = document.getElementById('bg');
    var elBucket = document.getElementById('bucket');
    var elBrick = document.getElementsByClassName('brick');
    var rec = document.getElementById('record');
    var recNumber = 0;
    var brickSet = [];

    // Position Bucket
    elBucket.addEventListener('mousedown', function(e) {
		var backetCoords = getCoords(elBucket);
		var shiftX = e.pageX - backetCoords.left;
		var bgCoords =  getCoords(elBg);
		
		document.onmousemove = function(e) {
			var newLeft = e.pageX - shiftX - bgCoords.left;
			var rightEdge = elBg.offsetWidth - elBucket.offsetWidth;
	
			if (newLeft < 0) {
			  	newLeft = 0;
			}
			if (newLeft > rightEdge) {
			  	newLeft = rightEdge;
			}
	
			elBucket.style.left = newLeft + 'px';
		}

		document.onmouseup = function() {
			document.onmousemove = document.onmouseup = null;
		}

		return false;
	});

	elBucket.ondragstart = function() {
		return false;
	}

	function getCoords(elem) {
		var box = elem.getBoundingClientRect();

		return {
			top: box.top + pageYOffset,
			left: box.left + pageXOffset
		};
	}


    // Brick
    for (let i = 0; i < elBrick.length; i++) {
				
        function forFall(elBrick) {
            if(!brickSet[i]) {
                brickSet[i] = 1;
            } else {
                brickSet[i]++;
				elBrick.style.top = brickSet[i] + 'px';
            }
		}
		
		setInterval(function(elBrick) {
			forFall(elBrick);
		}, Math.round(Math.random() * 10), elBrick[i]);
		
		function fall() {
			if (checkCatching()) {
				brickSet[i] = 1;
				recNumber++;
				rec.innerHTML = recNumber;
				// var brickCount = localStorage.getItem('0');
				// brickCount++;
				// localStorage.setItem(0, brickCount);
			}
			if (checkFail()) {
				brickSet[i] = 1;
			}
		}

		var fallTime = setInterval(function() {
			fall();
		}, 10);

        function checkCatching() {
			var elBrickX = elBrick[i].getBoundingClientRect().left;
            var elBrickY = elBrick[i].getBoundingClientRect().top;
            var elBucketX = elBucket.getBoundingClientRect().left;
            var elBucketY = elBucket.getBoundingClientRect().top;

            return (elBrickY > elBucketY &&
                    elBrickX > elBucketX && 
                    elBrickX < elBucketX + parseInt(elBucket.width));
		}

        function checkFail() {
            return (parseInt(elBrick[i].style.top) > outerHeight);
        }

    }

    
});

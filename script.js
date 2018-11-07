document.addEventListener('DOMContentLoaded', function(event) {

    var elBg = document.getElementById('bg');
    var elBucket = document.getElementById('bucket');
    var elBrick = document.getElementsByClassName('brick');
    var rec = document.getElementById('record');
    var recNumber = 0;
    var brickSet = [];

    // Ведро
    elBg.addEventListener('mousemove', function(event) {
        event = event || window.event;
        var bgCoords = this.getBoundingClientRect(); // координаты elBg относительно окна
        var bgInnerCoords = {
            left: bgCoords.left + elBg.clientLeft // координаты левого-нижнего внутреннего угла elBg
        };
        var backetCoords = {                                                      // сдвиг относительно поля (т.к. position:relative)
            left: event.clientX - bgInnerCoords.left - elBucket.clientWidth / 2  // и сдвиг на половину ширины
        };                                                                      // (!) используются координаты относительно окна clientX/Y, как и в bgCoords

        if (backetCoords.left < 0) backetCoords.left = 0;  // вылезает за левую границу - разместить по ней
        if (backetCoords.left + elBucket.clientWidth > elBg.clientWidth) {
            backetCoords.left = elBg.clientWidth - elBucket.clientWidth;  // вылезает за правую границу - разместить по ней
        }

        elBucket.style.left = backetCoords.left + 'px';
	});
	
	console.log(outerHeight);


    // Кирпичи
    for (let i = 0; i < elBrick.length; i++) {
        // console.log(elBrick[i]);

        setInterval(function(elBrick){
            if(!brickSet[i]) {
                brickSet[i] = 1;
            } else {
                brickSet[i]++;
                elBrick.style.top = brickSet[i] + 'px';
            }
        }, Math.random() * 10, elBrick[i]);

        function checkCatching(elBrick) {
            var elBrickX = elBrick[i].getBoundingClientRect().left;
            var elBrickY = elBrick[i].getBoundingClientRect().top;
            var elBucketX = elBucket.getBoundingClientRect().left;
            var elBucketY = elBucket.getBoundingClientRect().top;

            return (elBrickY > elBucketY &&
                    elBrickX > elBucketX && 
                    elBrickX < elBucketX + parseInt(elBucket.width));
		};

        function checkFail(elBrick) {
			console.log(parseInt(elBrick[i].style.top));
            return (parseInt(elBrick[i].style.top) > outerHeight);
        };

        function fall(){
            var falling = setInterval(function(){

                if (checkCatching(elBrick)) {
                    brickSet[i] = 1;
                    recNumber++;
                    rec.innerHTML = recNumber;
                    var brickCount = localStorage.getItem('0');
                    brickCount++;
                    localStorage.setItem(0, brickCount);
                }

                if (checkFail(elBrick)) {
                    brickSet[i] = 1;
                    console.log('ss');
                }

            }, Math.random() * 10, elBrick[i])
        };

        fall();
       
    };

    
});

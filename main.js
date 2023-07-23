function getDirection(distanceValue) {
    const MIN_DISTANCE = 5;

    let directionMoved = null;

    if(distanceValue < -1 * MIN_DISTANCE) {
        directionMoved = "right";
    }

    if(distanceValue > MIN_DISTANCE ) {
        directionMoved = "left";
    }

    return directionMoved;
}

function translateButtons(element, direction, x, max) {
    if(direction === "right") {
        const container = element.querySelector(".sliding-buttons-to-right");
        const buttons = container.querySelectorAll(".sliding-button");
        const firstButton = buttons[0];
        const secondButton = buttons[1];

        const firstButtonPercentage =  (x * 100) / max;
        const firstButtonX = 100 - (-1 * firstButtonPercentage);

        const secondButtonPercentage =  (x * 100) / (max / 2);
        const secondButtonX = 100 - (-1 * secondButtonPercentage);

        console.log(firstButtonX, secondButtonX)
        
        firstButton.style.transform = `translateX(${firstButtonX < 0 ? 0 : firstButtonX}%)`;
        secondButton.style.transform = `translateX(${secondButtonX < 0 ? 0 : secondButtonX}%)`;
    }
}

function init(selector, _config) {
    const config = {

    };

    if(_config) {
        Object.assign(config, _config);
    }

    const parent = document.querySelector(selector);

    var object = parent.querySelector(".sliding-body"),
    initX, firstX, lastX;


    const bodyElement = parent.querySelector(".sliding-body");
    const bodyWidth = bodyElement.getBoundingClientRect().width;

    const leftButtonsElement = parent.querySelector(".sliding-buttons-to-left");
    const rightButtonsElement = parent.querySelector(".sliding-buttons-to-right");

    const leftDistanceLimit = leftButtonsElement ? leftButtonsElement.getBoundingClientRect().width : 0;
    const rightDistanceLimit = rightButtonsElement ? rightButtonsElement.getBoundingClientRect().width : 0;

    object.addEventListener('mousedown', function(e) {
        e.preventDefault();
        initX = this.offsetLeft;
        firstX = e.pageX;

        this.addEventListener('mousemove', dragIt, false);

        window.addEventListener('mouseup', function() {
            object.removeEventListener('mousemove', dragIt, false);
        }, false);

    }, false);

    object.addEventListener('touchstart', function(e) {
        e.preventDefault();
        initX = this.offsetLeft;

        var touch = e.touches;
        firstX = touch[0].pageX;

        this.addEventListener('touchmove', swipeIt, false);

        window.addEventListener('touchend', function(e) {
            e.preventDefault();
            const TRANSITION_DURATION = 250;
            let directionMoved = getDirection(lastX);

            if(!(directionMoved == null)) {
                object.style.transition =  (TRANSITION_DURATION / 1000) + "s";

                if(directionMoved === "left") {
                    if(lastX > leftDistanceLimit * 0.75) {
                        object.style.left = leftDistanceLimit + "px";
                    } else {
                        object.style.left = 0;
                    }
                } 

                if(directionMoved === "right") {
                    if(Math.abs(lastX) > rightDistanceLimit * 0.75) {
                        object.style.left = -1 * rightDistanceLimit + "px";

                        const container = element.querySelector(".sliding-buttons-to-right");
                        const buttons = container.querySelectorAll(".sliding-button");

                        for(let i = 0; i < buttons.length; i++) {
                            const btn = buttons[i];
                            btn.style.transition = TRANSITION_DURATION / 1000 + "s";
                            btn.style.transform = `translateX(${0}%)`;
        
                            const timeoutDurationBtn = TRANSITION_DURATION + 10;
                            const timeoutBtn = setTimeout(() => {
                                btn.style.transition = "unset";
                                clearTimeout(timeoutBtn);
                            }, timeoutDurationBtn);
                        }
                    } else {
                        object.style.left = 0;
                    }
                } 
        
                const timeoutDuration = TRANSITION_DURATION + 10;
                const timeout = setTimeout(() => {
                    object.style.transition = "unset";
                    clearTimeout(timeout);
                }, timeoutDuration);

                directionMoved = null;
                lastX = 0;
            } else {
                
            }

            object.removeEventListener('touchmove', swipeIt, false);
        }, false);

    }, false);

    function dragIt(e) {
        const distance = initX+e.pageX - firstX;

        this.style.left = distance + 'px';
    }

    function swipeIt(e) {
        e.preventDefault();
        var contact = e.touches;
        const distance = initX + contact[0].pageX - firstX;
        lastX = distance;

        const directionMoved = getDirection(lastX);

        let distanceValue = distance;

        if(!(directionMoved == null)) { 
            if(directionMoved === "left") {
                if(Math.abs(lastX) > bodyWidth - rightDistanceLimit) {
                    distanceValue = bodyWidth - rightDistanceLimit;
                } else {
                    distanceValue = distance;
                }
            }

            if(directionMoved === "right") {
                if(Math.abs(lastX) > bodyWidth - leftDistanceLimit) {
                    distanceValue = leftDistanceLimit - bodyWidth;
                } else {
                    distanceValue = distance;
                }

                translateButtons(parent, directionMoved, lastX, leftDistanceLimit * 2);
            }
        }

        this.style.left = distanceValue + 'px';
    }
}

init("#element");
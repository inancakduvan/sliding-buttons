function getDirection(distanceValue) {
    const MIN_DISTANCE = 0.5;

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
        const container = element.querySelector(".sliding-buttons-on-right");
        const buttons = container.querySelectorAll(".sliding-button");
        const firstButton = buttons[0];
        const secondButton = buttons[1];

        const firstButtonPercentage =  (x * 100) / max;
        const firstButtonX = 100 - (-1 * firstButtonPercentage);

        const secondButtonPercentage =  (x * 100) / (secondButton ? secondButton.getBoundingClientRect().width : 1);
        const secondButtonX = 100 - (-1 * secondButtonPercentage);
        
        firstButton && (firstButton.style.transform = `translateX(${firstButtonX < 0 ? 0 : firstButtonX}%)`);
        secondButton && (secondButton.style.transform = `translateX(${secondButtonX < 0 ? 0 : secondButtonX}%)`);
    }

    if(direction === "left") {
        const container = element.querySelector(".sliding-buttons-on-left");
        const buttons = container.querySelectorAll(".sliding-button");
        const firstButton = buttons[0];
        const secondButton = buttons[1];

        const firstButtonPercentage =  (x * 100) / (firstButton ? firstButton.getBoundingClientRect().width : 1);
        const firstButtonX = (firstButtonPercentage) - 100;

        const secondButtonPercentage =  (x * 100) / (max);
        const secondButtonX = (secondButtonPercentage) - 100;
        
        firstButton && (firstButton.style.transform = `translateX(${firstButtonX > 0 ? 0 : firstButtonX}%)`);
        secondButton && (secondButton.style.transform = `translateX(${secondButtonX > 0 ? 0 : secondButtonX}%)`);
    }
}

function removeExtraButtons(parent) {
    const MAX_BUTTON_LENGTH = 2;

    const leftButtons = parent.querySelectorAll(".sliding-buttons-on-left .sliding-button");
    const rightButtons = parent.querySelectorAll(".sliding-buttons-on-right .sliding-button");

    for(let i = 0; i < leftButtons.length;i++) {
        if(i >= MAX_BUTTON_LENGTH) {
            leftButtons[i].remove();
        }
    }

    for(let i = 0; i < rightButtons.length;i++) {
        if(i >= MAX_BUTTON_LENGTH) {
            rightButtons[i].remove();
        }
    }
} 

function initSlidingButton(selector, _config) {
    const config = {
        isTouchable: false,
        animation: false,
        style: {
            height: 80
        }
    };

    if(_config) {
        Object.assign(config, _config);
    }

    const parent = document.querySelector(selector);
    removeExtraButtons(parent);

    // Reset translate values 
    if(!config.animation) {
        resetActionButtonsTranslate();
    }
    //

    if(config.style && config.style.height) {
        parent.style.height = config.style.height + "px";
    }

    let object = parent.querySelector(".sliding-body"),
    initX, firstX, lastX;

    const bodyElement = parent.querySelector(".sliding-body");
    const bodyWidth = bodyElement.getBoundingClientRect().width;

    const leftButtonsElement = parent.querySelector(".sliding-buttons-on-left");
    const rightButtonsElement = parent.querySelector(".sliding-buttons-on-right");

    let leftDistanceLimit = leftButtonsElement ? leftButtonsElement.getBoundingClientRect().width : 0;
    let rightDistanceLimit = rightButtonsElement ? rightButtonsElement.getBoundingClientRect().width : 0;

    setTimeout(() => {
        leftDistanceLimit = leftButtonsElement ? leftButtonsElement.getBoundingClientRect().width : 0;
        rightDistanceLimit = rightButtonsElement ? rightButtonsElement.getBoundingClientRect().width : 0;

        config.isTouchable = true;
    }, 250)

    // object.addEventListener('mousedown', function(e) {
    //     e.preventDefault();
    //     initX = this.offsetLeft;
    //     firstX = e.pageX;

    //     this.addEventListener('mousemove', dragIt, false);

    //     window.addEventListener('mouseup', function() {
    //         object.removeEventListener('mousemove', dragIt, false);
    //     }, false);

    // }, false);

    object.addEventListener('touchstart', function(e) {
        if (e.cancelable) e.preventDefault();
        initX = this.offsetLeft;

        var touch = e.touches;
        firstX = touch[0].pageX;

        this.addEventListener('touchmove', swipeIt, false);

        window.addEventListener('touchend', function(e) {
            if (e.cancelable) e.preventDefault();
            const TRANSITION_DURATION = 250;
            let directionMoved = getDirection(lastX);

            const setShowPositionOfButtons = () => {
                if(config.animation) {
                    let buttons = parent.querySelectorAll(".sliding-buttons-on-right .sliding-button");
                    // Reset translate of action buttons 
                    if(directionMoved === "left") {
                        buttons = parent.querySelectorAll(".sliding-buttons-on-left .sliding-button");
                    } 

                    for(let i = 0; i < buttons.length; i++) {
                        const btn = buttons[i];
                        
                        if(btn) {
                            btn.style.transition = TRANSITION_DURATION / 1000 + "s";
                            btn.style.transform = `translateX(${0}%)`;

                            const timeoutDurationBtn = TRANSITION_DURATION + 10;
                            const timeoutBtn = setTimeout(() => {
                                btn.style.transition = "unset";
                                clearTimeout(timeoutBtn);
                            }, timeoutDurationBtn);
                        }
                    }
                    //
                }
            }

            //
            const resetButtonsTranslate = () => {
                if(config.animation) {
                    const TRANSITION_DURATION = 250;

                    const buttonsRight = parent.querySelectorAll(".sliding-buttons-on-right .sliding-button");
                    const buttonsLeft = parent.querySelectorAll(".sliding-buttons-on-left .sliding-button");

                    const buttons = [
                        {
                            element: buttonsRight[0],
                            translateX: 200
                        },
                        {
                            element: buttonsRight[1],
                            translateX: 100
                        },
                        {
                            element: buttonsLeft[0],
                            translateX: -100
                        },
                        {
                            element: buttonsLeft[1],
                            translateX: -200
                        }
                    ]

                    for(let i=0; i < buttons.length; i++) {
                        const btn = buttons[i];

                        if(btn && btn.element) {
                            btn.element.style.transition = TRANSITION_DURATION / 1000 + "s";
                            btn.element.style.transform = `translateX(${btn.translateX}%)`;

                            const timeoutDurationBtn = TRANSITION_DURATION + 10;
                            const timeoutBtn = setTimeout(() => {
                                btn.element.style.transition = "unset";
                                clearTimeout(timeoutBtn);
                            }, timeoutDurationBtn);
                        }
                    }
                }
            }

            if(!(directionMoved == null)) {
                const TRIGGER_MARGIN = 0.6;
                object.style.transition =  (TRANSITION_DURATION / 1000) + "s";

                if(directionMoved === "left" && lastX > leftDistanceLimit * TRIGGER_MARGIN) {
                    object.style.left = leftDistanceLimit + "px";
                    setShowPositionOfButtons();
                } else if (directionMoved === "right" && Math.abs(lastX) > rightDistanceLimit * TRIGGER_MARGIN) {
                    object.style.left = -1 * rightDistanceLimit + "px";
                    setShowPositionOfButtons();
                } else {
                    object.style.left = 0;
                    resetButtonsTranslate();
                }

              
        
                // Reset transition of body
                const timeoutDuration = TRANSITION_DURATION + 10;
                const timeout = setTimeout(() => {
                    object.style.transition = "unset";
                    clearTimeout(timeout);
                }, timeoutDuration);
                //

                // Reset direction an last position value
                directionMoved = null;
                lastX = 0;
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
        
        if(config.isTouchable) {
            var contact = e.touches;
            const distance = initX + contact[0].pageX - firstX;
            lastX = distance;

            const directionMoved = getDirection(lastX);

            let distanceValue = distance;

            if(!(directionMoved == null)) { 
                if(directionMoved === "left" && Math.abs(lastX) > bodyWidth - rightDistanceLimit) {
                    distanceValue = bodyWidth - rightDistanceLimit;
                } else if(directionMoved === "right" && Math.abs(lastX) > bodyWidth - leftDistanceLimit) {
                    distanceValue = leftDistanceLimit - bodyWidth;
                } else {
                    distanceValue = distance;
                }

                if(directionMoved === "left" && leftDistanceLimit === 0) {
                    distanceValue = 0;
                }

                if(directionMoved === "right" && rightDistanceLimit === 0) {
                    distanceValue = 0;
                }

                // Translate action buttons
                if(config.animation) {
                    const maxTranslateValue = directionMoved === "left" ? leftDistanceLimit : rightDistanceLimit;
                    translateButtons(parent, directionMoved, lastX, maxTranslateValue);
                }
            }

            this.style.left = distanceValue + 'px';
        }
    }

    function resetActionButtonsTranslate() {
        const btns = parent.querySelectorAll(".sliding-button");
        for(let i = 0; i < btns.length; i++) {
            const btn = btns[i];
            btn.style.transform = "translateX(0)";
            btn.style.transition = "none";
        }
    }

    function reset() {
        resetActionButtonsTranslate();
        object.style.left = 0;
    }

    return {
        reset
    }
}

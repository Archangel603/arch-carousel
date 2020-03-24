export const SWIPE_DIRECTION = {
    left: 0,
    right: 1
};

export function onSwipe(el, callback, options = null) {
    el.addEventListener('touchstart', handleTouchStart, { passive: true });
    el.addEventListener('touchend', handleTouchMove, { passive: true });

    let xDown = null;
    let yDown = null;

    function handleTouchStart(e) {
        const firstTouch = e.touches[0];

        xDown = firstTouch.clientX;
        yDown = firstTouch.clientY;
    }

    function handleTouchMove(e) {
        if (!xDown || !yDown) {
            return;
        }

        const xUp = e.changedTouches[0].clientX;
        const yUp = e.changedTouches[0].clientY;
        const xDiff = xDown - xUp;
        const yDiff = yDown - yUp;
        const reqDelta = options && options.sensitivity ? options.sensitivity : 10;

        if (Math.abs(xDiff) > reqDelta || Math.abs(yDiff) > reqDelta) {

            const hyp2 = xDiff * xDiff + yDiff * yDiff;
            const cos = (hyp2 + xDiff * xDiff - yDiff * yDiff) / (2 * xDiff * Math.sqrt(hyp2));
            
            if (Math.abs(xDiff) > Math.abs(yDiff) && Math.abs(cos) > 0.98) {

                if (!options)
                    callback();

                if (xDiff > 0) {
                    if (options.direction === SWIPE_DIRECTION.left)
                        callback();
                    else if (options.onLeftSwipe)
                        options.onLeftSwipe();
                }
                else {
                    if (options.direction === SWIPE_DIRECTION.right)
                        callback();
                    else if (options.onRightSwipe)
                        options.onRightSwipe();
                }
            }

        }

        xDown = null;
        yDown = null;
    }
}
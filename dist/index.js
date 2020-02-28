import { getProperty } from '@joyfulljs/vendor-property';
/**
 * `transformOrigin` property name with browser vendor prefix if needed.
 */
export var transformOriginProperty = getProperty('transformOrigin');
/**
 * `transform` property name with browser vendor prefix if needed.
 */
export var transformProperty = getProperty('transform');
/**
 * make html element scalable by mouse wheel
 * @param el target html element
 * @param options
 */
export default function Scalable(el, options) {
    var _a = options || {}, onScaleChange = _a.onScaleChange, _b = _a.maxScale, maxScale = _b === void 0 ? 50 : _b, _c = _a.minScale, minScale = _c === void 0 ? 1 : _c, _d = _a.followMouse, followMouse = _d === void 0 ? true : _d;
    var computedStyle = window.getComputedStyle(el);
    // @ts-ignore  ts handle string index incorrectly. so ingore.
    var oldOrigin = computedStyle[transformOriginProperty];
    // @ts-ignore
    var oldTrans = computedStyle[transformProperty];
    var mouseX = -1, mouseY = -1;
    // matrix(3.5, 0, 0, 3.5, 0, 0)
    function handleScale(e) {
        var parts = getTransform(el);
        var oldScale = +parts[0];
        if ((e.deltaY < 0 && oldScale >= maxScale)
            || (e.deltaY > 0 && oldScale <= minScale)) {
            return;
        }
        var deltScale = e.deltaY * 0.005;
        var scale = Math.min(Math.max(minScale, oldScale - deltScale), maxScale);
        if (followMouse) {
            // deltScale * el.offsetWidth * (mouseX / el.offsetWidth);
            var deltW = deltScale * mouseX;
            // deltScale * el.offsetHeight * (mouseY / el.offsetHeight);
            var deltH = deltScale * mouseY;
            parts[4] = +parts[4] + deltW;
            parts[5] = +parts[5] + deltH;
        }
        parts[0] = scale;
        parts[3] = scale;
        // @ts-ignore
        el.style[transformProperty] = "matrix(" + parts.join(",") + ")";
        if (onScaleChange) {
            onScaleChange({ scale: scale });
        }
        e.preventDefault();
    }
    function reset() {
        mouseX = -1;
        mouseY = -1;
        // @ts-ignore
        el.style[transformOriginProperty] = oldOrigin;
        // @ts-ignore
        el.style[transformProperty] = oldTrans;
    }
    function mousemove(e) {
        mouseX = e.offsetX;
        mouseY = e.offsetY;
    }
    el.parentNode.addEventListener('wheel', handleScale);
    if (followMouse) {
        // @ts-ignore
        el.style[transformOriginProperty] = '0 0';
        el.addEventListener("mousemove", mousemove);
    }
    return {
        reset: reset,
        destroy: function () {
            el.parentNode.removeEventListener('wheel', handleScale);
            el.removeEventListener('mousemove', mousemove);
        }
    };
}
/**
 * get computed style of transform
 * @param el target html element
 */
export function getTransform(el) {
    // @ts-ignore
    var transform = window.getComputedStyle(el)[transformProperty];
    if (!transform || transform === 'none') {
        transform = 'matrix(1, 0, 0, 1, 0, 0)';
    }
    return transform.replace(/\(|\)|matrix|\s+/g, '').split(',');
}

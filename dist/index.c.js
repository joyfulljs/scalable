'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/**
 * make html element scalable by mouse wheel
 * @param el target html element
 * @param options
 */
function Scalable(el, options) {
    var mouseX = -1, mouseY = -1;
    var oldOrigin = el.style.transformOrigin;
    var oldTrans = window.getComputedStyle(el).transform;
    var _a = options || {}, onScaleChange = _a.onScaleChange, _b = _a.maxScale, maxScale = _b === void 0 ? 5 : _b, _c = _a.minScale, minScale = _c === void 0 ? 1 : _c;
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
        var deltW = deltScale * el.offsetWidth * (mouseX / el.offsetWidth);
        var deltH = deltScale * el.offsetHeight * (mouseY / el.offsetHeight);
        parts[4] = +parts[4] + deltW;
        parts[5] = +parts[5] + deltH;
        parts[0] = scale;
        parts[3] = scale;
        // if (moveToStart && e.deltaY > 0) {
        //   // try move to start position when scale down
        //   parts[4] = +parts[4] * 0.5;
        //   parts[5] = +parts[5] * 0.5;
        // }
        el.style.transformOrigin = '0 0';
        el.style.transform = "matrix(" + parts.join(",") + ")";
        if (onScaleChange) {
            onScaleChange({ scale: scale });
        }
        e.preventDefault();
    }
    function reset() {
        mouseX = -1;
        mouseY = -1;
        el.style.transformOrigin = oldOrigin;
        el.style.transform = oldTrans;
    }
    function mousemove(e) {
        mouseX = e.offsetX;
        mouseY = e.offsetY;
    }
    el.parentNode.addEventListener('wheel', handleScale);
    el.addEventListener("mousemove", mousemove);
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
function getTransform(el) {
    var transform = window.getComputedStyle(el).transform;
    if (!transform || transform === 'none') {
        transform = 'matrix(1, 0, 0, 1, 0, 0)';
    }
    return transform.replace(/\(|\)|matrix|\s+/g, '').split(',');
}

exports.default = Scalable;
exports.getTransform = getTransform;

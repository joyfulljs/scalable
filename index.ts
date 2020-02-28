import { getProperty } from '@joyfulljs/vendor-property';

/**
 * `transformOrigin` property name with browser vendor prefix if needed.
 */
export const transformOriginProperty = getProperty('transformOrigin');

/**
 * `transform` property name with browser vendor prefix if needed.
 */
export const transformProperty = getProperty('transform');

/**
 * make html element scalable by mouse wheel
 * @param el target html element
 * @param options 
 */
export default function Scalable(el: HTMLElement, options?: IOptions) {

  const { onScaleChange, maxScale = 50, minScale = 1, followMouse = true } = options || {};

  const computedStyle = window.getComputedStyle(el);
  // @ts-ignore  ts handle string index incorrectly. so ingore.
  const oldOrigin = computedStyle[transformOriginProperty];
  // @ts-ignore
  const oldTrans = computedStyle[transformProperty];

  let mouseX: number = -1, mouseY: number = -1;

  // matrix(3.5, 0, 0, 3.5, 0, 0)
  function handleScale(e: MouseWheelEvent) {
    const parts: Array<number | string> = getTransform(el);
    const oldScale = +parts[0];
    if (
      (e.deltaY < 0 && oldScale >= maxScale)
      || (e.deltaY > 0 && oldScale <= minScale)
    ) {
      return
    }
    const deltScale = e.deltaY * 0.005;
    const scale = Math.min(
      Math.max(minScale, oldScale - deltScale),
      maxScale
    );
    if (followMouse) {
      // deltScale * el.offsetWidth * (mouseX / el.offsetWidth);
      const deltW = deltScale * mouseX;
      // deltScale * el.offsetHeight * (mouseY / el.offsetHeight);
      const deltH = deltScale * mouseY;
      parts[4] = +parts[4] + deltW;
      parts[5] = +parts[5] + deltH;
    }
    parts[0] = scale;
    parts[3] = scale;
    // @ts-ignore
    el.style[transformProperty] = `matrix(${parts.join(",")})`;
    if (onScaleChange) {
      onScaleChange({ scale })
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

  function mousemove(e: MouseEvent) {
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
    reset,
    destroy() {
      el.parentNode.removeEventListener('wheel', handleScale);
      el.removeEventListener('mousemove', mousemove);
    }
  }
}

/**
 * get computed style of transform
 * @param el target html element
 */
export function getTransform(el: HTMLElement): string[] {
  // @ts-ignore
  let transform = window.getComputedStyle(el)[transformProperty];
  if (!transform || transform === 'none') {
    transform = 'matrix(1, 0, 0, 1, 0, 0)'
  }
  return transform.replace(/\(|\)|matrix|\s+/g, '').split(',');
}

export interface IOptions {
  /**
   * triggered when user scaling
   * @param e event argument { scale: number }
   */
  onScaleChange(e: { scale: number }): void;
  /**
   * the max value that can be scaled up to. 
   * default to 50;
   */
  maxScale?: number;
  /**
   * the min value that can be scaled down to. 
   * default to 1;
   */
  minScale?: number;
  /**
   * if to take the mouse position as the transform origin.
   */
  followMouse?: boolean
}
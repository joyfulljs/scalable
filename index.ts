/**
 * make html element scalable by mouse wheel
 * @param el target html element
 * @param options 
 */
export default function Scalable(el: HTMLElement, options?: IOptions) {

  const { onScaleChange, maxScale = 5, minScale = 1, followMouse = true } = options || {};
  const computedStyle = window.getComputedStyle(el);
  const oldOrigin = computedStyle.transformOrigin;
  const oldTrans = computedStyle.transform;

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
    el.style.transform = `matrix(${parts.join(",")})`;
    if (onScaleChange) {
      onScaleChange({ scale })
    }
    e.preventDefault();
  }

  function reset() {
    mouseX = -1;
    mouseY = -1;
    el.style.transformOrigin = oldOrigin;
    el.style.transform = oldTrans;
  }

  function mousemove(e: MouseEvent) {
    mouseX = e.offsetX;
    mouseY = e.offsetY;
  }

  el.parentNode.addEventListener('wheel', handleScale);
  if (followMouse) {
    el.style.transformOrigin = '0 0';
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
  let transform = window.getComputedStyle(el).transform;
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
   * default to 5;
   */
  maxScale?: number;
  /**
   * the min value that can be scaled down to. 
   * default to 1;
   */
  minScale?: number;
  /**
    * if to move to start when scale down. default to true
    */
  // moveToStart?: boolean;
  /**
   * if to take the mouse position as the transform origin.
   */
  followMouse?: boolean
}
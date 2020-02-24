import { IOptions } from './index.d';

/**
 * make html element scalable by mouse wheel
 * @param el target html element
 * @param options 
 */
export default function Scalable(el: HTMLElement, options?: IOptions) {

  const oldOrigin = el.style.transformOrigin;
  const oldTrans = window.getComputedStyle(el).transform;
  const { onScaleChange, maxScale = 5, minScale = 1 } = options || {};

  let mouseX = -1, mouseY = -1;
  // matrix(3.5, 0, 0, 3.5, 0, 0)
  function handleScale(e: MouseWheelEvent) {
    e.preventDefault();
    let parts = getTransform(el);
    let scale = +parts[0];
    scale += e.deltaY * -0.005;
    scale = Math.min(Math.max(minScale, scale), maxScale);
    if (e.deltaY > 0) {
      // try move to center when scale down
      parts[4] = String(+parts[4] * 0.5);
      parts[5] = String(+parts[5] * 0.5);
    }
    parts[0] = String(scale);
    parts[3] = String(scale);
    el.style.transformOrigin = `${mouseX}px ${mouseY}px`;
    el.style.transform = `matrix(${parts.join(",")})`;
    if (onScaleChange) {
      onScaleChange({ scale })
    }
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
  el.addEventListener("mousemove", mousemove);

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
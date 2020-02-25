/**
 * make html element scalable by mouse wheel
 * @param el target html element
 * @param options
 */
export default function Scalable(el: HTMLElement, options?: IOptions): {
    reset: () => void;
    destroy(): void;
};
/**
 * get computed style of transform
 * @param el target html element
 */
export declare function getTransform(el: HTMLElement): string[];
export interface IOptions {
    /**
     * triggered when user scaling
     * @param e event argument { scale: number }
     */
    onScaleChange(e: {
        scale: number;
    }): void;
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
    /**
     * if to take the mouse position as the transform origin.
     */
    followMouse?: boolean;
}

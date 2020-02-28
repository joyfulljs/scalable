/**
 * `transformOrigin` property name with browser vendor prefix if needed.
 */
export declare const transformOriginProperty: string;
/**
 * `transform` property name with browser vendor prefix if needed.
 */
export declare const transformProperty: string;
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
    followMouse?: boolean;
}

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
}
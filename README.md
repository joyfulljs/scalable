# make element scalable by nouse wheel

# useage

```JS
import Scalable from '@joyfulljs/scalable';

// ...
mount(){
  this.instance = new Scalale(this.refs.el, {
    followMouse: true,
    maxScale: 5,
    minScale: 1,
    onScaleChange: ( { scale } )=>{ console.log(scale) }
  });
},
active(){
  // if need to reset to origin state
  this.instance.reset()
},
unmount(){
  this.instance.destroy()
}
// ...

```


# api

```js

function Scalable(el: HTMLElement, options?: IOptions): {
    reset: () => void;
    destroy(): void;
};

interface IOptions {
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
```

# LICENSE

MIT

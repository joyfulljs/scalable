# make element scalable by mouse wheel

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

[docs](./index.d.ts)

```

# LICENSE

MIT

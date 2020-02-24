# make element scalable by nouse wheel

# useage

```JS
import Scalable from '@joyfulljs/scalable';

// ...
mount(){
  this.instance = new Scalale(this.refs.el);
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

# LICENSE

MIT

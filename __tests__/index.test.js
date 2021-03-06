const $ = require('jquery');
const { default: Scalable, getTransform } = require('../dist/index.c');
const jestUtils = require('@joyfulljs/jest-utils');

jestUtils.mockEventBinding();

Object.defineProperties(HTMLElement.prototype, {
  offsetHeight: {
    get: function () { return 100; }
  },
  offsetWidth: {
    get: function () { return 100; }
  }
});

function createEl() {
  let el = document.createElement('div');
  let parentNode = document.createElement('div');
  parentNode.appendChild(el);
  document.body.appendChild(parentNode);
  el.style.transformOrigin = '50px 50px';
  return [el, parentNode]
}

test('getTransform correctly', () => {
  let el = document.createElement('div');
  let trans = getTransform(el);
  expect(trans).toEqual(['1', '0', '0', '1', '0', '0']);
})

test('scale & reset correctly', () => {
  const [el, parentNode] = createEl();
  const instance = new Scalable(el);

  const originTrans = window.getComputedStyle(el).transform;

  const event = $.Event('wheel', { deltaY: -900 });
  $(parentNode).trigger(event);

  // test scale
  let newTrans = window.getComputedStyle(el).transform;
  expect(newTrans).toBe('matrix(5.5,0,0,5.5,0,0)');

  // test reset
  instance.reset();
  newTrans = window.getComputedStyle(el).transform;
  expect(newTrans).toBe(originTrans);
})

test('followMouse work correctly', () => {
  const [el, parentNode] = createEl();
  const instance = new Scalable(el);

  const mouseEvent = $.Event('mousemove', { offsetX: 20, offsetY: 30 });
  const event = $.Event('wheel', { deltaY: -900 });
  $(el).trigger(mouseEvent);
  $(parentNode).trigger(event);

  // test scale
  let newTrans = window.getComputedStyle(el).transform;
  expect(newTrans).toBe('matrix(5.5,0,0,5.5,135,90)');
})

test('maxScale & minScale works correctly', () => {

  const [el, parentNode] = createEl();
  const instance = new Scalable(el, { maxScale: 4, minScale: 0.5 });

  // test max scale
  let event = $.Event('wheel', { deltaY: -900 });
  $(parentNode).trigger(event);

  console.log('======', window.getComputedStyle(el).transformOrigin)
  let newTrans = window.getComputedStyle(el).transform;
  expect(newTrans).toBe('matrix(4,0,0,4,0,0)');

  instance.reset();

  // test min scale
  event = $.Event('wheel', { deltaY: 80 });
  $(parentNode).trigger(event);

  newTrans = window.getComputedStyle(el).transform;
  expect(newTrans).toBe('matrix(0.6,0,0,0.6,0,0)');
})

test('trigger onScaleChange & destroy correctly', () => {

  const [el, parentNode] = createEl();
  const change = jest.fn();
  const instance = new Scalable(el, {
    onScaleChange: change
  });

  // test trigger
  const event = $.Event('wheel', { deltaY: -900 });
  $(parentNode).trigger(event);
  expect(change).toHaveBeenCalledTimes(1);
  expect(change.mock.calls[0][0].scale).toBe(5.5);

  // test destroy
  instance.destroy();
  $(parentNode).trigger(event);
  // stay 1
  expect(change).toHaveBeenCalledTimes(1);
})
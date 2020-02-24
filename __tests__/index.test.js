const $ = require('jquery');
const { default: Scalable, getTransform } = require('../dist/index');

// use jquery to bind event
const oldBinder = HTMLElement.prototype.addEventListener;
const newBinder = function (type, callback) {
  HTMLElement.prototype.addEventListener = oldBinder;
  $(this).on(type, callback);
  HTMLElement.prototype.addEventListener = newBinder;
}
HTMLElement.prototype.addEventListener = newBinder;

test('getTransform correctly', () => {
  let el = document.createElement('div');
  let trans = getTransform(el);
  expect(trans).toEqual(['1', '0', '0', '1', '0', '0']);
})

test('reset correctly', () => {
  let el = document.createElement('div');
  let trans = getTransform(el);
  expect(trans).toEqual(['1', '0', '0', '1', '0', '0']);
})

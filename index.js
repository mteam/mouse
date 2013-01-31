var events = require('events'),
    bind = require('bind');

// --- setup ---

function Mouse() {
  events.extend(this);
  this.position = {x: null, y: null};
  this.pressed = {};
};

module.exports = Mouse;

Mouse.prototype.attach = function() {  
  window.addEventListener('mousemove', bind(this.move, this));
  window.addEventListener('mousedown', bind(this.down, this));
  window.addEventListener('mouseup', bind(this.up, this));
  window.addEventListener('mousewheel', bind(this.wheel, this));
  window.addEventListener('DOMMouseScroll', bind(this.scroll, this));
};

// --- events handling ---

Mouse.prototype.move = function(event) {
  this.update(event);
  this.trigger('moved');
};

Mouse.prototype.down = function(event) {
  this.update(event);

  var code = event.button,
      button = names[code] || code;

  if (!this.pressed[button]) {
    this.pressed[button] = true;
    this.trigger('pressed', button, this.getX(), this.getY());
  }
};

Mouse.prototype.up = function(event) {
  this.update(event);

  var code = event.button,
      button = names[code] || code;

  if (this.pressed[button]) {
    this.pressed[button] = false;
    this.trigger('released', button, this.getX(), this.getY());
  }
};

Mouse.prototype.wheel = function(event) {
  var button = event.wheelDelta > 0 ? 'up' : 'down';
  this.trigger('pressed', button, this.getX(), this.getY());
};

Mouse.prototype.scroll = function(event) {
  var button = event.detail < 0 ? 'up' : 'down';
  this.trigger('pressed', button, this.getX(), this.getY());
};

Mouse.prototype.update = function(event) {
  this.position.x = event.clientX;
  this.position.y = event.clientY;
};

// ---

Mouse.prototype.getPosition = function() {
  return this.position;
};

Mouse.prototype.getX = function() {
  return this.position.x;
};

Mouse.prototype.getY = function() {
  return this.position.y;
};

Mouse.prototype.isDown = function(button) {
  return !!this.pressed[button];
};

// --- button names ---

var names = {
  0: 'left',
  1: 'middle',
  2: 'right'
};

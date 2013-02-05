var expect = require('expect.js'),
    sham = require('sham'),
    Mouse = require('./index');

describe('Mouse', function() {
  var events = {
    left: { button: 0 },
    middle: { button: 1 },
    right: { button: 2 },

    wheelUp: { wheelDelta: 120 },
    wheelDown: { wheelDelta: -120 },

    scrollUp: { detail: -3 },
    scrollDown: { detail: 3 }
  };

  it('should trigger events', function() {
    var mouse = new Mouse;

    var pressed = sham.spy().called(),
        released = sham.spy().called();

    mouse.on('pressed', pressed);
    mouse.on('released', released);

    mouse.down(events.left);
    mouse.up(events.left);

    pressed.check();
    released.check();
  });

  it('should give correct button name', function() {
    var mouse = new Mouse;

    var pressed = sham.spy();
    mouse.on('pressed', pressed);

    ['left', 'middle', 'right'].forEach(function(button) {
      pressed.args(button);
      mouse.down(events[button]);
    });

    pressed.args('up');
    mouse.wheel(events.wheelUp);
    mouse.scroll(events.scrollUp);

    pressed.args('down');
    mouse.wheel(events.wheelDown);
    mouse.scroll(events.scrollDown);
  });

  it('should remember whether key is pressed', function() {
    var mouse = new Mouse;
    
    expect(mouse.isDown('right')).to.be(false);

    mouse.down(events.right);
    expect(mouse.isDown('right')).to.be(true);

    mouse.up(events.right);
    expect(mouse.isDown('right')).to.be(false);
  });
});

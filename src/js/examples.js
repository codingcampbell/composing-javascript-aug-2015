var Animal = function(name) {
  this.name = name;
};

Animal.prototype.breathe = function() {
  return "*inhale air*";
};

Animal.prototype.say = function() {
  return this.name + " says something";
};

window.Animal = Animal;

var Dog = function(name) {
  this._super = this.__proto__.__proto__; // Relative, but deprecated
  this._super = Object.getPrototypeOf(Dog.prototype); // Semi-relative (Dog is absolute)
  this._super = Object.getPrototypeOf(Object.getPrototypeOf(this)); // Relative, standardized, but long

  this._super.constructor(name); // or ...

  Animal.call(this, name); // Absolute, most compatible, technically brittle
};

Dog.prototype = Object.create(Animal.prototype);

Dog.prototype.say = function() {
  return this.name + " barks!";
};

window.Dog = Dog;

class AnimalES6 {
  constructor(name) {
    this.name = name;
  }

  breathe() {
    return "*inhale air*";
  }

  say() {
    return this.name + " says something";
  }
}

window.AnimalES6 = AnimalES6;

class DogES6 extends AnimalES6 {
  constructor(name) {
    super(name);
  }

  say() {
    return this.name + " barks!";
  }
}

window.DogES6 = DogES6;

var Mario = {
  lives: 3,
  hp: 1,

  jump() { return "boing!"; },
  die() { return "game over" },
  hit() {
    this.hp -= 1;
    if (this.hp === 0) { this.die(); }
  }
};

window.Mario = Mario;

var Flower = {
  firePowerUp() {
    this.hp = 2;
  },

  fireball() {
    return "blip!";
  }
};

window.Flower = Flower;

var mixer = function(target, mixin) {
  Object.keys(mixin).forEach(function(prop) {
    target[prop] = mixin[prop];
  });
};

window.mixer = mixer;

class MarioMix {
  constructor() {
    this.lives = 3;
    this.hp = 1;
  }

  jump() { return "boing!"; }
  die() { return "game over" }
  hit() {
    this.hp -= 1;
    if (this.hp === 0) { this.die(); }
  }
}

mixer(MarioMix.prototype, Flower);

window.MarioMix = MarioMix;

var add = function(a, b) {
  return a + b;
};

var add10 = function(b) {
  return add(10, b);
};

add10 = add.bind(null, 10);

var sub = function(a, b) {
  return add(a, -b);
};

window.add = add;
window.add10 = add10;
window.sub = sub;

var request = function(url) {
  return "Making ajax call to " + url;
}

var securify = function(fn) {
  return function(url) {
    return fn.call(this, url.replace(/^http:/, 'https:'));
  }
};

var secureRequest = securify(request);

window.request = request;
window.securify = securify;
window.secureRequest = secureRequest;

export default {};

export default class Slides {
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.slides = document.querySelectorAll('.slide');
    this.slideIndex = 0;
    this.items = [];
    this.itemIndex = 0;
    this.moveToSlide(0);

    eventBus.on('moveToSlide', (slideIndex) => this.moveToSlide(slideIndex));
    eventBus.on('nextSlide', () => this.moveToSlide(this.slideIndex + 1));
    eventBus.on('prevSlide', () => this.moveToSlide(this.slideIndex - 1));
    eventBus.on('next', () => this.next());
    eventBus.on('prev', () => this.prev());
  }

  prev() {
    if (this.moveToItem(this.itemIndex - 1) === false) {
      if (this.slideIndex > 0) {
        this.eventBus.trigger('prevSlide');
        this.moveToItem(this.items.length);
      }
    }
  }

  next() {
    if (this.moveToItem(this.itemIndex + 1) === false) {
      this.eventBus.trigger('nextSlide');
    }
  }

  moveToSlide(index) {
    if (index < 0 || index >= this.slides.length) {
      return false;
    }

    this.slides[this.slideIndex].classList.remove('active');
    this.slides[index].classList.add('active');

    this.items = this.slides[index].querySelectorAll('.slide-item');
    this.itemIndex = 0;
    this.slideIndex = index;
    this.eventBus.trigger('slideActive', index);
  }

  moveToItem(index) {
    if (index < 0 || index > this.items.length) {
      return false;
    }

    this.itemIndex = index;

    [].forEach.call(this.items, (item, i) => { 
      if (i < index) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    })
  }
};

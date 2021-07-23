import countdownClockTpl from '../templates/countdown-clock.hbs';

const refs = {
  startBtn: document.querySelector('[data-action="start"]'),
  stopBtn: document.querySelector('[data-action="stop"]'),
};

class CountdownTimer {
  constructor({ selector, targetDate, updateTime }) {
    this.selector = selector;
    this.targetDate = targetDate;
    this.updateTime = updateTime;
    this.intervalId = null;
    this.isActive = false;
  }

  start() {
    if (this.isActive) {
      return;
    }

    this.isActive = true;
    this.intervalId = setInterval(() => {
      const time = this.getTimerComponents(this.targetDate - Date.now());
      this.updateTime(time, this.selector);
    }, 1000);
  }

  stop() {
    this.isActive = false;
    clearInterval(this.intervalId);
  }

  getTimerComponents(time) {
    const days = this.pad(Math.floor(time / (1000 * 60 * 60 * 24)));
    const hours = this.pad(Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
    const mins = this.pad(Math.floor((time % (1000 * 60 * 60)) / (1000 * 60)));
    const secs = this.pad(Math.floor((time % (1000 * 60)) / 1000));

    return { days, hours, mins, secs };
  }

  pad(value) {
    return String(value).padStart(2, '0');
  }
}

const timer = new CountdownTimer({
  selector: '#timer-1',
  targetDate: new Date('Oct 17, 2021'),
  updateTime: updateClockface,
});

refs.startBtn.addEventListener('click', timer.start.bind(timer));
refs.stopBtn.addEventListener('click', timer.stop.bind(timer));

createClockfaceMarkup(timer.getTimerComponents(timer.targetDate - Date.now()), timer.selector);
timer.start();

function createClockfaceMarkup(time, selector) {
  document.querySelector(`${selector}`).insertAdjacentHTML('beforeend', countdownClockTpl(time));
}

function updateClockface({ days, hours, mins, secs }, selector) {
  document.querySelector(`${selector} [data-value="days"]`).textContent = days;
  document.querySelector(`${selector} [data-value="hours"]`).textContent = hours;
  document.querySelector(`${selector} [data-value="mins"]`).textContent = mins;
  document.querySelector(`${selector} [data-value="secs"]`).textContent = secs;
}

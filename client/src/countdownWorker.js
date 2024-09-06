let intervalId;
let timeLeft = 0;

self.onmessage = (event) => {
  if (event.data.timeLeft !== undefined) {
    timeLeft = event.data.timeLeft;
    console.log('Worker received timeLeft:', timeLeft);

    if (intervalId) {
      clearInterval(intervalId);
    }

    intervalId = setInterval(() => {
      timeLeft -= 1;
      console.log('Worker timeLeft:', timeLeft);
      if (timeLeft <= 0) {
        clearInterval(intervalId);
        self.postMessage({ timeLeft: 0 });
        self.close();
      } else {
        self.postMessage({ timeLeft });
      }
    }, 1000);
  }
};

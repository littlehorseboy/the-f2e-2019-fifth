interface KeyI {
  code: number;
  isDown: boolean;
  isUp: boolean;
  press: any;
  release: any;
  downHandler(event: any): void;
  upHandler(event: any): void;
}

export default function keyboard(keyCode: number): KeyI {
  const key = {
    code: keyCode,
    isDown: false,
    isUp: true,
    press: undefined,
    release: undefined,
    downHandler(event): void {
      event.preventDefault();
      if (event.keyCode === key.code) {
        if (key.isUp && key.press) {
          key.press();
        }

        key.isDown = true;
        key.isUp = false;
      }
    },
    upHandler(event): void {
      event.preventDefault();

      if (event.keyCode === key.code) {
        if (key.isDown && key.release) {
          key.release();
        }

        key.isDown = false;
        key.isUp = true;
      }
    },
  };

  window.addEventListener('keydown', key.downHandler.bind(key), false);
  window.addEventListener('keyup', key.upHandler.bind(key), false);

  return key;
}

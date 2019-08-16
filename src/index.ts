import 'normalize.css';
import * as PIXI from 'pixi.js';
import keyboard from './assets/js/keyboard';
import store from './reducers/configureStore';
import { addSceneObject } from './actions/sceneObject/sceneObject';
import { WithPIXIDisplayObject } from './reducers/sceneObject/sceneObject';

require('./index.css');

// eslint-disable-next-line @typescript-eslint/no-var-requires
const FontFaceObserver = require('fontfaceobserver');

/* eslint-disable @typescript-eslint/no-var-requires */
const plasticBagDownImg = require('./assets/images/F2E_week5/down.png');
const plasticBagJumpImg = require('./assets/images/F2E_week5/jump.png');
const bgRockImgLeft = require('./assets/images/bg-rock/rock2.png');
const bgRockImgCenter = require('./assets/images/bg-rock/rock3.png');
const bgRockImgRight = require('./assets/images/bg-rock/rock.png');
const turtleImg = require('./assets/images/F2E_week5/turtle.png');
const cheilinusUndulatusImg = require('./assets/images/F2E_week5/龍王鯛.png');
const bolbometoponMuricatumImg = require('./assets/images/F2E_week5/龍頭鸚哥魚.png');
const seahorseImg = require('./assets/images/F2E_week5/Seahorse.png');
const littleTurtleImg = require('./assets/images/F2E_week5/little-turtle.png');
const fishOrangeImg = require('./assets/images/F2E_week5/fish.png');
const fishYellowImg = require('./assets/images/F2E_week5/fish2.png');
const coralReefImg = require('./assets/images/F2E_week5/Coral_reef.png');
const anemoneImg = require('./assets/images/F2E_week5/anemone.png');
const coralImg = require('./assets/images/F2E_week5/coral.png');
const anemonesImg = require('./assets/images/F2E_week5/Sprite-0002.png');
const bgRocksImg = require('./assets/images/F2E_week5/bg-rocks.png');
const bgFishesImg = require('./assets/images/F2E_week5/bg-fishes.png');

const {
  Application,
  Loader,
  Container,
  Sprite,
  Graphics,
  Rectangle,
  Text,
  TextStyle,
  Texture,
  TilingSprite,
} = PIXI;

const app = new Application({
  antialias: true,
  width: 1280,
  height: 800,
  backgroundColor: 0xE0E0E0,
});

document.body.appendChild(app.view);

let sceneState: (delta: number, distance?: number) => void; // 遊戲場景狀態
let gameStartScene: PIXI.Container; // 遊戲開始畫面場景
let gameScene: PIXI.Container; // 遊戲場景
interface PlasticBagI extends PIXI.Sprite {
  vy: number;
}
interface MarineLifeI extends PIXI.Sprite {
  vx: number;
}
interface GameSceneObjectI {
  bgRightFishes: null | PIXI.Sprite;
  toolbarRightText: null | PIXI.Text;
  plasticBag: null | PlasticBagI;
  toolbarContainer: null | PIXI.Container;
  toolbarLevelTwoGraphic: null | PIXI.Graphics;
  toolbarLevelThreeGraphic: null | PIXI.Graphics;
  marineLife: MarineLifeI[];
}
const gameSceneObject: GameSceneObjectI = {
  bgRightFishes: null,
  toolbarRightText: null,
  plasticBag: null,
  toolbarContainer: null,
  toolbarLevelTwoGraphic: null,
  toolbarLevelThreeGraphic: null,
  marineLife: [],
};
let gameKarmaScene: PIXI.Container; // 業障場景

const end = (): void => {

};

const karma = (): void => {
  if (gameStartScene.visible) {
    gameStartScene.visible = false;
  }
  if (!gameKarmaScene.visible) {
    gameKarmaScene.visible = true;
  }
};

class Countdown {
  private internalSeconds: number;

  private timer: undefined | NodeJS.Timeout;

  public constructor() {
    this.internalSeconds = 90;
  }

  public get seconds(): number {
    return this.internalSeconds;
  }

  public setCountdownStatus(status: 'play' | 'pause' | 'stop'): void {
    if (status === 'play') {
      this.timer = setInterval((): void => {
        if (this.internalSeconds <= 0) {
          clearInterval(this.timer as NodeJS.Timeout);
        } else {
          this.internalSeconds -= 1;
        }
      }, 1000);
    }

    if (status === 'pause') {
      if (this.timer) {
        clearInterval(this.timer);
      }
    }

    if (status === 'stop') {
      if (this.timer) {
        clearInterval(this.timer);
      }
      this.internalSeconds = 90;
    }
  }
}

const countdown = new Countdown();

document.addEventListener('visibilitychange', (): void => {
  if (document.hidden) {
    countdown.setCountdownStatus('pause');
  } else {
    countdown.setCountdownStatus('play');
  }
});

const play = (distance: number, delta: number): void => {
  const reduxState = store.getState();

  if (gameStartScene.visible) {
    gameStartScene.visible = false;
  }
  if (!gameScene.visible) {
    gameScene.visible = true;
  }

  if (countdown.seconds <= 30) {
    sceneState = play.bind(undefined, 30);
  } else if (countdown.seconds <= 60) {
    sceneState = play.bind(undefined, 60);
  }

  const background90 = reduxState.sceneObjectReducer.gameScene
    .find((withPIXIDisplayObject: WithPIXIDisplayObject): boolean => withPIXIDisplayObject.id === 'background90');
  const background60 = reduxState.sceneObjectReducer.gameScene
    .find((withPIXIDisplayObject: WithPIXIDisplayObject): boolean => withPIXIDisplayObject.id === 'background60');
  const background30 = reduxState.sceneObjectReducer.gameScene
    .find((withPIXIDisplayObject: WithPIXIDisplayObject): boolean => withPIXIDisplayObject.id === 'background30');

  if (
    background90 && background60 && background30
  ) {
    if (distance <= 30) {
      background90.displayObject.visible = false;
      background60.displayObject.visible = false;
      background30.displayObject.visible = true;
    } else if (distance <= 60) {
      background90.displayObject.visible = false;
      background60.displayObject.visible = true;
      background30.displayObject.visible = false;
    } else {
      background90.displayObject.visible = true;
      background60.displayObject.visible = false;
      background30.displayObject.visible = false;
    }
  }

  if (
    gameSceneObject.toolbarLevelThreeGraphic && gameSceneObject.toolbarLevelTwoGraphic
  ) {
    if (distance <= 30) {
      gameSceneObject.toolbarLevelThreeGraphic.visible = true;
    } else if (distance <= 60) {
      gameSceneObject.toolbarLevelTwoGraphic.visible = true;
    }
  }

  const bgRocks = reduxState.sceneObjectReducer.gameScene
    .find((withPIXIDisplayObject: WithPIXIDisplayObject): boolean => withPIXIDisplayObject.id === 'bgRocks');

  if (bgRocks) {
    if (gameSceneObject.toolbarContainer) {
      bgRocks.displayObject.position.set(
        0,
        app.renderer.height - bgRocks.displayObject.height
          - gameSceneObject.toolbarContainer.height,
      );
    }
    (bgRocks.displayObject as PIXI.TilingSprite).tilePosition.set(
      (bgRocks.displayObject as PIXI.TilingSprite).tilePosition.x - 0.5,
      (bgRocks.displayObject as PIXI.TilingSprite).tilePosition.y,
    );
  }

  const bgLeftFishes = reduxState.sceneObjectReducer.gameScene
    .find((withPIXIDisplayObject: WithPIXIDisplayObject): boolean => withPIXIDisplayObject.id === 'bgLeftFishes');

  if (bgLeftFishes) {
    bgLeftFishes.displayObject.position.set(
      bgLeftFishes.displayObject.x - 5,
      bgLeftFishes.displayObject.y,
    );
    if (bgLeftFishes.displayObject.x < 0 - bgLeftFishes.displayObject.width) {
      bgLeftFishes.displayObject.x = app.renderer.width + bgLeftFishes.displayObject.width;
    }
  }

  if (gameSceneObject.bgRightFishes) {
    gameSceneObject.bgRightFishes.position.set(
      gameSceneObject.bgRightFishes.x - 3,
      gameSceneObject.bgRightFishes.y,
    );
    if (gameSceneObject.bgRightFishes.x < 0 - gameSceneObject.bgRightFishes.width) {
      gameSceneObject.bgRightFishes.x = app.renderer.width + gameSceneObject.bgRightFishes.width;
    }
  }

  if (gameSceneObject.toolbarRightText) {
    gameSceneObject.toolbarRightText.text = `End Distance: ${countdown.seconds} M`;
  }

  if (gameSceneObject.plasticBag) {
    // 按空白時 向上移動
    // y 不能小於 0，且 vy 加速度是負數
    if (gameSceneObject.plasticBag.y > 0 && gameSceneObject.plasticBag.vy < 0) {
      gameSceneObject.plasticBag.y += gameSceneObject.plasticBag.vy;
    }

    // 自動下墜
    if (gameSceneObject.toolbarContainer) {
      if (
        gameSceneObject.plasticBag.y
          > app.renderer.height
            - gameSceneObject.plasticBag.height
            - gameSceneObject.toolbarContainer.height
      ) {
        gameSceneObject.plasticBag.y = app.renderer.height
          - gameSceneObject.plasticBag.height
          - gameSceneObject.toolbarContainer.height;
        gameSceneObject.plasticBag.y += gameSceneObject.plasticBag.vy;
      } else if (gameSceneObject.plasticBag.vy > 0) {
        gameSceneObject.plasticBag.y += gameSceneObject.plasticBag.vy;
      }
    }
  }

  gameSceneObject.marineLife.forEach((life: MarineLifeI): void => {
    if (gameSceneObject.toolbarContainer) {
      Object.assign(life, {
        x: life.x + life.vx,
      });
    }
  });
};

const start = (): void => {
  if (!gameStartScene.visible) {
    gameStartScene.visible = true;
  }
  if (gameKarmaScene.visible) {
    gameKarmaScene.visible = false;
  }
};

const gameLoop = (delta: number): void => {
  sceneState(delta);
};

// 創造由上而下的漸層背景
const createGradTexture = (firstStopColor: string, secondStopColor: string): PIXI.Texture => {
  const quality = 256;
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = quality;
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

  const grd = ctx.createLinearGradient(0, 0, 0, quality);
  grd.addColorStop(0, firstStopColor);
  grd.addColorStop(1, secondStopColor);

  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, 1, quality);

  return Texture.from(canvas);
};

// 創造 PixelMplus 文字
const createPixelMplusTextStyle = (
  fontSize: number,
  fill?: string,
): PIXI.TextStyle => new TextStyle({
  fontFamily: 'regularPixelMplus10',
  fontSize,
  fill: fill ? `${fill}` : '#FFFFFF',
});

const setup = (pixiLoader: PIXI.Loader, resource: PIXI.LoaderResource): void => {
  // global gameStartScene 遊戲開始畫面場景
  const initStartScene = (): void => {
    gameStartScene = new Container();
    app.stage.addChild(gameStartScene);

    const background = (): void => {
      // 背景
      const gradTexture = createGradTexture('#9FEFFF', '#36479C');
      const gradientBg = new Sprite(gradTexture);
      gradientBg.width = 1280;
      gradientBg.height = 800;

      gameStartScene.addChild(gradientBg);
    };

    const title = (): void => {
      // titleContainer
      const titleContainer = new Container();

      // 拉基大冒險標題 Rect
      const titleGraphic = new Graphics();
      titleGraphic.beginFill(0x000000);
      titleGraphic.lineStyle(1, 0x707070, 1);
      titleGraphic.drawRect(0, 0, 611, 129);
      titleGraphic.endFill();
      titleContainer.addChild(titleGraphic);

      // 拉基大冒險標題文字
      const titleText = new Text('海底拉基大冒險', createPixelMplusTextStyle(78));
      titleText.position.set(
        titleGraphic.width / 2 - titleText.width / 2,
        titleGraphic.height / 2 - titleText.height / 2,
      );
      titleContainer.addChild(titleText);

      // titleContainer 填完內容後最後定位
      titleContainer.position.set(
        app.renderer.width / 2 - titleContainer.width / 2,
        271,
      );

      gameStartScene.addChild(titleContainer);
    };

    const startButton = (): void => {
      // startButtonContainer
      const startButtonContainer = new Container();

      // 按鈕 Rectangle
      const startButtonGraphic = new Graphics();
      startButtonGraphic.lineStyle(5, 0xFFFFFF, 1);
      startButtonGraphic.drawRect(0, 0, 240, 80);
      startButtonGraphic.endFill();
      startButtonGraphic.hitArea = new Rectangle(0, 0, 240, 80);
      startButtonGraphic.interactive = true;
      startButtonGraphic.buttonMode = true;
      startButtonGraphic.on('click', (): void => {
        countdown.setCountdownStatus('play');
        sceneState = play.bind(undefined, 90);
      });
      startButtonContainer.addChild(startButtonGraphic);

      // 按鈕文字
      const startButtonText = new Text('Start', createPixelMplusTextStyle(56));
      startButtonText.position.set(
        startButtonGraphic.width / 2 - startButtonText.width / 2,
        startButtonGraphic.height / 2 - startButtonText.height / 2,
      );
      startButtonContainer.addChild(startButtonText);

      // startButtonContainer 填完內容後最後定位
      startButtonContainer.position.set(
        app.renderer.width / 2 - startButtonContainer.width / 2,
        466,
      );

      gameStartScene.addChild(startButtonContainer);
    };

    const karmaButton = (): void => {
      // 業障文字 兼 按鈕
      const karmaButtonText = new Text('業障', createPixelMplusTextStyle(56));
      karmaButtonText.position.set(
        app.renderer.width / 2 - karmaButtonText.width / 2,
        585,
      );
      karmaButtonText.hitArea = new Rectangle(0, 0, karmaButtonText.width, karmaButtonText.height);
      karmaButtonText.interactive = true;
      karmaButtonText.buttonMode = true;
      karmaButtonText.on('click', (): void => {
        sceneState = karma;
      });

      gameStartScene.addChild(karmaButtonText);
    };

    const plasticBag = (): void => {
      const plasticBagLeft = Sprite.from(plasticBagJumpImg);
      plasticBagLeft.position.set(130, 414);
      gameStartScene.addChild(plasticBagLeft);

      const plasticBagRight = Sprite.from(plasticBagDownImg);
      plasticBagRight.rotation = -Math.PI * 0.2;
      plasticBagRight.position.set(1011, 104);
      gameStartScene.addChild(plasticBagRight);
    };

    const rocks = (): void => {
      // rockContainer
      const rockContainer = new Container();

      const rockLeft = Sprite.from(bgRockImgLeft);
      rockLeft.position.set(
        0,
        app.renderer.height - rockLeft.height,
      );
      rockContainer.addChild(rockLeft);

      const rockCenter = Sprite.from(bgRockImgCenter);
      rockCenter.position.set(
        rockLeft.width,
        app.renderer.height - rockCenter.height,
      );
      rockContainer.addChild(rockCenter);

      const rockRight = Sprite.from(bgRockImgRight);
      rockRight.position.set(
        rockLeft.width + rockCenter.width,
        app.renderer.height - rockRight.height,
      );
      rockContainer.addChild(rockRight);

      gameStartScene.addChild(rockContainer);
    };

    const toolbar = (): void => {
      // toolbarContainer
      const toolbarContainer = new Container();

      const textStyle = createPixelMplusTextStyle(30);

      // toolbar Rectangle
      const toolbarGraphic = new Graphics();
      toolbarGraphic.beginFill(0x151D46);
      toolbarGraphic.lineStyle(1, 0x707070, 1);
      toolbarGraphic.drawRect(0, 0, app.renderer.width, 80);
      toolbarGraphic.endFill();
      toolbarContainer.addChild(toolbarGraphic);

      // toolbar 左邊文字
      const toolbarLeftText = new Text('Control:', textStyle);
      toolbarLeftText.position.set(
        38,
        toolbarGraphic.height / 2 - toolbarLeftText.height / 2,
      );
      toolbarContainer.addChild(toolbarLeftText);

      // toolbar 左邊文字 + 框框
      const toolbarLeftButtonGraphic = new Graphics();
      toolbarLeftButtonGraphic.lineStyle(3, 0xFFFFFF, 1);
      toolbarLeftButtonGraphic.drawRect(0, 0, 113, 41);
      toolbarLeftButtonGraphic.endFill();
      toolbarLeftButtonGraphic.position.set(
        175,
        toolbarGraphic.height / 2 - toolbarLeftButtonGraphic.height / 2,
      );
      toolbarContainer.addChild(toolbarLeftButtonGraphic);

      const toolbarLeftButtonText = new Text('space', textStyle);
      toolbarLeftButtonText.position.set(
        toolbarLeftButtonGraphic.x
          + (toolbarLeftButtonGraphic.width / 2)
          - (toolbarLeftButtonText.width / 2),
        toolbarGraphic.height / 2 - toolbarLeftButtonText.height / 2,
      );
      toolbarContainer.addChild(toolbarLeftButtonText);

      // toolbar 右邊文字
      const toolbarRightText = new Text('End Distance: 30 M', textStyle);
      toolbarRightText.position.set(
        930,
        toolbarGraphic.height / 2 - toolbarRightText.height / 2,
      );
      toolbarContainer.addChild(toolbarRightText);

      // toolbarContainer 填完內容後最後定位
      toolbarContainer.position.set(
        0,
        app.renderer.height - toolbarGraphic.height,
      );

      gameStartScene.addChild(toolbarContainer);
    };

    background();
    title();
    startButton();
    karmaButton();
    plasticBag();
    rocks();
    toolbar();
  };

  const initGameScene = (): void => {
    // global gameScene 遊戲區
    gameScene = new Container();
    gameScene.visible = false;
    app.stage.addChild(gameScene);

    const background90 = ((): PIXI.Sprite => {
      // 背景 90M
      const gradTexture = createGradTexture('#63CFE5', '#76A6E0');
      const gradientBg = new Sprite(gradTexture);
      gradientBg.width = 1280;
      gradientBg.height = 800;

      gameScene.addChild(gradientBg);

      return gradientBg;
    })();

    store.dispatch(addSceneObject('gameScene', {
      id: 'background90',
      description: '距離終點 90 M 的漸層背景',
      displayObject: background90,
    }));

    const background60 = ((): PIXI.Sprite => {
      // 背景 60M
      const gradTexture = createGradTexture('#ACDBE5', '#B3C7E0');
      const gradientBg = new Sprite(gradTexture);
      gradientBg.width = 1280;
      gradientBg.height = 800;

      gameScene.addChild(gradientBg);

      return gradientBg;
    })();

    store.dispatch(addSceneObject('gameScene', {
      id: 'background60',
      description: '距離終點 60 M 的漸層背景',
      displayObject: background60,
    }));

    const background30 = ((): PIXI.Sprite => {
      // 背景 30M
      const gradTexture = createGradTexture('#CEE1E5', '#CAD4E0');
      const gradientBg = new Sprite(gradTexture);
      gradientBg.width = 1280;
      gradientBg.height = 800;

      gameScene.addChild(gradientBg);

      return gradientBg;
    })();

    store.dispatch(addSceneObject('gameScene', {
      id: 'background30',
      description: '距離終點 30 M 的漸層背景',
      displayObject: background30,
    }));

    const toolbarContainer = new Container();

    const textStyle = createPixelMplusTextStyle(30);

    // toolbar Rectangle
    const toolbarGraphic = new Graphics();
    toolbarGraphic.beginFill(0x151D46);
    toolbarGraphic.lineStyle(1, 0x707070, 1);
    toolbarGraphic.drawRect(0, 0, app.renderer.width, 80);
    toolbarGraphic.endFill();
    toolbarContainer.addChild(toolbarGraphic);

    // toolbar 左邊文字
    const toolbarLeftText = new Text('Control:', textStyle);
    toolbarLeftText.position.set(
      38,
      toolbarGraphic.height / 2 - toolbarLeftText.height / 2,
    );
    toolbarContainer.addChild(toolbarLeftText);

    // toolbar 左邊文字 + 框框
    const toolbarLeftButtonGraphic = new Graphics();
    toolbarLeftButtonGraphic.lineStyle(3, 0xFFFFFF, 1);
    toolbarLeftButtonGraphic.drawRect(0, 0, 113, 41);
    toolbarLeftButtonGraphic.endFill();
    toolbarLeftButtonGraphic.position.set(
      175,
      toolbarGraphic.height / 2 - toolbarLeftButtonGraphic.height / 2,
    );
    toolbarContainer.addChild(toolbarLeftButtonGraphic);

    const toolbarLeftButtonText = new Text('space', textStyle);
    toolbarLeftButtonText.position.set(
      toolbarLeftButtonGraphic.x
        + (toolbarLeftButtonGraphic.width / 2)
        - (toolbarLeftButtonText.width / 2),
      toolbarGraphic.height / 2 - toolbarLeftButtonText.height / 2,
    );
    toolbarContainer.addChild(toolbarLeftButtonText);

    // toolbar 右邊文字
    gameSceneObject.toolbarRightText = new Text('End Distance: 90 M', textStyle);
    gameSceneObject.toolbarRightText.position.set(
      930,
      toolbarGraphic.height / 2 - gameSceneObject.toolbarRightText.height / 2,
    );
    toolbarContainer.addChild(gameSceneObject.toolbarRightText);

    // toolbarLevelTwo Rectangle
    const toolbarLevelTwoGraphic = new Graphics();
    toolbarLevelTwoGraphic.visible = false;
    toolbarLevelTwoGraphic.beginFill(0x151D46);
    toolbarLevelTwoGraphic.lineStyle(1, 0x707070, 1);
    toolbarLevelTwoGraphic.drawRect(0, -80, app.renderer.width, 80);
    toolbarLevelTwoGraphic.endFill();
    toolbarContainer.addChild(toolbarLevelTwoGraphic);
    gameSceneObject.toolbarLevelTwoGraphic = toolbarLevelTwoGraphic;

    // toolbarLevelThree Rectangle
    const toolbarLevelThreeGraphic = new Graphics();
    toolbarLevelThreeGraphic.visible = false;
    toolbarLevelThreeGraphic.beginFill(0x151D46);
    toolbarLevelThreeGraphic.lineStyle(1, 0x707070, 1);
    toolbarLevelThreeGraphic.drawRect(0, -160, app.renderer.width, 80);
    toolbarLevelThreeGraphic.endFill();
    toolbarContainer.addChild(toolbarLevelThreeGraphic);
    gameSceneObject.toolbarLevelThreeGraphic = toolbarLevelThreeGraphic;

    // toolbarContainer 填完內容後最後定位
    toolbarContainer.position.set(
      0,
      app.renderer.height - toolbarGraphic.height,
    );

    gameScene.addChild(toolbarContainer);
    gameSceneObject.toolbarContainer = toolbarContainer;

    // 背景岩石群
    const rocksTexture = Texture.from(bgRocksImg);
    const bgRocks = new TilingSprite(
      rocksTexture,
      rocksTexture.baseTexture.width,
      rocksTexture.baseTexture.height,
    );
    gameScene.addChild(bgRocks);

    store.dispatch(addSceneObject('gameScene', {
      id: 'bgRocks',
      description: '背景岩石群',
      displayObject: bgRocks,
    }));

    // 背景魚群 (左)
    const bgLeftFishes = Sprite.from(bgFishesImg);
    bgLeftFishes.position.set(209, 251);
    gameScene.addChild(bgLeftFishes);

    store.dispatch(addSceneObject('gameScene', {
      id: 'bgLeftFishes',
      description: '背景魚群 (左)',
      displayObject: bgLeftFishes,
    }));

    // 背景魚群 (右)
    gameSceneObject.bgRightFishes = Sprite.from(bgFishesImg);
    gameSceneObject.bgRightFishes.position.set(640, 80);
    gameScene.addChild(gameSceneObject.bgRightFishes);

    // 萬惡的塑膠袋
    const plasticBagDownTexture = Texture.from(plasticBagDownImg);
    const plasticBag = Sprite.from(plasticBagDownTexture);
    plasticBag.position.set(
      120,
      app.renderer.height / 2 - plasticBag.height / 2,
    );
    gameScene.addChild(plasticBag);

    const plasticBagJumpTexture = Texture.from(plasticBagJumpImg);

    (plasticBag as PlasticBagI).vy = 3; // 預設的下降速度
    gameSceneObject.plasticBag = plasticBag as PlasticBagI;

    // 鍵盤控制萬惡的塑膠袋
    const space = keyboard(32);

    space.press = (): void => {
      if (gameSceneObject.plasticBag) {
        gameSceneObject.plasticBag.texture = plasticBagJumpTexture;
        gameSceneObject.plasticBag.vy = -5;
      }
    };

    space.release = (): void => {
      if (gameSceneObject.plasticBag) {
        gameSceneObject.plasticBag.texture = plasticBagDownTexture;
        gameSceneObject.plasticBag.vy = 3; // 預設的下降速度
      }
    };

    // 會一直游過來的海洋生物們
    const coralReef = Sprite.from(coralReefImg);
    coralReef.position.set(
      1025,
      app.renderer.height - coralReef.height - gameSceneObject.toolbarContainer.height,
    );
    gameScene.addChild(coralReef);
    (coralReef as MarineLifeI).vx = -2;
    gameSceneObject.marineLife = [
      ...gameSceneObject.marineLife,
      (coralReef as MarineLifeI),
    ];

    const turtle = Sprite.from(turtleImg);
    turtle.position.set(
      1300,
      37,
    );
    gameScene.addChild(turtle);
    (turtle as MarineLifeI).vx = -2;
    gameSceneObject.marineLife = [
      ...gameSceneObject.marineLife,
      (turtle as MarineLifeI),
    ];

    const seahorse = Sprite.from(seahorseImg);
    seahorse.position.set(
      1480,
      500,
    );
    gameScene.addChild(seahorse);
    (seahorse as MarineLifeI).vx = -2;
    gameSceneObject.marineLife = [
      ...gameSceneObject.marineLife,
      (seahorse as MarineLifeI),
    ];

    const coral = Sprite.from(coralImg);
    coral.position.set(
      1725,
      app.renderer.height - coral.height - gameSceneObject.toolbarContainer.height,
    );
    gameScene.addChild(coral);
    (coral as MarineLifeI).vx = -2;
    gameSceneObject.marineLife = [
      ...gameSceneObject.marineLife,
      (coral as MarineLifeI),
    ];

    const fishYellow = Sprite.from(fishYellowImg);
    fishYellow.position.set(
      3000,
      400,
    );
    gameScene.addChild(fishYellow);
    (fishYellow as MarineLifeI).vx = -3;
    gameSceneObject.marineLife = [
      ...gameSceneObject.marineLife,
      (fishYellow as MarineLifeI),
    ];

    const littleTurtle = Sprite.from(littleTurtleImg);
    littleTurtle.position.set(
      2200,
      160,
    );
    gameScene.addChild(littleTurtle);
    (littleTurtle as MarineLifeI).vx = -2;
    gameSceneObject.marineLife = [
      ...gameSceneObject.marineLife,
      (littleTurtle as MarineLifeI),
    ];

    const cheilinus = Sprite.from(cheilinusUndulatusImg);
    cheilinus.position.set(
      2500,
      440,
    );
    gameScene.addChild(cheilinus);
    (cheilinus as MarineLifeI).vx = -2;
    gameSceneObject.marineLife = [
      ...gameSceneObject.marineLife,
      (cheilinus as MarineLifeI),
    ];

    const bolbometopon = Sprite.from(bolbometoponMuricatumImg);
    bolbometopon.position.set(
      2900,
      80,
    );
    gameScene.addChild(bolbometopon);
    (bolbometopon as MarineLifeI).vx = -2;
    gameSceneObject.marineLife = [
      ...gameSceneObject.marineLife,
      (bolbometopon as MarineLifeI),
    ];
  };

  const initKarmaScene = (): void => {
    // 業障列表
    gameKarmaScene = new Container();
    gameKarmaScene.visible = false;
    app.stage.addChild(gameKarmaScene);

    const titleText = new Text('哀呀~業障重阿', createPixelMplusTextStyle(60, '#151D46'));
    titleText.position.set(
      app.renderer.width / 2 - titleText.width / 2,
      40,
    );
    gameKarmaScene.addChild(titleText);

    const subTitleText = new Text('(2/10)', createPixelMplusTextStyle(50, '#151D46'));
    subTitleText.position.set(
      app.renderer.width / 2 - subTitleText.width / 2,
      108,
    );
    gameKarmaScene.addChild(subTitleText);

    // 海洋生物們
    const turtle = Sprite.from(turtleImg);
    turtle.position.set(139, 165);

    const cheilinus = Sprite.from(cheilinusUndulatusImg);
    cheilinus.position.set(485, 217);

    const bolbometopon = Sprite.from(bolbometoponMuricatumImg);
    bolbometopon.position.set(765, 217);

    const seahorse = Sprite.from(seahorseImg);
    seahorse.position.set(1045, 220);

    const littleTurtle = Sprite.from(littleTurtleImg);
    littleTurtle.position.set(233, 400);

    const fishOrange = Sprite.from(fishOrangeImg);
    fishOrange.position.set(484, 405);

    const fishYellow = Sprite.from(fishYellowImg);
    fishYellow.position.set(679, 400);

    const coralReef = Sprite.from(coralReefImg);
    coralReef.position.set(138, 521);

    const anemone = Sprite.from(anemoneImg);
    anemone.position.set(560, 600);

    const coral = Sprite.from(coralImg);
    coral.position.set(720, 521);

    const anemones = Sprite.from(anemonesImg);
    anemones.position.set(897, 391);

    gameKarmaScene.addChild(turtle);
    gameKarmaScene.addChild(cheilinus);
    gameKarmaScene.addChild(bolbometopon);
    gameKarmaScene.addChild(seahorse);
    gameKarmaScene.addChild(littleTurtle);
    gameKarmaScene.addChild(fishOrange);
    gameKarmaScene.addChild(fishYellow);
    gameKarmaScene.addChild(coralReef);
    gameKarmaScene.addChild(anemone);
    gameKarmaScene.addChild(coral);
    gameKarmaScene.addChild(anemones);

    // back 文字 + 框框
    const backButtonGraphic = new Graphics();
    backButtonGraphic.lineStyle(3, 0x151D46, 1);
    backButtonGraphic.drawRect(0, 0, 200, 60);
    backButtonGraphic.endFill();
    backButtonGraphic.hitArea = new Rectangle(
      0, 0, backButtonGraphic.width, backButtonGraphic.height,
    );
    backButtonGraphic.interactive = true;
    backButtonGraphic.buttonMode = true;
    backButtonGraphic.on('click', (): void => {
      sceneState = start;
    });
    backButtonGraphic.position.set(
      app.renderer.width / 2 - backButtonGraphic.width / 2,
      725,
    );
    gameKarmaScene.addChild(backButtonGraphic);

    const backButtonText = new Text('Back', createPixelMplusTextStyle(40, '#151D46'));
    backButtonText.position.set(
      backButtonGraphic.x
        + (backButtonGraphic.width / 2)
        - (backButtonText.width / 2),
      backButtonGraphic.y + backButtonGraphic.height / 2 - backButtonText.height / 2,
    );
    gameKarmaScene.addChild(backButtonText);
  };

  initStartScene();
  initGameScene();
  initKarmaScene();

  // horseTODO: 暫時拿來亂動
  // sceneState = start;

  countdown.setCountdownStatus('play');
  sceneState = play.bind(undefined, 90);

  app.ticker.add((delta: number): void => gameLoop(delta));
};

const loadProgressHandler = (pixiLoader: PIXI.Loader, resource: PIXI.LoaderResource): void => {
  console.log(`loading ${resource.url}`);
  console.log(`progress ${pixiLoader.progress} %`);
};


const init = (): void => {
  new Loader()
    .add('plasticBagDownImg', plasticBagDownImg)
    .add('plasticBagJumpImg', plasticBagJumpImg)
    .add('bgRockImgLeft', bgRockImgLeft)
    .add('bgRockImgCenter', bgRockImgCenter)
    .add('bgRockImgRight', bgRockImgRight)
    .add('turtleImg', turtleImg)
    .add('cheilinusUndulatusImg', cheilinusUndulatusImg)
    .add('bolbometoponMuricatumImg', bolbometoponMuricatumImg)
    .add('seahorseImg', seahorseImg)
    .add('littleTurtleImg', littleTurtleImg)
    .add('fishOrangeImg', fishOrangeImg)
    .add('fishYellowImg', fishYellowImg)
    .add('CoralReefImg', coralReefImg)
    .add('anemoneImg', anemoneImg)
    .add('coralImg', coralImg)
    .add('anemonesImg', anemonesImg)
    .add('bgRocksImg', bgRocksImg)
    .add('bgFishesImg', bgFishesImg)
    .on('progress', loadProgressHandler)
    .load(setup);
};

const font = new FontFaceObserver('regularPixelMplus10');

// 可以確保字型載入後才開始 init，目前不管有沒有成功載入此字型都會繼續跑
font.load().then((): void => {
  init();
}, (): void => {
  init();
});

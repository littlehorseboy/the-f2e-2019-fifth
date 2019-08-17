import 'normalize.css';
import * as PIXI from 'pixi.js';
import uuidv4 from 'uuid/v4';
import keyboard from './assets/js/keyboard';
import store from './reducers/configureStore';
import { addSceneObject, removeAllSceneObject } from './actions/sceneObject/sceneObject';
import { WithPIXIDisplayObject } from './reducers/sceneObject/sceneObject';
import hitTestRectangle from './assets/js/hitTestReactangle';

require('./index.css');

// eslint-disable-next-line @typescript-eslint/no-var-requires
const FontFaceObserver = require('fontfaceobserver');

/* eslint-disable @typescript-eslint/no-var-requires */
const plasticBagDownImg = require('./assets/images/F2E_week5/down.png');
const plasticBagJumpImg = require('./assets/images/F2E_week5/jump.png');
const bgRockImgLeft = require('./assets/images/bg-rock/rock2.png');
const bgRockImgCenter = require('./assets/images/bg-rock/rock3.png');
const bgRockImgRight = require('./assets/images/bg-rock/rock.png');
// swimmingMarineLife
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
// end swimmingMarineLife
const bgRocksImg = require('./assets/images/F2E_week5/bg-rocks.png');
const bgFishesImg = require('./assets/images/F2E_week5/bg-fishes.png');
const endKindPersonImg = require('./assets/images/F2E_week5/end.png');
const kindPersonImg = require('./assets/images/F2E_week5/kindperson.png');
const poorTurtleImg = require('./assets/images/F2E_week5/poor-turtle.png');

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
let endScene: PIXI.Container; // 碰撞後或結束場景
const swimmingMarineLifeIds: string[] = []; // 游泳的海洋生物們 碰撞目標 Id
interface FailDescriptionDialogI {
  failDescription: '大海龜' | '龍王鯛' | '隆頭鸚哥魚' | '黃色小魚' | '橘色小魚' | '海馬'
  | '珊瑚礁' | '珊瑚' | '大海葵' | '海葵' | '小海龜';
  displayObject: PIXI.Container;
}
let failDescriptionDialog: FailDescriptionDialogI[] = [];
let gameKarmaScene: PIXI.Container; // 業障場景

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

function initGameScene(): void {
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

  // toolbar 右下角文字
  const toolbarRightText = new Text('End Distance: 90 M', textStyle);
  toolbarRightText.position.set(
    930,
    toolbarGraphic.height / 2 - toolbarRightText.height / 2,
  );
  toolbarContainer.addChild(toolbarRightText);

  store.dispatch(addSceneObject('gameScene', {
    id: 'toolbarRightText',
    description: '右下角文字',
    displayObject: toolbarRightText,
  }));

  // toolbarLevelTwo Rectangle
  const toolbarLevelTwoGraphic = new Graphics();
  toolbarLevelTwoGraphic.visible = false;
  toolbarLevelTwoGraphic.beginFill(0x151D46);
  toolbarLevelTwoGraphic.lineStyle(1, 0x707070, 1);
  toolbarLevelTwoGraphic.drawRect(0, -80, app.renderer.width, 80);
  toolbarLevelTwoGraphic.endFill();
  toolbarContainer.addChild(toolbarLevelTwoGraphic);

  store.dispatch(addSceneObject('gameScene', {
    id: 'toolbarLevelTwoGraphic',
    description: 'toolbarLevelTwo Rectangle',
    displayObject: toolbarLevelTwoGraphic,
  }));

  // toolbarLevelThree Rectangle
  const toolbarLevelThreeGraphic = new Graphics();
  toolbarLevelThreeGraphic.visible = false;
  toolbarLevelThreeGraphic.beginFill(0x151D46);
  toolbarLevelThreeGraphic.lineStyle(1, 0x707070, 1);
  toolbarLevelThreeGraphic.drawRect(0, -160, app.renderer.width, 80);
  toolbarLevelThreeGraphic.endFill();
  toolbarContainer.addChild(toolbarLevelThreeGraphic);

  store.dispatch(addSceneObject('gameScene', {
    id: 'toolbarLevelThreeGraphic',
    description: 'toolbarLevelTwo Rectangle',
    displayObject: toolbarLevelThreeGraphic,
  }));

  // toolbarContainer 填完內容後最後定位
  toolbarContainer.position.set(
    0,
    app.renderer.height - toolbarGraphic.height,
  );

  gameScene.addChild(toolbarContainer);

  store.dispatch(addSceneObject('gameScene', {
    id: 'toolbarContainer',
    description: 'toolbar container',
    displayObject: toolbarContainer,
  }));

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
  const bgRightFishes = Sprite.from(bgFishesImg);
  bgRightFishes.position.set(640, 80);
  gameScene.addChild(bgRightFishes);

  store.dispatch(addSceneObject('gameScene', {
    id: 'bgRightFishes',
    description: '背景魚群 (右)',
    displayObject: bgRightFishes,
  }));

  // 萬惡的塑膠袋
  const plasticBagDownTexture = Texture.from(plasticBagDownImg); // 下降的樣子
  const plasticBagJumpTexture = Texture.from(plasticBagJumpImg); // 向上跳的樣子
  const plasticBagSprite = Sprite.from(plasticBagDownTexture);
  plasticBagSprite.position.set(
    120,
    app.renderer.height / 2 - plasticBagSprite.height / 2,
  );
  gameScene.addChild(plasticBagSprite);

  store.dispatch(addSceneObject('gameScene', {
    id: 'plasticBag',
    description: '萬惡的塑膠袋',
    displayObject: plasticBagSprite,
    vy: 3, // 預設的下降速度
  }));


  // 鍵盤控制萬惡的塑膠袋
  const space = keyboard(32);

  space.press = (): void => {
    const state = store.getState();
    const plasticBag = state.sceneObjectReducer.gameScene
      .find((withPIXIDisplayObject: WithPIXIDisplayObject): boolean => withPIXIDisplayObject.id === 'plasticBag');
    if (plasticBag) {
      (plasticBag.displayObject as PIXI.Sprite).texture = plasticBagJumpTexture;
      plasticBag.vy = -5; // 按下空白的上升速度
    }
  };

  space.release = (): void => {
    const state = store.getState();
    const plasticBag = state.sceneObjectReducer.gameScene
      .find((withPIXIDisplayObject: WithPIXIDisplayObject): boolean => withPIXIDisplayObject.id === 'plasticBag');
    if (plasticBag) {
      (plasticBag.displayObject as PIXI.Sprite).texture = plasticBagDownTexture;
      plasticBag.vy = 3; // 預設的下降速度
    }
  };

  // 會一直游過來的海洋生物們
  interface CreateSwimmingMarineLifeI {
    imgSrc: string;
    positionX: number;
    positionY: number;
    description: string;
    vx: number;
  }
  /**
   * 創造一直往左游的海洋生物，加進 gameScene 場景，創建 Id，push 進 swimmingMarineLifeIds，加進 redux store
   * @param {string} params.imgSrc 圖片路徑，用來產生 PIXI.Sprite
   * @param {string} params.positionX x
   * @param {string} params.positionY y
   * @param {string} params.description 描述
   * @param {string} params.vx 向左游的速度
   */
  const createSwimmingMarineLife = (params: CreateSwimmingMarineLifeI): void => {
    const sprite = Sprite.from(params.imgSrc);
    sprite.position.set(
      params.positionX,
      params.positionY,
    );
    gameScene.addChild(sprite);

    const id = `sprite-${uuidv4()}`;
    swimmingMarineLifeIds.push(id);
    store.dispatch(addSceneObject('gameScene', {
      id,
      description: params.description,
      displayObject: sprite,
      vx: params.vx,
    }));
  };

  // 向左游的基本速度 (通常是小魚會在 - 1 讓他快一些)
  const baseVx = -2;

  createSwimmingMarineLife({
    imgSrc: littleTurtleImg,
    positionX: 200,
    positionY: app.renderer.height,
    description: '小海龜',
    vx: baseVx,
  });
  createSwimmingMarineLife({
    imgSrc: fishOrangeImg,
    positionX: 450,
    positionY: 100,
    description: '橘色小魚',
    vx: baseVx - 1,
  });
  createSwimmingMarineLife({
    imgSrc: fishYellowImg,
    positionX: 500,
    positionY: 190,
    description: '黃色小魚',
    vx: baseVx - 1,
  });
  createSwimmingMarineLife({
    imgSrc: fishYellowImg,
    positionX: 600,
    positionY: 80,
    description: '黃色小魚',
    vx: baseVx - 1,
  });
  createSwimmingMarineLife({
    imgSrc: fishOrangeImg,
    positionX: 690,
    positionY: 160,
    description: '橘色小魚',
    vx: baseVx - 2,
  });
  createSwimmingMarineLife({
    imgSrc: fishYellowImg,
    positionX: 780,
    positionY: 40,
    description: '黃色小魚',
    vx: baseVx - 2,
  });
  createSwimmingMarineLife({
    imgSrc: anemoneImg,
    positionX: 800,
    positionY: app.renderer.height,
    description: '海葵',
    vx: baseVx + 0.5,
  });
  createSwimmingMarineLife({
    imgSrc: coralReefImg,
    positionX: 1025,
    positionY: app.renderer.height,
    description: '珊瑚礁',
    vx: baseVx + 0.5,
  });
  createSwimmingMarineLife({
    imgSrc: turtleImg,
    positionX: 1300,
    positionY: 37,
    description: '大海龜',
    vx: baseVx,
  });
  createSwimmingMarineLife({
    imgSrc: seahorseImg,
    positionX: 1480,
    positionY: 500,
    description: '海馬',
    vx: baseVx,
  });
  createSwimmingMarineLife({
    imgSrc: coralImg,
    positionX: 1725,
    positionY: app.renderer.height,
    description: '珊瑚',
    vx: baseVx + 0.5,
  });
  createSwimmingMarineLife({
    imgSrc: fishYellowImg,
    positionX: 3000,
    positionY: 400,
    description: '黃色小魚',
    vx: baseVx - 1,
  });
  createSwimmingMarineLife({
    imgSrc: fishOrangeImg,
    positionX: 3150,
    positionY: 390,
    description: '橘色小魚',
    vx: baseVx - 1,
  });
  createSwimmingMarineLife({
    imgSrc: fishYellowImg,
    positionX: 2200,
    positionY: 60,
    description: '黃色小魚',
    vx: baseVx,
  });
  createSwimmingMarineLife({
    imgSrc: cheilinusUndulatusImg,
    positionX: 2500,
    positionY: 410,
    description: '龍王鯛',
    vx: baseVx,
  });
  createSwimmingMarineLife({
    imgSrc: bolbometoponMuricatumImg,
    positionX: 2900,
    positionY: 80,
    description: '隆頭鸚哥魚',
    vx: baseVx,
  });
  createSwimmingMarineLife({
    imgSrc: fishOrangeImg,
    positionX: 5000,
    positionY: app.renderer.height - 200,
    description: '橘色小魚',
    vx: baseVx - 3,
  });
  createSwimmingMarineLife({
    imgSrc: anemoneImg,
    positionX: 3100,
    positionY: app.renderer.height,
    description: '海葵',
    vx: baseVx + 0.5,
  });
  createSwimmingMarineLife({
    imgSrc: anemonesImg,
    positionX: 3300,
    positionY: app.renderer.height,
    description: '大海葵',
    vx: baseVx + 0.5,
  });
  createSwimmingMarineLife({
    imgSrc: anemoneImg,
    positionX: 3800,
    positionY: app.renderer.height,
    description: '海葵',
    vx: baseVx + 0.5,
  });
  createSwimmingMarineLife({
    imgSrc: fishYellowImg,
    positionX: 4800,
    positionY: 400,
    description: '黃色小魚',
    vx: baseVx - 1,
  });
  createSwimmingMarineLife({
    imgSrc: fishOrangeImg,
    positionX: 4950,
    positionY: 390,
    description: '橘色小魚',
    vx: baseVx - 1,
  });
  createSwimmingMarineLife({
    imgSrc: cheilinusUndulatusImg,
    positionX: 3500,
    positionY: 120,
    description: '龍王鯛',
    vx: baseVx,
  });
  createSwimmingMarineLife({
    imgSrc: littleTurtleImg,
    positionX: 3800,
    positionY: 100,
    description: '小海龜',
    vx: baseVx,
  });
  createSwimmingMarineLife({
    imgSrc: seahorseImg,
    positionX: 3900,
    positionY: 480,
    description: '海馬',
    vx: baseVx,
  });
  createSwimmingMarineLife({
    imgSrc: coralReefImg,
    positionX: 3800,
    positionY: app.renderer.height,
    description: '珊瑚礁',
    vx: baseVx + 0.5,
  });
  createSwimmingMarineLife({
    imgSrc: turtleImg,
    positionX: 4900,
    positionY: 37,
    description: '大海龜',
    vx: baseVx,
  });
  createSwimmingMarineLife({
    imgSrc: fishYellowImg,
    positionX: 10000,
    positionY: 400,
    description: '黃色小魚',
    vx: baseVx - 3,
  });

  createSwimmingMarineLife({
    imgSrc: endKindPersonImg,
    positionX: 11000,
    positionY: 200,
    description: '終點',
    vx: baseVx,
  });

  const initOverlap = (): void => {
    const overlapContainer = new Container();
    overlapContainer.visible = false;
    gameScene.addChild(overlapContainer);

    store.dispatch(addSceneObject('gameScene', {
      id: 'overlapContainer',
      description: 'overlap container',
      displayObject: overlapContainer,
    }));

    // 小視窗背景
    const overlapBackground = new Graphics();
    overlapBackground.alpha = 0.6;
    overlapBackground.beginFill(0x000000);
    overlapBackground.drawRect(0, 0, app.renderer.width, app.renderer.height);
    overlapBackground.endFill();
    overlapContainer.addChild(overlapBackground);

    interface DescriptionDialogParamsI {
      width: number;
      height: number;
      imgSrc?: string;
      titleText: string;
      subTitleText: string;
      subTitle2Text?: string;
    }

    const createDescriptionDialog = (params: DescriptionDialogParamsI): PIXI.Container => {
      // 小視窗 Container
      const dialogContainer = new Container();
      dialogContainer.visible = false;

      // 小視窗
      const dialog = new Graphics();
      dialog.alpha = 0.8;
      dialog.beginFill(0x000000);
      dialog.lineStyle(1, 0x707070, 1);
      dialog.drawRect(0, 0, params.width, params.height);
      dialog.endFill();
      dialogContainer.addChild(dialog);

      const dialogBodyContainer = new Container();

      const dialogTitle = new Text(params.titleText, createPixelMplusTextStyle(60, '#FF5555'));
      dialogTitle.position.set(
        dialog.width / 2 - dialogTitle.width / 2,
        54,
      );
      dialogBodyContainer.addChild(dialogTitle);

      const dialogSubTitle = new Text(params.subTitleText, new TextStyle({
        fontFamily: 'system-ui, -apple-system, "Roboto", "Helvetica", "Arial", sans-serif',
        fontSize: 40,
        fill: '#FFFFFF',
      }));
      dialogSubTitle.position.set(
        dialog.width / 2 - dialogSubTitle.width / 2,
        143,
      );
      dialogBodyContainer.addChild(dialogSubTitle);

      if (params.subTitle2Text) {
        const dialogSubTitle2 = new Text(params.subTitle2Text, new TextStyle({
          fontFamily: 'system-ui, -apple-system, "Roboto", "Helvetica", "Arial", sans-serif',
          fontSize: 40,
          fill: '#FFFFFF',
        }));
        dialogSubTitle2.position.set(
          dialog.width / 2 - dialogSubTitle2.width / 2,
          193,
        );
        dialogBodyContainer.addChild(dialogSubTitle2);
      }

      // AgainButtonContainer
      const AgainButtonContainer = new Container();

      // 按鈕 Rectangle
      const AgainButtonGraphic = new Graphics();
      AgainButtonGraphic.lineStyle(5, 0xFFFFFF, 1);
      AgainButtonGraphic.drawRect(0, 0, 200, 80);
      AgainButtonGraphic.endFill();
      AgainButtonGraphic.hitArea = new Rectangle(0, 0, 240, 80);
      AgainButtonGraphic.interactive = true;
      AgainButtonGraphic.buttonMode = true;
      AgainButtonGraphic.on('click', (): void => {
        countdown.setCountdownStatus('stop');
        countdown.setCountdownStatus('play');
        gameScene.parent.removeChild(gameScene);
        store.dispatch(removeAllSceneObject('gameScene'));
        failDescriptionDialog = [];
        initGameScene();
        endScene.parent.removeChild(endScene);
        initEndScene(); // eslint-disable-line @typescript-eslint/no-use-before-define
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        sceneState = play.bind(undefined, 90);
      });
      AgainButtonContainer.addChild(AgainButtonGraphic);

      // 按鈕文字
      const AgainButtonText = new Text('Again', createPixelMplusTextStyle(56));
      AgainButtonText.position.set(
        AgainButtonGraphic.width / 2 - AgainButtonText.width / 2,
        AgainButtonGraphic.height / 2 - AgainButtonText.height / 2,
      );
      AgainButtonContainer.addChild(AgainButtonText);

      // AgainButtonContainer 填完內容後最後定位
      AgainButtonContainer.position.set(
        dialog.width / 2 - AgainButtonContainer.width / 2,
        252,
      );

      dialogBodyContainer.addChild(AgainButtonContainer);

      let sprite: PIXI.Sprite;
      if (params.imgSrc) {
        sprite = Sprite.from(params.imgSrc);
        sprite.position.set(
          dialog.width / 2 - sprite.width / 2,
          30,
        );
        dialogContainer.addChild(sprite);

        dialogBodyContainer.position.set(
          dialogBodyContainer.x,
          sprite.height,
        );
      }

      dialogContainer.addChild(dialogBodyContainer);

      // dialogContainer 填完內容後最後定位
      dialogContainer.position.set(
        app.renderer.width / 2 - dialogContainer.width / 2,
        app.renderer.height / 2 - dialogContainer.height / 2,
      );

      return dialogContainer;
    };

    const turtleContainer = createDescriptionDialog({
      width: 700,
      height: 400,
      titleText: '殺死海龜了!',
      subTitleText: '海龜會吃水母的',
    });
    failDescriptionDialog.push({
      failDescription: '大海龜',
      displayObject: turtleContainer,
    });
    overlapContainer.addChild(turtleContainer);

    const cheilinusUndulatusContainer = createDescriptionDialog({
      width: 700,
      height: 400,
      titleText: '殺死龍王鯛了!',
      subTitleText: '龍王鯛原名曲紋唇魚',
      subTitle2Text: '是保育類 剩不到10隻阿',
    });
    failDescriptionDialog.push({
      failDescription: '龍王鯛',
      displayObject: cheilinusUndulatusContainer,
    });
    overlapContainer.addChild(cheilinusUndulatusContainer);

    const bolbometoponMuricatumContainer = createDescriptionDialog({
      width: 700,
      height: 400,
      titleText: '殺死隆頭鸚哥魚了!',
      subTitleText: '隆頭鸚哥魚是保育類',
      subTitle2Text: '剩不到10隻阿',
    });
    failDescriptionDialog.push({
      failDescription: '隆頭鸚哥魚',
      displayObject: bolbometoponMuricatumContainer,
    });
    overlapContainer.addChild(bolbometoponMuricatumContainer);

    const fishYellowContainer = createDescriptionDialog({
      width: 700,
      height: 400,
      titleText: '殺死黃色小魚了!',
      subTitleText: '不知道是甚麼品種的小魚',
    });
    failDescriptionDialog.push({
      failDescription: '黃色小魚',
      displayObject: fishYellowContainer,
    });
    overlapContainer.addChild(fishYellowContainer);

    const fishOrangeContainer = createDescriptionDialog({
      width: 700,
      height: 400,
      titleText: '殺死橘色小魚了!',
      subTitleText: '不知道是甚麼品種的小魚',
    });
    failDescriptionDialog.push({
      failDescription: '橘色小魚',
      displayObject: fishOrangeContainer,
    });
    overlapContainer.addChild(fishOrangeContainer);

    const seahorseContainer = createDescriptionDialog({
      width: 700,
      height: 400,
      titleText: '殺死海馬了!',
      subTitleText: '海馬被纏住窒息而死',
    });
    failDescriptionDialog.push({
      failDescription: '海馬',
      displayObject: seahorseContainer,
    });
    overlapContainer.addChild(seahorseContainer);

    const coralReefContainer = createDescriptionDialog({
      width: 700,
      height: 400,
      titleText: '殺死珊瑚了!',
      subTitleText: '珊瑚被纏住 窒息而死',
    });
    failDescriptionDialog.push({
      failDescription: '珊瑚礁',
      displayObject: coralReefContainer,
    });
    overlapContainer.addChild(coralReefContainer);

    const coralContainer = createDescriptionDialog({
      width: 700,
      height: 400,
      titleText: '殺死珊瑚了!',
      subTitleText: '珊瑚被纏住 窒息而死',
    });
    failDescriptionDialog.push({
      failDescription: '珊瑚',
      displayObject: coralContainer,
    });
    overlapContainer.addChild(coralContainer);

    const anemonesContainer = createDescriptionDialog({
      width: 700,
      height: 400,
      titleText: '殺死海葵了!',
      subTitleText: '海葵被纏住 窒息而死',
    });
    failDescriptionDialog.push({
      failDescription: '大海葵',
      displayObject: anemonesContainer,
    });
    overlapContainer.addChild(anemonesContainer);

    const anemoneContainer = createDescriptionDialog({
      width: 700,
      height: 400,
      titleText: '殺死海葵了!',
      subTitleText: '海葵被纏住 窒息而死',
    });
    failDescriptionDialog.push({
      failDescription: '海葵',
      displayObject: anemoneContainer,
    });
    overlapContainer.addChild(anemoneContainer);

    const littleTurtleContainer = createDescriptionDialog({
      width: 700,
      height: 480,
      imgSrc: poorTurtleImg,
      titleText: '海龜一生都不開心',
      subTitleText: '你一生陪著小海龜',
      subTitle2Text: '綁在海龜的肚子上...',
    });
    failDescriptionDialog.push({
      failDescription: '小海龜',
      displayObject: littleTurtleContainer,
    });
    overlapContainer.addChild(littleTurtleContainer);
  };

  initOverlap();
}

// 初始化結束場景
function initEndScene(): void {
  endScene = new Container();
  endScene.visible = false;
  app.stage.addChild(endScene);

  const endOverlapContainer = new Container();
  endScene.addChild(endOverlapContainer);

  // 整片背景微透明黑
  const overlapBackground = new Graphics();
  overlapBackground.alpha = 0.9;
  overlapBackground.beginFill(0x000000);
  overlapBackground.drawRect(0, 0, app.renderer.width, app.renderer.height);
  overlapBackground.endFill();

  endOverlapContainer.addChild(overlapBackground);

  // kindPerson
  const kindPerson = Sprite.from(kindPersonImg);
  kindPerson.position.set(
    app.renderer.width / 2 - kindPerson.width / 2,
    8,
  );
  endOverlapContainer.addChild(kindPerson);

  const title = new Text('恭喜!    被好心人收走', createPixelMplusTextStyle(60, '#FFDF55'));
  title.position.set(
    app.renderer.width / 2 - title.width / 2,
    369,
  );
  endOverlapContainer.addChild(title);

  const subTitle = new Text('只有少數垃圾能被撿走', new TextStyle({
    fontFamily: 'system-ui, -apple-system, "Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 40,
    fill: '#FFFFFF',
  }));
  subTitle.position.set(
    app.renderer.width / 2 - subTitle.width / 2,
    460,
  );
  endOverlapContainer.addChild(subTitle);

  const subTitleTwo = new Text('減少源頭 少用塑膠用品 才是最有效的', new TextStyle({
    fontFamily: 'system-ui, -apple-system, "Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 40,
    fill: '#FFFFFF',
  }));
  subTitleTwo.position.set(
    app.renderer.width / 2 - subTitleTwo.width / 2,
    512,
  );
  endOverlapContainer.addChild(subTitleTwo);

  // AgainButtonContainer
  const AgainButtonContainer = new Container();

  // 按鈕 Rectangle
  const AgainButtonGraphic = new Graphics();
  AgainButtonGraphic.lineStyle(5, 0xFFFFFF, 1);
  AgainButtonGraphic.drawRect(0, 0, 200, 80);
  AgainButtonGraphic.endFill();
  AgainButtonGraphic.hitArea = new Rectangle(0, 0, 240, 80);
  AgainButtonGraphic.interactive = true;
  AgainButtonGraphic.buttonMode = true;
  AgainButtonGraphic.on('click', (): void => {
    countdown.setCountdownStatus('stop');
    countdown.setCountdownStatus('play');
    gameScene.parent.removeChild(gameScene);
    store.dispatch(removeAllSceneObject('gameScene'));
    failDescriptionDialog = [];
    initGameScene();
    endScene.parent.removeChild(endScene);
    initEndScene(); // eslint-disable-line @typescript-eslint/no-use-before-define
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    sceneState = play.bind(undefined, 90);
  });
  AgainButtonContainer.addChild(AgainButtonGraphic);

  // 按鈕文字
  const AgainButtonText = new Text('Again', createPixelMplusTextStyle(56));
  AgainButtonText.position.set(
    AgainButtonGraphic.width / 2 - AgainButtonText.width / 2,
    AgainButtonGraphic.height / 2 - AgainButtonText.height / 2,
  );
  AgainButtonContainer.addChild(AgainButtonText);

  // AgainButtonContainer 填完內容後最後定位
  AgainButtonContainer.position.set(
    app.renderer.width / 2 - AgainButtonContainer.width / 2,
    600,
  );

  endOverlapContainer.addChild(AgainButtonContainer);
}

const end = (
  status: 'done' | 'fail',
  failDescription: '大海龜' | '龍王鯛' | '隆頭鸚哥魚' | '黃色小魚' | '橘色小魚' | '海馬'
  | '珊瑚礁' | '珊瑚' | '大海葵' | '海葵' | '小海龜',
  delta: number,
): void => {
  if (status === 'done') {
    endScene.visible = true;
  } else {
    const state = store.getState();
    const overlapContainer = state.sceneObjectReducer.gameScene
      .find((withPIXIDisplayObject: WithPIXIDisplayObject): boolean => withPIXIDisplayObject.id === 'overlapContainer');
    if (overlapContainer) {
      const dialog = failDescriptionDialog.find(
        (descriptionDialog): boolean => descriptionDialog.failDescription === failDescription,
      );

      if (dialog) {
        dialog.displayObject.visible = true;
      }

      overlapContainer.displayObject.visible = true;
    }
  }
};

const karma = (): void => {
  if (gameStartScene.visible) {
    gameStartScene.visible = false;
  }
  if (!gameKarmaScene.visible) {
    gameKarmaScene.visible = true;
  }
};

function play(distance: number, delta: number): void {
  const state = store.getState();

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

  const background90 = state.sceneObjectReducer.gameScene
    .find((withPIXIDisplayObject: WithPIXIDisplayObject): boolean => withPIXIDisplayObject.id === 'background90');
  const background60 = state.sceneObjectReducer.gameScene
    .find((withPIXIDisplayObject: WithPIXIDisplayObject): boolean => withPIXIDisplayObject.id === 'background60');
  const background30 = state.sceneObjectReducer.gameScene
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

  const toolbarLevelTwoGraphic = state.sceneObjectReducer.gameScene
    .find((withPIXIDisplayObject: WithPIXIDisplayObject): boolean => withPIXIDisplayObject.id === 'toolbarLevelTwoGraphic');
  const toolbarLevelThreeGraphic = state.sceneObjectReducer.gameScene
    .find((withPIXIDisplayObject: WithPIXIDisplayObject): boolean => withPIXIDisplayObject.id === 'toolbarLevelThreeGraphic');

  if (
    toolbarLevelTwoGraphic && toolbarLevelThreeGraphic
  ) {
    if (distance <= 30) {
      toolbarLevelThreeGraphic.displayObject.visible = true;
    } else if (distance <= 60) {
      toolbarLevelTwoGraphic.displayObject.visible = true;
    }
  }

  const toolbarContainer = state.sceneObjectReducer.gameScene
    .find((withPIXIDisplayObject: WithPIXIDisplayObject): boolean => withPIXIDisplayObject.id === 'toolbarContainer');

  const bgRocks = state.sceneObjectReducer.gameScene
    .find((withPIXIDisplayObject: WithPIXIDisplayObject): boolean => withPIXIDisplayObject.id === 'bgRocks');

  if (bgRocks) {
    if (toolbarContainer) {
      bgRocks.displayObject.position.set(
        0,
        app.renderer.height - bgRocks.displayObject.height
          - toolbarContainer.displayObject.height,
      );
    }
    (bgRocks.displayObject as PIXI.TilingSprite).tilePosition.set(
      (bgRocks.displayObject as PIXI.TilingSprite).tilePosition.x - 0.5,
      (bgRocks.displayObject as PIXI.TilingSprite).tilePosition.y,
    );
  }

  const bgLeftFishes = state.sceneObjectReducer.gameScene
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

  const bgRightFishes = state.sceneObjectReducer.gameScene
    .find((withPIXIDisplayObject: WithPIXIDisplayObject): boolean => withPIXIDisplayObject.id === 'bgRightFishes');

  if (bgRightFishes) {
    bgRightFishes.displayObject.position.set(
      bgRightFishes.displayObject.x - 3,
      bgRightFishes.displayObject.y,
    );
    if (bgRightFishes.displayObject.x < 0 - bgRightFishes.displayObject.width) {
      bgRightFishes.displayObject.x = app.renderer.width + bgRightFishes.displayObject.width;
    }
  }

  const toolbarRightText = state.sceneObjectReducer.gameScene
    .find((withPIXIDisplayObject: WithPIXIDisplayObject): boolean => withPIXIDisplayObject.id === 'toolbarRightText');

  if (toolbarRightText) {
    (toolbarRightText.displayObject as PIXI.Text).text = `End Distance: ${countdown.seconds} M`;
  }

  const plasticBag = state.sceneObjectReducer.gameScene
    .find((withPIXIDisplayObject: WithPIXIDisplayObject): boolean => withPIXIDisplayObject.id === 'plasticBag');

  if (plasticBag && plasticBag.vy) {
    // 按空白時 向上移動
    // y 不能小於 0，且 vy 加速度是負數
    if (plasticBag.displayObject.y > 0 && plasticBag.vy < 0) {
      plasticBag.displayObject.y += plasticBag.vy;
    }

    // 自動下墜
    if (toolbarContainer) {
      if (
        plasticBag.displayObject.y
          > app.renderer.height
            - plasticBag.displayObject.height
            - toolbarContainer.displayObject.height
      ) {
        plasticBag.displayObject.y = app.renderer.height
          - plasticBag.displayObject.height
          - toolbarContainer.displayObject.height;
        plasticBag.displayObject.y += plasticBag.vy;
      } else if (plasticBag.vy > 0) {
        plasticBag.displayObject.y += plasticBag.vy;
      }
    }
  }

  // 游泳海洋生物 (有被記錄 Id 的) 向左游
  state.sceneObjectReducer.gameScene.forEach((marineLife): void => {
    if (swimmingMarineLifeIds.includes(marineLife.id)) {
      if (marineLife.vx) {
        Object.assign(marineLife.displayObject, {
          x: marineLife.displayObject.x + marineLife.vx,
        });
      }

      // 萬惡塑膠袋與游泳海洋生物或終點發生碰撞
      if (
        plasticBag && hitTestRectangle(
          (marineLife.displayObject as PIXI.Sprite),
          (plasticBag.displayObject as PIXI.Sprite),
          -50,
          -50,
        )
      ) {
        if (marineLife.description === '終點') {
          sceneState = end.bind(undefined, 'done', undefined);
        } else {
          // sceneState = end.bind(undefined, 'fail', marineLife.description);
        }
      }

      // 每次檢查海洋生物們及 toolbarContainer 的高度來提升難度
      if (
        toolbarContainer
          && (marineLife.displayObject.y + marineLife.displayObject.height)
            >= (app.renderer.height - toolbarContainer.displayObject.height)
      ) {
        Object.assign(marineLife.displayObject, {
          y: app.renderer.height
            - toolbarContainer.displayObject.height
            - marineLife.displayObject.height,
        });
      }
    }
  });
}

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
  initEndScene();
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
    .add('endKindPersonImg', endKindPersonImg)
    .add('kindPersonImg', kindPersonImg)
    .add('poorTurtleImg', poorTurtleImg)
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

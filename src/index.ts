import 'normalize.css';
import * as PIXI from 'pixi.js';

require('./index.css');

// eslint-disable-next-line @typescript-eslint/no-var-requires
const FontFaceObserver = require('fontfaceobserver');

// eslint-disable-next-line @typescript-eslint/no-var-requires
const bgFarImg = require('./assets/images/bg-far.png');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bgMidImg = require('./assets/images/bg-mid.png');

const {
  Application,
  Loader,
  Container,
  Sprite,
  Graphics,
  Rectangle,
  Text,
  Texture,
  TilingSprite,
} = PIXI;

const app = new Application({
  antialias: true,
  width: 1280,
  height: 800,
});

document.body.appendChild(app.view);

let state: (delta: number) => void; // 遊戲場景狀態
let gameStartScene: PIXI.Container; // 遊戲開始畫面場景
let gameScene: PIXI.Container; // 遊戲場景
let gameKarmaScene: PIXI.Container; // 業障場景
let gameStartToNext = false;
let gameStartToKarma = false;
let bgFar: PIXI.TilingSprite;
let bgMid: PIXI.TilingSprite;

const end = (): void => {

};

const play = (delta: number): void => {
  bgFar.tilePosition.set(bgFar.tilePosition.x - 0.128, bgFar.tilePosition.y);
  bgMid.tilePosition.set(bgMid.tilePosition.x - 0.64, bgMid.tilePosition.y);
};

const start = (): void => {
  if (gameStartToNext) {
    gameStartScene.visible = false;
    gameScene.visible = true;

    state = play;
  }

  if (gameStartToKarma) {
    gameStartScene.visible = false;
    gameKarmaScene.visible = true;

    state = play;
  }
};

const gameLoop = (delta: number): void => {
  state(delta);
};

// 創造由上而下的漸層背景
const createGradTexture = (): PIXI.Texture => {
  const quality = 256;
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = quality;
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

  const grd = ctx.createLinearGradient(0, 0, 0, quality);
  grd.addColorStop(0, '#9FEFFF');
  grd.addColorStop(1, '#36479C');

  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, 1, quality);

  return Texture.from(canvas);
};

const setup = (pixiLoader: PIXI.Loader, resource: PIXI.LoaderResource): void => {
  // global gameStartScene 遊戲開始畫面場景
  gameStartScene = new Container();
  app.stage.addChild(gameStartScene);

  const initStartScene = (): void => {
    const background = (): void => {
      // 背景
      const gradTexture = createGradTexture();
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
      const textStyle = new PIXI.TextStyle({
        fontFamily: 'regularPixelMplus10',
        fontSize: 78,
        fill: '#FFFFFF',
      });

      const titleText = new Text('海底拉基大冒險', textStyle);
      titleText.position.set(
        titleGraphic.width / 2 - titleText.width / 2,
        titleGraphic.height / 2 - titleText.height / 2,
      );
      titleContainer.addChild(titleText);

      // titleContainer 填完內容後再次定位
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
        gameStartToNext = true;
      });
      startButtonContainer.addChild(startButtonGraphic);

      // 按鈕文字
      const textStyle = new PIXI.TextStyle({
        fontFamily: 'regularPixelMplus10',
        fontSize: 56,
        fill: '#FFFFFF',
      });

      const startButtonText = new Text('Start', textStyle);
      startButtonText.position.set(
        startButtonGraphic.width / 2 - startButtonText.width / 2,
        startButtonGraphic.height / 2 - startButtonText.height / 2,
      );
      startButtonContainer.addChild(startButtonText);

      // startButtonContainer 填完內容後再次定位
      startButtonContainer.position.set(
        app.renderer.width / 2 - startButtonContainer.width / 2,
        466,
      );

      gameStartScene.addChild(startButtonContainer);
    };

    const karmaButton = (): void => {
      // 業障文字 兼 按鈕
      const textStyle = new PIXI.TextStyle({
        fontFamily: 'regularPixelMplus10',
        fontSize: 56,
        fill: '#FFFFFF',
      });

      const karmaButtonText = new Text('業障', textStyle);
      karmaButtonText.position.set(
        app.renderer.width / 2 - karmaButtonText.width / 2,
        585,
      );
      karmaButtonText.hitArea = new Rectangle(0, 0, karmaButtonText.width, karmaButtonText.height);
      karmaButtonText.interactive = true;
      karmaButtonText.buttonMode = true;
      karmaButtonText.on('click', (): void => {
        gameStartToKarma = true;
      });

      gameStartScene.addChild(karmaButtonText);
    };

    // toolbarContainer
    const toolbarContainer = new Container();

    // 按鈕 Rectangle
    const toolbarGraphic = new Graphics();
    toolbarGraphic.lineStyle(1, 0x707070, 1);
    toolbarGraphic.beginFill(0x151D46);
    toolbarGraphic.drawRect(0, 0, app.renderer.width, 80);
    toolbarGraphic.endFill();
    toolbarGraphic.interactive = true;
    toolbarGraphic.buttonMode = true;
    toolbarGraphic.on('click', (): void => {
      gameStartToNext = true;
    });
    toolbarContainer.addChild(toolbarGraphic);

    // 按鈕文字
    const textStyle = new PIXI.TextStyle({
      fontFamily: 'regularPixelMplus10',
      fontSize: 56,
      fill: '#FFFFFF',
    });

    const startButtonText = new Text('Start', textStyle);
    startButtonText.position.set(
      toolbarGraphic.width / 2 - startButtonText.width / 2,
      toolbarGraphic.height / 2 - startButtonText.height / 2,
    );
    toolbarContainer.addChild(startButtonText);

    // startButtonContainer 填完內容後再次定位
    toolbarContainer.position.set(
      0,
      app.renderer.height - toolbarGraphic.height,
    );

    gameStartScene.addChild(toolbarContainer);

    background();
    title();
    startButton();
    karmaButton();
  };

  initStartScene();

  // global gameScene 遊戲區
  gameScene = new Container();
  gameScene.visible = false;
  app.stage.addChild(gameScene);

  const farTexture = Texture.from(bgFarImg);
  bgFar = new TilingSprite(
    farTexture,
    farTexture.baseTexture.width,
    farTexture.baseTexture.height,
  );
  gameScene.addChild(bgFar);

  const midTexture = Texture.from(bgMidImg);
  bgMid = new TilingSprite(
    midTexture,
    midTexture.baseTexture.width,
    midTexture.baseTexture.height,
  );
  bgMid.position.set(0, 128);
  gameScene.addChild(bgMid);

  state = start;

  app.ticker.add((delta: number): void => gameLoop(delta));
};

const loadProgressHandler = (pixiLoader: PIXI.Loader, resource: PIXI.LoaderResource): void => {
  console.log(`loading ${resource.url}`);
  console.log(`progress ${pixiLoader.progress} %`);
};


const init = (): void => {
  new Loader()
    .add('bgFarImg', bgFarImg)
    .add('bgMidImg', bgMidImg)
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

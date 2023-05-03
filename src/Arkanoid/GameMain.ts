//============================================================================
//
// 名稱：主程式物件.
//
//============================================================================
import * as PIXI from 'pixi.js';
import {BasicCore} from './BasicCore';
import {LoaderResource,LOADER_MODE} from './LoaderResource';
import {Background, BACKGROUND_STYLE} from './Background';
import {GameRound} from './GameRound';
import {GAME_ROUND} from './Round';
import {Ball} from './Ball';
import {Board} from './Board';
import {GameData, TOUCHE_STATE} from './GameData';
import {Transitions} from './Transitions';
import {King} from './King';
import {Sound, SOUND_TYPE} from './Sound';

// 遊戲模式.
export enum GAME_MODE {
    GAME_OVER=0,                // 遊戲結束.
    READY,                      // 準備開始.
    GAME_START,                 // 開始遊戲.
    IN_GAME,                    // 遊戲中.
    NEXT_ROUND,                 // 下個關卡.
    TRANSITIONS,                // 轉場中.
    BALL_OUT,                   // 球掉落底線.
    PLAY_TO_EXPLOSION           // 破關. 
}

export class GameMain{
    // 背景.    
    public background:Array<Background>=[];
    // 關卡.
    public gameLevel:Array<GameRound>=[];
    // 球.
    public ball:Array<Ball>=[];
    // 板子.
    public board:Array<Board>=[];
    // 過場.
    public transitions:Array<Transitions>=[];
    // 王.
    public king:Array<King>=[];
        
    // 音樂、音效.
    //public sound:Sound;

    // pixi物件.
    private _pixi:PIXI.Application;

    // 執行FPS時間.
    private _fpsTick:number=new Date().getTime();    
    // 執行主迴圈FPS時間.
    private _fpsLoopTick:number=new Date().getTime();    
    // 執行READY時間.
    private _readyTick:number=new Date().getTime();    
    // 執行下個關卡時間.
    private _nextRoundTick:number=new Date().getTime();    

    // FPS.
    //private _fpsStyle:PIXI.TextStyle;
    //private _fpsText:PIXI.Text;
    private _fpsText:Array<PIXI.BitmapText>=[];
    private _fps:number=0;

    // 介面字風格.
    //private _uiFontStyle:PIXI.TextStyle;
    // 文字-最高分.
    //private _highScoreText:PIXI.Text;
    private _highScoreText:Array<PIXI.BitmapText>=[];
    // 文字-分數.
    //private _scoreText:PIXI.Text;
    private _scoreText:Array<PIXI.BitmapText>=[];
    // 文字-關卡.
    //private _roundText:PIXI.Text;
    private _roundText:Array<PIXI.BitmapText>=[];
    // 文字-準備.
    //private _readyStyle:Array<PIXI.TextStyle>;
    private _readyText:Array<PIXI.BitmapText>=[];

    // FPS開關.
    private _fpsSwitch:boolean = false;
    // 除錯開關.
    private _debugSwitch:boolean = false;
    
    // 遊戲狀態.
    private _gameMode:GAME_MODE = GAME_MODE.GAME_OVER;    

    // 按鍵狀態.
    // 0:左.
    // 1:右.
    // 2:空白鍵.
    // 3:Enter.
    private KeyState:Array<boolean>=[false,false,false,false];

    // 碰撞磚塊編號.
    private _brickId:number = -1;

    //--------------------------------------------------------------------------
    // FPS開關.
    //--------------------------------------------------------------------------
    public set fps(v:boolean){
        if(this._fpsSwitch===v)
            return;
        this._fpsSwitch = v;        
        if(v)
            this._pixi.stage.addChild(this._fpsText[0]);
        else
            this._pixi.stage.removeChild(this._fpsText[0]);
    }
    public get fps():boolean{
        return this._fpsSwitch;
    }
        
    //------------------------------------------------------------------------
    // 除錯開關.
    //------------------------------------------------------------------------
    public set debugs(s:boolean){
        
        if(this._debugSwitch===s)
            return;
        this._debugSwitch=s;
        
        // 球.
        this.ball[0].debugs=s;
        // 關卡.
        this.gameLevel[0].debugs=s;
        // 板子.
        this.board[0].debugs=s;
        // 王.
        if(GameData.Round===GAME_ROUND.ROUND_36)
            this.king[0].debugs=s;
    }
    public get debugs():boolean{
        return  this._debugSwitch;
    }

    //--------------------------------------------------------------------------
    // 載入圖形.
    //--------------------------------------------------------------------------    
    private LoaderResourceInterval():LOADER_MODE{
        // 判斷圖片是否載入完畢.
        if(LoaderResource.sImageLoadComplete === LOADER_MODE.COMPLETE){
            // 設定進入遊戲.
            LoaderResource.sImageLoadComplete=LOADER_MODE.INGAME;

            // 背景.
            this.background.push(new Background(BACKGROUND_STYLE.STYLE_1));

            // 最高分數.
            //this._highScoreText = new PIXI.Text(GameData.HighScore, this._uiFontStyle);
            this._highScoreText[0] = new PIXI.BitmapText(GameData.HighScore.toString(), { fontName: 'ArkanoidFont', fontSize: 24, letterSpacing:4, align: 'left' });
            this._highScoreText[0].x = 992;
            this._highScoreText[0].y = 154;
            this._highScoreText[0].zIndex = 10;
            this._highScoreText[0].anchor.set(1);
            this._pixi.stage.addChild(this._highScoreText[0]);    
            // 分數.
            //this._scoreText = new PIXI.Text(GameData.Score, this._uiFontStyle);
            this._scoreText[0] = new PIXI.BitmapText(GameData.Score.toString(), { fontName: 'ArkanoidFont', fontSize: 24, letterSpacing:4, align: 'left' });
            this._scoreText[0].x = 992;
            this._scoreText[0].y = 250;
            this._scoreText[0].zIndex = 10;
            this._scoreText[0].anchor.set(1);
            this._pixi.stage.addChild(this._scoreText[0]);            
            // 關卡.
            //this._roundText = new PIXI.Text(GameData.Round, this._uiFontStyle);
            this._roundText[0] = new PIXI.BitmapText(GameData.Round.toString(), { fontName: 'ArkanoidFont', fontSize: 24, letterSpacing:4, align: 'left' });
            this._roundText[0].x = 992;
            this._roundText[0].y = 826;
            this._roundText[0].zIndex = 10;
            this._roundText[0].anchor.set(1);
            this._pixi.stage.addChild(this._roundText[0]);

            // 準備.
            this._readyText[0] = new PIXI.BitmapText('PLAYER 1\nREADY', { fontName: 'ArkanoidFont', fontSize: 24, letterSpacing:4, align: 'left' });
            this._readyText[0].zIndex = 10;
            this._readyText[0].anchor.set(1);
            this._pixi.stage.addChild(this._readyText[0]);

            //this._pixi.stage.sortableChildren  = true;
            //this._fpsText = new PIXI.Text('FPS：0', this._fpsStyle);
            this._fpsText[0] = new PIXI.BitmapText('FPS 0', { fontName: 'ArkanoidFont', fontSize: 24, letterSpacing:4, tint:0xcc6600, align: 'left' });
            this._fpsText[0].x = 8;
            this._fpsText[0].y = 8;        
            this._fpsText[0].zIndex = 5000;
    
            // 關卡.
            this.gameLevel.push(new GameRound(GAME_ROUND.ROUND_1));
            // 王.
            this.king.push(new King());
            // 球.
            this.ball.push(new Ball());
            // 板子.
            this.board.push(new Board());

            // 過場.
            this.transitions.push(new Transitions());

            // 重新開始遊戲.
            this.resetGame();
            
            // FPS開關.
            this.fps=true;
            // Debugs開關.
            this.debugs=false;

            //alert(window.devicePixelRatio);
            //console.log(window.devicePixelRatio);
        }
        return LoaderResource.sImageLoadComplete;
    }

    //--------------------------------------------------------------------------
    // 鍵盤事件-按下.
    //--------------------------------------------------------------------------
    public inputKeyDown(e:any):void{
        //console.log("KeyDown:"+e.keyCode);

        // 左移動.
        if(e.keyCode===37){ 
            this.KeyState[0]=true;            
        // 右移動.
        }else if(e.keyCode===39){ 
            this.KeyState[1]=true;            
        // 空白鍵.
        }else if(e.keyCode===32){ 
            this.KeyState[2]=true;
        // Enter.
        }else if(e.keyCode===13){ 
            this.KeyState[3]=true;
        }

    }

    //--------------------------------------------------------------------------
    // 鍵盤事件-放開.
    //--------------------------------------------------------------------------
    public inputKeyUp(e:any):void{
        //console.log("KeyUp:"+e.keyCode);

        // 左移動.
        if(e.keyCode===37){
            this.KeyState[0]=false;
        // 右移動.
        }else if(e.keyCode===39){ 
            this.KeyState[1]=false;
        // 空白鍵.
        }else if(e.keyCode===32){
            this.KeyState[2]=false;
        // Enter.
        }else if(e.keyCode===13){ 
            this.KeyState[3]=false;
        // F(FPS).
        }else if(e.keyCode===70){ 
            this.fps = !this.fps;
        // D(Debugs).
        }else if(e.keyCode===68){ 
            this.debugs = !this.debugs;
        // A(AI).
        }else if(e.keyCode===65){ 
            GameData.Invincible = !GameData.Invincible;
        // R(Reset).
        }else if(e.keyCode===82){
            GameData.LifeNow++;
            Sound.play(SOUND_TYPE.BOARD_BOOM);
            this.board[0].boom();                
            this._nextRoundTick = new Date().getTime();
            this._gameMode = GAME_MODE.BALL_OUT;
        // S(Sound).
        }else if(e.keyCode===83){ 
            Sound.mute = !Sound.mute;    
        }

    }
               
    //--------------------------------------------------------------------------
    // 設定關卡.
    //--------------------------------------------------------------------------
    private setRound(){
        let bgid:number;
        // 背景.
        bgid = (GameData.Round-1)%4;
        if(GameData.Round===GAME_ROUND.ROUND_36){
            this.background[0].updateBg(BACKGROUND_STYLE.STYLE_5);
            this.king[0].spriteKing1.visible = true;
        }else{
            this.background[0].updateBg(bgid);
        }
        // 關卡.
        this.gameLevel[0].updateRound(GameData.Round);
        // 更新關卡文字.
        this._roundText[0].text = GameData.Round.toString();
    }

    //--------------------------------------------------------------------------
    // 重新開始遊戲.
    //--------------------------------------------------------------------------
    private resetGame(){
        // 板子現在數量.
        GameData.LifeNow=2;
        this.board[0].updateLife();
        // 分數.
        GameData.Score=0;        
        // 磚塊、強力磚塊數量.
        GameData.BricksMax=0;        
        
        // 關卡.
        GameData.Round=GAME_ROUND.ROUND_1;

        // 關閉王音效.
        Sound.stop(SOUND_TYPE.ENDING);

        // 設定關卡.
        this.setRound();        
        // 初始王.
        this.king[0].reset();
    }

    //--------------------------------------------------------------------------
    // 開始遊戲.
    //--------------------------------------------------------------------------
    private startGame(){
        // 重新開始遊戲.
        this.resetGame();
        // 顯示文字.
        this._readyTick = new Date().getTime();
        // 播放音效.
        Sound.play(SOUND_TYPE.ROUND_START);
        this._gameMode = GAME_MODE.READY;
    }
    
    //--------------------------------------------------------------------------
    // 球反彈.
    //--------------------------------------------------------------------------
    private rebound(delta:number){        
        //let brickIdTemp;
        let canGo=[-1,-1,-1];        
        let tx, ty:number;
        let speedX, speedY:number;

        // 備份球座標.
        tx = this.ball[0].sprite.x;
        ty = this.ball[0].sprite.y;
        // 備份球反彈速度.
        speedX = this.ball[0].speedX;
        speedY = this.ball[0].speedY;

        Ball.sDelta = delta;       

        // 模擬球所有移動路徑是否會卡在磚塊內. 
        for(let i=0; i<3; i++){
            // 反彈.
            if(i===0){
                this.ball[0].speedY = -this.ball[0].speedY;
            }else if(i===1){
                this.ball[0].speedX = -this.ball[0].speedX; 
            }else if(i===2){
                this.ball[0].speedX = -this.ball[0].speedX; 
                this.ball[0].speedY = -this.ball[0].speedY;
            }
            // 移動球.
            this.ball[0].sprite.x += (this.ball[0].speedX*Ball.sDelta);
            this.ball[0].sprite.y += (this.ball[0].speedY*Ball.sDelta);
            canGo[i] = this.gameLevel[0].hitTestBall(this.ball[0].sprite);

            // 備份球座標.
            this.ball[0].sprite.x = tx;
            this.ball[0].sprite.y = ty;
            // 備份球反彈速度.
            this.ball[0].speedX = speedX;
            this.ball[0].speedY = speedY;
        }

        // 找不會卡在方塊內的路徑行進.
        if(canGo[0]===-1){
            this.ball[0].speedY = -this.ball[0].speedY;
        }else if(canGo[1]===-1){
            this.ball[0].speedX = -this.ball[0].speedX; 
        }else if(canGo[2]===-1){
            this.ball[0].speedX = -this.ball[0].speedX; 
            this.ball[0].speedY = -this.ball[0].speedY;
        }else{
            this.ball[0].speedX = -this.ball[0].speedX; 
            this.ball[0].speedY = -this.ball[0].speedY;
            console.log(canGo);
        }
           
    }

    //------------------------------------------------------------------------
    // 建構式.
    //------------------------------------------------------------------------
    constructor(p:PIXI.Application) {
        // 紀錄pixi指標.
        this._pixi = p;
        this._pixi.start();        

        // 音樂、音效.        
        Sound.Init();

        // 載入圖形資源.
        LoaderResource.Init(this._pixi);
        // 初始物件.
        BasicCore.Init(this._pixi);
    }
    
    //--------------------------------------------------------------------------
    // 釋放.
    //--------------------------------------------------------------------------
    public destroy(){    
        // 背景捲動.
        if(this.background[0]!=null)
            this.background[0].destroy();

        // 釋放.
        BasicCore.Free();
    }    

    //--------------------------------------------------------------------------
    // 更新UI.
    //--------------------------------------------------------------------------
    public updateUI(){
        // 更新最高分數.
        if(GameData.Score>GameData.HighScore){
            GameData.HighScore = GameData.Score;
            this._highScoreText[0].text = GameData.HighScore.toString();
        }
        // 文字-分數.
        this._scoreText[0].text = GameData.Score.toString();
    }

    //--------------------------------------------------------------------------
    // 更新.
    //--------------------------------------------------------------------------
    public update(delta:number){                     
        // 將主迴圈的執行次數鎖定在FPS:60左右.
        if((new Date().getTime()-this._fpsLoopTick)<16)
            return;    
        this._fpsLoopTick = new Date().getTime();

        // 載入圖形初始精靈.  
        if(this.LoaderResourceInterval()!==LOADER_MODE.INGAME){return;}

        // 遊戲狀態.
        if(this._gameMode === GAME_MODE.GAME_OVER){                         // 遊戲結束.
            // 顯示文字.
            this._readyText[0].x = 560;
            this._readyText[0].y = 770;
            this._readyText[0].text = "GAME OVER";
            this._readyText[0].visible = true;

            //----------------------------------------
            // 鍵盤.
            //---------------------------------------
            // Enter.
            if(this.KeyState[2] || this.KeyState[3]){                 
                this.startGame();   // 開始遊戲.
            }

            //-------------------------------------
            // 觸碰螢幕.
            //-------------------------------------        
            // 放開觸碰.
            if(GameData.ToucheMode === TOUCHE_STATE.TOUCH_END){
                this.startGame();   // 開始遊戲.                
            }

        }else if(this._gameMode === GAME_MODE.READY){                       // 準備開始.
            // 顯示文字.
            this._readyText[0].x = 556;
            this._readyText[0].y = 740;
            this._readyText[0].text = "PLAYER 1\n\n\n READY";
            this._readyText[0].visible = true;
            
            // 開始遊戲 .
            if((new Date().getTime()-this._readyTick)>=2000){
                // 關閉文字.
                this._readyText[0].visible = false;

                // 開啟球.
                this.ball[0].sprite.visible = true;
                // 開啟板子.
                this.board[0].sprite.x = 370;
                this.board[0].sprite.y = 802;                
                this.board[0].sprite.visible = true;

                this._gameMode = GAME_MODE.GAME_START;
            }

        }else if(this._gameMode === GAME_MODE.GAME_START){                  // 開始遊戲.
            // 無敵-自動發球.
            if(GameData.Invincible){
                this._gameMode = GAME_MODE.IN_GAME;
            }else{
                //--------------------------------------------------------------------
                // 鍵盤.
                //--------------------------------------------------------------------
                // 左移動.
                if(this.KeyState[0]){ 
                    this.board[0].move(true);
                // 右移動.
                }else if(this.KeyState[1]){             
                    this.board[0].move(false);
                // Enter.
                }else if(this.KeyState[3]){
                    this._gameMode = GAME_MODE.IN_GAME;
                }

                //-------------------------------------
                // 觸碰螢幕.
                //-------------------------------------        
                if( (GameData.ToucheMode === TOUCHE_STATE.TOUCH_START) ||
                    (GameData.ToucheMode === TOUCHE_STATE.TOUCH_MOVE))
                {
                    this._gameMode = GAME_MODE.IN_GAME;                
                }
            }

            // 讓球跟著板子.
            this.ball[0].sprite.x = this.board[0].sprite.x+(this.board[0].sprite.width>>1);
            this.ball[0].sprite.y = this.board[0].sprite.y-this.ball[0].sprite.height-1;

        }else if(this._gameMode === GAME_MODE.IN_GAME){                     // 遊戲中.
            // 無敵-讓板子跟著球跑.
            if(GameData.Invincible){
                this.board[0].moveWithX(this.ball[0].sprite.x-(this.board[0].sprite.width>>1));
            }else{
                //--------------------------------------------------------------------
                // 鍵盤.
                //--------------------------------------------------------------------
                // 左移動.
                if(this.KeyState[0]){ 
                    this.board[0].move(true);
                // 右移動.
                }else if(this.KeyState[1]){             
                    this.board[0].move(false);
                }

                //-------------------------------------
                // 觸碰螢幕.
                //-------------------------------------        
                if( (GameData.ToucheMode === TOUCHE_STATE.TOUCH_START) ||
                    (GameData.ToucheMode === TOUCHE_STATE.TOUCH_MOVE))
                {                                        
                    if((GameData.SCREEN_WIDTH_BASE>>1) < GameData.ToucheX)
                        this.board[0].move(false);
                    else
                        this.board[0].move(true);                                            
                }
            }
            
            // 球與磚塊碰撞.
            this._brickId = this.gameLevel[0].hitTestBall(this.ball[0].sprite);            
            if(this._brickId>-1){                
                this.rebound(delta);            // 球反彈.
                this.board[0].updateLife();     // 加隻判斷.
            }
                        
            // 球與板子碰撞.
            if(this.board[0].hitTestSprite(this.ball[0].sprite)){
                Sound.play(SOUND_TYPE.BOARD_BOUNCE);
                this.ball[0].speedY = -this.ball[0].speedY; 
            }
            // 球與王碰撞.
            if(this.king[0].hitTestSprite(this.ball[0].sprite)){
                this.ball[0].speedX = -this.ball[0].speedX;
                //this.rebound(delta);        // 球反彈.

                // 王被消滅.
                if(this.king[0].ifWipeOut()){
                    this.ball[0].sprite.visible = false;
                    this._gameMode = GAME_MODE.PLAY_TO_EXPLOSION;
                }                    
            }
            // 王子彈與板子碰撞.
            if(this.king[0].hitTestBullet(this.board[0].sprite) && !GameData.Invincible ){
                Sound.play(SOUND_TYPE.BOARD_BOOM);
                this.board[0].boom();                
                this._nextRoundTick = new Date().getTime();
                this._gameMode = GAME_MODE.BALL_OUT;
            }

            // 球-更新.
            if(this.ball[0].update(delta)){                                
                Sound.play(SOUND_TYPE.BOARD_BOOM);
                this.board[0].boom();                
                this._nextRoundTick = new Date().getTime();
                this._gameMode = GAME_MODE.BALL_OUT;
            }

            // 王關碰撞.
            if(GameData.Round===GAME_ROUND.ROUND_36)
                this.king[0].update(delta, this.board[0].sprite);

            // 下個關卡.
            if(GameData.BricksMax<=0 && GameData.Round!==GAME_ROUND.ROUND_36){                
                // 進入下一關卡.
                GameData.Round++;
                this._gameMode = GAME_MODE.NEXT_ROUND;
            }

        }else if(this._gameMode === GAME_MODE.NEXT_ROUND){                   // 下個關卡.
                // 暫停1秒.
                GameData.sleep(1000);
                
                // 設定關卡.
                this.setRound();
                // 開啟過場.
                this.transitions[0].visible = true;
                this._nextRoundTick = new Date().getTime();
                this._gameMode = GAME_MODE.TRANSITIONS;

        }else if(this._gameMode === GAME_MODE.BALL_OUT){                     // 球掉落底線.
            
            // 等待N秒.
            if((new Date().getTime()-this._nextRoundTick)>=1800){
                // 更新生命數.
                GameData.LifeNow--;                
                this.board[0].updateLife();
                
                // 關閉子彈.
                if(GameData.Round===GAME_ROUND.ROUND_36)
                    this.king[0].closeBullet();

                // Game Over.
                if(GameData.LifeNow<0){
                    Sound.play(SOUND_TYPE.GAME_OVER);
                    this._gameMode = GAME_MODE.GAME_OVER;
                }else{
                    this._nextRoundTick = new Date().getTime();
                    this._gameMode = GAME_MODE.TRANSITIONS;    
                }

            }

        }else if(this._gameMode === GAME_MODE.TRANSITIONS){                  // 轉場中.
            // 開啟過場.
            this.transitions[0].visible = true;
            // 關閉球與板子.
            this.board[0].sprite.visible = false;
            this.ball[0].sprite.visible = false;
            // 等待N秒.
            if((new Date().getTime()-this._nextRoundTick)>=1800){            
                // 關閉過場.
                this.transitions[0].visible = false;                
                // 準備開始.
                this._readyTick = new Date().getTime();
                // 播放音效.
                if(GameData.Round===GAME_ROUND.ROUND_36)
                    Sound.play(SOUND_TYPE.FINAL_BOSS);
                else
                    Sound.play(SOUND_TYPE.ROUND_START);

                this._gameMode = GAME_MODE.READY;
                // 移動速度.
                this.ball[0].speedX =  Math.abs(this.ball[0].speedX);
                this.ball[0].speedY = -Math.abs(this.ball[0].speedY);
            }

        }else if(this._gameMode === GAME_MODE.PLAY_TO_EXPLOSION){            // 破關.
            // 等黑幕蓋下進入GameOver.
            if( this.king[0].updateWipeOut()===24){
                // 播放音效.
                Sound.play(SOUND_TYPE.ENDING);
                this._gameMode = GAME_MODE.GAME_OVER;
            }
        }
    
        // 更新UI.
        this.updateUI();

        // 顯示FPS.        
        this._fps++;
        if((new Date().getTime()-this._fpsTick)>=1000){
            //this._fpsText[0].text = 'FPS '+Math.ceil(this._pixi.ticker.FPS);
            this._fpsText[0].text = 'FPS '+Math.ceil(this._fps); this._fps=0;
            this._fpsTick=new Date().getTime();
        }
    }

}
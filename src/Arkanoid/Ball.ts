//============================================================================
//
// 名稱：球物件.
//
//============================================================================
import * as PIXI from 'pixi.js';
import {BasicCore} from './BasicCore';
import { GameData } from './GameData';

export class Ball extends BasicCore{
        
    public static sDelta:number=1;

    // 球-物件.
    public sprite:PIXI.AnimatedSprite;

    // 移動速度.
    public speedX:number =  8.0;
    public speedY:number = -8.0;

    // 球-碰撞區域.
    private _spriteGraphics = new PIXI.Graphics();    
    // 除錯開關.
    private _debugSwitch:Boolean = false;

    // 邊界-碰撞區域.
    private _boundaryRect:PIXI.Rectangle;
    private _boundaryGraphics = new PIXI.Graphics();

    //------------------------------------------------------------------------
    // 建構式.
    //------------------------------------------------------------------------
    constructor() {
        let brickTextures = [];

        super();

        // 球.
        brickTextures = this.getTexture( ['ball.png']);
        this.sprite = new PIXI.AnimatedSprite(brickTextures);
        this.sprite.x = 420;
        this.sprite.y = 780;        
        this.sprite.gotoAndPlay(0);
        this.sprite.animationSpeed = 1;
        this.sprite.visible = false;
        Ball.sPixi.stage.addChild(this.sprite);

        // 球碰撞區域.
        //this._spriteGraphics.x = this.sprite.x;
        //this._spriteGraphics.y = this.sprite.y;
        this._spriteGraphics.lineStyle(1, 0xff0000, 1);
        this._spriteGraphics.drawRect( 0, 0, this.sprite.width, this.sprite.height);                
        //this._spriteGraphics.drawCircle (0, 0, 10)
     
        // 邊界碰撞區域.
        this._boundaryRect = new PIXI.Rectangle(63, 30, 704, 864);
        this._boundaryGraphics.x = this._boundaryRect.x;
        this._boundaryGraphics.y = this._boundaryRect.y;
        this._boundaryGraphics.lineStyle(1, 0xff0000, 1);
        this._boundaryGraphics.drawRect( 0, 0, this._boundaryRect.width, this._boundaryRect.height);
        
    }

    //--------------------------------------------------------------------------
    // 釋放.
    //--------------------------------------------------------------------------
    public destroy():void{}
    
    //------------------------------------------------------------------------
    // 更新.
    //------------------------------------------------------------------------
    public update(delta:number):boolean{
        let outBottomBase:boolean = false;

        // 移動球.
        this.sprite.x += (this.speedX*Ball.sDelta);
        this.sprite.y += (this.speedY*Ball.sDelta);

        // 超出邊界處理.
        if(this.sprite.x<this._boundaryRect.x)
            this.sprite.x = this._boundaryRect.x;
        if(this.sprite.x>(this._boundaryRect.x + this._boundaryRect.width))
            this.sprite.x = (this._boundaryRect.x + this._boundaryRect.width);

        if(this.sprite.y<this._boundaryRect.y)
            this.sprite.y = this._boundaryRect.y;
        //if(this.sprite.y>(this._boundaryRect.y+this._boundaryRect.height))
        //    this.sprite.y = (this._boundaryRect.y+this._boundaryRect.height);
        
        // 右牆或左牆碰撞反彈.        
        if( ((this.sprite.x + this.speedX) > ((this._boundaryRect.x + this._boundaryRect.width) - this.sprite.width)) || ((this.sprite.x + this.speedX) < (this._boundaryRect.x)))
            this.speedX = -this.speedX;
        // 下牆或上牆碰撞        
        if(((this.sprite.y + this.speedY) < (this._boundaryRect.y))){
            this.speedY = -this.speedY;            
        }
                            
        // 球超出底線.
        outBottomBase = (this.sprite.y + this.speedY) > (GameData.SCREEN_HEIGHT_BASE+150);
        if(outBottomBase){
            return outBottomBase;
        }

        // 更新碰撞位置.
        this._spriteGraphics.x = this.sprite.x;
        this._spriteGraphics.y = this.sprite.y;        

        return false;
    }

    //------------------------------------------------------------------------
    // 除錯開關.
    //------------------------------------------------------------------------
    public set debugs(s:boolean){
        if(this._debugSwitch===s)
            return;
        this._debugSwitch=s;
        if(s){
            // 顯示碰撞區域.
            Ball.sPixi.stage.addChild(this._spriteGraphics);
            Ball.sPixi.stage.addChild(this._boundaryGraphics);

        }else{
            // 關閉碰撞區域.
            Ball.sPixi.stage.removeChild(this._spriteGraphics);
            Ball.sPixi.stage.removeChild(this._boundaryGraphics);
        }
    }

}

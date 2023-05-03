//============================================================================
//
// 名稱：板子物件.
//
//============================================================================
import * as PIXI from 'pixi.js';
import {GameData} from './GameData';
import {BasicCore} from './BasicCore';

// 列舉-磚塊樣式.
export enum INPUT_DEVICE {
    KEYBOARD=0,
    MOUSE,
    TOUCH,
}

export class Board extends BasicCore{
    // 板子-物件.
    public sprite:PIXI.AnimatedSprite;

    // 板子移動速度.
    public moveSpeed:number = 8;

    // 板子-爆炸動畫.
    private _spriteBoomAni:PIXI.AnimatedSprite;

    // 小板子物件.
    private _lifeBoard:Array<PIXI.AnimatedSprite>=[];

    // 板子-碰撞區域.
    private _spriteGraphics = new PIXI.Graphics();
    // 除錯開關.
    private _debugSwitch:Boolean = false;

    //------------------------------------------------------------------------
    // 建構式.
    //------------------------------------------------------------------------
    constructor() {
        let brickTextures = [];
        let n;

        super();

        // 板子.
        brickTextures = this.getTexture( ['plate.png']);
        this.sprite = new PIXI.AnimatedSprite(brickTextures);
        this.sprite.gotoAndPlay(0);
        //this.sprite.anchor.set(0.5);
        this.sprite.animationSpeed = 0.1;
        this.sprite.visible = false;
        Board.sPixi.stage.addChild(this.sprite);

        // 板子-爆炸動畫.
        brickTextures = this.getTexture( ['plateBoom_1.png', 'plateBoom_2.png','plateBoom_3.png','null.png']);
        this._spriteBoomAni = new PIXI.AnimatedSprite(brickTextures);
        this._spriteBoomAni.x = this.sprite.x+(this.sprite.width>>1);
        this._spriteBoomAni.y = this.sprite.y+(this.sprite.height>>1);
        this._spriteBoomAni.gotoAndPlay(0);
        this._spriteBoomAni.anchor.set(0.5);
        this._spriteBoomAni.animationSpeed = 0.07;
        this._spriteBoomAni.loop = false;
        this._spriteBoomAni.visible = false;
        Board.sPixi.stage.addChild(this._spriteBoomAni);
            
        // 小板子物件.
        brickTextures = this.getTexture( ['plate1up.png']);
        for(let i:number=0; i<GameData.LifeMax; i++){
            n = Math.floor(i/3);
            this._lifeBoard[i] = new PIXI.AnimatedSprite(brickTextures);
            this._lifeBoard[i].x = 800+(65*(i%3));            
            this._lifeBoard[i].y = 416+(32*n);
            this._lifeBoard[i].gotoAndPlay(0);            
            this._lifeBoard[i].animationSpeed = 1;
            this._lifeBoard[i].visible = true;
            Board.sPixi.stage.addChild(this._lifeBoard[i]);            
        }

        // 板子碰撞區域.
        this._spriteGraphics.lineStyle(1, 0xff0000, 1);
        this._spriteGraphics.drawRect( 0, 0, this.sprite.width, this.sprite.height);         
        this._spriteGraphics.x = this.sprite.x;
        this._spriteGraphics.y = this.sprite.y;        

    }

    //--------------------------------------------------------------------------
    // 釋放.
    //--------------------------------------------------------------------------
    public destroy():void{}
    
    //------------------------------------------------------------------------
    // 更新.
    //------------------------------------------------------------------------
    public update(delta:number){}

    //------------------------------------------------------------------------
    // 更新生命數.
    //------------------------------------------------------------------------
    public updateLife(){
        for(let i:number=0; i<GameData.LifeMax; i++){
            this._lifeBoard[i].visible = false;
            if(i<GameData.LifeNow)
                this._lifeBoard[i].visible = true;
        }        
    }

    //------------------------------------------------------------------------
    // 移動板子.
    //------------------------------------------------------------------------
    public move( leftMove:boolean){
        if(leftMove){
            this.sprite.x -= this.moveSpeed;
            if(this.sprite.x<63)
                this.sprite.x = 63;
        }else{
            this.sprite.x += this.moveSpeed;
            if(this.sprite.x>640)
                this.sprite.x = 640;
        }        
        // 移動碰撞.
        this._spriteGraphics.x = this.sprite.x;
        this._spriteGraphics.y = this.sprite.y;
    }

    //------------------------------------------------------------------------
    // 移動板子-跟著x座標.
    //------------------------------------------------------------------------
    public moveWithX( x:number){
        this.sprite.x = x;
        if(this.sprite.x<63)
            this.sprite.x = 63;
        if(this.sprite.x>640)
            this.sprite.x = 640;
        // 移動碰撞.
        this._spriteGraphics.x = this.sprite.x;
        this._spriteGraphics.y = this.sprite.y;
    }

    //------------------------------------------------------------------------
    // 碰撞測試.
    //------------------------------------------------------------------------
    public hitTestSprite(rect:PIXI.AnimatedSprite):boolean {
        if(!this.sprite.visible){return false;}
        if( (this.sprite.x)>(rect.x+rect.width)||
            (this.sprite.y)>(rect.y+rect.height)||
            (this.sprite.x+this.sprite.width)<(rect.x)||
            (this.sprite.y+this.sprite.height)<(rect.y)) 
        {
            return false;
        }
        return true;
    }    

    //------------------------------------------------------------------------
    // 板子爆炸.
    //------------------------------------------------------------------------
    public boom():void{        
        this._spriteBoomAni.x = this.sprite.x+(this.sprite.width>>1);
        this._spriteBoomAni.y = this.sprite.y+(this.sprite.height>>1);
        this._spriteBoomAni.gotoAndPlay(0);
        this.sprite.visible = false;
        this._spriteBoomAni.visible = true;
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
            Board.sPixi.stage.addChild(this._spriteGraphics);
        }else{
            // 關閉碰撞區域.
            Board.sPixi.stage.removeChild(this._spriteGraphics);
        }
        
    }

}
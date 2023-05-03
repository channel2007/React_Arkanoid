//============================================================================
//
// 名稱：磚塊物件.
//
//============================================================================
import * as PIXI from 'pixi.js';
import {BasicCore} from './BasicCore';
import {GameData} from './GameData';
import {Sound, SOUND_TYPE} from './Sound';

// 列舉-磚塊樣式.
export enum BRICK_STYLE {
    STYLE_1=0,
    STYLE_2,
    STYLE_3,
    STYLE_4,
    STYLE_5,
    STYLE_6,
    STYLE_7,
    STYLE_8,
    STYLE_9,
    STYLE_10,
}

export class Brick extends BasicCore{
    // 磚塊圖片.
    private static sBrickName = [
        ['brick_1.png'],              // 磚塊-1.
        ['brick_2.png'],              // 磚塊-2.
        ['brick_3.png'],              // 磚塊-3.
        ['brick_4.png'],              // 磚塊-4.
        ['brick_5.png'],              // 磚塊-5.
        ['brick_6.png'],              // 磚塊-6.
        ['brick_7.png'],              // 磚塊-7.
        ['brick_8.png'],              // 磚塊-8.
        ['brick_9.png'],              // 磚塊-9.
        ['brick_10.png'],             // 磚塊-10.
    ];
    // 磚塊分數表.
    private static sScoreTable = [80,70,60,50,90,100,110,120,200,9999];
    // 磚塊生命表.
    private static sLifeTable  = [1,1,1,1,1,1,1,1,2,9999];

    // 加隻分數.
    private static sScore1UP:number = 20000;

    // 磚塊-物件.
    public sprite:PIXI.AnimatedSprite; 

    // 磚塊-碰撞區域.
    private _spriteGraphics = new PIXI.Graphics();
    // 除錯開關.
    private _debugSwitch:Boolean = false;

    // 生命數.
    private _life:number=1;
    // 分數.
    private _score:number=0;

    // 磚塊風格.
    private _style:BRICK_STYLE = BRICK_STYLE.STYLE_1;

    //------------------------------------------------------------------------
    // 建構式.
    //------------------------------------------------------------------------
    constructor(style:BRICK_STYLE) {
        let brickTextures = [];
        let frame=0;

        // 執行基礎類建構函數.
        super();

        // 紀錄磚塊風格.
        this._style = style;

        // 取的磚塊圖.
        if(style === BRICK_STYLE.STYLE_9){
            brickTextures = this.getTexture( ['brick_9_1.png','brick_9_2.png','brick_9_3.png','brick_9_4.png','brick_9_5.png','brick_9.png']);
            frame = 5;
        }else if(style === BRICK_STYLE.STYLE_10){
            brickTextures = this.getTexture( ['brick_10_1.png','brick_10_2.png','brick_10_3.png','brick_10_4.png','brick_10_5.png','brick_10.png']);
            frame = 5;
        }else{
            brickTextures = this.getTexture( [Brick.sBrickName[style][0]]);
        }        
        this.sprite = new PIXI.AnimatedSprite(brickTextures);
        this.sprite.x = 0;
        this.sprite.y = 0;        
        this.sprite.gotoAndPlay(frame);
        this.sprite.animationSpeed = 0.2;
        this.sprite.zIndex = 1;
        this.sprite.loop = false;
        this.sprite.visible = true;
        Brick.sPixi.stage.addChild(this.sprite);
        
        // 生命.
        this._life = Brick.sLifeTable[style];
        // 分數.
        this._score = Brick.sScoreTable[style];

        // 磚塊碰撞區域.
        this._spriteGraphics.x = this.sprite.x;
        this._spriteGraphics.y = this.sprite.y;
        this._spriteGraphics.lineStyle(1, 0xff0000, 1);        
        this._spriteGraphics.drawRect( 0, 0, this.sprite.width, this.sprite.height);                
        
        //Brick.sPixi.stage.addChild(this._spriteGraphics);
        
    }
 
    //--------------------------------------------------------------------------
    // 釋放.
    //--------------------------------------------------------------------------
    public destroy():void{        
        Brick.sPixi.stage.removeChild(this.sprite);
        // 磚塊-物件.
        this.sprite.destroy();        
        // 磚塊-碰撞區域.
        this._spriteGraphics.destroy();
    }

    //------------------------------------------------------------------------
    // 更新.
    //------------------------------------------------------------------------
    public update(delta?:number){
        // 更新碰撞位置.
        this._spriteGraphics.x=this.sprite.x;
        this._spriteGraphics.y=this.sprite.y;
        //this._spriteGraphics.width=this.sprite.width+1;
        //this._spriteGraphics.height=this.sprite.height+1;

    }
    
    //--------------------------------------------------------------------------
    // 判斷加隻.
    // (2萬分加隻，6萬分加隻，之後每加6萬分加隻).
    //--------------------------------------------------------------------------
    private add1UP(minusScore:number){
        Brick.sScore1UP -= minusScore;
        if(Brick.sScore1UP<=0){
            // 加隻倒數.
            if(GameData.Score<60000){
                Brick.sScore1UP += 40000;
            }else{
                Brick.sScore1UP += 60000;
            }
            // 判斷最大隻數.
            if(GameData.LifeNow<GameData.LifeMax){
                // 播放音效.
                Sound.play(SOUND_TYPE.EXTRA_LIFE);
                // 加隻.
                GameData.LifeNow++;                
            }
        }        
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
        
        // 灰色方塊動畫中不要扣生命值(有可能是重複碰撞到同一個磚塊).
        if(this._style === BRICK_STYLE.STYLE_9 && this.sprite.currentFrame!=5)
            return true;
        
        // 扣生命.
        this._life--;        
        if(this._life<=0){
            // 音效.
            Sound.play(SOUND_TYPE.BRICKS_BOUNCE_1);
            // 關閉磚塊.
            this.sprite.visible = false;
            // 扣除磚塊數量.
            GameData.BricksMax--;
            // 增加分數.
            GameData.Score += this._score;
            // 最高分數. 
            // 紅白機版打磚塊最高分就是999990.
            if(GameData.Score > 999990){
                GameData.Score = 999990;
            }else{
                // 判斷加隻.
                this.add1UP(this._score);
            }
            
        }else{
            // 音效.
            Sound.play(SOUND_TYPE.BRICKS_BOUNCE_2);
            // 播放磚塊動畫.
            if(this._style === BRICK_STYLE.STYLE_9)
                this.sprite.gotoAndPlay(0);
            else if(this._style === BRICK_STYLE.STYLE_10)    
                this.sprite.gotoAndPlay(0);
        }
        return true;
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
            Brick.sPixi.stage.addChild(this._spriteGraphics);
        }else{
            // 關閉碰撞區域.
            Brick.sPixi.stage.removeChild(this._spriteGraphics);
        }
    }

    
}
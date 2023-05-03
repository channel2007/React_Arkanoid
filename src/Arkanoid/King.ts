//============================================================================
//
// 名稱：王物件.
//
//============================================================================
import * as PIXI from 'pixi.js';
import {BasicCore} from './BasicCore';
import {GameData} from './GameData';
import {Sound, SOUND_TYPE} from './Sound';

// 王-生命數.
const KING_LIFE_MAX = 16;
// 王-子彈數.
const KING_BULLET_MAX = 6;

// 加強AnimatedSprite物件.
class AnimatedSpriteUpgrade extends PIXI.AnimatedSprite{    
    // 目標.
    public tx:number=0;
    public ty:number=0;
    // 移動速度.
    public vx:number=0;
    public vy:number=0;
    // 發射角度.
    public theta:number=0; 
}

export class King extends BasicCore{
    // 王-物件1.
    public spriteKing1:PIXI.AnimatedSprite;
    // 王-物件2.
    public spriteKing2:PIXI.AnimatedSprite;

    // 王-碰撞區域.
    private _spriteGraphics = new PIXI.Graphics();
    // 除錯開關.
    private _debugSwitch:Boolean = false;

    // 閃爍時間.
    private _flashTick:number=new Date().getTime();    
    // 消滅王黑幕效果.
    private _blackGraphics = new PIXI.Graphics();
    // 黑幕-區塊.
    private _blackRect:number = 0;
    // 黑幕-等分.
    private _blackEqualParts:number = 0;
    // 子彈.
    private _bullet:Array<AnimatedSpriteUpgrade>=[];
    // 子彈碰撞.
    private _bulletGraphics:Array<PIXI.Graphics>=[];

    // 發射子彈時間.
    private _fireTick:number=new Date().getTime();
    // 發射子彈間格時間.
    private _fireSpaceTick:number=new Date().getTime();
    // 發射子彈數量.
    private _bulletStock:number=3;


    // 生命數.
    private _life:number = KING_LIFE_MAX;

    //------------------------------------------------------------------------
    // 建構式.
    //------------------------------------------------------------------------
    constructor() {
        let kingTextures = [];

        super();

        // 王-物件1.
        kingTextures = this.getTexture( ['king_1_2.png', 'king_1_1.png']);
        this.spriteKing1 = new PIXI.AnimatedSprite(kingTextures);
        this.spriteKing1.gotoAndStop(1);
        this.spriteKing1.loop = false;
        this.spriteKing1.autoUpdate = false;
        //this.spriteKing1.animationSpeed = 6.0;
        this.spriteKing1.x = 286;
        this.spriteKing1.y = 130;
        this.spriteKing1.visible = false;
        King.sPixi.stage.addChild(this.spriteKing1);

        // 王-物件2.
        kingTextures = this.getTexture( ['king_2_2.png', 'king_2_1.png']);
        this.spriteKing2 = new PIXI.AnimatedSprite(kingTextures);
        this.spriteKing2.gotoAndStop(1);        
        this.spriteKing2.loop = false;
        this.spriteKing2.autoUpdate = false;
        //this.spriteKing2.animationSpeed = 6.0;
        this.spriteKing2.x = 286;
        this.spriteKing2.y = 130;
        this.spriteKing2.visible = false;
        King.sPixi.stage.addChild(this.spriteKing2);

        // 子彈.
        kingTextures = this.getTexture( ['bullet_1.png', 'bullet_2.png', 'bullet_3.png', 'bullet_4.png', 'bullet_5.png', 'bullet_6.png', 'bullet_7.png', 'bullet_8.png']);
        for(let i=0; i<KING_BULLET_MAX; i++){
            // 子彈.
            this._bullet[i] = new AnimatedSpriteUpgrade(kingTextures);
            this._bullet[i].gotoAndPlay(1);                
            this._bullet[i].animationSpeed = 0.15;
            this._bullet[i].x = 0;
            this._bullet[i].y = 0;
            this._bullet[i].visible = false;            
            King.sPixi.stage.addChild(this._bullet[i]);

            // 子彈碰撞.
            this._bulletGraphics[i] = new PIXI.Graphics();
            this._bulletGraphics[i].lineStyle(1, 0x00ff00, 1);
            this._bulletGraphics[i].drawRect( 0, 0,this._bullet[i].width, this._bullet[i].height);                
                
        }

        // 王碰撞區域.
        this._spriteGraphics.lineStyle(1, 0x00ff00, 1);
        this._spriteGraphics.drawRect( 0, 0, this.spriteKing1.width, this.spriteKing1.height);         
        this._spriteGraphics.x = this.spriteKing1.x;
        this._spriteGraphics.y = this.spriteKing1.y;        

        // 消滅王黑幕效果.
        this._blackRect = this.spriteKing1.height/24;
        this._blackGraphics.beginFill(0x000000);
        this._blackGraphics.drawRect(0, 0, this.spriteKing1.width, this.spriteKing1.height);
        this._blackGraphics.endFill();
        this._blackGraphics.height = 0;
        this._blackGraphics.x = this.spriteKing1.x;
        this._blackGraphics.y = this.spriteKing1.y;
        King.sPixi.stage.addChild(this._blackGraphics);
        
    }

    //--------------------------------------------------------------------------
    // 釋放.
    //--------------------------------------------------------------------------
    public destroy():void{}
        
    //------------------------------------------------------------------------
    // 更新.
    //------------------------------------------------------------------------
    public update( delta:number, rect:PIXI.AnimatedSprite){
        // 恢復閃爍.
        if((new Date().getTime()-this._flashTick)>=100){
            this.spriteKing1.visible = true;
            this.spriteKing2.visible = false;
        }

        // 更新子彈.
        for(let i=0; i<KING_BULLET_MAX; i++){
            if(this._bullet[i].visible){
                // 移動子彈.
                this._bullet[i].x -= this._bullet[i].vx;
                this._bullet[i].y -= this._bullet[i].vy;

                this._bulletGraphics[i].x = this._bullet[i].x;
                this._bulletGraphics[i].y = this._bullet[i].y;

                // 關閉子彈.
                if(this._bullet[i].y>GameData.SCREEN_HEIGHT_BASE)
                    this._bullet[i].visible = false;
            }
        }

        // 發射子彈時間.
        if((new Date().getTime()-this._fireTick)>=4000){
            // 發射子彈.
            if((new Date().getTime()-this._fireSpaceTick)>=500){                
                // 王張開嘴巴.
                this.spriteKing1.gotoAndStop(0);
                this.spriteKing2.gotoAndStop(0);
                // 發射子彈.
                this._fire(rect);    
                // 扣掉子彈發射數量.
                this._bulletStock--;
                // 初始下次發射時間.
                if(this._bulletStock<=0){
                    // 王閉上嘴巴.
                    this.spriteKing1.gotoAndStop(1);
                    this.spriteKing2.gotoAndStop(1);    
                    this._bulletStock = 3;
                    this._fireTick = new Date().getTime();
                }
                this._fireSpaceTick = new Date().getTime();
            }    
        }

    }

    //------------------------------------------------------------------------
    // 王被消滅特效.
    //------------------------------------------------------------------------
    public updateWipeOut():number{                
        this._blackEqualParts++;
        this._blackGraphics.height = (this._blackRect * this._blackEqualParts);
        GameData.sleep(180);

        return this._blackEqualParts;
    }

    //------------------------------------------------------------------------
    // 碰撞測試.
    //------------------------------------------------------------------------
    public hitTestSprite(rect:PIXI.AnimatedSprite):boolean {
        if(!this.spriteKing1.visible){return false;}
        if( (this.spriteKing1.x)>(rect.x+rect.width)||
            (this.spriteKing1.y)>(rect.y+rect.height)||
            (this.spriteKing1.x+this.spriteKing1.width)<(rect.x)||
            (this.spriteKing1.y+this.spriteKing1.height)<(rect.y)) 
        {
            return false;
        }
        // 音效.
        Sound.play(SOUND_TYPE.BRICKS_BOUNCE_2);
        // 初始閃爍時間.
        this._flashTick = new Date().getTime();
        this.spriteKing1.visible = false;
        this.spriteKing2.visible = true;        
        // 扣生命.
        this._life--;
        
        return true;
    }    

    //------------------------------------------------------------------------
    // 子彈碰撞測試.
    //------------------------------------------------------------------------
    public hitTestBullet(rect:PIXI.AnimatedSprite):boolean {
        for(let i=0; i<KING_BULLET_MAX; i++){
            if( (this._bullet[i].x)>(rect.x+rect.width)||
                (this._bullet[i].y)>(rect.y+rect.height)||
                (this._bullet[i].x+this._bullet[i].width)<(rect.x)||
                (this._bullet[i].y+this._bullet[i].height)<(rect.y)) 
            {
               continue;
            }else{
                return true;
            }        
        }
        return false;
    }

    //------------------------------------------------------------------------
    // 重設資料.
    //------------------------------------------------------------------------
    public reset():void {
        // 生命數.
        this._life = KING_LIFE_MAX;
        // 黑幕-等分.
        this._blackEqualParts=0;
        this._blackGraphics.height = 0;
        // 關閉王.
        this.spriteKing1.visible = false;
        this.spriteKing2.visible = false;        
    }

    //------------------------------------------------------------------------
    // 關閉子彈.
    //------------------------------------------------------------------------    
    public closeBullet():void {
        // 關閉子彈.
        for(let i=0; i<KING_BULLET_MAX; i++){
            this._bullet[i].x = 0;
            this._bullet[i].y = 0;
            this._bullet[i].visible = false;            
        }
    }

    //------------------------------------------------------------------------
    // 王被消滅判斷.
    //------------------------------------------------------------------------    
    public ifWipeOut():boolean {
        //
        if(this.life<=0){                                
            this.closeBullet(); // 關閉子彈.
            return true;
        }
        return false;
    }

    //------------------------------------------------------------------------
    // 發射子彈.
    //------------------------------------------------------------------------    
    private _fire(rect:PIXI.AnimatedSprite):void {
        let d:number=0;

        // 防呆.
        if( this._life<=0)
            return;
            
        // 發射子彈.
        for(let i=0; i<KING_BULLET_MAX; i++){
            if(!this._bullet[i].visible){
                // 設定子彈.
                this._bullet[i].x = this.spriteKing1.x+110;
                this._bullet[i].y = this.spriteKing1.y+200;
                this._bullet[i].tx = rect.x;
                this._bullet[i].ty = rect.y;
                this._bullet[i].angle = 0;
                // 速度.
                d = Math.sqrt((this._bullet[i].x-this._bullet[i].tx)*(this._bullet[i].x-this._bullet[i].tx)+(this._bullet[i].y-this._bullet[i].ty)*(this._bullet[i].y-this._bullet[i].ty));
                this._bullet[i].vx = ((this._bullet[i].x-this._bullet[i].tx)/d*4);
                this._bullet[i].vy = ((this._bullet[i].y-this._bullet[i].ty)/d*4);
                this._bullet[i].visible = true;
                return;
            }
        }                        
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
            King.sPixi.stage.addChild(this._spriteGraphics);
            // 顯示子彈碰撞區域.
            for(let i=0; i<KING_BULLET_MAX; i++)
                King.sPixi.stage.addChild(this._bulletGraphics[i]);            
        }else{
            // 關閉碰撞區域.
            King.sPixi.stage.removeChild(this._spriteGraphics);
            // 顯示子彈碰撞區域.
            for(let i=0; i<KING_BULLET_MAX; i++)
                King.sPixi.stage.removeChild(this._bulletGraphics[i]);
        }
    }

    //------------------------------------------------------------------------
    // 取得.
    //------------------------------------------------------------------------
    public get life():number{
        if(this._life<=0){
            this.spriteKing1.visible = true;
            this.spriteKing2.visible = false;    
        }
        return this._life;
    }

}
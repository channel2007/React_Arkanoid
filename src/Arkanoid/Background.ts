//============================================================================
//
// 名稱：背景物件.
//
//============================================================================
import * as PIXI from 'pixi.js';
import {BasicCore} from '../Arkanoid/BasicCore';

// 列舉-背景樣式.
export enum BACKGROUND_STYLE {
    STYLE_1=0,
    STYLE_2,
    STYLE_3,
    STYLE_4,
    STYLE_5,
}

export class Background extends BasicCore{
    // 背景.
    private _background:Array<PIXI.AnimatedSprite>=[];
    // 背景風格.
    private _style:BACKGROUND_STYLE = BACKGROUND_STYLE.STYLE_1;

    //------------------------------------------------------------------------
    // 建構式.
    //------------------------------------------------------------------------
    constructor(style:BACKGROUND_STYLE) {
        let backgroundTextures = [];

        // 執行基礎類建構函數.
        super();

        this._style = style;

        // 背景.
        if(this._style===BACKGROUND_STYLE.STYLE_1)
            backgroundTextures=this.getTexture(['background_1.png']);
        else if(this._style===BACKGROUND_STYLE.STYLE_2)
            backgroundTextures=this.getTexture(['background_2.png']);
        else if(this._style===BACKGROUND_STYLE.STYLE_3)
            backgroundTextures=this.getTexture(['background_3.png']);
        else if(this._style===BACKGROUND_STYLE.STYLE_4)
            backgroundTextures=this.getTexture(['background_4.png']);
        else if(this._style===BACKGROUND_STYLE.STYLE_5)
            backgroundTextures=this.getTexture(['background_5.png']);
        this._background.push(new PIXI.AnimatedSprite(backgroundTextures));
        this._background[0].x = 0;
        this._background[0].y = 0;    
        this._background[0].gotoAndPlay(0);
        this._background[0].animationSpeed = 1;
        this._background[0].zIndex = 0;
        Background.sPixi.stage.addChild(this._background[0]);

    }

    //--------------------------------------------------------------------------
    // 釋放.
    //--------------------------------------------------------------------------
    public destroy():void{        
        // 背景.
        for(let i=0; i<this._background.length; i++){
            Background.sPixi.stage.removeChild(this._background[i]);
            this._background[i].destroy();
        }        
    }

    //------------------------------------------------------------------------
    // 更新背景.
    //------------------------------------------------------------------------
    public updateBg(style:BACKGROUND_STYLE):void{        
        if(style===BACKGROUND_STYLE.STYLE_1)
            this._background[0].textures = this.getTexture(['background_1.png']);
        else if(style===BACKGROUND_STYLE.STYLE_2)
            this._background[0].textures = this.getTexture(['background_2.png']);
        else if(style===BACKGROUND_STYLE.STYLE_3)
            this._background[0].textures = this.getTexture(['background_3.png']);                    
        else if(style===BACKGROUND_STYLE.STYLE_4)
            this._background[0].textures = this.getTexture(['background_4.png']);
        else if(style===BACKGROUND_STYLE.STYLE_5)
            this._background[0].textures = this.getTexture(['background_5.png']);
    }
    
    //------------------------------------------------------------------------
    // 更新.
    //------------------------------------------------------------------------
    public update(delta:number){}

}
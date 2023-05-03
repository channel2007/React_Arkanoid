//============================================================================
//
// 名稱：物件貼圖.
//
//============================================================================
import * as PIXI from 'pixi.js';

export abstract class BasicCore{
    // pixi物件.
    public static sPixi:PIXI.Application;

    // 動畫最大張數.
    protected _maxFrame:number = 0;

    //------------------------------------------------------------------------
    // 初始敵機資源.
    //------------------------------------------------------------------------
    public static Init(p:PIXI.Application){
        this.sPixi = p;
    }

    //------------------------------------------------------------------------
    // 釋放敵機資源.
    //------------------------------------------------------------------------
    public static Free(){}

    //------------------------------------------------------------------------
    // 回傳物件貼圖.
    //------------------------------------------------------------------------
    public getTexture( imgArr:any):any{      
        let explosionTextures = [];
        let texture;
        for(let i=0; i<imgArr.length; i++){
            texture = PIXI.Texture.from(imgArr[i]);
            explosionTextures.push(texture);                
        }
        this._maxFrame = imgArr.length;
        return explosionTextures;
    }

}
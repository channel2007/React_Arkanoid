//============================================================================
// 過場物件.
// 參考資料:
// -載入字型檔.
//  https://jsfiddle.net/Bouh/te72sa5d/12/
//
//============================================================================
import * as PIXI from 'pixi.js';
import {BasicCore} from '../Arkanoid/BasicCore';
import {GameData} from './GameData';

export class Transitions extends BasicCore{

    // 背景.
    private _backgroundGraphics = new PIXI.Graphics();    

    // 字風格.
    //private _fontStyleRed:PIXI.TextStyle;
    //private _fontStyleWhite:PIXI.TextStyle;
    // 文字-抬頭.
    //private _titleText:PIXI.Text;
    private _titleText:Array<PIXI.BitmapText>=[];
    // 文字-分數.
    //private _scoreText:PIXI.Text;
    private _scoreText:Array<PIXI.BitmapText>=[];
    // 文字-最高分數.
    //private _highScoreText:PIXI.Text;
    private _highScoreText:Array<PIXI.BitmapText>=[];
    // 文字-關卡.
    //private _roundText:PIXI.Text;
    private _roundText:Array<PIXI.BitmapText>=[];

    // 過場開關.
    private _visible:boolean = false;

    //------------------------------------------------------------------------
    // 建構式.
    //------------------------------------------------------------------------
    constructor(){

        super();

        // 背景.
        this._backgroundGraphics.zIndex = 20;
        this._backgroundGraphics.beginFill(0x000000);
        this._backgroundGraphics.drawRect(0, 0, GameData.SCREEN_WIDTH_BASE, GameData.SCREEN_HEIGHT_BASE);
        this._backgroundGraphics.endFill();        
        this._backgroundGraphics.x = 0;
        this._backgroundGraphics.y = 0;            

        /*
        //--------------------------------------------------------------------
        // 介面字風格.
        this._fontStyleRed = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 40,            
            align: 'right',
            lineHeight: 64,
            fill: ['#ff0000', '#ff0000'], 
        });
         */
        // 文字-抬頭.        
        //this._titleText = new PIXI.Text("1UP           HIGH SCORE", this._fontStyleRed);
        this._titleText[0] = new PIXI.BitmapText("1UP    HIGH SCORE", { fontName: 'ArkanoidFont', tint:0xcc6600, fontSize: 24, letterSpacing:4, align: 'left' });
        this._titleText[0].zIndex = 20;
        //this._titleText[0].style.fill = ['#ff0000', '#ff0000'] ;
        this._titleText[0].x=140;
        this._titleText[0].y=32;        
       
        /*
        //--------------------------------------------------------------------
        // 介面字風格.
        this._fontStyleWhite = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 40,            
            align: 'right',
            lineHeight: 64,
            fill: ['#ffffff', '#ffffff'], 
        });
        */

        // 文字-分數.
        //this._scoreText = new PIXI.Text(GameData.Score, this._fontStyleWhite);     
        this._scoreText[0] = new PIXI.BitmapText("1UP    HIGH SCORE", { fontName: 'ArkanoidFont', fontSize: 24, letterSpacing:4, align: 'left' });
        this._scoreText[0].zIndex = 20;
        this._scoreText[0].x=this._titleText[0].x+64;
        this._scoreText[0].y=this._titleText[0].y+34;        
        // 文字-最高分數.
        //this._highScoreText = new PIXI.Text(GameData.HighScore, this._fontStyleWhite);        
        this._highScoreText[0] = new PIXI.BitmapText(GameData.HighScore.toString(), { fontName: 'ArkanoidFont', fontSize: 24, letterSpacing:4, align: 'left' });
        this._highScoreText[0].zIndex = 20;
        this._highScoreText[0].x=this._titleText[0].x+320;
        this._highScoreText[0].y=this._titleText[0].y+34;
        // 文字-關卡.
        //this._roundText = new PIXI.Text("ROUND 1", this._fontStyleWhite);        
        this._roundText[0] = new PIXI.BitmapText("", { fontName: 'ArkanoidFont', fontSize: 24, letterSpacing:4, align: 'left' });
        this._roundText[0].zIndex = 20;
        this._roundText[0].x=this._titleText[0].x+260;
        this._roundText[0].y=this._titleText[0].y+428;
        
        
    }

    //--------------------------------------------------------------------------
    // 釋放.
    //--------------------------------------------------------------------------
    public destroy():void{}

    //------------------------------------------------------------------------
    // 更新.
    //------------------------------------------------------------------------
    public update(delta:number):void{}

    //------------------------------------------------------------------------
    // 過場開關.
    //------------------------------------------------------------------------
    public set visible(v:boolean){
        // 文字-分數.
        if(GameData.Score===0)
            this._scoreText[0].text = "00";
        else
            this._scoreText[0].text = GameData.Score.toString();

        // 文字-最高分數.
        this._highScoreText[0].text = GameData.HighScore.toString();
        // 文字-關卡.
        this._roundText[0].text = "ROUND  "+GameData.Round;

        if(this._visible===v)
            return;
            
        if(v){
            Transitions.sPixi.stage.addChild(this._backgroundGraphics);   
            Transitions.sPixi.stage.addChild(this._titleText[0]);
            Transitions.sPixi.stage.addChild(this._scoreText[0]);        
            Transitions.sPixi.stage.addChild(this._highScoreText[0]);    
            Transitions.sPixi.stage.addChild(this._roundText[0]);        
        }else{
            Transitions.sPixi.stage.removeChild(this._backgroundGraphics);   
            Transitions.sPixi.stage.removeChild(this._titleText[0]);
            Transitions.sPixi.stage.removeChild(this._scoreText[0]);        
            Transitions.sPixi.stage.removeChild(this._highScoreText[0]);    
            Transitions.sPixi.stage.removeChild(this._roundText[0]);        
        }
        this._visible=v;
    }

}
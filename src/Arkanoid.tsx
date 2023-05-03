import React from 'react';
import './Arkanoid.css';

import * as PIXI from 'pixi.js';

import { isMobile} from 'react-device-detect';
import {GameData,TOUCHE_STATE} from './Arkanoid/GameData';
import {GameMain} from './Arkanoid/GameMain';

// 傳入參數.
// 變數後面加?表示可以不需要傳入變數.
export interface Props {
  width_base: number;                   // 基底-寬.
  height_base: number;                  // 基底-高.
  screen_mode:number;                   // 顯示模式(0:比例不變 1:全螢幕).
}

export default class Arkanoid extends React.Component<Props, object>{
    // pixi物件.
    public  pixi:PIXI.Application;          

    // gameMain.
    public gameMain:GameMain;

    //--------------------------------------------------------------------------
    // 初始變數.
    //--------------------------------------------------------------------------
    constructor(props:any) {
        let resolution = 1;

        super(props);

        // 如果顯示模式=比例不變.
        if(this.props.screen_mode===0){
            // 判斷裝置設定resolution.        
            if (isMobile)
                resolution = 0.4;
            else
                resolution = 1;            
        }
           
        // pixi物件.
        this.pixi = new PIXI.Application({ 
            backgroundColor: 0x000000,
            width: this.props.width_base, 
            height: this.props.height_base,
            antialias: false,                      // 預設為 False，會使字體更圓滑，反鋸齒.
            transparent: false,                   // 預設為 False，背景透明，如果你希望看到 HTML 背影那就設為 true 吧.            
            resolution: resolution
            //resolution: 1/window.devicePixelRatio
        });

        
        // 基底寬高.
        GameData.SCREEN_WIDTH_BASE = this.props.width_base;
        GameData.SCREEN_HEIGHT_BASE= this.props.height_base;
        // 顯示模式(0:比例不變 1:全螢幕).
        GameData.SCREEN_MODE = this.props.screen_mode;

        // GameMain.
        this.gameMain = new GameMain(this.pixi);

        // 綁定函數.
        this.update=this.update.bind(this);
        this.onResize=this.onResize.bind(this);
        this.inputKeyDown=this.inputKeyDown.bind(this);
        this.inputKeyUp=this.inputKeyUp.bind(this);
    }

    //--------------------------------------------------------------------------
    // 初始.
    //--------------------------------------------------------------------------
    componentDidMount(){        
        // 加入view.
        document.body.appendChild(this.pixi.view);        

        // 設定主迴圈.
        this.pixi.ticker.autoStart = false;
        this.pixi.ticker.maxFPS = 60;
        this.pixi.ticker.minFPS = 60;
        this.pixi.ticker.speed = 1;
        //this.pixi.ticker.stop();
        this.pixi.ticker.start();

        //----------------------------------------------------------------------
        // 主迴圈.
        this.pixi.ticker.add(this.update);
                        
        // 加入視窗改變事件.
        window.addEventListener("resize", this.onResize);      
        // 加入鍵盤(按下)事件.
        window.addEventListener("keydown", this.inputKeyDown);
        // 加入鍵盤(放開)事件.
        window.addEventListener("keyup", this.inputKeyUp);

        // 加入觸碰式事件.
        window.addEventListener("touchstart", this.handleTouchEvent, false);
        window.addEventListener("touchend", this.handleTouchEvent, false); 
        window.addEventListener("touchmove", this.handleTouchEvent, false);         

        // 加入Mouse移動.
        window.addEventListener("mousemove", this.mouseMoveEvent);

        // 隨螢幕大小改變尺寸.
        this.onResize();
    }

    //--------------------------------------------------------------------------
    // 移除.
    //--------------------------------------------------------------------------
    componentWillUnmount(){    

        // 加入Mouse移動.
        window.removeEventListener("mousemove", this.mouseMoveEvent);

        // 移除觸碰式事件.
        window.removeEventListener("touchstart", this.handleTouchEvent, false);
        window.removeEventListener("touchend", this.handleTouchEvent, false); 
        window.removeEventListener("touchmove", this.handleTouchEvent, false);         

        // 移除顯示區.
        document.body.removeChild(this.pixi.view);
        // 移除FPS.        
        //document.body.removeChild(document.getElementById('stats')!);
        
        // 移除視窗改變事件.
        window.removeEventListener( "resize", this.onResize);
        // 移除鍵盤事件.
        window.removeEventListener("keydown", this.inputKeyDown);
        // 移除鍵盤事件.
        window.removeEventListener("keyup", this.inputKeyUp);

        // gameMain釋放.
        this.gameMain.destroy();        
    }

    //--------------------------------------------------------------------------
    // 主迴圈.
    //--------------------------------------------------------------------------
    private update(delta:number):void {         
        this.gameMain.update(delta);
    }

    //--------------------------------------------------------------------------
    // 隨螢幕大小改變尺寸.
    //--------------------------------------------------------------------------
    private onResize():void {         
        let w = window.innerWidth;       
        let h = window.innerHeight;                   
        
        // 0:比例不變.
        if( GameData.SCREEN_MODE === 0){
            let scale = Math.min(w/this.props.width_base,h/this.props.height_base); 
            this.pixi.view.style.left   = (w-scale*this.props.width_base)/2 + "px"; 
            this.pixi.view.style.top    = (h-scale*this.props.height_base)/2 + "px"; 
            this.pixi.view.style.width  = scale*this.props.width_base + "px"; 
            this.pixi.view.style.height = scale*this.props.height_base + "px";          
            this.pixi.view.style.position = "absolute";
            this.pixi.view.style.display = "block";
            //alert(window.devicePixelRatio);
        // 1:全螢幕.
        }else{                    
            //let scaleX = (w/this.props.width_base); 
            //let scaleY = (h/this.props.height_base); 
            //this.pixi.view.style.left = (w-scaleX*this.props.width_base)/2 + "px"; 
            //this.pixi.view.style.top =  (h-scaleY*this.props.height_base)/2 + "px"; 
            //this.pixi.view.style.width = scaleX * this.props.width_base + "px"; 
            //this.pixi.view.style.height= scaleY * this.props.height_base + "px";        
            this.pixi.view.style.left  = "0px";
            this.pixi.view.style.top   = "0px";
            this.pixi.view.style.width = "100%";
            this.pixi.view.style.height= "100%";
        }
        
    }

    //--------------------------------------------------------------------------
    // 鍵盤事件-按下.
    //--------------------------------------------------------------------------
    private inputKeyDown(e:any):void{
        //console.log("KeyDown:"+e.keyCode);
        this.gameMain.inputKeyDown(e);
    }  
  
    //--------------------------------------------------------------------------
    // 鍵盤事件-放開.
    //--------------------------------------------------------------------------
    private inputKeyUp(e:any):void{
        //console.log("KeyUp:"+e.keyCode);
        this.gameMain.inputKeyUp(e);
    }  
  
    //--------------------------------------------------------------------------
    // 觸碰事件.
    // https://codertw.com/%E5%89%8D%E7%AB%AF%E9%96%8B%E7%99%BC/260238/
    //--------------------------------------------------------------------------
    private handleTouchEvent(e:any):void{        
        // 計算觸碰座標.
        let w = window.innerWidth/GameData.SCREEN_WIDTH_BASE;
        let h = window.innerHeight/GameData.SCREEN_HEIGHT_BASE; 

        //只判斷一次碰撞.
        if (e.touches.length === 1) {             
            switch (e.type) { 
                case "touchstart": 
                    //console.log("Touch started ( "+e.touches[0].clientX+", "+e.touches[0].clientY + ")");
                    //this.gameplay.touchStarted(e.touches[0].clientX, e.touches[0].clientY);
                    //alert("Touch started ( "+e.touches[0].clientX+", "+e.touches[0].clientY + ")");
                    GameData.ToucheMode = TOUCHE_STATE.TOUCH_START;
                    GameData.ToucheX = e.touches[0].clientX/w;
                    GameData.ToucheY = e.touches[0].clientY/h;                        
                break; 
                case "touchmove": 
                    e.preventDefault(); //阻止滾動                 
                    //console.log("Touch move ( "+e.changedTouches[0].clientX+", "+e.changedTouches[0].clientY+ ")");                
                    //alert("Touch ended ( "+e.changedTouches[0].clientX+", "+e.changedTouches[0].clientY+ ")");
                    GameData.ToucheMode = TOUCHE_STATE.TOUCH_MOVE;
                    GameData.ToucheX = e.changedTouches[0].clientX/w;
                    GameData.ToucheY = e.changeTouches[0].clientY/h;
                break;
            }
        }
        switch (e.type) { 
            case "touchend": 
                //console.log("Touch ended ( "+e.changedTouches[0].clientX+", "+e.changeTouches[0].clientY+ ")");
                //alert("Touch ended ( "+e.changedTouches[0].clientX+", "+e.changeTouches[0].clientY+ ")");                
                GameData.ToucheMode = TOUCHE_STATE.TOUCH_END;
                GameData.ToucheX = e.changedTouches[0].clientX/w;
                GameData.ToucheY = e.changeTouches[0].clientY/h;
            break; 
        }

    }
    private mouseMoveEvent(e:any):void{
        GameData.MouseX = e.clientX;
        GameData.MouseY = e.clientY;
    }    
    
    //--------------------------------------------------------------------------
    render () {
        return (null);    
    }

}

//export default SpaceInvaders;

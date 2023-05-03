//============================================================================
//
// 名稱：載入資源.
//
//============================================================================
import * as PIXI from 'pixi.js';

// 列舉-檔案載入狀態.
export enum LOADER_MODE {
    WAITING,                // 等待開始載入.
    LOADING,                // 載入中.
    COMPLETE,               // 載入完畢.
    INGAME,                 // 進入遊戲.
}

export class LoaderResource{    
    // pixi物件.
    public static sPixi:PIXI.Application;
    // 圖檔是否載入完畢.
    public static sImageLoadComplete:number = LOADER_MODE.WAITING;
    // 進度.
    private static progressStyle:PIXI.TextStyle;
    private static progressText:PIXI.Text;    
    
    //------------------------------------------------------------------------
    // 初始敵機資源.
    //------------------------------------------------------------------------
    public static Init(p:PIXI.Application){
        
        if(this.sImageLoadComplete===LOADER_MODE.WAITING){
            this.sPixi = p;            

            // 進度.
            this.progressStyle = new PIXI.TextStyle({
                fontSize: 48,
                fontStyle: 'italic',
                fontWeight: 'bold',
                fill: ['#ffffff', '#ffffff'],
                stroke: '#000000',
                strokeThickness: 4,
                letterSpacing:5,
                wordWrap: true,
                wordWrapWidth: 440,
                lineJoin: 'round',
            });
            this.progressText = new PIXI.Text('LOADING。。。', this.progressStyle);
            this.progressText.x=240;
            this.progressText.y=424;
            //this.progressText.zIndex = 1000;
            LoaderResource.sPixi.stage.addChild(this.progressText);

            this.sPixi.loader
            .add('arkanoid_json', './images/arkanoid.json')

            .add('background_1_json', './images/background_1.json')
            .add('background_2_json', './images/background_2.json')
            .add('background_3_json', './images/background_3.json')
            .add('background_4_json', './images/background_4.json')
            .add('background_5_json', './images/background_5.json')

            .add('king_json', './images/king.json')
            .add('bullet_json', './images/bullet.json')
            
            .add('arkanoid_xml', './fonts/FontWhite.xml')

            .load(this.onLoadComplete.bind(this))                       // 載入完成.            
            .onProgress.add((p) => {                                    // 載入進度.
                this.progressText.text="LOADING。。。"+ Math.round(p.progress) +"%";
                if(Math.round(p.progress)>=100){
                    LoaderResource.sPixi.stage.removeChild(this.progressText);
                    //this.progressText.destroy();
                }
                console.log("【載入進度】"+p.progress);
            });    
        }
    }
    //------------------------------------------------------------------------
    // 釋放敵機資源.
    //------------------------------------------------------------------------
    public static Free(){
        // 釋放圖形資源.
        this.sPixi.loader.destroy ();
        LoaderResource.sImageLoadComplete = LOADER_MODE.WAITING;
    }
    //------------------------------------------------------------------------
    // 圖形載入完畢.
    //------------------------------------------------------------------------
    private static onLoadComplete():void{                
        this.sImageLoadComplete =  LOADER_MODE.COMPLETE;
     }

}

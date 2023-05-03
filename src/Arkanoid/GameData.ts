//============================================================================
//
// 名稱：遊戲資料.
//
//============================================================================
// 列舉-觸碰狀態.
export enum TOUCHE_STATE {
    TOUCH_START,
    TOUCH_END, 
    TOUCH_MOVE,
    TOUCH_NONE,
}

//============================================================================
// 遊戲資料.
//============================================================================
export class GameData{
    // 基本螢幕大小.    
    public static SCREEN_WIDTH_BASE:number = 1024;
    public static SCREEN_HEIGHT_BASE:number=  896;
    // 顯示模式(0:比例不變 1:全螢幕).
    public static SCREEN_MODE:number=0;
    
    // 觸碰模式.
    public static ToucheMode:TOUCHE_STATE=TOUCHE_STATE.TOUCH_NONE;
    // 觸碰座標.
    public static ToucheX:number=0;
    public static ToucheY:number=0;

    // Mouse座標.
    public static MouseX:number=0;
    public static MouseY:number=0;

    // 無敵.
    public static Invincible:boolean = true;

    // 板子最大數量.
    public static LifeMax:number=12;
    // 板子現在數量.
    public static LifeNow:number=3;

    // 最高分.
    public static HighScore:number=50000;
    // 分數.
    public static Score:number=0;

    // 關卡.
    public static Round:number=1;

    // 磚塊數量.
    public static BricksMax:number=0;
     

    //--------------------------------------------------------------------------
    // 暫停N毫秒.
    //--------------------------------------------------------------------------
    public static sleep(m:number):void{
        for(var t = Date.now();Date.now() - t <= m;);
    }

}
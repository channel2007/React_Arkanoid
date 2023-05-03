//============================================================================
//
// 名稱：關卡物件.
//
//============================================================================
import * as PIXI from 'pixi.js';
import {BasicCore} from './BasicCore';
import {GameData} from './GameData';
import {Brick} from './Brick';
import {ROUND,GAME_ROUND} from './Round';


export class GameRound extends BasicCore{

    // 所有磚塊.
    public bricks:Array<Brick>=[];
    
    // 除錯開關.
    private _debugSwitch:Boolean = false;

    //------------------------------------------------------------------------
    // 建構式.
    //------------------------------------------------------------------------
    constructor(level:GAME_ROUND) {
        // 執行基礎類建構函數.
        super();                    
        // 更新關卡.
        this.updateRound(level);

        // 刪除元素.
        //this.bricks[1].destroy();
        //this.bricks.splice(1, 1);
    }
 
    //--------------------------------------------------------------------------
    // 釋放.
    //--------------------------------------------------------------------------
    public destroy():void{}

    //------------------------------------------------------------------------
    // 更新關卡.
    //------------------------------------------------------------------------
    public updateRound(level:GAME_ROUND):void{
        let round:any = [];
        let strongBrick:number = 0;

        // 刪除磚塊.
        for(let i=0; i<this.bricks.length; i++)
            this.bricks[i].destroy();
        this.bricks.length = 0

        // 取得關卡資料.
        round = ROUND.getRound(level);

        // 重建磚塊.
        for(let y=0; y<18; y++){
            for(let x=0; x<11; x++){                         
                if(round[y][x]>0){
                    // 建立磚塊.                    
                    this.bricks.push(new Brick(round[y][x]-1));
                    this.bricks[GameData.BricksMax].sprite.x = 64+(64*x);
                    this.bricks[GameData.BricksMax].sprite.y = 31+(32*y);                    
                    this.bricks[GameData.BricksMax].update();
                    GameData.BricksMax++;
                    // 紀錄打不壞的磚塊數量.
                    if(round[y][x]===10)
                        strongBrick++;
                }
            }
        }
        // 扣掉打不壞磚塊數量.
        GameData.BricksMax-=strongBrick;
    }

    //------------------------------------------------------------------------
    // 更新.
    //------------------------------------------------------------------------
    public update(delta:number):void{}

    //------------------------------------------------------------------------
    // 球碰撞磚塊測試.
    //------------------------------------------------------------------------
    public hitTestBall(ballRect:PIXI.AnimatedSprite):number {
        for(let i=0; i<this.bricks.length; i++){            
            // 判斷磚塊開啟.
            if(this.bricks[i].sprite.visible){
                if(this.bricks[i].hitTestSprite(ballRect))
                    return i;
            }
        }
        return -1;    
    }

    //------------------------------------------------------------------------
    // 除錯開關.
    //------------------------------------------------------------------------
    public set debugs(s:boolean){
        if(this._debugSwitch===s)
            return;            
        this._debugSwitch=s;
        for(let i=0; i<this.bricks.length; i++){
            this.bricks[i].debugs = s;
        }
    }

}
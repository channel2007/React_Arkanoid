//============================================================================
//
// 名稱：音效物件.
//
//============================================================================
import { Howl } from 'howler';

// 列舉-播放音效.
export enum SOUND_TYPE {
    ROUND_START,                // 0:開始遊戲音效.
    BRICKS_BOUNCE_1,            // 1:磚塊反彈.
    BRICKS_BOUNCE_2,            // 2:硬磚塊反彈.
    BOARD_BOUNCE,               // 3:板子反彈.
    BOARD_BOOM,                 // 4:板子爆炸.
    GAME_OVER,                  // 5:Game Over.
    FINAL_BOSS,                 // 6:最後王開始音樂.
    ENDING,                     // 7:破關.
    EXTRA_LIFE                  // 8:1UP.
}

export class Sound {

    // 音樂、音效開關.
    private static _soundMute:Boolean = false;
    // 音效.    
    private static _sound:Array<Howl> = [];

    //------------------------------------------------------------------------
    // 初始.
    //------------------------------------------------------------------------
    public static Init() {
        Sound._sound.push(new Howl({src: ['./sounds/RoundStart.mp3']}));
        Sound._sound.push(new Howl({src: ['./sounds/BricksBounce1.mp3']}));
        Sound._sound.push(new Howl({src: ['./sounds/BricksBounce2.mp3']}));
        Sound._sound.push(new Howl({src: ['./sounds/BoardBounce.mp3']}));
        Sound._sound.push(new Howl({src: ['./sounds/BoardBoom.mp3']}));
        Sound._sound.push(new Howl({src: ['./sounds/GameOver.mp3']}));
        Sound._sound.push(new Howl({src: ['./sounds/FinalBoss.mp3']}));
        Sound._sound.push(new Howl({src: ['./sounds/Ending.mp3']}));
        Sound._sound.push(new Howl({src: ['./sounds/ExtraLife.mp3']}));                
    }

    //--------------------------------------------------------------------------
    // 釋放.
    //--------------------------------------------------------------------------
    public static Free(){}
 
    //--------------------------------------------------------------------------
    // 播放音樂音效.
    //--------------------------------------------------------------------------
    public static play(type:SOUND_TYPE){
        if(type===SOUND_TYPE.ROUND_START)
            Sound._sound[0].play();
        else if(type===SOUND_TYPE.BRICKS_BOUNCE_1)
            Sound._sound[1].play();
        else if(type===SOUND_TYPE.BRICKS_BOUNCE_2)
            Sound._sound[2].play();
        else if(type===SOUND_TYPE.BOARD_BOUNCE)
            Sound._sound[3].play();
        else if(type===SOUND_TYPE.BOARD_BOOM)
            Sound._sound[4].play();
        else if(type===SOUND_TYPE.GAME_OVER)
            Sound._sound[5].play();
        else if(type===SOUND_TYPE.FINAL_BOSS)
            Sound._sound[6].play();
        else if(type===SOUND_TYPE.ENDING)
            Sound._sound[7].play();
        else if(type===SOUND_TYPE.EXTRA_LIFE)
            Sound._sound[8].play();

    }    

    //--------------------------------------------------------------------------
    // 播放音樂音效.
    //--------------------------------------------------------------------------
    public static stop(type:SOUND_TYPE){
        if(type===SOUND_TYPE.ROUND_START)
            Sound._sound[0].stop();
        else if(type===SOUND_TYPE.BRICKS_BOUNCE_1)
            Sound._sound[1].stop();
        else if(type===SOUND_TYPE.BRICKS_BOUNCE_2)
            Sound._sound[2].stop();
        else if(type===SOUND_TYPE.BOARD_BOUNCE)
            Sound._sound[3].stop();
        else if(type===SOUND_TYPE.BOARD_BOOM)
            Sound._sound[4].stop();
        else if(type===SOUND_TYPE.GAME_OVER)
            Sound._sound[5].stop();
        else if(type===SOUND_TYPE.FINAL_BOSS)
            Sound._sound[6].stop();
        else if(type===SOUND_TYPE.ENDING)
            Sound._sound[7].stop();
        else if(type===SOUND_TYPE.EXTRA_LIFE)
            Sound._sound[8].stop();
            
    }
    
    //--------------------------------------------------------------------------
    // 開關音樂音效.
    //--------------------------------------------------------------------------
    public static set mute(v:Boolean){    
        Sound._soundMute = v;
        if(v)
            Howler.mute(true);
        else
            Howler.mute(false);
    }
    public static get mute(){    
        return Sound._soundMute;
    }
    
}
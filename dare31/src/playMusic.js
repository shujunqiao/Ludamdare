/**
 * Created by cocos-q on 14-12-7.
 */

var SOUND_TYPE = {
    BOMB:0,
    PO_0:1,
    PO_1:2,
    PO_2:3,
    win:4,
    lose:5
}

var PlayMusic = cc.Class.extend({
    _audio:null,
    ctor:function(){
        this._audio = cc.audioEngine;
    },
    playMusic:function(){
        this._audio.playMusic(res.bk_music_1, true);
    },
    stopMusic:function(){
        this._audio.stopMusic();
    },
    playSound:function(idx){
        switch (idx){
            case SOUND_TYPE.BOMB:
                this._audio.playEffect(res.sound_bomb);
                break;
            case SOUND_TYPE.PO_0:
                this._audio.playEffect(res.sound_po_0);
                break;
            case SOUND_TYPE.PO_1:
                this._audio.playEffect(res.sound_po_1);
                break;
            case SOUND_TYPE.PO_2:
                this._audio.playEffect(res.sound_po_2);
                break;
            case SOUND_TYPE.lose:
                this._audio.playEffect(res.sound_lose);
            case SOUND_TYPE.win:
                this._audio.playEffect(res.sound_win);
                break;
        }
    }
});

var _instance = null
PlayMusic.getInstance = function(){
    if(null == _instance){
        _instance = new PlayMusic();
    }
    return _instance;
}


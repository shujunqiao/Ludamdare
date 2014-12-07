/**
 * Created by cocos-q on 14-12-6.
 */
var GameOverLayer = cc.Layer.extend({
    ctor:function(bWin){
        this._super();

        var size = cc.director.getWinSize();
        //
        var scMgr = null;
        scMgr = SceneManager.getInstance();
        //
        var sp_bk;
        cc.log("in gameover:"+bWin);
        if(bWin){
            sp_bk = new cc.Sprite(res.end_win);
            PlayMusic.getInstance().playSound(SOUND_TYPE.win);
        }
        else{
            sp_bk = new cc.Sprite(res.end_lose);
            var lyWhite = new cc.LayerColor(cc.color(255,255,255));
            this.addChild(lyWhite);
            PlayMusic.getInstance().playSound(SOUND_TYPE.lose);
        }
        this.addChild(sp_bk);
        sp_bk.setPosition(size.width/2, size.height/2);

        var menu = new cc.Menu();
        var btnReturn = new cc.MenuItemImage(res.btn_exit_0,
            res.btn_exit_0,
            function(){
                scMgr.runScene(sc_idx.LOGIN);
            },
            this);
        btnReturn.setPosition(size.width*0.5, size.height*0.12);
        menu.addChild(btnReturn);
        btnReturn.setScale(0.5);
        this.addChild(menu,1);
        menu.setPosition(0,0);
    }
});

var GameOverScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
    },
    init:function(){
        var layer = new GameOverLayer(getGameOverStatus());
        this.addChild(layer);
        layer.init();
    }
});

var gameEndWithWin = null;
var setGameOverStatus = function(bWin){
    gameEndWithWin = bWin;
}
var getGameOverStatus = function(){
    return gameEndWithWin;
}
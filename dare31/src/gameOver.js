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
        if(bWin){
            sp_bk = new cc.Sprite(res.end_win);
        }
        else{
            sp_bk = new cc.Sprite(res.end_lose);
        }
        this.addChild(sp_bk);
        sp_bk.setPosition(size.width/2, size.height/2);

        var menu = new cc.Menu();
        var btnReturn = new cc.MenuItemImage(res.btn_Return_0,
            res.btn_Return_1,
            function(){
                scMgr.runScene(sc_idx.LOGIN);
            },
            this);
        btnReturn.setPosition(size.width/2, size.height*0.3);
        menu.addChild(btnReturn);
        this.addChild(menu,1);
        menu.setPosition(0,0);
    }
});

var GameOverScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
    },
    init:function(){
        var layer = new GameOverLayer();
        this.addChild(layer);
        layer.init();
    }
});
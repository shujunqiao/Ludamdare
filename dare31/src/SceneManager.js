/**
 * Created by cocos-q on 14-7-19.
 */

sc_idx = {
    LOGIN:0,
    MENU:1,
    GAME:2,
    GAME_OVER:3
};

arr_sc = [];
var isFirstRunScene = true;
var SceneManager = cc.Class.extend({
    init:function(){
        this.initScene();
    },
    initScene:function(){
        this.addScene(MyScene, sc_idx.LOGIN);
        this.addScene(GameScene, sc_idx.GAME);
        this.addScene(GameOverScene, sc_idx.GAME_OVER);
    },
    runScene:function(idx){
        console.log("scmgr, idx:", idx, arr_sc.length);
        if(arr_sc[idx] != null ){
            if (isFirstRunScene)
                isFirstRunScene = false;
            var sc = new arr_sc[idx];
            sc.init();
            cc.director.runScene(sc);
        }
    },
    addScene:function(sc, idx){
        arr_sc[idx] = sc;
    }
});

SceneManager._instance = null;
SceneManager.getInstance = function () {
    if (!SceneManager._instance) {
        SceneManager._instance = new SceneManager();
        SceneManager._instance.init();
    }
    return SceneManager._instance;
};

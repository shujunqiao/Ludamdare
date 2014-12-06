
var scMgr = null;

var TIMER_MINUTE = 60;

var BOX_NUM_MAX = 3;

var BOX_RADIUS = 60;
var BORDER_PLAY = {
    x:BOX_RADIUS,
    y:100+BOX_RADIUS,
    w:960-BOX_RADIUS,
    h:300
}

var gGameLayer = null;
var GAME_END_TIMER = 10;

var GameLayer = cc.Layer.extend({
    hp:null,
    scoreV:null,
    timerV:null,
    arrBoxes:null,
    _count:0,
    curSecond:0,
    bGameEnd:false,
    init:function () {

        //////////////////////////////
        // 1. super init first
        this._super();

        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask director the window size
        var size = cc.director.getWinSize();
        scMgr = SceneManager.getInstance();
        cc.log("in game js, size:("+size.width+", "+size.height+")");

        var closeItem = new cc.MenuItemImage(
            res.btn_Return_0,
            res.btn_Return_1,
            function () {
                scMgr.runScene(sc_idx.LOGIN);
            },this);
        closeItem.setAnchorPoint(0.5, 0.5);

        var bk_0 = new cc.Sprite(res.Back_1);
        this.addChild(bk_0);
        bk_0.setPosition(size.width/2, size.height/2);
        bk_0.setScaleY(size.height/bk_0.getContentSize().height);

        var menu = cc.Menu.create(closeItem);
        menu.setPosition(0, 0);
        this.addChild(menu, 1);
        closeItem.setPosition(size.width - 30, 30);

        //add hp
        this.hp = new HPStatus();
        this.addChild(this.hp);
        this.hp.setPosition(100, size.height-23);

        this.scoreV = new SpScore();
        this.addChild(this.scoreV, 1);
        this.scoreV.setPosition(size.width-100, size.height-70);

        this.timerV = new BaseNumber(res.number_time);
        this.addChild(this.timerV);
        this.timerV.setPosition(size.width-50, size.height-30);
        //
//        var num = new OneNumber();
//        this.addChild(num);
//        num.setPosition(100,100);

        var eff = new EffectAdd();
        cc.log("eff:"+eff.bloodEff);

        //add boxes
        this.arrBoxes = [];
        var b_x = size.width/3;
        var b_y = size.height/3;
        var b_w = size.width/6;
        for(var i=0; i<BOX_NUM_MAX; i++){
            var box = new Treasure();
            this.addChild(box);
//            box.x = b_x + b_w*i;
//            box.y = b_y;
            box.setPosition(getRandPos());
            box.setIdx(i);
            this.arrBoxes[i] = box;
        }

//        var symbol = new SpSymbol(2);
//        this.addChild(symbol);
//        symbol.setPosition(200,200);

        //
        this._count = 0;
        this.curSecond = 0;
        this.bGameEnd = false;
        this.scheduleUpdate();
    },
    update:function(dx){
        if(!this.bGameEnd){
            if(this._count % TIMER_MINUTE == 0){
                this.timerV.setNumber(this.curSecond);
                this.curSecond ++;

                if(this.curSecond > GAME_END_TIMER){
                    this.gameOver(true);
                }
            }
            this._count ++;
        }
    },
    gameOver:function(isWin){
        cc.log("game is over:"+isWin);
        this.bGameEnd = true;
        scMgr.runScene(sc_idx.GAME_OVER);
    },
    onClickedOneBox:function(idx){
        cc.log("clicked: "+idx);
        this.removeChild(this.arrBoxes[idx], true);

        var box = new Treasure();
        this.addChild(box);
        box.setPosition(getRandPos());
        box.setIdx(idx);
        this.arrBoxes[idx] = box;
    },
    addScore:function(score){
        cc.log("addScore: "+score);
        this.scoreV.addScore(score);
    },
    subBlood:function(blood){
        cc.log("subBlood: "+blood);
        this.hp.subBlood(blood);
    }
});

var getRandPos = function(){
    var _x = GetRandomNum(BORDER_PLAY.x,BORDER_PLAY.w);
    var _y = GetRandomNum(BORDER_PLAY.y, BORDER_PLAY.y+BORDER_PLAY.h);
    return new cc.Point(_x, _y);
}
var  GetRandomNum = function(Min,Max)
{
    var Range = Max - Min;
    var Rand = Math.random();
    return(Min + Math.round(Rand * Range));
}

var GameScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
    },
    init:function(){
        var layer = new GameLayer();
        this.addChild(layer);
        layer.init();
        gGameLayer = layer;
    }
});
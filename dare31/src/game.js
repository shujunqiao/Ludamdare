
var scMgr = null;

var TIMER_MINUTE = 60;

var BOX_NUM_MAX = 3;

var BOX_RADIUS = 60;
var BORDER_PLAY = {
    x:BOX_RADIUS,
    y:100+BOX_RADIUS,
    w:960-BOX_RADIUS,
    h:300
};

var gGameLayer = null;
var GAME_END_TIMER = 63;

var EFF_INTERVAL_FRAME = 6;
var EFF_SPACE_Y = 5;

var Effs = {
    Mul_2:0,
    Mul_3:1,
    Bomb_1:2,
    Bomb_2:3,
    Sub_Blood:4,
    Add_Score:5
};

var GameLayer = cc.Layer.extend({
    hp:null,
    scoreV:null,
    timerV:null,
    arrBoxes:null,
    _count:0,
    curSecond:0,
    bGameEnd:false,
    touchBeganPos:null,
    _curEffects:null,
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
        this.hp.setPosition(160, size.height-23);

        this.scoreV = new SpScore();
        this.addChild(this.scoreV, 1);
        this.scoreV.setPosition(size.width-80, size.height-70);

        this.timerV = new BaseNumber(res.number_time);
        this.addChild(this.timerV);
        this.timerV.setPosition(size.width-50, size.height-30);
        //
//        var num = new OneNumber();
//        this.addChild(num);
//        num.setPosition(100,100);

//        var eff = new EffectAdd();
//        cc.log("eff:"+eff.bloodEff);

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

        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: this.onTouchBegan,
            onTouchMoved: this.onTouchMoved,
            onTouchEnded: this.onTouchEnded,
            onTouchCancelled: this.onTouchCancelled
        }, this);

//        var symbol = new SpSymbol(2);
//        this.addChild(symbol);
//        symbol.setPosition(200,200);

        //
        this._count = 0;
        this.curSecond = 0;
        this.bGameEnd = false;
        this.touchBeganPos = new cc.Point(0,0);
        this._curEffects = [];
        this.scheduleUpdate();
    },
    onTouchBegan:function(touch, event){
        this.touchBeganPos = touch.getLocation();
        return true;
    },
    onTouchMoved:function(touch, event){
        ;
    },
    onTouchEnded:function(touch, event){
        var endPos = touch.getLocation();
        gGameLayer.checkTouchBox(endPos);
    },
    checkTouchBox:function(pos){
        var arrClicked = []
        for(var i=0; i<BOX_NUM_MAX; i++){
            if( this.arrBoxes[i].checkTouched(pos) ){
                arrClicked.push(i);
            }
        }
        console.log("clicked:", arrClicked.length);
        switch (arrClicked.length){
            case 1:
                this.arrBoxes[arrClicked[0]].onClick();
                break;
            case 2:{
                var eff1 = this.arrBoxes[arrClicked[0]]._effect;
                var eff2 = this.arrBoxes[arrClicked[1]]._effect;
                var sun = eff1.bloodEff + eff2.bloodEff;
                switch (sun){
                    case 0:
                        //this.playEff(Effs.Bomb_2);
                        this.gameOver(false);
                        break;
                    case 2:
                        var score = eff1._score + eff2._score;
                        this.addScore(score);
                        this.playEff(Effs.Mul_2, 2, new cc.Point(pos.x, pos.y+40));
                    case 1:
                        for(var idx in arrClicked){
                            this.arrBoxes[idx].onClick();
                        }
                        break;
                }
            }
                break;
            case 3:
                var eff1 = this.arrBoxes[arrClicked[0]]._effect;
                var eff2 = this.arrBoxes[arrClicked[1]]._effect;
                var eff3 = this.arrBoxes[arrClicked[2]]._effect;
                var sum = eff1.bloodEff + eff2.bloodEff + eff3.bloodEff;
                switch (sum){
                    case 0:
                    case 1:
                        this.gameOver(false);
                        break;
                    case 2:
                        var score = eff1._score;
                        if (!score){
                            score = eff2._score;
                        }
                        this.addScore(score);
                        for(var i=0; i<3; i++){
                            this.arrBoxes[i].onDestoryOneBox(i);
                        }
                        break;
                    case 3:
                        var score = eff1._score + eff2._score + eff3._score;
                        this.addScore(score*2);
                        this.playEff(Effs.Mul_3, 2, new cc.Point(pos.x, pos.y+40));
                        for(var i=0; i<3; i++){
                            this.arrBoxes[i].onClickedOneBox(i);
                        }
                        break;
                }
                break;
        }
    },
    playEff:function(idx, score, pos){
        cc.log("playEff:"+idx);
        switch (idx){
            case Effs.Mul_2:
                var ly = new AddScore(2, Symbol.MUL);
                ly.time = 2;
                ly.setPosition(pos);
                this.addChild(ly);
                this._curEffects[this.getIdxOfEff()] = ly;
                break;
            case Effs.Mul_3:
                var ly = new AddScore(3, Symbol.MUL);
                ly.time = 2;
                ly.setPosition(pos);
                this.addChild(ly);
                this._curEffects[this.getIdxOfEff()] = ly;
                break;
            case Effs.Bomb_1:
                break;
            case Effs.Bomb_2:
                break;
            case Effs.Add_Score:
                var ly = new AddScore(score);
                ly.time = 2;
                ly.setPosition(pos);
                this.addChild(ly);
                this._curEffects[this.getIdxOfEff()] = ly;
                break;
            case Effs.Sub_Blood:
                var ly = new AddScore(score, Symbol.SUB);
                ly.time = 2;
                ly.setPosition(pos);
                this.addChild(ly);
                this._curEffects[this.getIdxOfEff()] = ly;
                break;
        }
        console.log("will playEff:", idx);
    },
    getIdxOfEff:function(){
        var idx = 0;
        for(var i=0; i<this._curEffects.length; i++){
            if(this._curEffects[i] == null)
                return i;
        }
        return this._curEffects.length;
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
            if(this._curEffects.length > 0){
                if(this._count % EFF_INTERVAL_FRAME == 0){
                    for(var item in this._curEffects){
                        if(this._curEffects[item] != null){
                            this._curEffects[item].time -= 0.1;
                            if(this._curEffects[item].time < 0){
                                this.removeChild(this._curEffects[item], true);
                                this._curEffects[item] = null;
                            }
                            else{
                                var i_y = this._curEffects[item].y + EFF_SPACE_Y;
                                this._curEffects[item].setPositionY(i_y);
                            }
                        }
                    }
                }
            }
            this._count ++;
        }
    },
    gameOver:function(isWin){
        cc.log("game is over:"+isWin);
        this.bGameEnd = true;
        setGameOverStatus(isWin);
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
    onDestoryOneBox:function(idx){
        cc.log("onDestoryOneBox:"+idx);
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
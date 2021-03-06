
var MAX_BLOOD = 100;

var HPStatus = cc.Layer.extend({
    bloodBar:null,
    _blood:0,
    ctor:function(){
        this._super();

        cc.log("in hp!");
        //
        this.bloodBar = new ccui.LoadingBar(res.sliderProgress_png);
        this.bloodBar.setName("LoadingBar");
        this.bloodBar.setPercent(100);
        this.bloodBar.setScale(1.2);

        this.addChild(this.bloodBar);

        this._blood = MAX_BLOOD;
    },
    setBlood:function(blood){
        this._blood = blood;
        this.bloodBar.setPercent(this._blood*100/MAX_BLOOD);
    },
    resetCurBlood:function(){
        if(this._blood <= 0){
            gGameLayer.gameOver(false);
            return;
        }
        if(this._blood > MAX_BLOOD){
            this._blood = MAX_BLOOD;
        }
        this.setBlood(this._blood);
    },
    addBlood:function(blood){
        this._blood += blood;
        this.resetCurBlood();
    },
    subBlood:function(blood){
        this._blood -= blood;
        this.resetCurBlood();
    }
});

var BASE_SCORE = 0;
var SpScore = cc.Layer.extend({
    _score:0,
    numSp:null,
    ctor:function(){
        this._super();

        this._score = BASE_SCORE;
        this.numSp = new BaseNumber(res.number_lan);
        this.addChild(this.numSp);
    },
    addScore:function(score){
        this._score += score;
        this.resetCurScore();
    },
    subScore:function(score){
        this._score -= score;
        this.resetCurScore();
    },
    resetCurScore:function(){
        this.setScore(this._score);
    },
    setScore:function(score){
        this._score = score;
//        console.log(this.numSp, this._score);
        this.numSp.setNumber(this._score);
    },
    getScore:function(){
        return this._score;
    }
});

var OneNumber = cc.Layer.extend({
    arrNumbers:null,
    _lastNum:-1,
    u_w:0,
    u_h:0,
    ctor:function(file){
        this._super();

        if(!file){
            file = res.number_life;
        }
        var base_bk = new cc.Sprite(file);
        var size = base_bk.getContentSize();
        var n_x = 0;
        var n_y = 0;
        var n_w = size.width/10;
        this.u_w = n_w;
        this.u_h = size.height;
        this.arrNumbers = [];
        for(var i=0; i<10; i++){
            var rect = cc.rect(n_x+n_w*i, n_y, n_w, size.height);
            var sp = new cc.Sprite(file, rect);
            this.addChild(sp);
            sp.setVisible(false);
            this.arrNumbers[i] = sp;
        }
        this.setNumber(0);
    },
    setNumber:function(num){
        num = parseInt(num);
        if(num>10) num = num % 10;

        //
        if(this._lastNum >= 0){
            this.arrNumbers[this._lastNum].setVisible(false);
        }

        this.arrNumbers[num].setVisible(true);
        this._lastNum = num;
    },
    getW:function(){
        return this.u_w;
    },
    getH:function(){
        return this.u_h;
    }
});

var SPACE_L = 2;
var BaseNumber = cc.Layer.extend({
    _num:null,
    u_w:0,
    _arrNums:null,
    _file:null,
    ctor:function(file){
        this._super();

        if(!file){
            file = res.number_life;
        }

        this._arrNums = [];
        this._file = file;
        //
        this.setNumber(0);
    },
    setNumber:function(num){
        this._num = num;
        var arr = numToArr(this._num);
        for(var i=0; i<arr.length; i++){
            if(i < this._arrNums.length){
                this._arrNums[i].setNumber(arr[i]);
            }
            else{
                var sp = new OneNumber(this._file);
                sp.setPosition(i*(sp.getW() + SPACE_L), 0);
                sp.setNumber(arr[i]);
                sp.setVisible(true);
                this.addChild(sp);
                this._arrNums[i] = sp;
                var size = cc.size((i+1)*(sp.getW() + SPACE_L), sp.getH());
                this.setContentSize(size);
            }
        }
    }
});

var numToArr = function(num){
    var temp = num;
    var arr = [];
    if (temp == 0){
        arr[0] = 0;
    }
    else{
        while(temp>0){
            var single = temp % 10;
            arr[arr.length] = single;
            temp = (temp - single) / 10;
        }
    }
    return arr.reverse();
}

var Timer = BaseNumber.extend({
    ctor:function(){
        ;
    }
});
var Score = BaseNumber.extend({
    ctor:function(){
        this._super(res.number_score);
    }
});

var Symbol = {
    SUB:0,
    ADD:1,
    MUL:2
};

var SpSymbol = cc.Layer.extend({
    ctor:function(idx){
        this._super();
        var sp = new cc.Sprite(res.symbol_png);
        var size = sp.getContentSize();

        if(!idx){
            idx = 0;
        }

        var r_x = 0;
        var r_y = 0;
        var r_w = size.width/3;
        var rect = cc.rect(r_x+r_w*idx, r_y, r_w, size.height);
        var sp1 = new cc.Sprite(res.symbol_png, rect);
        sp1.setScale(2);
        this.addChild(sp1);
    }
});

var SUB_BLOOD_NUM = 10;

var FRAME_IN_PER_CHANGE = 20;
var BOX_LIFT_TIME = 30*FRAME_IN_PER_CHANGE;

var BOX_SCALE_SMALL = 0.5;
var BOX_SCALE_LARGE = 0.51;

var BOX_TOUCH_SIZE = {w:50, h:50};
var Treasure = cc.Layer.extend({
    _idx:0,
    _effect:null,
    _imgSt0:null,
//    _imgSt1:null,
    _count:0,
    _display:false,
    ctor:function(){
        this._super();
        var menu = new cc.Menu();
        menu.x = 0;
        menu.y = 0;
//        var box = new cc.MenuItemImage(res.Box_png,
//                                        res.Box_png,
//                                        this.onClick,
//                                        this);
//        box.x = 0;
//        box.y = 0;
//        menu.addChild(box);
//        this.addChild(menu);
        var strBox = getRandColorBox();
        this._imgSt0 = new cc.Sprite(res[strBox+"1"]);
//        this._imgSt1 = new cc.Sprite(res[strBox+"2"]);

        this._imgSt0.setPosition(0,0);
        this._imgSt0.setScale(BOX_SCALE_SMALL);
//        this._imgSt1.setPosition(0,0);
//        this._imgSt1.setScale(1.05);
//        console.log(this._imgSt0, this._imgSt1);

        this.addChild(this._imgSt0);
//        this.addChild(this._imgSt1);

        this._effect = GetGameEffect();
        this._count = 0;
        this._display = false;

        this.scheduleUpdate();
    },
    checkTouched:function(pos){
//        console.log("checkTouched, pos:", pos, this.x, this.y);
        if(pos.x < this.x-BOX_TOUCH_SIZE.w || pos.x > this.x+BOX_TOUCH_SIZE.w ||
            pos.y > this.y+BOX_TOUCH_SIZE.h || pos.y < this.y-BOX_TOUCH_SIZE.h){
            return false;
        }
        return true;
    },
    onClick:function(){
//        console.log("onClick:",this.getIdx());
        cc.log("bloodEff:"+this._effect.bloodEff);
        if(!gGameLayer){
            return;
        }
        switch (this._effect.bloodEff){
            case BLOOD_EFF.ADD_BLOOD:
                cc.log("eff score:"+this._effect._score);
                gGameLayer.playEff(Effs.Add_Score, this._effect._score, this.getPosition());
                gGameLayer.addScore(this._effect._score);
                break;
            case BLOOD_EFF.SUB_BLOOD:
                cc.log("will sub blood.");
                gGameLayer.playEff(Effs.Sub_Blood, 10, this.getPosition());
                gGameLayer.subBlood(SUB_BLOOD_NUM);
                break;
            case BLOOD_EFF.ADD_LIFE:
                gGameLayer.playEff(Effs.Add_Blood, 10, this.getPosition());
                gGameLayer.addBlood(SUB_BLOOD_NUM);
                gGameLayer.onDestoryOneBox(this.getIdx());
                break;
        }
        if(gGameLayer){
            gGameLayer.onClickedOneBox(this._idx);
        }
    },
    update:function(dx){
        if(this._count > BOX_LIFT_TIME){
            gGameLayer.onDestoryOneBox(this._idx);
        }
        if(this._count % FRAME_IN_PER_CHANGE == 0){
            if(this._display){
                this._imgSt0.setScale(BOX_SCALE_SMALL);
            }
            else{
                this._imgSt0.setScale(BOX_SCALE_LARGE);
            }
            this._display = !this._display;
        }
        this._count ++;
    },
    setIdx:function(idx){
        this._idx = idx;
    },
    getIdx:function(){
        return this._idx;
    }
});

var allColorBox = ["Box_red_", "Box_yellow_", "Box_blue_"];
var getRandColorBox = function(){
    var idx = GetRandomNum(0, allColorBox.length);
    idx %= allColorBox.length;
    return allColorBox[idx];
};

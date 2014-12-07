
var BLOOD_EFF = {
    SUB_BLOOD:0,
    ADD_BLOOD:1,
    ADD_LIFE:100
}

var BaseEffect = cc.Class.extend({
    _idx:0,
    bloodEff:0,

    ctor:function(){
//        this._super();

//        cc.log("in BaseEffects");
    },
    playAnimation:function(idx){
//        cc.log("play animation:"+idx);
    }
});

var SCORE_LV = {
    LV_1:20,
    LV_2:30,
    LV_3:40,
    LV_4:50
}

var EffectAdd = BaseEffect.extend({
    _score:0,
    ctor:function(){
        this._super();

        this.playAnimation(1);
        this.bloodEff = BLOOD_EFF.ADD_BLOOD;
    }
});

var EffectAdd20 = EffectAdd.extend({
    ctor:function(){
        this._super();
        this._score = SCORE_LV.LV_1;
    }
});
var EffectAdd30 = EffectAdd.extend({
    ctor:function(){
        this._super();
        this._score = SCORE_LV.LV_2;
    }
});
var EffectAdd40 = EffectAdd.extend({
    ctor:function(){
        this._super();
        this._score = SCORE_LV.LV_3;
    }
});
var EffectAdd50 = EffectAdd.extend({
    ctor:function(){
        this._super();
        this._score = SCORE_LV.LV_4;
    }
});

var EffectAddLife = BaseEffect.extend({
    ctor:function(){
        this._super();

        this.bloodEff = BLOOD_EFF.ADD_LIFE;
    }
});

var EffectBomb = BaseEffect.extend({
    ctor:function(){
        this._super();

        this.bloodEff = BLOOD_EFF.SUB_BLOOD;
    }
});

var AllEffects = [EffectAdd20, EffectAdd30, EffectAdd40, EffectAdd50, EffectBomb, EffectAddLife];

var GetGameEffect = function(){
    var idx = GetRandomNum(0, AllEffects.length);
    idx %= AllEffects.length;
//    cc.log("get game effect:"+idx);
    var eff = new (AllEffects[idx])();
    return eff;
}

var AddScore = cc.Layer.extend({
    ctor:function(score, type){
        this._super();

        if(!score){
            score = 0;
        }
//        console.log("AddScore, type:", type);
        if(undefined == type){
            type = Symbol.ADD;
        }
        var spAdd = new SpSymbol(type);
        this.addChild(spAdd);
        spAdd.setPosition(0,0);
        var res_file = res.number_life;
        switch (type){
            case Symbol.SUB:
                res_file = res.number_score;
                break;
            case Symbol.MUL:
                res_file = res.number_lan;
                break;
        }
        var spScore = new BaseNumber(res_file);
        this.addChild(spScore);
        spScore.setNumber(score);
        spScore.setPosition(23,-2);
    }
});


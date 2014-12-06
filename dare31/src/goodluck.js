
var BLOOD_EFF = {
    SUB_BLOOD:0,
    ADD_BLOOD:1
}

var BaseEffect = cc.Class.extend({
    _idx:0,
    bloodEff:0,
    ctor:function(){
//        this._super();

        cc.log("in BaseEffects");
    },
    playAnimation:function(idx){
        cc.log("play animation:"+idx);
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
        cc.log("EffectAdd");
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

var EffectBomb = BaseEffect.extend({
    ctor:function(){
        this.bloodEff = BLOOD_EFF.SUB_BLOOD;
    }
});

var AllEffects = [EffectAdd20, EffectAdd30, EffectAdd40, EffectAdd50, EffectBomb];

var GetGameEffect = function(){
    var idx = GetRandomNum(0, AllEffects.length);
    idx %= AllEffects.length;
    cc.log("get game effect:"+idx);
    var eff = new (AllEffects[idx])();
    return eff;
}


/**
 * Created by cocos-q on 14-12-7.
 */

var topScores = null;
var TOP_KEY = {
    t1:"TOP_SCORE_1",
    t2:"TOP_SCORE_2",
    t3:"TOP_SCORE_3"
};
var RankingList = cc.Layer.extend({
    ctor:function(){
        this._super();

        var curStorage = cc.sys.localStorage;
        curStorage.setItem(TOP_KEY.t1, 130);
        curStorage.setItem(TOP_KEY.t3, 140);
        var t1 = curStorage.getItem(TOP_KEY.t1);
        var t2 = curStorage.getItem(TOP_KEY.t2);
        var t3 = curStorage.getItem(TOP_KEY.t3);
        console.log("in rankinglist:",t1,t2,t3);
    }
});
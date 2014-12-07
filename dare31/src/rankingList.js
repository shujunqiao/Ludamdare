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
    arrList:null,
    ctor:function(){
        this._super();

        var curStorage = cc.sys.localStorage;
        curStorage.setItem(TOP_KEY.t1, 130);
        curStorage.setItem(TOP_KEY.t3, 140);
        var t1 = curStorage.getItem(TOP_KEY.t1);
        var t2 = curStorage.getItem(TOP_KEY.t2);
        var t3 = curStorage.getItem(TOP_KEY.t3);
        console.log("in rankinglist:",t1,t2,t3);
        this.arrList = [];
        if(t1 != undefined)
            this.arrList.push(t1);
        if(t2 != undefined)
            this.arrList.push(t2);
        if(t3 != undefined)
            this.arrList.push(t3);
    },
    getTop3List:function(){
        return this.arrList;
    },
    getThisRank:function(score){
        var len = this.arrList.length;
        switch (len){
            case 0:
                this.arrList[0] = score;
                return 1;
            case 1:
                if(this.arrList[0] < score){
                    this.arrList[1] = this.arrList[0];
                    this.arrList[0] = score;
                    return 1;
                }
                this.arrList[1] = score;
                return 2;
            case 2:
                if(this.arrList[0] < score){
                    this.arrList[2] = this.arrList[1];
                    this.arrList[1] = this.arrList[0];
                    this.arrList[0] = score;
                    return 1;
                }
                if(this.arrList[1] < score){
                    this.arrList[2] = this.arrList[1];
                    this.arrList[1] = score;
                    return 2;
                }
                this.arrList[2] = score;
                return 3;
            case 3:
                if(this.arrList[1] < score){
                    this.arrList[2] = this.arrList[1];
                    this.arrList[1] = this.arrList[0];
                    this.arrList[0] = score;
                    return 1;
                }
                if(this.arrList[1] < score){
                    this.arrList[2] = this.arrList[1];
                    this.arrList[1] = score;
                    return 2;
                }
                if(this.arrList[2] < score){
                    this.arrList[2] = score;
                    return 3;
                }
                return -1;
        }
        return -1;
    }
});
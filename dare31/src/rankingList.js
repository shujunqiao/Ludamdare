/**
 * Created by cocos-q on 14-12-7.
 */

var topScores = null;
var TOP_KEY = {
    t1:"TOP_SCORE_1",
    t2:"TOP_SCORE_2",
    t3:"TOP_SCORE_3"
};

var FONT_SCORE_SIZE = 30;

var RankingList = cc.Layer.extend({
    arrList:null,
    ctor:function(){
        this._super();

        var curStorage = cc.sys.localStorage;
//        curStorage.removeItem(TOP_KEY.t1);
//        curStorage.removeItem(TOP_KEY.t2);
//        curStorage.removeItem(TOP_KEY.t3);
        var t1 = curStorage.getItem(TOP_KEY.t1);
        var t2 = curStorage.getItem(TOP_KEY.t2);
        var t3 = curStorage.getItem(TOP_KEY.t3);
//        console.log("in rankinglist:",t1,t2,t3);
        this.arrList = [];
        if(t1 != undefined && t1 != null)
            this.arrList.push(parseInt(t1));
        if(t2 != undefined && t2 != null)
            this.arrList.push(parseInt(t2));
        if(t3 != undefined && t3 != null)
            this.arrList.push(parseInt(t3));
    },
    getTop3List:function(){
        return this.arrList;
    },
    setResult:function(score){
        var str = "";
        //
        var rankN = this.getThisRank(score);
//        console.loglog(this.arrList);
        //
//        this.arrList.sort();
//        console.log(this.arrList);
        var curStorage = cc.sys.localStorage;
        for(var idx in this.arrList){
            var temp = parseInt(idx)+1;
            var key = "t"+temp.toString();
//            console.log("key:", key);
            curStorage.setItem(TOP_KEY[key], this.arrList[idx]);
        }
        //display top3
        var t_h = -43;
        var arrLbs = [];
        for(var idx in this.arrList){
//            var lbTop = new cc.LabelBMFont(this.arrList[idx].toString(), res.Font_bmf_ttf);
            var temp = parseInt(idx)+1;
            var lbTop = new cc.LabelTTF("top"+temp+": "+this.arrList[idx], res.Font_arial, FONT_SCORE_SIZE);
            lbTop.y = t_h * idx;
            this.addChild(lbTop);
            arrLbs.push(lbTop);
        }

        var newLb = new cc.LabelBMFont("new", res.Font_bmf_ttf);
        if(score > 0){
            this.addChild(newLb);
            var lb = null;
            switch (rankN){
                case 1:
                    str = "Great Job!";
                    lb = arrLbs[0];
                    break;
                case 2:
                    str = "Good Job!";
                    lb = arrLbs[1];
                    break;
                case 3:
                    str = "Just so so!";
                    lb = arrLbs[2];
                    break;
                default:
                    newLb.setVisible(false);
                    str = "Come on!";
                    break;
            }

            if(lb != null){
                var size = lb.getContentSize();
                var pos = lb.getPosition();
                newLb.setPosition(pos.x+size.width/2+30,pos.y+10);
                newLb.setScale(0.4);
            }
        }
        else{
            str = "unlucky!!!";
        }
        var lb = new cc.LabelBMFont(str, res.Font_bmf_ttf);
        lb.setPositionY(-t_h);
        this.addChild(lb);
    },
    getThisRank:function(score){
        if(score < 1){
            return -1;
        }
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
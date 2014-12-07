

var scMgr = null;
var g_len = 30;
var g_line = 13;

var MyLayer = cc.Layer.extend({
    bk:null,
    sprite:null,
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

        var newBtn = getBtn(this.onClick, this, "new game", 10);
        newBtn.setPosition(size.width/2, size.height/2);

        var btnBegin = new cc.MenuItemImage(
            res.btn_Begin_0,
            res.btn_Begin_1,
            function () {
                PlayMusic.getInstance().playSound(SOUND_TYPE.PO_2);

                scMgr.runScene(sc_idx.GAME);
            },this);
        btnBegin.setAnchorPoint(0.5, 0.5);
        btnBegin.setPosition(size.width*0.9,size.height*0.27);

        var menu = cc.Menu.create(btnBegin);
        menu.setPosition(0, 0);
        this.addChild(menu, 2);

//        var rank = new RankingList();

//        //add text
//        var txt = new ccui.TextField();
//        txt.fontName = "Marker Felt";
////        txt.setTouchEnabled(true);
//        this.addChild(txt,2);
//        txt.setTextColor(cc.color(100,200,100));
//        txt.setString("A Text");
//        txt.setPosition(100,100);

//        var color = cc.color(255,255,255);
//        var bk_ly = new cc.LayerColor(color, size.width, size.height);
//        this.addChild(bk_ly);

        /////////////////////////////
        // 3. add your codes below...

        // add "Helloworld" splash screen"
        this.sprite = cc.Sprite.create(res.Back_0);
        this.sprite.setAnchorPoint(0.5, 0.5);
        this.sprite.setPosition(this.sprite.getContentSize().width / 2, size.height / 2);
        this.sprite.setScale(size.height/this.sprite.getContentSize().height);
        this.addChild(this.sprite, 1);
    },
    onClick:function(item){
        var tag = item.getTag();
        cc.log("item:"+tag);
        if (tag == 3)
            scMgr.runScene(sc_idx.MENU);
        else if(tag == 10){
            scMgr.runScene(sc_idx.GAME);
        }
    }
});

var getBtn = function(selector, target, txt, tag){
    var lb = cc.LabelTTF.create(txt, "Impact", 38);
    var btn = cc.MenuItemLabel.create(lb, selector, target);
    btn.setTag(tag);
    return btn;
}

var getImgBtn = function(img0, img1, selector, target, tag){
    var img = new cc.MenuItemImage(img0, img1, selector, target);
    img.setTag(tag);
    return img;
}

var MyScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
    },
    init:function(){
        var layer = new MyLayer();
        this.addChild(layer);
        layer.init();
    }
});


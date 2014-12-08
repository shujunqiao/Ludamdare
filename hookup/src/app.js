var BattleScene = cc.Scene.extend({
    ENUM_STATE_NONE:0,
    Enum_STATE_WAIT:1,
    ENUM_STATE_UP:2,
    ENUM_STATE_DOWN:3,

    ENUM_BULLET_NONE:0,
    ENUM_BULLET_FLOWER:1,
    ENUM_BULLET_BRICK:2,

    ENUM_ROLE_TYPE_1:"1",
    ENUM_ROLE_TYPE_2:"2",
    ENUM_ROLE_TYPE_3:"3",

    SKYLINE:460,
    SPEED_BEGIN:35,
    GRAVITY:98,

    BULLET_INIT_POS:null,

    viewUI:null,
    victoryPanel:null,
    lostPanel:null,
    pausePanel:null,
    imgBackground:null,
    lblGate:null,
    btnBrick:null,
    lblBrick:null,
    btnFlower:null,
    lblFlower:null,
    btnPause:null,
    imgWinDirection:null,
    imgArrow:null,
    imgBullet:null,
    lblWind:null,
    roles:null,

    gateConf:null,

    state:0,
    oriState:0,
    numArrowStep:1,
    vx:0,
    vy:0,
    wind:0,
    windCount:2,
    numBricks:0,
    numFlowers:0,
    bulletType:1,

    numRole1:0,
    numRole2:0,
    numRole3:0,


    onEnter:function () {
        this._super();

        this.gateConf = database_gate[currGate-1];
        //cc.log(this.gateConf);
        this.numBricks = this.gateConf.brick;
        this.numFlowers = this.gateConf.flower;

        this.viewUI = ccs.uiReader.widgetFromJsonFile(uiBattleScene);
        this.addChild(this.viewUI);

        cc.audioEngine.playMusic(res.audio_game, true);

        this.imgBackground = this.viewUI.getChildByName("imgBackground");
        this.lblGate = this.viewUI.getChildByName("lblGate");
        this.lblGate.setString(currGate);
        this.btnBrick = this.viewUI.getChildByName("btnBrick");
        this.lblBrick = this.btnBrick.getChildByName("lblBrick");
        this.lblBrick.setString(this.numBricks);
        this.btnBrick.setVisible(this.gateConf.brick > 0);
        this.btnFlower = this.viewUI.getChildByName("btnFlower");
        this.lblFlower = this.btnFlower.getChildByName("lblFlower");
        this.lblFlower.setString(this.numFlowers);
        this.btnPause = this.viewUI.getChildByName("btnMenu");
        this.imgArrow = this.viewUI.getChildByName("imgArrow");
        this.imgWinDirection = this.viewUI.getChildByName("imgWinDirection");
        this.imgBullet = this.viewUI.getChildByName("imgBullet");
        this.lblWind = this.viewUI.getChildByName("lblWind");

        this.roles = [];
        var imgRole;
        var arrRole = this.gateConf.roles.split("|");
        for (var i=0; i<5; i++)
        {
            imgRole = this.viewUI.getChildByName("imgRole"+i);
            if (arrRole[i] != "0")
            {
                imgRole.roleType = arrRole[i];
                imgRole.loadTexture(res["img_role_"+arrRole[i]]);
                this.roles.push(imgRole);

                switch (arrRole[i])
                {
                    case this.ENUM_ROLE_TYPE_1:
                        this.numRole1++;
                        break;
                    case this.ENUM_ROLE_TYPE_2:
                        this.numRole2++;
                        break;
                    case this.ENUM_ROLE_TYPE_3:
                        this.numRole3++;
                        break;
                }
            }
            else
            {
                imgRole.setVisible(false);
            }
        }

        if (this.numRole2 + this.numRole3 <= 0)
        {
            this.numRole1 = 0;
        }

        this.BULLET_INIT_POS = this.imgBullet.getPosition();

        this.imgBackground.addTouchEventListener(this.imgBackground_touchHandler, this);
        this.btnBrick.addTouchEventListener(this.btnBrick_touchHandler, this);
        this.btnFlower.addTouchEventListener(this.btnFlower_touchHandler, this);
        this.btnPause.addTouchEventListener(this.btnPause_touchHandler, this);

        this.randomWind();
        this.checkBullet(this.ENUM_BULLET_FLOWER);
        this.scheduleUpdate();
    },

    update: function(dt)
    {
        switch (this.state)
        {
            case this.Enum_STATE_WAIT:
                if (this.imgArrow.rotation >= 35)
                {
                    this.numArrowStep = -1;
                }
                else if (this.imgArrow.rotation <= -35)
                {
                    this.numArrowStep = 1;
                }
                this.imgArrow.rotation += this.numArrowStep;
                break;

            case this.ENUM_STATE_UP:
                this.vy -= this.GRAVITY * dt * 0.4;
                if (this.vy < 0)
                {
                    this.state = this.ENUM_STATE_DOWN;
                }
                this.imgBullet.x += this.vx;
                this.imgBullet.y += this.vy;
                this.imgBullet.rotation += 10;
                break;

            case this.ENUM_STATE_DOWN:
                if (this.imgBullet.y <= this.SKYLINE)
                {
                    this.randomWind();
                    this.onThrowEnd();
                    break;
                }
                this.vy -= this.GRAVITY * dt * 0.15;
                this.imgBullet.x += this.wind * 2;
                this.imgBullet.y += this.vy;
                this.imgBullet.rotation += 10;

                var bound;
                for (var i=this.roles.length-1; i>=0; i--)
                {
                    bound = this.roles[i].getBoundingBox();
                    if (cc.rectContainsPoint(bound, this.imgBullet.getPosition()))
                    {
                        this.randomWind();
                        this.onThrowEnd(this.roles[i]);
                        this.roles.splice(i, 1);
                        break;
                    }
                }

                break;
        }

    },


    randomWind: function()
    {
        if (this.windCount < 2)
        {
            this.windCount++;
            return;
        }
        else
        {
            this.windCount = 0;
        }

        var gameConf = this.gateConf;
        this.wind = gameConf.windlow + Math.random() * (gameConf.windup - gameConf.windlow);

        this.wind *= (Math.random() < 0.5) ? -1 : 1;
        this.imgWinDirection.loadTexture((this.wind < 0) ? res.wind_left : res.wind_right);

        this.lblWind.setString(String(Math.abs(this.wind)).substr(0,3));
    },

    checkBullet: function(type)
    {
        this.bulletType = type;
        this.imgBullet.setRotation(0);

        var hasBullet = false;

        switch (this.bulletType)
        {
            case this.ENUM_BULLET_FLOWER:
                if (this.numFlowers > 0)
                {
                    hasBullet = true;
                    this.imgBullet.loadTexture(res.icon_flower);
                }
                break;
            case this.ENUM_BULLET_BRICK:
                if (this.numBricks > 0)
                {
                    hasBullet = true;
                    this.imgBullet.loadTexture(res.icon_brick);
                }
                break;
        }

        if (!hasBullet)
        {
            if (this.numFlowers > 0)
            {
                this.bulletType = this.ENUM_BULLET_FLOWER;
                this.imgBullet.loadTexture(res.icon_flower);
            }
            else if (this.numBricks > 0)
            {
                this.bulletType = this.ENUM_BULLET_BRICK;
                this.imgBullet.loadTexture(res.icon_brick);
            }
            else
            {
                this.bulletType = this.ENUM_BULLET_NONE;
                this.imgBullet.setVisible(false);
                this.onLost();
                return;
            }
        }

        this.state = this.Enum_STATE_WAIT;
        this.imgBullet.setVisible(true);
    },

    onThrowEnd: function(hitRole)
    {
        this.state = this.ENUM_STATE_NONE;

        this.imgBullet.setVisible(false);
        this.imgBullet.setPosition(this.BULLET_INIT_POS);

        if (hitRole)
        {
            //cc.log(this.bulletType, hitRole.roleType);

            switch (hitRole.roleType)
            {
                case this.ENUM_ROLE_TYPE_1:
                    if (this.bulletType == this.ENUM_BULLET_FLOWER)
                    {
                        this.onWin();
                        return;
                    }
                    else if (this.bulletType == this.ENUM_BULLET_BRICK)
                    {
                        this.onLost();
                        return;
                    }
                    break;
                case this.ENUM_ROLE_TYPE_2:
                    if (this.bulletType == this.ENUM_BULLET_FLOWER)
                    {
                        this.onLost();
                        return;
                    }
                    else
                    {
                        hitRole.setVisible(false);
                        this.numRole2--;
                    }
                    break;
                case this.ENUM_ROLE_TYPE_3:
                    if (this.bulletType == this.ENUM_BULLET_BRICK)
                    {
                        hitRole.setVisible(false);
                        this.numRole3--;
                    }
                    else
                    {
                        cc.audioEngine.playEffect(res.audio_wrong, false);
                    }
                    break;
            }
        }

        if (this.numRole1 != 0 && this.numRole2 + this.numRole3 <= 0)
        {
            this.onWin();
        }
        else
        {
            this.checkBullet(this.bulletType);
        }

    },

    onWin: function()
    {
        currGate++;

        this.victoryPanel = ccs.uiReader.widgetFromJsonFile(uiVictoryPanel);
        this.addChild(this.victoryPanel, 999);

        cc.audioEngine.playMusic(res.audio_victory, false);

        var btnPlay = this.victoryPanel.getChildByName("btnNext");
        btnPlay.addTouchEventListener((function(sender, type)
        {
            if (type == ccui.Widget.TOUCH_ENDED)
            {
                cc.director.runScene(new BattleScene());
            }
        }), this);

        var btnExit = this.victoryPanel.getChildByName("btnExit");
        btnExit.addTouchEventListener(this.btnExit_touchHandler, this);
    },

    onLost: function()
    {
        this.lostPanel = ccs.uiReader.widgetFromJsonFile(uiLostPanel);
        this.addChild(this.lostPanel, 999);

        cc.audioEngine.playMusic(res.audio_lost, false);

        var btnPlay = this.lostPanel.getChildByName("btnReplay");
        btnPlay.addTouchEventListener((function(sender, type)
        {
            if (type == ccui.Widget.TOUCH_ENDED)
            {
                cc.director.runScene(new BattleScene());
            }
        }), this);

        var btnExit = this.lostPanel.getChildByName("btnExit");
        btnExit.addTouchEventListener(this.btnExit_touchHandler, this);
    },

    btnPause_touchHandler: function(sender, type)
    {
        if (type == ccui.Widget.TOUCH_ENDED)
        {
            this.oriState = this.state;
            this.state = this.ENUM_STATE_NONE;

            this.pausePanel = ccs.uiReader.widgetFromJsonFile(uiPausePanel);
            this.addChild(this.pausePanel, 999);

            var btnPlay = this.pausePanel.getChildByName("btnPlay");
            btnPlay.addTouchEventListener((function(sender, type)
            {
                if (type == ccui.Widget.TOUCH_ENDED)
                {
                    this.state = this.oriState;

                    this.pausePanel.removeFromParent();
                    this.pausePanel = null;
                }
            }), this);

            var btnExit = this.pausePanel.getChildByName("btnExit");
            btnExit.addTouchEventListener(this.btnExit_touchHandler, this);
        }
    },

    btnExit_touchHandler: function(sender, type)
    {
        if (type == ccui.Widget.TOUCH_ENDED)
        {
            cc.director.runScene(new HelloWorldScene());
        }
    },

    imgBackground_touchHandler: function(sender, type)
    {
        if (type == ccui.Widget.TOUCH_ENDED)
        {
            if (this.state != this.Enum_STATE_WAIT)
            {
                return;
            }

            this.vx = this.SPEED_BEGIN * Math.sin(this.imgArrow.rotation * Math.PI/180);
            this.vy = this.SPEED_BEGIN * Math.cos(this.imgArrow.rotation * Math.PI/180);
            this.state = this.ENUM_STATE_UP;

            cc.audioEngine.playEffect(res.audio_throw, false);

            if (this.bulletType == this.ENUM_BULLET_FLOWER)
            {
                this.numFlowers--;
                this.lblFlower.setString(this.numFlowers);
            }
            else if (this.bulletType == this.ENUM_BULLET_BRICK)
            {
                this.numBricks--;
                this.lblBrick.setString(this.numBricks);
            }
        }
    },

    btnBrick_touchHandler: function(sender, type)
    {
        this.checkBullet(this.ENUM_BULLET_BRICK);
    },

    btnFlower_touchHandler: function(sender, type)
    {
        this.checkBullet(this.ENUM_BULLET_FLOWER);
    }
});


var HelloWorldLayer = cc.Layer.extend({
    sprite:null,
    ctor:function () {
        this._super();

        var viewUI = ccs.uiReader.widgetFromJsonFile(uiMainScene);
        this.addChild(viewUI);

        cc.audioEngine.playMusic(res.audio_main, true);

        var btnPlay = viewUI.getChildByName("btnPlay");
        btnPlay.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                cc.director.runScene(new BattleScene());
            }
        }, this);


        var btnExit = viewUI.getChildByName("btnExit");
        btnExit.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                cc.director.end();
            }
        }, this);

        return true;
    }
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});


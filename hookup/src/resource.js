var uiMainScene = "res/MainSceneUI.json";
var uiBattleScene = "res/BattleSceneUI.json";
var uiVictoryPanel = "res/VictoryUI.json";
var uiLostPanel = "res/LostUI.json";
var uiPausePanel = "res/PauseUI.json";
var database_gate = [{"gate":1,"flower":1,"brick":0,"shit":0,"roles":"0|0|1|0|0","israndom":0,"windlow":0,"windup":1},{"gate":2,"flower":3,"brick":0,"shit":0,"roles":"0|0|1|0|0","israndom":1,"windlow":1,"windup":2},{"gate":3,"flower":3,"brick":0,"shit":0,"roles":"0|0|1|0|0","israndom":1,"windlow":2,"windup":3},{"gate":4,"flower":1,"brick":3,"shit":0,"roles":"0|0|1|0|3","israndom":0,"windlow":0,"windup":1},{"gate":5,"flower":1,"brick":3,"shit":0,"roles":"0|3|1|0|0","israndom":0,"windlow":1,"windup":2},{"gate":6,"flower":1,"brick":6,"shit":0,"roles":"3|0|1|0|3","israndom":0,"windlow":0,"windup":1},{"gate":7,"flower":1,"brick":6,"shit":0,"roles":"0|3|1|3|0","israndom":0,"windlow":0,"windup":2},{"gate":8,"flower":1,"brick":9,"shit":0,"roles":"3|3|3|0|1","israndom":0,"windlow":0.5,"windup":1.5},{"gate":9,"flower":1,"brick":9,"shit":0,"roles":"1|3|3|3|3","israndom":0,"windlow":0.5,"windup":1.5},{"gate":10,"flower":1,"brick":9,"shit":0,"roles":"3|3|1|3|3","israndom":0,"windlow":0.5,"windup":1.5},{"gate":11,"flower":1,"brick":9,"shit":0,"roles":"3|3|1|3|2","israndom":0,"windlow":0,"windup":2},{"gate":12,"flower":1,"brick":9,"shit":0,"roles":"3|3|3|1|2","israndom":0,"windlow":0,"windup":2},{"gate":13,"flower":1,"brick":9,"shit":0,"roles":"3|1|3|3|2","israndom":1,"windlow":1,"windup":2.5},{"gate":14,"flower":1,"brick":9,"shit":0,"roles":"2|3|1|3|2","israndom":0,"windlow":0,"windup":1},{"gate":15,"flower":1,"brick":9,"shit":0,"roles":"3|2|1|2|3","israndom":0,"windlow":0,"windup":1},{"gate":16,"flower":1,"brick":9,"shit":0,"roles":"1|2|2|3|3","israndom":1,"windlow":0,"windup":1.5},{"gate":17,"flower":1,"brick":9,"shit":0,"roles":"1|2|2|3|3","israndom":1,"windlow":1,"windup":3},{"gate":18,"flower":1,"brick":7,"shit":0,"roles":"1|2|2|3|3","israndom":1,"windlow":1.5,"windup":3},{"gate":19,"flower":0,"brick":8,"shit":0,"roles":"1|2|2|2|3","israndom":1,"windlow":1.5,"windup":3},{"gate":1,"flower":5,"brick":0,"shit":0,"roles":"0|0|1|0|0","israndom":0,"windlow":0,"windup":1},{"gate":2,"flower":3,"brick":0,"shit":0,"roles":"0|0|1|0|0","israndom":1,"windlow":1,"windup":2},{"gate":3,"flower":3,"brick":0,"shit":0,"roles":"0|0|1|0|0","israndom":1,"windlow":2,"windup":3},{"gate":4,"flower":1,"brick":3,"shit":0,"roles":"0|0|1|0|3","israndom":0,"windlow":0,"windup":1},{"gate":5,"flower":1,"brick":3,"shit":0,"roles":"0|3|1|0|0","israndom":0,"windlow":1,"windup":2},{"gate":6,"flower":1,"brick":6,"shit":0,"roles":"3|0|1|0|3","israndom":0,"windlow":0,"windup":1},{"gate":7,"flower":1,"brick":6,"shit":0,"roles":"0|3|1|3|0","israndom":0,"windlow":0,"windup":2},{"gate":8,"flower":1,"brick":9,"shit":0,"roles":"3|3|3|0|1","israndom":0,"windlow":0.5,"windup":1.5},{"gate":9,"flower":1,"brick":9,"shit":0,"roles":"1|3|3|3|3","israndom":0,"windlow":0.5,"windup":1.5},{"gate":10,"flower":1,"brick":9,"shit":0,"roles":"3|3|1|3|3","israndom":0,"windlow":0.5,"windup":1.5},{"gate":11,"flower":1,"brick":9,"shit":0,"roles":"3|3|1|3|2","israndom":0,"windlow":0,"windup":2},{"gate":12,"flower":1,"brick":9,"shit":0,"roles":"3|3|3|1|2","israndom":0,"windlow":0,"windup":2},{"gate":13,"flower":1,"brick":9,"shit":0,"roles":"3|1|3|3|2","israndom":1,"windlow":1,"windup":2.5},{"gate":14,"flower":1,"brick":9,"shit":0,"roles":"2|3|1|3|2","israndom":0,"windlow":0,"windup":1},{"gate":15,"flower":1,"brick":9,"shit":0,"roles":"3|2|1|2|3","israndom":0,"windlow":0,"windup":1},{"gate":16,"flower":1,"brick":9,"shit":0,"roles":"1|2|2|3|3","israndom":1,"windlow":0,"windup":1.5},{"gate":17,"flower":1,"brick":9,"shit":0,"roles":"1|2|2|3|3","israndom":1,"windlow":1,"windup":3},{"gate":18,"flower":1,"brick":7,"shit":0,"roles":"1|2|2|3|3","israndom":1,"windlow":1.5,"windup":3},{"gate":19,"flower":0,"brick":8,"shit":0,"roles":"1|2|2|2|3","israndom":1,"windlow":1.5,"windup":3}];

var res = {
    img_role_1: "res/BattleScene/img_role_1.png",
    img_role_2: "res/BattleScene/img_role_2.png",
    img_role_3: "res/BattleScene/img_role_3.png",

    icon_flower: "res/BattleScene/icon_flower.png",
    icon_brick: "res/BattleScene/icon_brick.png",

    atls_number1: "res/Common/labelatlasimg.png",
    atls_number2: "res/Common/number.png",

    wind_left: "res/BattleScene/wind_left.png",
    wind_right: "res/BattleScene/wind_right.png",

    audio_main: "res/audio/main.wav",
    audio_game: "res/audio/game.wav",
    audio_throw: "res/audio/throw.wav",
    audio_right: "res/audio/right.wav",
    audio_wrong: "res/audio/wrong.wav",
    audio_victory: "res/audio/victory.wav",
    audio_lost: "res/audio/lost.wav"

};

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}

g_resources.push(uiMainScene);
g_resources.push(uiBattleScene);
g_resources.push(uiVictoryPanel);
g_resources.push(uiLostPanel);
g_resources.push(uiPausePanel);

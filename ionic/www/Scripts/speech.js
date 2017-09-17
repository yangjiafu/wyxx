﻿var speechState = 0;

function getSpeechState(){
    return speechState;
}

function clickSpeechBn() {
    if (speechState == 0) {
        $("#imgSpeaker").attr("src", "imgs/speaker2.png");
        speechState = 1;
        xunfeiListenSpeaking.startSpeak(
            function() {
                speechState = 0;
                $("#imgSpeaker").attr("src", "imgs/speaker1.png");
            },
            function() {
                alert("加载错误");
                speechState = 0;
                $("#imgSpeaker").attr("src", "imgs/speaker1.png");
            },
            $(".swiper-slide-active").text()
        );
    }

    else if(speechState !=0) {
        xunfeiListenSpeaking.stopSpeak();
        speechState = 0;
        $("#imgSpeaker").attr("src", "imgs/speaker1.png");
    }
}

function showText() {
    var txt = $(".swiper-slide-active").text();
    alert(txt);
}
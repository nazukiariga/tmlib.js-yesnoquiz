/*
 * 
 */

// 初期化
// 読み込む画像, 音
var ASSETS = {
    // image
    'correct': 'images/correct.png',
    'incorrect': 'images/incorrect.png',
    // se
    'correct_se': 'sounds/correct.mp3',
    'incorrect_se': 'sounds/incorrect.mp3',
    // bgm
    'bgm': 'sounds/bgm.m4a',
};

// 問題のリスト
var QUESTIONS = [
    {
        text: '「ハッカー」とは「不正行為を行う人」\nのことである',
        answer: false,
    },
    {
        text: '1+1*-(1+10)=-10',
        answer: true,
    },
    {
        text: '上り坂より下り坂のほうが多い',
        answer: false,
    },
    {
        text: 'マクドナルドのロゴマークは、\nアルファベットの「Ｍ」である。',
        answer: false,
    },
    {
        text: '地上で働いているアリは、\nおばあさんアリである。',
        answer: true,
    },
];

// 初期化
tm.game.setup({
    title: "Yes/No クイーズ",
    width: 640,
    height: 960,
    startLabel: "game",
});

/*
 * ゲームシーン
 */
tm.define("GameScene", {
    // 親クラスを指定
    superClass: "Scene",

    // 初期化
    init: function() {
        this.superInit();
        // スコア用変数
        this.score = 0;

        // スコアラベル
        this.scoreLabel = Label("0").addChildTo(this);
        this.scoreLabel.x = SCREEN_GRID_X.center();  // x 座標
        this.scoreLabel.y = SCREEN_GRID_Y.span(3);   // y 座標
        this.scoreLabel.fillStyle = "#222";          // 色
        this.scoreLabel.fontSize = 64;               // サイズ

        // 問題文用ラベル
        this.questionLabel = Label("").addChildTo(this);// シーンに追加
        this.questionLabel.x = SCREEN_GRID_X.center();  // x 座標
        this.questionLabel.y = SCREEN_GRID_Y.span(5);   // y 座標
        this.questionLabel.fillStyle = "#222";          // 色
        this.questionLabel.fontSize = 32;               // サイズ

        // ◯ボタンを生成
        this.correctButton = SpriteButton("correct").addChildTo(this);
        this.correctButton.x = SCREEN_GRID_X.span(4);   // x 座標
        this.correctButton.y = SCREEN_GRID_Y.span(10);  // y 座標
        // 押した時の処理を設定
        this.correctButton.onpush = function() {
            this.judge(true);
        }.bind(this);

        // ✕ボタンを生成
        this.incorrectButton = SpriteButton("incorrect").addChildTo(this);
        this.incorrectButton.x = SCREEN_GRID_X.span(-4);
        this.incorrectButton.y = SCREEN_GRID_Y.span(10);
        // 押した時の処理を設定
        this.incorrectButton.onpush = function() {
            this.judge(false);
        }.bind(this);

        // 問題リストをクローンする
        this.questions = QUESTIONS.clone();

        // bgm を再生
        SoundManager.setVolumeMusic(0.25);
        SoundManager.playMusic('bgm');
    },

    // 開始時
    onenter: function() {
        // カウントシーンを生成
        var scene = CountScene({
            count: ["Ready!"],
            fontSize: 80,
        });
        this.app.pushScene(scene);

        // 問題をセット
        this.setQuestion();
    },

    // 問題をセットする
    setQuestion: function() {
        // 問題をランダムでピックアップ
        var q = this.questions.pickup();
        // ピックアップされた問題を問題リストから削除
        this.questions.erase(q);
        // 問題のテキストをラベルにセット
        this.questionLabel.text = q.text;

        // 問題をフェードアウト表示
        this.questionLabel.alpha = 0;
        this.questionLabel.tweener.clear().fadeIn(500);

        this.question = q;
    },

    // 判定
    judge: function(answer) {
        // 正解かどうかを判定
        if (this.question.answer === answer) {
            this.score++;
            // 正解音を再生
            SoundManager.play('correct_se');

            // 問題がまだあるかを判定
            if (this.questions.length <= 0) {
                // リザルトシーンへ
                this.nextArguments = {
                    score: this.score,
                }
                this.app.popScene();
            }
            else {
                // 次の問題をセット
                this.setQuestion();
            }
        }
        else {
            this.score--;
            // 不正解音を再生
            SoundManager.play('incorrect_se');
            
            // 次の問題をセット
            this.setQuestion();
        }

        // スコアを更新
        this.scoreLabel.text = this.score;
    },
});

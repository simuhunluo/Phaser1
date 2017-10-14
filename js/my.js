// 实际应用场景改为window.innerWidth和window.innerHeight。
// 这里是为了方便查看示例。
var width = window.innerWidth;
var height = window.innerHeight;

// 创建游戏实例
var game = new Phaser.Game(width, height, Phaser.AUTO, '#game');

// 定义场景
var states = {
    // 加载场景
    preload: function() {
        this.preload = function() {
            // 设置背景为黑色
            game.stage.backgroundColor = '#000000';
            // 加载游戏资源
            game.load.crossOrigin = 'anonymous'; // 设置跨域
            game.load.image('bg', 'img/pic1.jpg');
            game.load.image('apple', 'img/apple.png');
            game.load.image('other', 'img/pic2.jpg');
            game.load.image('man','img/banzi.png');
            game.load.image('button','img/replay.png');
            game.load.image('downbutton','img/downbutton.png');
            game.load.audio('bgMusic', 'audio/audio1.mp3');

            //创建文字
            var progressText=game.add.text(game.world.centerX,game.world.centerY,'0%',{
                fontSize:'60px',
                fill:'#ffffff'
            });

            progressText.anchor.setTo(0.5,0.5);//设置锚点

            //监听加载完一个文件的事件
            game.load.onFileComplete.add(
                function (progress) {
                    progressText.text=progress+'%';
                }
            );
            game.load.onLoadComplete.add(function () {
                game.state.start('created');
            });
        }
    },
    // 开始场景
    created: function() {
        this.create = function() {
            //添加背景图片
            var bg = game.add.image(0, 0, 'bg');
            bg.width = game.world.width;
            bg.height = game.world.height;
            //添加标题
            var title=game.add.text(game.world.centerX,game.world.centerY*0.4,"我的小游戏",{
                fontSize:'50px',
                fontWeight:'bold',
                fill:'#f2bb15'
            });
            title.anchor.setTo(0.5,0.5);
            //添加提示
            var remind=game.add.text(game.world.centerX,game.world.centerY,"点击开始",{
                fontSize:'30px',
                fill:'#f2bb15'
            });
            remind.anchor.setTo(0.5,0.5);

            //添加点击事件
            game.input.onTap.add(function () {
                game.state.start("play")
            })/*
            game.input.onTap.add(function () {
                game.state.start('play');
            });*/
/*            setTimeout(function() {
                game.state.start('play');
            }, 3000);*/
        }
    },
    // 游戏场景
    play: function() {
        var man; // 主角
        var apple;
        var apples; // 苹果
        var score = 0; // 得分
        var title; // 分数
        this.create = function() {
            // TO-DO
            game.stage.backgroundColor = '#444';
            var music=game.add.audio('bgMusic',1,true,true);
            //music.play();
            // 添加分数
            title = game.add.text(game.world.centerX, game.world.height * 0.25, '0', {
                fontSize: '40px',
                fontWeight: 'bold',
                fill: '#f2bb15'
            });
            title.anchor.setTo(0.5, 0.5);

            //添加主角
            man=game.add.sprite(game.world.centerX,game.world.centerY*1.5,'man');
            var manImage=game.cache.getImage('man');
            man.width=manImage.width * 0.4;
            man.height = manImage.height * 0.3;
            man.anchor.setTo(0.5,0.5);

            /*在PC端，如果不加一下代码，会出现只要鼠标动，人物也会跟着动，下面要让人物在PC端点击鼠标之后才可移动*/
            var touching = false;
            game.input.onDown.add(function () {
                touching=true;
            });
            game.input.onUp.add(function () {
                touching=false;
            });
            game.input.onDown.add(function (pointer) {
                if (Math.abs(pointer.x-man.x)<man.width/2){
                    touching=true;//只有点击区域为man的附近，点击才生效
                }
            });
            game.input.addMoveCallback(function (pointer,x,y,isTap) {
                if (!isTap&&touching){
                    man.x=x;
                }
            });
            apples=game.add.group();
            var appleTimer=game.time.create(true);
            appleTimer.loop(1000,function () {
                var x=Math.random()*game.world.width;
                var y=function () {
                    var m;
                    while ((m=Math.random()*game.world.height)<game.world.height*0.1){
                         return m;
                    }
                };
                apple=apples.create(x,y,'apple');
                //设置苹果大小
                var appleImg=game.cache.getImage('apple');
                apple.width=game.world.width/30;
                apple.height=apple.width/appleImg.width*appleImg.height;
                //加入物理运动
                game.physics.enable(apple);
                apple.body.collideWorldBounds=true;//针对苹果开启世界的边缘
                apple.body.onWorldBounds=new Phaser.Signal();//当触边的时候响应事件
                apple.body.onWorldBounds.add(function (apple, up, down, left, right) {
                    if (down){
                        apple.kill();
                        game.state.start('over',true,false,score);
                    }
                })
            });
            appleTimer.start();
            //开启物理引擎
            game.physics.startSystem(Phaser.Physics.Arcade);
            game.physics.arcade.gravity.y=300;

            game.physics.enable(man);
            man.body.allowGravity=false;//消除其重力影响



        },
        this.update=function () {
            //?接触检测时间要卸载update生命周期里面，意思为每次更新视图都会检测主角 和苹果是否有接触，
            // 有的话，则执行pickApple方法
            game.physics.arcade.overlap(man,apples,pickApple,null,this);

            function pickApple(man, apple) {
                var point = 1;
                var img = 'apple';
                // 添加得分图片
                var goal = game.add.image(apple.x, apple.y, img);
                var goalImg = game.cache.getImage(img);
                goal.width = apple.width;
                goal.height = goal.width / (goalImg.width / goalImg.height);
                goal.alpha = 0;
                // 添加过渡效果
                var showTween = game.add.tween(goal).to({
                    alpha: 1,
                    y: goal.y - 20
                }, 100, Phaser.Easing.Linear.None, true, 0, 0, false);
                showTween.onComplete.add(function() {
                    var hideTween = game.add.tween(goal).to({
                        alpha: 0,
                        y: goal.y - 20
                    }, 100, Phaser.Easing.Linear.None, true, 200, 0, false);
                    hideTween.onComplete.add(function() {
                        goal.kill();
                    });
                });
                // 更新分数
                score += point;
                title.text = score;
                // 清除苹果
                apple.kill();
            }
        }

    },
    // 结束场景
    over: function() {
        var score=0;
        this.init=function () {
            score=arguments[0];
        }
        this.create = function() {
            // TO-DO
            var bg=game.add.image(0,0,'bg');
            bg.width=game.world.width;
            bg.height=game.world.height;

            var button=game.add.button(game.world.centerX,game.world.centerY*1.5,'button',function () {
                game.state.start('play');
            });
            button.width=game.world.width*0.18;
            button.height=game.world.height*0.2;
            button.anchor.setTo(0.5,0.5);

/*            var downbutton=game.add.image(0,0,'downbutton');
            downbutton.width=game.world.width;
            downbutton.height=game.world.height;*/

            var title=game.add.text(game.world.centerX,game.world.centerY,"游戏结束",{
                fontSize: '40px',
                fontWeight: 'bold',
                fill: '#f2bb15'
            });
            title.anchor.setTo(0.5,0.5);
            var scorestr="你的得分是"+score+"分";
            var scoreText=game.add.text(game.world.centerX,game.world.centerY*0.5,scorestr,{
                fontSize: '40px',
                fontWeight: 'bold',
                fill: '#f2bb15'
            });
            scoreText.anchor.setTo(0.5,0.5);

        }
    }
};

// 添加场景到游戏示例中
Object.keys(states).map(function(key) {
    game.state.add(key, states[key]);
});

// 启动游戏
game.state.start('preload');
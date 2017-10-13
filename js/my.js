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
            game.load.image('man','img/sss.png');
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
            var music=game.add.audio('bgMusic',1,true,true);
            music.play();

            //添加主角
            var man=game.add.sprite(game.world.centerX,game.world.centerY*1.3,'man');
            var manImage=game.cache.getImage('man');
            man.width=manImage.width * 0.3;
            man.height = manImage.height * 0.3;
            man.anchor.setTo(0.5,0);
            //添加点击事件
            game.input.onTap.add(function () {
                alert("啊");
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
        this.create = function() {
            // TO-DO
            game.stage.backgroundColor = '#444';
            setTimeout(function() {
                game.state.start('over');
            }, 3000);
        }
    },
    // 结束场景
    over: function() {
        this.create = function() {
            // TO-DO
            game.stage.backgroundColor = '#000';
            alert('游戏结束!');
        }
    }
};

// 添加场景到游戏示例中
Object.keys(states).map(function(key) {
    game.state.add(key, states[key]);
});

// 启动游戏
game.state.start('preload');
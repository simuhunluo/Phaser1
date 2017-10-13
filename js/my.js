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

            game.load.audio('bgMusic', 'audio/audio1.mp3');
            // 添加进度文字
            var progressText = game.add.text(game.world.centerX, game.world.centerY, '0%', {
                fontSize: '60px',
                fill: '#ffffff'
            });
            progressText.anchor.setTo(0.5, 0.5);
            // 监听加载完一个文件的事件
            game.load.onFileComplete.add(function(progress) {
                progressText.text = progress + '%';
            });
            // 监听加载完毕事件
            game.load.onLoadComplete.add(onLoad);
            // 最小展示时间，示例为3秒
            var deadLine = false;
            setTimeout(function() {
                deadLine = true;
            },1500);
            // 加载完毕回调方法
            function onLoad() {
                if (deadLine) {
                    // 已到达最小展示时间，可以进入下一个场景
                    game.state.start('created');
                } else {
                    // 还没有到最小展示时间，1秒后重试
                    setTimeout(onLoad, 1000);
                }
            }
        },
            this.create = function() {
                // game.state.start('created');
            }
    },
    // 开始场景
    created: function() {
        this.create = function() {
            // TO-DO
            var bg = game.add.image(0, 0, 'bg');
            bg.width = game.world.width;
            bg.height = game.world.height;

            var music=game.add.audio('bgMusic',1,true,true);
            music.play();

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
var width = window.innerWidth;
var height = window.innerHeight;
var game = new Phaser.Game(width, height, Parser.AUTO, "#game");
var states={
	preload:function(){},
	created:function(){},
	play:function(){},
	over:function(){}
};
Object.keys(states).map(function (key) {
	game.stage.add(key,states[key]);
});

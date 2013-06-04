var PlayerHud = (function()
{

	function PlayerHud(p)
	{
		this.mugShots = new Image();
		this.mugShots.loaded = false;
		this.mugShots.src = "Hud-Menu/PlayerProfiles.png";
		this.players = p;
		this.setPlayer(p[0]);
		this.ctx = new Array();
		this.ctxCords = new Array();
		for (var i = 0; i < this.players.length; i++) 
		{
			var canvas = $("#MugShot" + i.toString());
			canvas.fadeIn(1000);
			this.ctx.push(canvas[0].getContext("2d"));
			this.ctxCords.push(this.getCords(this.players[i]));
		}
		var _hud = this;
		this.mugShots.onload = function()
		{
			this.loaded = true;
		}
	};
	PlayerHud.prototype.Draw = function()
	{

		if(!this.mugShots.loaded)
			return;

		var w = this.mugShots.width/2;
		var h = this.mugShots.height/2;
		
		var j = 1;
		for (var i = 0; i < this.players.length; i++) 
		{
			
			if(this.players[i].teamColor != this.player.teamColor)
			{
				var ele = $("#MugShot" + j.toString());
				if(this.players[i].active == true)
				{
					ele.css("border-color", "rgb(0, 255, 20)");
				}
				this.ctx[j].clearRect(0,0,600,600);
				this.ctx[j].save();
				this.ctx[j].drawImage(this.mugShots,this.ctxCords[i].x * w,this.ctxCords[i].y * h,w,h,10,10,w,h);
				this.ctx[j].font = "16pt Courier";
				this.ctx[j].fillText("Name:" + this.players[i].id, 10, 80);
				this.ctx[j].fillText("Color:" + this.players[i].teamColor , 10, 100);
				this.ctx[j].font = "10pt Courier"
				this.ctx[j].restore();
				j++;
			}

		};
		if(this.player.active == true)
		{
			$("#MugShot0").css("border-color", "rgb(0, 255, 20)");
		}
		this.ctx[0].clearRect(0,0,600,600);
		this.ctx[0].save();
		this.ctx[0].drawImage(this.mugShots,this.anix * w,this.aniy * h,w,h,10,10,w,h);
		this.ctx[0].font = "16pt Courier";
		this.ctx[0].fillText("Name:"+ this.player.id, 10, 80);
		this.ctx[0].fillText("Color:" + this.player.teamColor , 10, 100);
		this.ctx[0].fillText("Points:" + this.player.displyedPoints, 10, 120);
		this.ctx[0].font = "10pt Courier"
		this.ctx[0].restore();	
	};
	PlayerHud.prototype.setPlayer =  function(p)
	{
		this.player = p;
		if("Orange" == this.player.teamColor)
		{
			this.anix = 0;
			this.aniy = 0;
		}
		else if("Blue" == this.player.teamColor)
		{
			this.anix = 1;
			this.aniy = 0;
		}
		else if("Green" == this.player.teamColor)
		{
			this.anix = 0;
			this.aniy = 1;
		}
		else if("Yellow" == this.player.teamColor)
		{
			this.aniy = 1;
			this.anix = 1;
		}
	};
	PlayerHud.prototype.getCords = function(p)
	{
		var player = p;
		if("Orange" == player.teamColor)
		{
			anix = 0;
			aniy = 0;
		}
		else if("Blue" == player.teamColor)
		{
			anix = 1;
			aniy = 0;
		}
		else if("Green" == player.teamColor)
		{
			anix = 0;
			aniy = 1;
		}
		else if("Yellow" == player.teamColor)
		{
			aniy = 1;
			anix = 1;
		}
		return {x:anix,y:aniy}
	};
	PlayerHud.prototype.update =  function()
	{
		if(this.player.displyedPoints < this.player.points)
			this.player.displyedPoints++;
		else if(this.player.displyedPoints > this.player.points)
			this.player.displyedPoints--;
	};
	
	return PlayerHud;
})();
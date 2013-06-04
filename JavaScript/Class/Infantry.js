function Unit(x,y,tile_SizeX,tile_SizeY,Data,team,name)
{
	this.globalposition = new vector((tile_SizeX*x),(tile_SizeY*y));
	this.img = new Image();
	this.img = Data.colors[team];
	this.teamColor = team;
	this.cellx = x;
	this.celly = y;
	this.tile_width = tile_SizeX;
	this.tile_height = tile_SizeY;
	this.widthSec =  Data.srcWidth/4;
	this.heightSec = Data.srcHeight/4;
	this.anix = 0;
	this.aniy = 0;
	this.name = name;
	this.defence = Data.defence;
	this.attack = Data.attack;
	this.attackRange = Data.attackRange;
	this.baseAp = Data.Ap;
	this.Ap = Data.Ap;
	this.critical = Data.critical; 
	this.attackTarget = null;
	this.moving = false
	this.alpha = 1;
	this.Apblock = false;
	this.teamNum = 0;
	this.movex = 0;
	this.movey = 0;
	this.movetoPath = [];
	this.health = 100;
	this.Selected = false;
	this.block = Data.block;
	this.mbattleSprite = null;
	this.lastActive = null;
	this.speed = 5;
	this.timepast = 0;
}
Unit.prototype.constructor=Entity;  
Unit.prototype = new Entity();
Unit.prototype.blocked = function(str)
{   
	for(tile in this.block)
	{
		if(this.block[tile] == str)
		{
			return true;
		}
	}
	return false;
};
Unit.prototype.turnUpdate = function()
{
	this.Ap = this.baseAp;
	this.Apblock = false;
	this.alpha  = 1;
};
Unit.prototype.Draw = function(ctx,worldpos)
{
	if(this.animateID == true)
		this.animate();
	
	ctx.globalAlpha =this.alpha;
	var drawPos = this.globalposition.sub(worldpos);
	ctx.drawImage(this.img,this.anix,this.aniy,this.widthSec,this.heightSec,drawPos.x ,drawPos.y,this.tile_width,this.tile_height);
	ctx.globalAlpha = 1;
};
Unit.prototype.Update = function()
{
	if(this.lastActive == null)
	{
		this.lastActive = new Date().getTime();
	}
	var currenttime = new Date().getTime();
	var timepast = ( currenttime   - this.lastActive)/1000;
	this.timepast = this.timepast + timepast;
	this.lastActive = currenttime;
	var mx = (this.tile_width * (this.speed*timepast));
	var my =  (this.tile_height * (this.speed*timepast));
	if(this.movex > 0 )
	{
		this.globalposition.x = this.globalposition.x +  mx ;
		this.movex = this.movex -  mx;
		this.Setanimate(this.heightSec*3)
		if(this.movex < 0)
			this.movex = 0;
		
	}
	else if(this.movex < 0 )
	{
		this.globalposition.x = this.globalposition.x -  mx;
		this.movex = this.movex+ mx;;
		this.Setanimate(0);

		if(this.movex > 0)
			this.movex = 0;

	}
	else if(this.movey > 0 )
	{
		this.globalposition.y = this.globalposition.y + my;
		this.movey = this.movey - my;

		this.Setanimate(this.heightSec*2);

		if(this.movey < 0)
			this.movey = 0;
		
	}
	else if(this.movey < 0 )
	{
		this.globalposition.y = this.globalposition.y - my;
		this.movey = this.movey +  my;
		this.Setanimate(this.heightSec);
		
		if(this.movey > 0)
			this.movey = 0;
	}
	if(this.movex == 0 && this.movey == 0)
	{

		if(this.movetoPath.length != 0)
		{
			this.movex = this.movetoPath[this.movetoPath.length-1].movex * this.tile_width;
			this.movey = this.movetoPath[this.movetoPath.length-1].movey * this.tile_height;
			this.moving = true;
		}
		else if(this.movetoPath.length == 0)
		{
			this.moving = false;
			this.animateID = null;

			if(this.Apblock)
				this.alpha = 0.6;
		}
		this.movetoPath.pop();
	}
};
Unit.prototype.Setanimate = function(y)
{
	this.aniy = y;
	_ent = this;
	this.animateID = true;
	
};
Unit.prototype.animate = function()
{
   if(this.timepast >= 0.2)
	{
		if(this.anix + this.widthSec < this.img.width)
			this.anix += this.widthSec;
		else
			this.anix = 0;

		this.timepast =0;
	}
};
Unit.prototype.Destory = function()
{
	
};
Unit.prototype.setMovetoPath = function(i,j,path)
{

	this.movetoPath = path;
	if(_onlineGame == true)
	{
		var Data = 
		{
			updateName:"MoveTo",
			MovetoPath:path,
			cellx:i,
			celly:j,
		};
		SocketIO.SendData("Update",Data);
	}
};
Unit.prototype.setattackTarget = function(i,j,target,moveto)
{
	this.attackTarget = target;
	if(_onlineGame == true)
	{
		var Data = 
		{
			updateName:"attackTarget",
			MovetoPath:moveto,
			target:target,
			cellx:i,
			celly:j,
		};
		SocketIO.SendData("Update",Data);
	}
};

function Entity(x,y,img,tile_SizeX,tile_SizeY)
{
	this.globalposition = new vector(x,y);
	this.img = new Image();
	this.img.src ="MapUnits/orange.png";
	
	this.tile_width = tile_SizeX;
	this.tile_height = tile_SizeY;
	this.widthSec = this.img.width/9;
	this.heightSec = this.img.height;
	this.Selected = false;
	this.teamColor = null;
	this.speed = 2.5;
	this.anix =0;
	this.aniy =0;
	this.wait = 1;
	this.animateID = null;
}
Entity.prototype.Move = function(cell_x,cell_y)
{

}
Entity.prototype.Draw = function(ctx,worldpos)
{

	var drawPos = this.globalposition.sub(worldpos);
	ctx.drawImage(this.img,0,0,this.widthSec,this.heightSec,drawPos.x,drawPos.y,this.tile_width,this.tile_height);
}
Entity.prototype.Update = function()
{

}

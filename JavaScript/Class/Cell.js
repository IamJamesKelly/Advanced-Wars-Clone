function Cell(x,y,width,height,tileType)
{
	this.unit = null;
	this.building = null;
	this.tile = tileType;

	this.globalposition = new vector(x,y);
	this.attackTarget = null;
	this.tile_sizeX = width;
	this.tile_sizeY = height;
	this.CellSelect = false;
	this.moveAble = false;
	this.captureAble = false;
	this.attackAble = false;
	this.totalMoveCost = 0;
	this.alpha = 0.0;
	this.fade = false;
	this.pathTo = null;
}
Cell.prototype.SetUnit = function(aUnit)
{
	this.unit = aUnit;
}
Cell.prototype.SetBuilding = function(building)
{
	this.building = building;
}
Cell.prototype.highlight = function()
{
	if (this.alpha >= 0.6)
		this.fade = -0.01;
	if (this.alpha <= 0.2)
		this.fade = 0.01;
		
	this.alpha = this.alpha +  this.fade;
}
Cell.prototype.SelectDraw = function(ctx,worldx,worldy)
{		

	if(this.CellSelect == false)
		return;

	var str = this.alpha.toString();
	ctx.fillStyle = "rgba(43, 213, 65, " +  str + ");";
	this.highlight();

	ctx.fillRect(this.globalposition.x - worldx,this.globalposition.y - worldy,this.tile_sizeX,this.tile_sizeY);
}
Cell.prototype.moveRange= function(ctx,worldx,worldy)
{		

	if(this.captureAble == true)
	{
		ctx.fillStyle = "rgba(0, 0, 300,0.4);"
		ctx.fillRect(this.globalposition.x - worldx,this.globalposition.y - worldy,this.tile_sizeX,this.tile_sizeY);
	}
	if(this.attackAble == true)
	{
		ctx.fillStyle = "rgba(250, 0, 0,0.3);"
		ctx.fillRect(this.globalposition.x - worldx,this.globalposition.y - worldy,this.tile_sizeX,this.tile_sizeY);
	}
	if(this.moveAble != false)
	{
		ctx.fillStyle = "rgba(0, 50, 250,0.3);"
		ctx.fillRect(this.globalposition.x - worldx,this.globalposition.y - worldy,this.tile_sizeX,this.tile_sizeY);
	}
}
Cell.prototype.Update = function(i,j)
{
	if(this.unit != null)
	{
		this.unit.turnUpdate();
	}
	if (this.unit != null && this.building != null && this.unit.teamColor != this.building.teamColor) 
	{
		this.building.Capture(this.unit);
		
	}
	if(this.building != null)
	{
		this.building.Update(i,j);
	}	
}
Cell.prototype.reset = function()
{
	this.totalMoveCost = 0;
	this.moveAble = false;
	this.captureAble = false;
	this.attackAble = false;
	this.CellSelect = false;
	this.pathTo = null;
}


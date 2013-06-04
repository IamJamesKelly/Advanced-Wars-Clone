function Buildings(drawx,drawy,tile_SizeX,tile_SizeY,imageWidth,imageheight,img,aniY,aniX,teamColor,buildingName,xycords)
{
	this.globalposition = new vector(drawx,drawy);
	this.widthSec = imageWidth;
	this.heightSec = imageheight;
	this.tile_width = tile_SizeX;
	this.tile_height = tile_SizeY;
	this.CaptuResistence = 5;
	this.beingcaptured = false;
	this.XYcords = xycords
	this.name = buildingName;
	this.team = "";
	this.image = img;
	this.revenu = 100;
	this.img = new Image();
	this.img.src =""
	this.producing = 0;
	this.anix = aniX;
	this.aniy = aniY;
	this.unitsProduced = [];
	this.Production = 0;
	this.currentlyBuilding = null;
	this.factory = null;
	this.teamColor = teamColor
	this.timerImg = null;
	this.beingcaptured = false;
};
Buildings.prototype = new Entity();
Buildings.prototype.Capture = function(aUnit,i,j)
{
	this.beingcaptured = true;

	if(this.CaptuResistence == 0)
	{
		this.setTeamColor(aUnit.teamColor);
		_GameData.buildingCaptured++;
		if(this.name == "Base")
		{
			_GameData.basesCaptured++;
		}
		if(_onlineGame == true)
		{
			var Data = 
			{
				updateName:"BuildingCaptured",
				color:aUnit.teamColor,
				cellx:i,
				celly:j,
			};
			SocketIO.SendData("Update",Data);
		}
		
		this.resetResitance();
		this.beingcaptured = false;
	} 
	this.CaptuResistence--;
};
Buildings.prototype.Draw = function(ctx,worldpos)
{
	var drawPos = this.globalposition.sub(worldpos);
	ctx.drawImage(this.image,this.anix *this.widthSec ,this.aniy * this.heightSec,this.widthSec,this.heightSec,drawPos.x,drawPos.y,this.tile_width,this.tile_height);
	if(this.currentlyBuilding != null)
	{
		var w = (this.timerImg.width/10);
		var produc = this.currentlyBuilding.data.productionTime - this.Production; 
		ctx.drawImage(this.timerImg,(produc)*w,0,w,this.timerImg.height,drawPos.x,drawPos.y -this.timerImg.height ,this.tile_width*0.15,this.tile_height*0.15);
	}
};
Buildings.prototype.Update = function(x,y)
{
	if(this.currentlyBuilding != null)
	{
		this.Production++;
	}
	if(this.currentlyBuilding != null && this.currentlyBuilding.data.productionTime == this.Production)
	{
		this.unitsProduced.push(this.factory.createUnit(this.currentlyBuilding.data.name,this.teamColor,this.XYcords.x,this.XYcords.y));
		this.Production = 0;
		this.currentlyBuilding = null;
	}
};
Buildings.prototype.setTeamColor = function(setColor)
{
	this.teamColor = setColor;
	if(this.teamColor == "Orange")
		this.anix = 1;
	else if(this.teamColor == "Blue")
		this.anix = 2;
	else if(this.teamColor == "Green")
		this.anix = 3;
	else if(this.teamColor == "Yellow")
		this.anix = 4;
	else if(this.teamColor == "neutral")
		this.anix = 0;
};
Buildings.prototype.resetResitance = function()
{
	this.CaptuResistence = 5;
};

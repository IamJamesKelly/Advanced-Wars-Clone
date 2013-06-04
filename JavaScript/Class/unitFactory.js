var unitFactory = (function(){
	
	function unitFactory(teamcolors,tileWidth,tileHeight,loadmap)
	{
		this.loadUnitImages = ["Anti-AirTank","APC","Artillery","Bazooka","Bomber","Heavy-Tank","Infantry","Recon","light-Artillery","MissileLanchers","NeoTank","Fighter","Submarine","Tank"];
		this.colorRange = teamcolors;
		this.mtileWidth = tileWidth;
		this.mtileHeight = tileHeight;
		this.unitToLoad = 1;
		_factory = this;
		this.amap = loadmap;
		this.screenBattleScreen = new battleScreenSpriteFactory(teamcolors);
		this.unitData =  UnitData;
		this.amap.loadComplete(this);
	
	}
	unitFactory.prototype.addImage =function (newimg,unitType,namecolor)
	{
		this.unitToLoad++;
		this.unitData[unitType].colors[namecolor] = newimg;
		if(this.unitData[unitType].srcWidth == 0)
			this.unitData[unitType].srcWidth = newimg.width;
		if(this.unitData[unitType].srcHeight == 0)
			this.unitData[unitType].srcHeight = newimg.height;

		if(this.unitToLoad == this.loadUnitImages.length*this.colorRange.length)
		{
			this.amap.loadComplete(this);
		}
	}
	unitFactory.prototype.isloadComplete = function()
	{
		if(this.loadUnitImages == this.unitToLoad)
		{
			return true;
		}
		return false;
	}
	unitFactory.prototype.createUnit = function(Name,Color,x,y) {

		var newUnit = new Unit(x,y,this.mtileWidth,this.mtileHeight,this.unitData[Name],Color,Name)

		newUnit.mbattleSprite = this.screenBattleScreen.getSprite(Name,Color);
		
		return newUnit;
	};

	return unitFactory;
})();
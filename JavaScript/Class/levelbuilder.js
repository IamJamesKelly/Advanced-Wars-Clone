var levelbuilder = (function(){
	
	function levelbuilder(tileW,tileH,_map)
	{
		this.imgBasicBuildings = BuildingImages["imgBasicBuildings"];
		this.basicFrameAcross  = BuildingImages["imgBasicBuildings"].across;
		this.basicFramesDown   = BuildingImages["imgBasicBuildings"].down;
		this.im = 0;
		this.imagesLoaded = false;
		levelbuild     = this;
		this.mplayers  = _map.mplayers;
		this.Parentmap = _map;
		
		this.imgLargeBuilding = BuildingImages["imgLargeBuilding"];
		this.largeFrameAcross = BuildingImages["imgLargeBuilding"].across;
		this.largeFramesDown  = BuildingImages["imgLargeBuilding"].down;
		this.imgTimer         = BuildingImages["imgTimer"];
		this.imgTimer.across  = BuildingImages["imgTimer"].across;;
	
		this.imagesLoaded = true;
		this.tile_sizeX = tileW;
		this.tile_sizeY = tileH;
	}
	levelbuilder.prototype.createBuilding = function(id,i,j) {
		
		var newSecWidth = 0;
		var newSecHeight = 0;
		var newWidth = 0;
		var newHeight = 0;
		var x =0;
		var y = 0;
		var tmpimg = null;
		var srcx = 0;
		var cords = new vector(i,j);

		if(Tiletypes[id].imagSet == "basic")
		{
			x = this.tile_sizeX*i;
			y = this.tile_sizeY*j;
			newWidth = this.tile_sizeX;
			newHeight = this.tile_sizeY;
			newSecWidth = this.imgBasicBuildings.width/this.basicFrameAcross;
			newSecHeight = this.imgBasicBuildings.height/this.basicFramesDown;
			tmpimg = this.imgBasicBuildings;
		}
		else
		{
			x = (this.tile_sizeX*i);
			y = (this.tile_sizeY*j)-this.tile_sizeY;
			newWidth = this.tile_sizeX;
			newHeight = this.tile_sizeY + this.tile_sizeY;
			newSecWidth = this.imgLargeBuilding.width/this.largeFrameAcross;
			newSecHeight = this.imgLargeBuilding.height/this.largeFramesDown;
			tmpimg = this.imgLargeBuilding;
		}

		var newBuilding = new  Buildings(x,y,newWidth,newHeight,newSecWidth,newSecHeight,tmpimg,Tiletypes[id].srcY,srcx,"neutral",Tiletypes[id].t_Type,cords);
		newBuilding.timerImg = this.imgTimer;

		return newBuilding;
	};

	return levelbuilder;
})();
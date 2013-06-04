var BattleScreen = (function(){
	
	function BattleScreen(width,height,teamColors)
	{
		this.landtl = 
		{	
			"Base":{top:0,left:0},"Factory":{top:0,left:1},"AirBase":{top:0,left:2},"Port":{top:0,left:3},"street1":{top:0,left:4},"street2":{top:1,left:0},
			"RoadCity":{top:1,left:1},"RoadWoodLand":{top:1,left:2},"RoadMountain":{top:1,left:3},"RoadWater":{top:1,left:4},"RoadGrassLand":{top:2,left:0},
			"GrassLandRoad":{top:2,left:0},"GrassLandCity":{top:2,left:1},"GrassLandWoodLand":{top:2,left:2},"GrassLandMountain":{top:2,left:3},"GrassLandWater":{top:2,left:4},
			"GrassLand":{top:2,left:2},"WoodLand":{top:3,left:0},"Mountain":{top:3,left:1},"Bridge":{top:3,left:2},"River":{top:3,left:3},"Bank":{top:3,left:4}
		}
		
		this.battleDraw = false;
		this.land = new Image();
		this.land.src = "BattleScreenImages/Backgroads/Land.png";
		_BattleScreen = this;
		this.land.onload =function()
		{
			_BattleScreen.landwidth = this.width;
			_BattleScreen.landheight = this.height;
		}

		this.seaImage = new Image();
		this.seaImage.src = "BattleScreenImages/Backgroads/sea.png";
		this.land.onload =function()
		{
			_BattleScreen.seawidth = this.width/5;
			_BattleScreen.seaheight = this.height/5;
		}

		this.Air = new Image();
		this.Air.src = "BattleScreenImages/Backgroads/Air.png";
		this.land.onload =function()
		{
			_BattleScreen.airwidth = this.width;
			_BattleScreen.airheight = this.height;
		}

		this.battleStats = new Image();
		this.battleStats.src = "Hud-Menu/IntelBackgroad.png";
		
		this.battleStats.onload =function()
		{
			_BattleScreen.battleStatswidth = this.width;
			_BattleScreen.battleStatsheight = this.height;
		}

		this.bg1data = "";
		this.bg2data = "";

		this.unit1 = "";
		this.unit2 = "";
		this.displayh1 =0;
		this.displayh2 =0;
		this.unit1pos = {x:0,y:0};
		this.unit2pos ={x:0,y:0};
		this.mwidth = width;
		this.mheight = height;	
		this.animated = false;
		this.unitsUpdated = false;
	}
	BattleScreen.prototype.Draw = function(ctx,width,height) 
	{

		
		ctx.save();	
			ctx.drawImage(this.bg1data.img,this.bg1data.x ,this.bg1data.y,this.bg1data.w,this.bg1data.h,0,0,this.mwidth/2,this.mheight);
			this.unit1.mbattleSprite.Draw(ctx,2,this.displayh1);
		ctx.restore();
		ctx.save();
			ctx.translate((this.mwidth), 0);
			ctx.scale(-1, 1);
			ctx.drawImage(this.bg2data.img,this.bg2data.x ,this.bg2data.y,this.bg2data.w,this.bg2data.h,0,0,this.mwidth/2,this.mheight);
			this.unit2.mbattleSprite.Draw(ctx,2,this.displayh2);
		ctx.restore();
		
		//Backgroad drawn
		ctx.save();
        ctx.translate(this.mwidth/3, (this.mheight/4)*3);	
		ctx.drawImage(this.battleStats,0,0,this.battleStatswidth,this.battleStatsheight,0,0,(this.mwidth/3),this.mheight/4);
		var xcenter = (this.mwidth/3)/2;
		var height = (this.mheight/4) -20;
		var health1 = ((height/100)*this.displayh1);
		var health2 = ((height/100)*this.displayh2);
		var y1 = height - health1;
		var y2 = height - health2;
		//health display
    	ctx.fillStyle   = '#f00';//red
		ctx.fillRect  (xcenter-50,   20 , 20, height); 	
		ctx.fillRect  (xcenter+30,   20 , 20, height);
		ctx.fillStyle   = '00ff7f';//green
		ctx.fillRect  (xcenter-50,   20 + y2, 20, health2);
		ctx.fillRect  (xcenter+30,   20 + y1, 20, health1);

		ctx.font = "20pt Courier";
	
		ctx.fillStyle   = '#000000';//
		ctx.fillText("Unit:" + this.unit1.name, xcenter + 60, 40);
		ctx.fillText("Attack:" + this.unit1.attack, xcenter + 60, 80);
		ctx.fillText("Defence:" + this.unit1.defence, xcenter + 60, 120);

		ctx.fillText("Unit:" + this.unit2.name,10, 40);
		ctx.fillText("Attack:" + this.unit2.attack,10, 80);
		ctx.fillText("Defence:" + this.unit2.defence,10, 120);


		

		ctx.restore();	
	};
	BattleScreen.prototype.DamageCaculator = function(map)
	{
		
		var damage1 = (map[this.unit1pos.x][this.unit1pos.y].unit.attack - map[this.unit2pos.x][this.unit2pos.y].unit.defence/10)*5;
		var damage2 = (map[this.unit2pos.x][this.unit2pos.y].unit.attack - map[this.unit1pos.x][this.unit1pos.y].unit.defence/10)*5;
		
		map[this.unit1pos.x][this.unit1pos.y].unit.health -= damage2;
		map[this.unit2pos.x][this.unit2pos.y].unit.health -= damage1;

		return map;
	};
	BattleScreen.prototype.begin = function(map,x,y,x2,y2) {
		
		var dirx = x2 - x;
		var diry = y2 - y;
		this.unit1 = map[x][y].unit;
		this.unit2 = map[x2][y2].unit;
		this.bg1data = this.getBackGroad(map[x][y].unit.name,x,y,map);
		this.bg2data = this.getBackGroad(map[x2][y2].unit.name,x2,y2,map)
		map[x][y].unit.mbattleSprite.animating = true;
		map[x2][y2].unit.mbattleSprite.animating = true; 
		map[x2][y2].unit.mbattleSprite.framesPast = 0;
		map[x][y].unit.mbattleSprite.framesPast = 0;
		map[x][y].unit.mbattleSprite.close = true;
		map[x2][y2].unit.mbattleSprite.close = true;
		
		this.unit1pos.x = x;
		this.unit1pos.y = y;
		this.unit2pos.x = x2;
		this.unit2pos.y = y2;
		this.animated = true;
		this.battleDraw = true;
		this.unitsUpdated = false;
		this.displayh1 = this.unit1.health;
		this.displayh2 = this.unit2.health;

		return this.DamageCaculator(map);
	};
	BattleScreen.prototype.update = function(map)
	{
		
		map[this.unit1pos.x][this.unit1pos.y].unit.mbattleSprite.update();
		map[this.unit2pos.x][this.unit2pos.y].unit.mbattleSprite.update();
		if(this.displayh1 > map[this.unit1pos.x][this.unit1pos.y].unit.health)
		{
			this.displayh1 = this.displayh1 - 1;
		}
		if(this.displayh2 > map[this.unit2pos.x][this.unit2pos.y].unit.health)
		{
			this.displayh2 = this.displayh2 - 1;
		}
		if(map[this.unit1pos.x][this.unit1pos.y].unit.mbattleSprite.close == false && map[this.unit1pos.x][this.unit1pos.y].unit.mbattleSprite.close == false)
		{
			this.animated = false;
			this.battleDraw = false;
			this.unitsUpdated = false;
			clearInterval(this.animateID);
			this.animateID = null;
		}
		map[this.unit1pos.x][this.unit1pos.y].unit.Ap = 0;		

		return map;
	};
	BattleScreen.prototype.getBackGroad = function(UnitName,i,j,map) 
	{
		
		
		var name = map[i][j].tile.t_Type;
		var maxi = map.length;
		var maxj = map[i].length;
		
		if(UnitName == "Plane" || UnitName == "Bomber")
		{
			return {x:0,y:0,w:this.Air.width,h:this.Air.height,img:this.Air};
		}
		else if(UnitName == "Submarine")
		{
			return {x:0,y:0,w:this.seaImage.width,h:this.seaImage.height,img:this.seaImage};
		}
		var width = this.land.width/5;
		var height = this.land.height/4;

		
		var name = map[i][j].tile.t_Type;

		for(var stepj= -1 ;1 >= stepj;stepj++)
		{
			for(var stepi=-1 ; 1  >= stepi;stepi++)
			{
				if( i + stepi < maxi &&  i + stepi > 0 && j + stepj < maxj && j + stepj > 0 )
				{
					var myname = name + map[i + stepi][j + stepj].tile.t_Type;
					if( this.landtl[myname] != null)
					{
						var xy = this.landtl[myname];
						return {x:(xy.left *width),y:(xy.top*height),w:width,h: height,img:this.land};
					}
				}
			}   
		}
		if(this.landtl[name] != null)
		{
			var xy = this.landtl[name];
			return {x:(xy.left *width),y:(xy.top*height),w:width,h: height,img:this.land};
		}
	};
	BattleScreen.prototype.animate  = function()
	{
		_BattleScreen = this;
		if(this.animateID == null)
		this.animateID = setInterval(function()
		{
			
		
			if(_BattleScreen.animated == false)
			{
				_BattleScreen.battleDraw = false;
				_BattleScreen.unitsUpdated = false;
				clearInterval(_BattleScreen.animateID);
				_BattleScreen.animateID = null;
			}
			
			//_BattleScreen.update()
		},1000);
	};
	BattleScreen.prototype.destory = function()
	{
		clearInterval(_BattleScreen.animateID);
	};
		
	return BattleScreen;
})();
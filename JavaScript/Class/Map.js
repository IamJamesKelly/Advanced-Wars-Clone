var _onMapload = false;
function Map(j,image,nplayers)
{
	this.bg = image;
	this.mapLoaded = false;
	

	this.start = false;
	this.Bases = new Array();

	this.unitDisplay = new unitInfoDisplay();
	this._Inter = 0;

	this.screenw = $("#GameWorld").width();
	this.screenh = $("#GameWorld").height();
	this.spacex = $("#PlayerDetails").width();
	
	this.Scale_width = this.bg.width/2;
	this.Scale_height = this.bg.height/2;

	this.scaleX = (this.screenw/this.Scale_width);
	this.scaleY = (this.screenh/this.Scale_height);

	this.tile_sizeX = (16 * this.scaleX);
	this.tile_sizeY = (16 * this.scaleY);

	this.levelLoader = new levelbuilder(this.tile_sizeX ,this.tile_sizeY,this);

	this.factory = null;
	this.tilesAcross = ( this.bg.width/16);
	this.tilesDown = (this.bg.height/16);
	this.activePlayer = null;
	this.srollStartx = 0;
	this.srollStarty = 0;
	this.scrollAllow = false;
	this.moveClear = false;

	this.cells = new Array(this.tilesAcross);
	for(i = 0;i < this.tilesAcross;i++)
	{
		this.cells[i] = new Array(this.tilesDown);
	}

	this.MouseX = 0;
	this.MouseY = 0;
	this.worldpos =  new vector(0,0);
	this.toload = new Array();
	this.players = new Array();
	this.selectedCellX = null;
	this.selectedCellY = null;

	this.jason = j;
 	this.mapLoaded = true;

 	this.buildingDisplay = new BuildingMenu();

 	this.battleScreen = null;
 	_map = this;
  	if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) )
    {
 		$$('#backUnitSelect').tap(function()
		{
			_map.buildingDisplay.updateBuildMenu(-1);
		});
	    $$('#forwardUnitSelect').tap(function()
		{
			_map.buildingDisplay.updateBuildMenu(1);
		});
		$(window).resize(function() {
			_map.resize();
		});
	    $$("#Build").tap(function(){
			_map.BeginBuild();
		});
	}
	else
	{
		$('#backUnitSelect,#forwardUnitSelect,#Build').unbind('click');
	 	$('#backUnitSelect').click(function()
		{
			_map.buildingDisplay.updateBuildMenu(-1);
		});

	    $('#forwardUnitSelect').click(function()
		{
			_map.buildingDisplay.updateBuildMenu(1);
		});
		$(window).resize(function() {
			_map.resize();
		});
	    $("#Build").click(function(){
			_map.BeginBuild();
		});
	}
}
Map.prototype.resize = function()
{	
	this.screenw = $("#GameWorld").width();
	this.screenh = $("#GameWorld").height();
	this.spacex = $("#PlayerDetails").width();
	this.Scale_width = this.bg.width/2;
	this.Scale_height = this.bg.height/2;
	this.scaleX = (this.screenw/this.Scale_width);
	this.scaleY = (this.screenh/this.Scale_height);
	this.tile_sizeX = (16 * this.scaleX);
	this.tile_sizeY = (16 * this.scaleY);
	if(this.battleScreen != null)
	{
		this.battleScreen.mwidth = this.screenw;
		this.battleScreen.mheight  = this.screenh;
	}
	for(var j=0;this.tilesDown> j;j++)
	{
		for(var i=0;this.tilesAcross  > i;i++)
		{
			if(this.cells[i][j].unit != null)
			{
				this.cells[i][j].unit.tile_width = this.tile_sizeX;
				this.cells[i][j].unit.tile_height =this.tile_sizeY;
				this.cells[i][j].unit.globalposition =  new vector((this.tile_sizeX*i),(this.tile_sizeY*j));
			
			}
			if(this.cells[i][j].building != null)
			{
				this.cells[i][j].building.tile_width = this.tile_sizeX;
				this.cells[i][j].building.tile_height = this.tile_sizeY;
				this.cells[i][j].building.globalposition =  new vector((this.tile_sizeX*i),(this.tile_sizeY*j));
			}
			if(this.cells[i][j] != null)
			{
				this.cells[i][j].tile_sizeX = this.tile_sizeX;
				this.cells[i][j].tile_sizeY = this.tile_sizeY;
				this.cells[i][j].globalposition =  new vector((this.tile_sizeX*i),(this.tile_sizeY*j));
			}
		}
	}
	this.battleScreen
}
Map.prototype.Update = function()
{
	if(this.battleScreen.battleDraw == true)
	{
		this.cells = this.battleScreen.update(this.cells);
		
		return;
	}
	for(var j=0;this.tilesDown> j;j++)
	{
		for(var i=0;this.tilesAcross  > i;i++)
		{
			if(this.cells[i][j].unit != null)
			{
				if(this.cells[i][j].unit.moving == false)
				{
					if(this.cells[i][j].unit.attackTarget != null)
					{
						var x = this.cells[i][j].unit.attackTarget.x;
						var y = this.cells[i][j].unit.attackTarget.y;
						this.cells[i][j].unit.attackTarget = null;
						this.cells = this.battleScreen.begin(this.cells,i,j,x,y);
					}
				}
				if(this.cells[i][j].unit.health <= 0 && this.battleScreen.battleDraw == false)
				{

					this.cells[i][j].unit = null;
					 SocketIO.SendData("Update",{updateName:"removeUnit",x:i,y:j});
					if(this.activePlayer.checkIfOwn(this.cells[i][j].unit))
					{
						_GameData.unitsLost++;
					}
				}
			}
		}
	}
}
Map.prototype.scroll = function(e)
{
	if(this.scrollAllow  == false)
		return;

	var moveX = this.srollStartx - e.pageX ;
	var moveY =  this.srollStarty - e.pageY;
	if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) )
    {
    	moveX = moveX * 10;
    	moveY = moveY * 10;
    }
 	var mX = (moveX/this.Scale_width);
 	var my = (moveY/this.Scale_height);

	if(this.worldpos.x + mX  < this.Scale_width  && this.worldpos.x + mX  >= 0  )
	{
		this.worldpos.x = this.worldpos.x + mX;
	}
	else
	{
		if(this.worldpos.x + mX > this.Scale_width)   
			moveX =  this.Scale_width;
		if(this.worldpos.x + mX  <= 0  )
			moveX = 0;
	}
	if(this.worldpos.y + my  < this.Scale_height && this.worldpos.y + my   >= 0  )
	{
		this.worldpos.y = this.worldpos.y + my;
	}
	else
	{
		if(this.worldpos.y + my > this.Scale_width)   
			moveY =  this.Scale_width;
		if(this.worldpos.y +my  <= 0  )
			moveY = 0;
	}
	this.gridx = Math.floor(e.pageX/this.tile_sizeX )* this.tile_sizeX;
	this.gridy =  Math.floor(e.pageY/this.tile_sizeY )* this.tile_sizeY;
}
Map.prototype.ScrollTo = function(x,y)
{
	_map = this;
	var _x = x;
	var _y = y;
    var scalx = (_map.worldpos.x * _map.scaleX);
    var scaly = (_map.worldpos.y * _map.scaleY);

	var dirx = Math.floor(x - scalx);
	var diry = Math.floor(y - scaly);

	if(dirx < this.worldpos.x + (_map.Scale_width* _map.scaleX)/2 && dirx >= this.worldpos.x)
	{
		dirx = 0;
	}
	if(diry < this.worldpos.y + ( _map.Scale_height *_map.scaleY)/2 && diry >= this.worldpos.y)
	{
		diry = 0;
	}
	var _map = this;
	clearInterval(this._Inter);

	this._Inter  = setInterval(function(){

		var  mx = 40; 
		var  my = 40;
		var xReached = false;
		var yReached = false;

		if(dirx < 0)
		{
			mx = -40; 
		}
		else if(dirx == 0 )
		{
			mx = 0;
			xReached = true;
		}

		if(diry < 0)
		{
			my = -40;
		}
		else if(diry == 0)
		{
			my = 0;
			yReached = true;
		}

		if(_map.worldpos.x + mx  <= _map.Scale_width  && _map.worldpos.x + mx >= 0 && xReached == false)
		{
			_map.worldpos.x = _map.worldpos.x + mx;
		}
		else
		{
			if(_map.worldpos.x + mx > _map.Scale_width)   
				_map.worldpos.x =  _map.Scale_width;
			if(_map.worldpos.x + mx  <= 0  )
				_map.worldpos.x = 0;

			xReached = true;
		}

		if(_map.worldpos.y + my  <= _map.Scale_height &&  _map.worldpos.y + my  >= 0 && yReached == false)
		{
			_map.worldpos.y = _map.worldpos.y + my;
		}
		else
		{

			if(_map.worldpos.y + my > _map.Scale_height)   
				_map.worldpos.y =   _map.Scale_height;
			if(_map.worldpos.y +my  <= 0  )
				_map.worldpos.y = 0;


			yReached = true;
		}

		if(yReached == true && xReached == true)
		{
			clearInterval(_map._Inter);
		}
		
	},100);
};
Map.prototype.Draw = function()
{
	var canvas = $("#GameWorld")[0];
	var ctx = canvas.getContext("2d");
	ctx.clearRect(10,10,this.screenw,this.screenh);
	canvas.width = this.screenw;
	canvas.height = this.screenh;
	this.unitDisplay.Draw();
	if(this.battleScreen.battleDraw == true)
	{
		this.battleScreen.Draw (ctx,this.screenw,this.screenh);
	}
	if(this.battleScreen.battleDraw == false)
	{
		ctx.drawImage(this.bg,this.worldpos.x, this.worldpos.y,this.Scale_width,this.Scale_height,0,0,this.screenw,this.screenh);
		for(var j=0;this.tilesDown> j;j++)
		{
			for(var i=0;this.tilesAcross  > i;i++)
			{
				
				this.cells[i][j].SelectDraw(ctx,this.worldpos.x * this.scaleX, this.worldpos.y*this.scaleY);
				this.cells[i][j].moveRange(ctx,this.worldpos.x * this.scaleX, this.worldpos.y*this.scaleY);

				if(this.cells[i][j].building != null)
				{
					this.cells[i][j].building.Draw(ctx, new vector(this.worldpos.x * this.scaleX, this.worldpos.y*this.scaleY));
				}
				if(this.cells[i][j].unit != null)
				{
					this.cells[i][j].unit.Update();
					this.cells[i][j].unit.Draw(ctx, new vector(this.worldpos.x * this.scaleX, this.worldpos.y*this.scaleY));
				}
			}
		}	

		if(this.buildingDisplay.hidden == false)
		{
			this.buildingDisplay.Draw(this.activePlayer.teamColor);
		}
		if(this.selectedCellY != null && this.selectedCellX != null && this.cells[this.selectedCellX][this.selectedCellY].unit != null)
		{
			
		}
	}
}
Map.prototype.Click = function(e)
{
	if(this.battleScreen.battleDraw == true)
		return;

	var i = Math.floor(((this.worldpos.x* this.scaleX)+ (e.pageX - this.spacex))/this.tile_sizeX);
	var j =  Math.floor((((this.worldpos.y* this.scaleY)+e.pageY)/this.tile_sizeY));
	if(this.tilesDown < j || this.tilesAcross < i)
	{
		return;
	}
	
	this.moveClear = true;
	this.toggleCell(i,j);
}
Map.prototype.newTurnUpdate = function(teamId)
{
	for(var j=0;this.tilesDown> j;j++)
	{
		for(var i=0;this.tilesAcross  > i;i++)
		{
			this.cells[i][j].Update(i,j);

			if(this.cells[i][j].building != null)
			{

				if(this.cells[i][j].building.unitsProduced.length)
				{
					var newunit = this.cells[i][j].building.unitsProduced[0];
					this.cells[i][j].building.unitsProduced.pop();
					this.freeSquare(i,j,newunit);
					_GameData.unitsProduced++;
				}
				if(this.activePlayer != null && this.activePlayer.checkIfOwn(this.cells[i][j].building))
				{
					this.activePlayer.points  = this.activePlayer.points + this.cells[i][j].building.revenu; 
				}
			}
		}
	}
	
	this.selectedCellX = null;
	this.selectedCellY = null;

	return this.activePlayer;
}
Map.prototype.movementRange = function(x,y,move,aUnit,path)
{
	var moves = 0;
	
	if(path == null)
		path = [];

	if(this.cells[x][y] != null)
	{

		if(move > 0 )
		{
			if(this.cells[x][y].pathTo == null || this.cells[x][y].totalMoveCost < move)
			{
				this.cells[x][y].totalMoveCost = move;
				this.cells[x][y].pathTo = path.slice();
			}

			if(this.movementCheck(x-1,y,move, aUnit,path))
			{
				var pathLeft = path.slice();
				pathLeft.unshift({movex:-1,movey:0});
				this.movementRange(x-1,y,move -this.cells[x -1][y].tile.Cost,aUnit,pathLeft);
			}
			else
			{
				moves++;
			}
			if(this.movementCheck(x,y-1,move, aUnit,path))
			{
				var pathDown = path.slice();
				pathDown.unshift({movex:0,movey:-1});
				this.movementRange(x,y-1,move -this.cells[x][y-1].tile.Cost,aUnit,pathDown);
			}
			else
			{
				moves++;
			}	
			if(this.movementCheck(x,y+1,move, aUnit,path))
			{
				var pathUp = path.slice();
				pathUp.unshift({movex:0,movey:1});
				this.movementRange(x,y+1,move -this.cells[x][y+1].tile.Cost,aUnit,pathUp);
				
			}
			else
			{
				moves++;
			}
			if(this.movementCheck(x+1,y,move, aUnit,path))
			{
				var pathRight = path.slice();
				pathRight.unshift({movex:1,movey:0});
				this.movementRange(x+1,y,move -this.cells[x+1][y].tile.Cost,aUnit,pathRight);
			}
			else
			{
				moves++;
			}
			if( move == 0 && this.cells[x][y].unit != null || moves == 4 &&  this.cells[x][y].unit != null )
			{
				this.cells[x][y].unit.Apblock = true;
			}	
		}
		if(this.cells[x][y].pathTo == null || this.cells[x][y].totalMoveCost < move || this.cells[x][y].pathTo.length == 0)
		{

			this.cells[x][y].totalMoveCost = move;
			this.cells[x][y].pathTo = path.slice();
		}
		
	}
}
Map.prototype.movementCheck = function(x,y,move,aUnit,path,move)
{
	if(x < 0 || x > this.tilesAcross || y < 0 || y > this.tilesDown )
		return false;
	if(this.cells[x][y] == null)
		return false;

	if(this.cells[x][y].unit != null && this.activePlayer.checkIfOwn(this.cells[x][y].unit) == false)
	{
		if(this.cells[x][y].pathTo == null || this.cells[x][y].totalMoveCost < move || this.cells[x][y].pathTo.length == 0)
		{
			this.cells[x][y].attackAble = true;
			this.cells[x][y].totalMoveCost = 0;
			this.cells[x][y].pathTo = path.slice();
		}
	
		return false;
	}
	else if(this.cells[x][y].unit != null)
	{
		return false;
	}
	if(this.cells[x][y].building != null  && this.activePlayer.checkIfOwn(this.cells[x][y].building) == false)
	{
		this.cells[x][y].captureAble = true;
		this.cells[x][y].moveAble = true;
		return true;
	}
	else if(this.cells[x][y].building != null )
	{
		return false;
	}
	if(0 > move - this.cells[x][y].tile.Cost)
	{
		return false;
	}
	if(aUnit.blocked(this.cells[x][y].tile.t_Type) == true)
	{
		return false;
	}

	this.cells[x][y].moveAble = true;
	return true;
}
Map.prototype.Setup = function(players)
{
	var jsdata = this.jason;
	var cell = 0;
	var tileData = jsdata.layers[0].data;
	var tile_type;
	for(var j=0; this.tilesDown  >  j;j++)
	{
		for(var i=0;this.tilesAcross > i;i++)
		{
			var type = parseFloat(tileData[cell]) -1;
			this.cells[i][j] = new Cell(i*this.tile_sizeX,j*this.tile_sizeY,this.tile_sizeX,this.tile_sizeY);
 			tile_type = jsdata.tilesets[0].tileproperties[type].Type;

			this.cells[i][j].tile = Tiletypes[tile_type];
			
			if(this.cells[i][j].tile.srcY != null)
			{
				this.cells[i][j].SetBuilding(this.levelLoader.createBuilding(tile_type,i,j));
				if(Tiletypes[tile_type].t_Type == "Base")
				{
					this.Bases.push(new vector(i,j));
				}
			}
			cell++;
		}
	}
	var p;
	
	for(p in players)
	{
		this.toload.push(players[p].teamColor);
	}
	this.players = players;
	this.factory = new unitFactory(this.toload,this.tile_sizeX ,this.tile_sizeY,this);
	this.battleScreen = new BattleScreen(this.screenw,this.screenh,this.toload);
}
Map.prototype.loadComplete = function (factoryLoaded)
{
	this.factory = factoryLoaded;
	
	for(p in this.players)
	{
		var basepos = this.Bases[this.Bases.length -1];
		this.Bases.pop();
		if(this.cells[basepos.x][basepos.y].building != null)
		{
			this.cells[basepos.x][basepos.y].building.setTeamColor( this.players[p].teamColor);
			this.startUpUnits(basepos.x,basepos.y, this.players[p].teamColor);
			this.players[p].basePos = basepos;

		}
	}	
	this.resize();
}
Map.prototype.toggleCell = function(i,j)
{
	if(this.cells[i][j] == null)
		return;

	
	this.clickUnit(i,j);
	this.clickBuilding(i,j);
	if(this.cells[i][j].building == null && this.cells[i][j].unit == null)
	{
		this.clearMoveRange();
	}
}
Map.prototype.clickUnit = function(i,j)
{

	if(this.cells[i][j].unit != null && this.activePlayer.checkIfOwn(this.cells[i][j].unit))
	{
		AudioPlayer.Play("unitSelect",false);
		this.cells[i][j].unit.Selected = true;
		this.cells[i][j].CellSelect = true;
		this.clearMoveRange();
		this.selectedCellY = j;
		this.selectedCellX = i;
		this.unitDisplay.Display(this.cells[i][j].unit);
		if(this.activePlayer.active)
		{
			this.movementRange(this.selectedCellX,this.selectedCellY,this.cells[this.selectedCellX][this.selectedCellY].unit.Ap,this.cells[this.selectedCellX][this.selectedCellY].unit);
		}
	}
	else if(this.cells[i][j].unit != null && this.selectedCellX != null && this.selectedCellY != null  && this.cells[this.selectedCellX][this.selectedCellY].unit != null && this.cells[i][j].attackAble == true)
	{
		var attackRange = this.cells[this.selectedCellX][this.selectedCellY].unit.attackRange;
		var moveTo = this.cells[i][j].pathTo.slice();
		this.checkAttackRange(i,j);
		var withinattackRange = this.checkAttackRange(i,j);

		if(withinattackRange)
		{
			var target = new vector(i,j);
			this.cells[this.selectedCellX][this.selectedCellY].unit.setattackTarget(this.selectedCellX,this.selectedCellY,target,null);
			this.clearMoveRange();
			return;
		}
			
		this.cells[this.selectedCellX][this.selectedCellY].unit.setMovetoPath(this.selectedCellX,this.selectedCellY,moveTo);

		var x = this.selectedCellX;
		var y = this.selectedCellY;

		for(var step=0; moveTo.length > step;step++)
		{
			x += moveTo[step].movex;
			y += moveTo[step].movey;
		}

		this.cells[x][y].unit = this.cells[this.selectedCellX][this.selectedCellY].unit;
		this.cells[x][y].unit.Ap =  this.cells[x][y].totalMoveCost;

		if(x != this.selectedCellX || y != this.selectedCellY)
			this.cells[this.selectedCellX][this.selectedCellY].unit = null;

		var target = new vector(i,j);
		this.cells[x][y].unit.setattackTarget(this.selectedCellX,this.selectedCellY,target,moveTo);
		this.clearMoveRange();
	}
	else if(this.cells[i][j].unit != null && this.activePlayer.checkIfOwn(this.cells[i][j].unit) == false)
	{
		this.clearMoveRange();
		this.cells[this.selectedCellX][this.selectedCellY].CellSelect = false;
	}
}
Map.prototype.clickBuilding = function(i,j)
{
	if(this.selectedCellY != null && this.selectedCellX != null && this.cells[this.selectedCellX][this.selectedCellY].unit != null && this.cells[i][j].moveAble)
	{
			
		var movedy = Math.floor(j - this.selectedCellY);
		var movedx =  Math.floor(i - this.selectedCellX);

		this.cells[this.selectedCellX][this.selectedCellY].CellSelect = false;
		this.cells[this.selectedCellX][this.selectedCellY].unit.setMovetoPath(this.selectedCellX,this.selectedCellY,this.cells[i][j].pathTo.slice());
			
		this.cells[i][j].unit = this.cells[this.selectedCellX][this.selectedCellY].unit;

		this.cells[this.selectedCellX][this.selectedCellY].unit.Ap =  this.cells[i][j].totalMoveCost;
			
		if(i != this.selectedCellX || j !=  this.selectedCellY )
		{
		 	this.cells[this.selectedCellX][this.selectedCellY].unit = null;
		}	
		this.clearMoveRange();
		this.cells[i][j].CellSelect = true;
		this.unitDisplay.Display(this.cells[i][j].unit);
		if(this.activePlayer.active)
		{
			this.movementRange(i,j,this.cells[i][j].unit.Ap,this.cells[i][j].unit);
		}
		
	}
	if(this.selectedCellY != null && this.selectedCellX != null && this.cells[this.selectedCellX][this.selectedCellY].unit != null && this.cells[i][j].moveAble && i != this.selectedCellX && j != this.selectedCellY  )
	{
		var movedy = Math.floor(j - this.selectedCellY);
		var movedx =  Math.floor(i - this.selectedCellX);

		this.cells[this.selectedCellX][this.selectedCellY].CellSelect = false;
		this.cells[this.selectedCellX][this.selectedCellY].unit.setMovetoPath(this.selectedCellX,this.selectedCellY,this.cells[i][j].pathTo.slice());;
		
		this.cells[i][j].unit = this.cells[this.selectedCellX][this.selectedCellY].unit;

		this.cells[this.selectedCellX][this.selectedCellY].unit.Ap =  this.cells[i][j].totalMoveCost;
		
		if(i != this.selectedCellX || j !=  this.selectedCellY )
	 		this.cells[this.selectedCellX][this.selectedCellY].unit = null;
	}	
	if(this.cells[i][j].unit == null)
	{
		this.unitDisplay.clear();
		this.clearMoveRange();
	}
	if(this.type == "online")
	{

	}

	this.buildingDisplay.toggleDisplay(this.cells[i][j]);
	this.selectedCellY = j;
	this.selectedCellX = i;
}
Map.prototype.setActivePlayer = function(p)
{
	olplayer = this.activePlayer;
	this.activePlayer = p;
};
Map.prototype.clearMoveRange = function(rightclick)
{
	for(var j=0;this.tilesDown > j;j++)
	{
		for(var i=0;this.tilesAcross  > i;i++)
		{
			if(this.cells[i][j].moveAble == true || this.cells[i][j].captureAble == true ||  this.cells[i][j].attackAble == true)
			{
				this.cells[i][j].reset();
			}
		}
	}
	if(this.selectedCellY == null || this.selectedCellX == null )
		return;

	this.unitDisplay.clear();
	

	this.cells[this.selectedCellX][this.selectedCellY].CellSelect = false;
}
Map.prototype.startUpUnits = function(x,y,Color,startUnits)
{	
	var i = -1;
	var j = -1

	startUnits = ["Infantry","Recon","Bazooka","Bomber"]
	for(newUnit in startUnits)
	{
		this.freeSquare(x,y,startUnits[newUnit],Color);
	}	
}
Map.prototype.checkAttackRange = function(i,j)
{
	var diffy = Math.abs(j - this.selectedCellY);
	var diffx = Math.abs(i - this.selectedCellX);
	if(i == this.selectedCellX  && diffy <= this.cells[this.selectedCellX][this.selectedCellY].unit.attackRange)
		return true;
	if(j == this.selectedCellY && diffx <= this.cells[this.selectedCellX][this.selectedCellY].unit.attackRange)
		return true;

	return false;
}
Map.prototype.BeginBuild = function()
{
	
	var id = this.buildingDisplay.setx; 
	if((this.activePlayer.points - this.buildingDisplay.unitInfo[id].cost) < 0)
	{
		return;
	}
	this.activePlayer.points = this.activePlayer.points - this.buildingDisplay.unitInfo[id].cost;
	this.cells[this.selectedCellX][this.selectedCellY].building.currentlyBuilding = {productionId:id,data:this.buildingDisplay.unitInfo[id]};
	if(this.cells[this.selectedCellX][this.selectedCellY].building.factory == null)
		this.cells[this.selectedCellX][this.selectedCellY].building.factory  = this.factory;

	

	$("#Build,#backUnitSelect,#forwardUnitSelect").hide();
}
Map.prototype.freeSquare = function(x,y,unitnameOrUnit,Color)
{
	var nx ,ny;
	for(j = -1; j < 2; j++)
	{
		for(i = -1; i < 2; i++)
		{
			if(  x + i >= 0  && x + i <= this.tilesAcross && y + j >= 0  && y + j <= this.tilesDown && this.cells[x + i][y + j] != null && this.cells[x + i][y + j].building == null && this.cells[x + i][y + j].unit == null)
			{
				if(typeof(unitnameOrUnit) == 'string' && Color != undefined)
				{
					this.cells[x+i][y+j].unit = this.factory.createUnit(unitnameOrUnit,Color,x+i,y+j);
					nx = x + i;
					ny = y + j;
					
				}
				else
				{
					this.cells[x+i][y+j].unit = unitnameOrUnit;
					this.cells[x+i][y+j].unit.globalposition.x = (x+i) *  this.tile_sizeX;
					this.cells[x+i][y+j].unit.globalposition.y = (y+j) *  this.tile_sizeY;
					nx = x + i;
					ny = y + j;
				}
				i = 2;
				j = 2;
			}
		}
	}
	if(_onlineGame  == true)
	{
		var Data = 
		{
			updateName:"newUnit",
			name:this.cells[nx][ny].unit.name,
			color:this.cells[nx][ny].unit.teamColor,
			cellx:nx,
			celly:ny,
		};
		SocketIO.SendData("Update",Data);
	}
}
Map.prototype.removecolor = function(Color)
{
	for(var j=0;this.tilesDown> j;j++)
	{
		for(var i=0;this.tilesAcross  > i;i++)
		{
			if(this.cells[i][j].unit != null && this.cells[i][j].unit.teamColor == Color)
			{
				this.cells[i][j].unit = null;
			}
			if(this.cells[i][j].building != null && this.cells[i][j].building == Color)
			{
				this.cells[i][j].building.teamColor = "neutral";
			}
		}
	}
}
var BuildingMenu = (function(){
	
	function BuildingMenu()
	{
		this.production = {"Barracks":{start:0,num:2},"Factory":{start:2,num:9},"AirBase":{start:11,num:15},"Docks":{start:15,num:19},"Base":{start:0,num:15}};
		this.unitInfo = 
		{
			0:{cost:1500,Info:"",name:"Infantry",productionTime:5},
			1:{cost:2500,Info:"",name:"Bazooka",productionTime:5},
			2:{cost:100,Info:"",name:"Anti-AirTank",productionTime:5},
			3:{cost:4000,Info:"",name:"Recon",productionTime:5},
			4:{cost:6000,Info:"",name:"Artillery",productionTime:5},
			5:{cost:15000,Info:"",name:"MissileLanchers",productionTime:5},
			6:{cost:7000,Info:"",name:"Tank",productionTime:5},
			7:{cost:100,Info:"",name:"Heavy-Tank",productionTime:5},
			8:{cost:100,Info:"",name:"light-Artillery",productionTime:5},
			9:{cost:5000,Info:"",name:"APC",productionTime:5},
			10:{cost:100,Info:"",name:"NeoTank",productionTime:5},
			11:{cost:20000,Info:"",name:"Fighter",productionTime:5},
			12:{cost:20000,Info:"",name:"Bomber",productionTime:5},
			13:{cost:100,Info:"",name:"Helicopter",productionTime:5},
			14:{cost:100,Info:"",name:"Helicopter Transporter",productionTime:5},
			15:{cost:100,Info:"",name:"BattleShip",productionTime:5},
			16:{cost:100,Info:"",name:"Cruiser",productionTime:5},
			17:{cost:100,Info:"",name:"Submarine",productionTime:5},
			18:{cost:100,Info:"",name:"Boat Transporter",productionTime:5}
		};

		this.sety = 0;
		this.setx = 0;

		this.drawx = 0;
		this.drawy = 0;
		this.unitSelected = "";

		this.range = 0;
		this.image = null;
		this.x = 0;
		this.y = 0;
		this.srcwidth = 0;
		this.heightSec = 0;
		this.name = "";
		this.hidden = true;
		this.units = new Image();
		this.units.src = "BattleScreenImages/BuildSprites.png"
		this.buildwidth = 0;
		this.buildheight = 0;
		_BuildingMenu = this;

		this.hideBuildmenu = true;
		
		this.units.onload= function()
		{
			_BuildingMenu.buildwidth = this.width/19;
			_BuildingMenu.buildheight = this.height/4;
		};
		var canvas = $("#overlay")[0];
		this.ctx = canvas.getContext("2d");
		this.ctx.font = "15pt Courier";
		this.ctx.fillText("Building:", 0, 20);
	}
	BuildingMenu.prototype.toggleDisplay = function(tile,rightclick) {

		if(tile == null || rightclick == false)
		{
			if(this.hidden == false)
			{
				$("#Build,#backUnitSelect,#forwardUnitSelect").fadeOut(100);
				this.ctx.clearRect(0,0,600,600);
				this.hideBuildmenu = true;
				this.hidden = true;
			}
			return;
		}
		if(rightclick == true)
		{
			if(this.hidden == false)
			{
				
				$("#Build,#backUnitSelect,#forwardUnitSelect").fadeOut(100);
				this.ctx.clearRect(0,0,600,600);
				this.hideBuildmenu = true;
				this.hidden = true;
			}
			return;
		}
		if(this.hidden == false && tile == null || this.hidden == false && tile.building == null || rightclick == true)
		{
			$("#Build,#backUnitSelect,#forwardUnitSelect").fadeOut(100);
			this.ctx.clearRect(0,0,600,600);
			this.hideBuildmenu = true;
			this.hidden = true;
		}
		else if(tile.building != null)
		{
			this.building =  tile.building;
			
			if(this.building.teamColor == "Orange")
				this.sety = 3;
			else if(this.building.teamColor == "Blue")
				this.sety = 0;
			else if(this.building.teamColor == "Green")
				this.sety = 2;
			else if(this.building.teamColor == "Yellow")
				this.sety = 1;

			if(tile.building.currentlyBuilding != null)
			{
				this.setx = tile.building.currentlyBuilding.productionId;
			}
			else if(this.production[this.building.name] != null)
			{
				this.setx = this.production[this.building.name].start;
				this.range = this.production[this.building.name].num;
			}

			this.drawy = this.sety * this.buildheight;
			this.updateBuildMenu(0);

			
				
				if(tile.building.currentlyBuilding == null && this.production[this.building.name]  != null && this.building.teamColor != "neutral")
				{
					$("#Build,#backUnitSelect,#forwardUnitSelect").show();
					this.hideBuildmenu = false;
				}
				else
				{
					$("#Build,#backUnitSelect,#forwardUnitSelect").hide();
					this.hideBuildmenu = true;
				}
				this.hidden = false;
		
		}	
		this.ctx.clearRect(0,0,600,600);
		this.ctx.font = "15pt Courier";
		this.ctx.fillText("Building:", 0, 20);
	};
	BuildingMenu.prototype.Draw = function(teamcolor) {

		this.ctx.clearRect(0,0,600,600);
		this.ctx.font = "15pt Courier";
		this.ctx.fillText("Building:", 0, 20);
		this.ctx.save();
        this.ctx.translate(this.mwidth/3, (this.mheight/4)*3);	
		this.ctx.drawImage(this.building.image,this.building.anix * this.building.widthSec,this.building.aniy * this.building.heightSec,this.building.widthSec,this.building.heightSec,5,20,this.building.widthSec*1.5,this.building.heightSec*1.5);
		this.ctx.font = "12pt Courier";
		this.ctx.fillText("Type:"+this.building.name, (this.building.widthSec*1.5)+5, 40);
		this.ctx.fillText("Team:" + this.building.teamColor, (this.building.widthSec*1.5)+5, 60);
		this.ctx.fillText("Revenu:" + this.building.revenu, (this.building.widthSec*1.5)+5, 80);
		this.ctx.font = "10pt Courier";

		if(this.building.teamColor != teamcolor)
		{
			$("#Build,#backUnitSelect,#forwardUnitSelect").hide();
		}
		if(this.production[this.building.name]  != null && this.building.teamColor != "neutral" && this.building.teamColor == teamcolor && this.hideBuildmenu == false)
		{
			this.ctx.drawImage(this.units,this.drawx,this.drawy,this.buildwidth,this.buildheight,200,0,this.buildwidth*1.5,this.buildheight*1.5);
			this.ctx.fillText("Unit:" + this.unitSelected.name, (this.building.widthSec*1.5)+5, 100);
			this.ctx.fillText("Info:" + this.unitSelected.Info, (this.building.widthSec*1.5)+5, 120);
			this.ctx.fillText("Cost:" + this.unitSelected.cost, (this.building.widthSec*1.5)+5, 140);
		}
		this.ctx.restore();
	};
	BuildingMenu.prototype.updateBuildMenu = function(dirx) {

		this.range = 11;
		if(this.production[this.building.name] == null)
			return;

		if(this.setx +dirx < this.range && this.setx +dirx >= this.production[this.building.name].start)
		{
			this.setx += dirx;
			this.unitSelected = this.unitInfo[this.setx];
		}
		else if(this.setx +dirx > this.range)
		{
			this.drawx = this.setx * this.buildwidth;
		}
		this.drawx = this.setx * this.buildwidth;
	};
	
	return BuildingMenu;
})();
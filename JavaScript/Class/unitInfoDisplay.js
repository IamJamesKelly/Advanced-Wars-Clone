var unitInfoDisplay = (function(){
	
	function unitInfoDisplay()
	{
		this.unit = null;
		var canvas = $("#selectedUnit .layer")[0];
		this.ctx = canvas.getContext("2d");
		this.sety = 0;
		this.ctx.font = "15pt Courier";
		this.ctx.fillText("Unit:",10, 20);
	}
	unitInfoDisplay.prototype.Display = function(unit)
	{
		this.unit = unit;
		if(this.unit.teamColor == "Orange")
			this.sety = 3;
		else if(this.unit.teamColor == "Blue")
			this.sety = 0;
		else if(this.unit.teamColor == "Green")
			this.sety = 2;
		else if(this.unit.teamColor == "Yellow")
			this.sety = 1;
	}
	unitInfoDisplay.prototype.Draw = function()
	{
		if(this.unit == null)
			return;


		this.ctx.clearRect(0,0,600,600);
		this.ctx.save();
		this.ctx.font = "15pt Courier";
		this.ctx.fillText("Unit:", 10, 20);
		this.ctx.font = "10pt Courier";
		this.ctx.fillText("Name:", 20, 30);
		this.ctx.fillText("Attack:" + this.unit.attack, 20, 40);
		this.ctx.fillText("Defence:" + this.unit.defence,20, 50);
		this.ctx.fillText("Ap:" + this.unit.Ap,20, 60);
		this.ctx.restore();	
		this.ctx.save()
		var height = 100;
		var health  = (height/100) * this.unit.health;
		
		this.ctx.font = "10pt Courier";
		this.ctx.fillText("Health:", 20, 70);
		this.ctx.fillStyle   = '#f00';//red
		this.ctx.fillRect  (120,   60 ,  height, 10); 	
		this.ctx.fillStyle   = '00ff7f';//green
		this.ctx.fillRect  (120,   60 , health, 10);
		this.ctx.restore();	
		this.ctx.save()
		this.ctx.font = "10pt Courier";
		var y = 80;
		this.ctx.fillText("Advantage:,", 20, y);
		y += 10;
		for(crit in this.unit.critical)
		{
			this.ctx.fillText(this.unit.critical[crit] + ",", 20, y);
			y += 10;
		}
		this.ctx.restore();	
		
	}
	unitInfoDisplay.prototype.clear = function()
	{
		this.ctx.clearRect(0,0,600,600);
		this.ctx.font = "15pt Courier";
		this.ctx.fillText("Unit:",10, 20);
		this.unit = null;
	}

	return unitInfoDisplay;
})();
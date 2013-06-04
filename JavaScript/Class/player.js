var player = (function()
{
	
	function player(playerId,team)
	{
		this.id = playerId;
		this.basePos = new vector(0,0);
		this.teamColor = team;
		this.active = false;
		this.points = 1000;
		this.unitsLossed = 0;
		this.unitsKilled = 0;
		this.BuildingsCaptured = 0;
		this.displyedPoints = 1000;
		this.dead = false;
		this.currentGameData = null;
	}
	player.prototype.checkIfOwn = function(object) 
	{
		if(this.teamColor == object.teamColor)
		{
			return true;
		}

		return false;
	};
	

	return player;
})();
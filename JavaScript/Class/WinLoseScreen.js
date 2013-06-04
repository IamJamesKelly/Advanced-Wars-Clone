var WinLoseScreen = (function(){

	function WinLoseScreen()
	{
		this.screen = $("#winLose");
	}
	WinLoseScreen.prototype.Display = function(data,Player,numOpponets) 
	{
		
		var d = new Array();
		this.gamesPlayed++;
		d[0] = "Winner";
		d[1] = "You Placed 1st";
		d[2] = "You Killed " + data.unitsKilled.toString() +" Enemy Units";
		d[3] = "You Lossed " + data.unitsLost.toString()  + " Unints";
		d[4] = "You Captured " + data.buildingCaptured.toString()  + " Buildings";
		d[5] = "";

		if(Player.dead == true)
		{
			d[0] = "You Lossed";
			_PlayerMe.losses++;
			if(numOpponets == 1)
				d[1] = "You Placed 2nd";
			if(numOpponets == 2)
				d[1] = "You Placed 3nd";
			if(numOpponets == 3)
				d[1] = "You Placed 4th";
		}
		else
		{
			_PlayerMe.wins++;
		}
		_Account.UpdatePlayer();
		var i = 0;
		$('#winLose').children("h4").each(function()
		{
			$(this).text(d[i])
			i++;
		});
		
		$("#screenInGame").fadeOut(100);
		$('#winLose,#Profile').fadeIn("1000");
		if(_onlineGame)
		{
			SocketIO.DiconnectGame(currentGame);
		}
		
	};

	return WinLoseScreen;
})();
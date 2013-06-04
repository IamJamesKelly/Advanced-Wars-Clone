var PlayerData = (function(){

	function PlayerData(data)
	{
		this.name = data.name;
		this.email = data.email;
		this.losses = data.losses;
		this.wins = data.wins;
		this.gamesPlayed = data.gamesPlayed;
		this.id = data._id;
	}
	PlayerData.prototype.Display = function() 
	{
		var pro = $("#Profile");
		var print = [this.name,this.losses.toString(),this.wins.toString(), this.gamesPlayed.toString()];
		var i = 0;
		var j = 0;
		pro.children(".Profile").text(print[j]);
		pro.children(".inforight").each(function()
		{
			j++;
			$(this).text(print[j]);
		});
		
		$("#signUp,#signIn").fadeOut(100,function()
		{
			$("#Profile,#StartMenu").fadeIn(100);
		});
	};

	return PlayerData;
})();

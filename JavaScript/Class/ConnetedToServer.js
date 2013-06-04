  var socketIO = (function(){

	function socketIO()
	{
		this.socket =  io.connect('http://54.228.194.181:8080');
		this.setReceive();
	}
	socketIO.prototype.SendData = function(name,data) 
	{
		if(data.LoobyID == null)
		{
			data.LoobyID = _lobbyId;
		}
		
	 	this.socket.emit(name,data);
	};
	socketIO.prototype.setReceive = function() 
	{
	 	this.socket.on("LobbyJoined", function (data) 
	 	{
			var n = data.MaxPlayers - data.PlayersIn;
			var str = "Waiting for "+ n.toString() +" Others to Join";
			var str2 = "Lobby Map:" + data.MapName;
			$("#LobbyName").text(data.LobbyName);
			$("#lobbyHead").children(".name").text(str);
			$("#lobbyHead").children(".teamcolor").text(str2);
			
			_lobbyId = data.LoobyID;
	 		for (var i = 1; i <= data.PlayersIn; i++) 
	 		{
	 			var lob = $("#lobbyP" + i.toString());
				lob.children(".name").text("Name:" + data.Players[i-1]);
				lob.children(".teamcolor").text("Color:" + data.Colors[i-1]);
			}
			$("#Create").fadeOut(1000 ,function()
			{
				$("#lobby").fadeIn(1000, function()
				{	
					for (var i = 1; i <= data.PlayersIn; i++) 
 					{
 						$("#lobbyP" + i.toString()).fadeIn(1000);
 					}
				});
			});
  		});
		this.socket.on('displaylobby',function(looby)
		{
			var ul = $("#lobbylist");
			$("#lobbylist").html('');
			ul.append("<li class = 'getDetail'  id =" + looby.LobbyID + "><h4 class = 'left'>" + looby.LobbyName + "</h4><h4 class = 'middle'>" + looby.MapName + "</h4><h4 class = 'right'>" + looby.PlayersIn.toString() + "/" + looby.NumPlayers.toString() + "</h4></li>")
			$("#" + looby.LobbyID).click(function()
			{
				$(".getDetail").removeClass('selected');
				$(this).addClass('selected');
				var id = $(this).attr("id");
				SocketIO.SendData("LobbyData",{LoobyID:id});
			});
			$(".Box").click(function(){
				$(".Box").removeClass('selected');
				$(this).addClass('selected');
			});

			$("#Lobbyselect").fadeIn(100);
		});
  		this.socket.on("StartGame", function (data) 
	 	{
	 		var soc = this;
	 		$("#lobby").fadeOut(1000,function()
	 		{
	 			_onlineGame = true;
	 			loadGame(data,data.playerData);
	 			soc.emit("setup",{LoobyID:_lobbyId});
	 		});
	 	});
	 	this.socket.on("LobbyData", function (data) 
	 	{
	 		$("#OrangeBox,#BlueBox,#YellowBox,#GreenBox").fadeIn(100);
	 		
	 		if(data.Orange == true)
	 		{
	 			$("#OrangeBox").fadeOut(100);
	 		}
	 		if(data.Blue == true)
	 		{
	 			$("#BlueBox").fadeOut(100);
	 		}
	 		if(data.Yellow == true)
	 		{
	 			$("#YellowBox").fadeOut(100);
	 		}
	 		if(data.Green == true)
		 	{
		 		$("#GreenBox").fadeOut(100);
	 		}
	 	});
	};
	socketIO.prototype.setGameOn = function(game) 
	{
		this.socket.on("Update", function (data) 
	 	{
	 	
	 		if(data.updateName == "MoveTo")
	 		{
	 			if(game.map.cells[data.cellx][data.celly].unit == null)
	 				return;

	 			game.map.cells[data.cellx][data.celly].unit.movetoPath = data.MovetoPath;
	 			var x = data.cellx;
	 			var y = data.celly;

	 			for(var step = 0; data.MovetoPath.length > step;step++)
				{
					x += data.MovetoPath[step].movex;
					y += data.MovetoPath[step].movey;
				}
	 			game.map.cells[x][y].unit = game.map.cells[data.cellx][data.celly].unit;
	 			game.map.cells[data.cellx][data.celly].unit = null;
	 		}
	 		else if(data.updateName == "setup")
	 		{
	 			game.map.playerTurn = data.playerTurn;
	 			for(p in game.Players)
	 			{
	 				if(game.Players[p].teamColor == data.color)
	 				{
						game.setActivePlayer(game.Players[p].id);
						game.map.activePlayer = game.Players[p];
						game.map.activePlayer.active = data.playerTurn;
						game.Players[p].active = data.playerTurn;
						game.pHud.setPlayer(game.Players[p]);

						if(game.Players[p].active == false)
						{
							var ele = $("#MugShot" + p.toString());
							ele.css("border-color", "rgb(0, 255, 20)");
						}
						if(game.map.activePlayer.active == false)
						{
							$("#endturn").fadeOut(1);
						}
	 				}
	 			}	
				for(var j=0;game.map.tilesDown > j;j++)
				{
					for(var i=0;game.map.tilesAcross > i;i++)
					{
						if( game.map.cells[i][j].building != null && game.map.cells[i][j].building.name == "Base" && game.map.activePlayer.checkIfOwn(game.map.cells[i][j].building))
						{
							game.map.ScrollTo(game.map.cells[i][j].building.globalposition.x,game.map.cells[i][j].building.globalposition.y);
						}
					}
				}
	 			game.pHud.players = game.Players;
	 			game.pHud.player = game.map.activePlayer;
	 		}
	 		else if(data.updateName == "endTurn")
	 		{
	 			if(data.newUpdate)
	 			{
	 				game.map.newTurnUpdate();
	 			}
	 			game.map.playerTurn = data.playerTurn;
	 			game.map.activePlayer.active = false;
				game.pHud.player.active = false;
				var leftInGame = game.Players.length;
				for(p in game.Players)
	 			{
	 				if(game.Players[p] == null || data.dead[game.Players[p].teamColor])
	 				{
	 					leftInGame--;
	 				}
	 			}

	 			for(p in game.Players)
	 			{

	 				game.Players[p].points = data.points[game.Players[p].teamColor];
	 				game.Players[p].dead   = data.dead[game.Players[p].teamColor];
	 				if(game.Players[p].dead == true)
	 				{
	 					game.map.removecolor(game.Players[p].teamColor);
	 					if(game.map.activePlayer.teamColor == game.Players[p].teamColor)
						{
							game.endturn();
							game.endGame(false,leftInGame);
						}
	 				}

	 				var ele = $("#MugShot" + p.toString());
	 				if(game.Players[p].dead)
	 				{
	 					$(ele).fadeOut(100);
	 				}
	 				ele.css('border-color', "rgb(204, 204, 204)");
	 				if(game.Players[p].teamColor == data.color)
	 				{
	 				
	 					if(game.map.activePlayer.teamColor == data.color)
	 					{
							game.map.activePlayer.active = data.playerTurn;
							game.pHud.player.active = data.playerTurn;
							$("#endturn").fadeIn(100);
						}
						else
						{
							game.Players[p].active = data.playerTurn;
							
						}
	 				}
	 				else
					{
						game.Players[p].active = false;
					}
					

	 			}

	 			game.pHud.players = game.Players;
	 		}
	 		else if(data.updateName == "attackTarget")
	 		{

	 			
	 			var x = data.cellx;
	 			var y = data.celly;
	
	 			if(data.MovetoPath != null)
	 			{
		 			for(var step = 0; data.MovetoPath.length > step;step++)
					{
						x += data.MovetoPath[step].movex;
						y += data.MovetoPath[step].movey;
					}
				}
	 			if(game.map.cells[x][y].unit == null)
	 				return;

	 			game.map.cells[x][y].unit.attackTarget = data.target;
	 		}
	 		else if(data.updateName ==  "BuildingCaptured")
	 		{
 				if(game == null || data.cellx == undefined || data.celly == undefined)
		 		{
		 			return;
		 		}
	 			game.map.cells[data.cellx][data.celly].building.setTeamColor(data.color);
	 			game.map.cells[data.cellx][data.celly].building.resetResitance();
	 		}
	 		else if(data.updateName ==  "newUnit")
	 		{
	 			var unit = game.map.factory.createUnit(data.name,data.color,data.cellx,data.celly);
	 			game.map.cells[data.cellx][data.celly].unit = unit;
	 		}
	 		else if(data.updateName ==  "removeUnit")
	 		{
	 			game.map.cells[data.x][data.y].unit = null;
	 		}

	 	});
		this.socket.on("winGame", function (data)
		{
			game.endGame(true,1);
		});
	};	
	socketIO.prototype.DiconnectGame = function(game) 
	{
		this.socket.emit("DiconnectGame",{LoobyID:_lobbyId,Color:currentGame.map.activePlayer.teamColor});
		_lobbyId = null;
	};	
	
	return socketIO;
})();

  
  

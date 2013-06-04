function loadGame(gameData,playerData)
{

	this.levelImg = new Image();
	gameData;
	AudioPlayer.Play("startGame",false,1);
 	function setupGame(j,myId,Players,type)
	{
		var inGame = new Array();
		for(p in Players)
		{
			var p = new player(Players[p].playerName,Players[p].color);
			inGame.push(p);
		}

	 	currentGame = new Game("Player",j,this.levelImg,inGame,type);
	 	SocketIO.setGameOn(currentGame);
	 	SocketIO.SendData("setup",{LobbyID:_lobbyId});
		currentGame.Draw();
		var _refreshIntervalId = "";
		
		function callback()
		{

	 		if(_refreshIntervalId != null)
	 		{
	 			currentGame.Draw();
				currentGame.update();
				requestAnimFrame(callback);
	 		}
	 	}
	 
		QuitMenu(_refreshIntervalId,currentGame);
		$("#gameScreen,#screenInGame,#GameWorld,#buildingMenu,#PlayerDetails,#selectedUnit,#X").fadeIn(200,function()
		{
			callback();
			currentGame.map.resize();
			currentGame.setUpControls();
		});
	};
	this.levelImg.onload = function(e){
		var data = playerData;
		var gData = gameData;
			$.ajax({
			type: "GET", 
			 url: "LevelData/"+gameData.mapname+".json",
		 	 	success: function(j){
		 	 		setupGame(j,"",data,gData.Type);

		 	 	}	
			});
	};
	this.levelImg.src  = "LevelImages/" + gameData.mapname +".png";
} 

var Game = (function(){

 	function Game(aplayer,mapdata,mapImage,myPlayers,gameType) 
 	{
 		this.map = new Map(mapdata,mapImage);
 		this.map.Setup(myPlayers);
 		this.activePlayer = myPlayers[0];
 		this.Players = myPlayers;
 		this.type = gameType;
 		this.turn = 0;
 		this.gameComplete = false;
 		this.setUpControls();
 		this.LocalGameUpdate();
 		this.pHud = new PlayerHud(myPlayers);

		for(var j=0;_map.tilesDown> j;j++)
		{
			for(var i=0;_map.tilesAcross  > i;i++)
			{
				if( _map.cells[i][j].building != null && _map.cells[i][j].building.name == "Base" && _map.activePlayer.checkIfOwn(_map.cells[i][j].building))
					_map.ScrollTo(_map.cells[i][j].building.globalposition.x,_map.cells[i][j].building.globalposition.y);	
			}
		}
 	}
 	Game.prototype.update = function() 
 	{
 		if(this.activePlayer.active || this.type == "local")
 		{
 			this.map.playerTurn = true;
 		}

 		this.map.Update();
 		this.pHud.update();
 	};
	Game.prototype.LocalGameUpdate = function()
	{
		
		if(this.Players.length <= this.turn)
		{
			this.turn = 0;
		}
		if(this.pHud != null)
			this.pHud.setPlayer(this.Players[this.turn]);

		var ngame = this.map.newTurnUpdate();
		if(ngame != null)
			this.Players[this.activePlayer] = ngame;

		this.map.setActivePlayer(this.Players[this.turn]);

		this.activePlayer = this.turn;

		this.turn++;
		this.map.buildingDisplay.toggleDisplay(null);
		for(var j=0;this.map.tilesDown> j;j++)
		{
			for(var i=0;this.map.tilesAcross  > i;i++)
			{
				if( this.map.cells[i][j].building != null && this.map.cells[i][j].building.name == "Base" && this.map.activePlayer.checkIfOwn(this.map.cells[i][j].building))
				{
					this.map.ScrollTo(this.map.cells[i][j].building.globalposition.x,this.map.cells[i][j].building.globalposition.y);
				}
			}
		}
	};
	Game.prototype.OnlineGameUpdate = function(data)
	{
		SocketIO.SendData("endTurn",data);
		this.activePlayer.active = true;
	};
 	Game.prototype.setActivePlayer = function(id) 
 	{
 		if(this.activePlayer.id == id)
 		{
 			this.activePlayer.active = true;
 		}
 	};
 	Game.prototype.endturn = function() 
 	{
 		this.map.clearMoveRange(true);
	    this.map.buildingDisplay.toggleDisplay(null);
 	
 		AudioPlayer.Play("endTurn",false);
 		if(_onlineGame  == false)
 		{

 			this.LocalGameUpdate();
 		}
 		else 
 		{
 			this.map.newTurnUpdate();
 			$("#endturn").fadeOut(100);
 		}
 		this.map.selectedCellY = null;
 		this.map.selectedCellX = null;
 		var points = {"Orange":null,"Blue":null,"Yellow":null,"Green":null};
 		var deadoralive = {"Orange":null,"Blue":null,"Yellow":null,"Green":null};
		for(p in this.Players)
		{
			if(this.Players[p].checkIfOwn(this.map.cells[this.Players[p].basePos.x][this.Players[p].basePos.y].building))
			{
				this.Players[p].dead = false;
			}
			else
			{
				this.Players[p].dead = true;
			}
			points[this.Players[p].teamColor] = this.Players[p].points;
			deadoralive[this.Players[p].teamColor] = this.Players[p].dead;
		}
		if(_onlineGame  == true)
 		{
			this.OnlineGameUpdate({points:points,dead:deadoralive,Color:this.map.activePlayer.teamColor});
		}
 	};
	Game.prototype.Draw = function() 
	{
		this.map.Draw();
		this.pHud.Draw();
 	};
 	Game.prototype.endGame = function(win,leftInGame) 
 	{
 		_splashScreen.Display(_GameData,this.map.activePlayer,leftInGame);
 	};
 	Game.prototype.setUpControls = function() 
 	{
 	 	_map = this.map;
 	 	_game = this;
 	 		$('#endturn,#gameScreen,#returnMain').unbind();
		if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) )
	    {
	    	
		 	$$("#gameScreen").swiping(function(e)
			{
				_map.scrollAllow  = true;
		     	_map.srollStartx =  e.originalEvent.iniTouch.x;
		     	_map.srollStarty =  e.originalEvent.iniTouch.y;
				_map.scroll({pageX: e.currentTouch.x,pageY: e.currentTouch.y});
			});
	    }
	    else
	    {
	 	 
		 	$(window).mousemove(function()
			{
				_map.scroll(event);
			}).mousedown(function(e)
			{
		     	_map.scrollAllow  = true;
		     	_map.srollStartx =  e.pageX;
		     	_map.srollStarty =  e.pageY;
		    }).mouseup(function(e)
		    {
		     	_map.scrollAllow  = false;
		    }).click(function(e)
		    {
			    _map.Click(e);
		    }).bind("contextmenu", function(e) {
		    	_map.clearMoveRange(true);
		    	_map.buildingDisplay.toggleDisplay(null);
	            e.preventDefault();
	         });
		}
		$("#endturn").click(function()
		{
			_game.endturn();
		}); 
		$("#gameScreen").click(function(e)
		{
			_map.Click(e);
		});
		$("#returnMain").click(function(e)
		{
			$("#winLose").fadeOut(100,function()
			{
				$("#gameScreen").fadeOut(0);
				$("#StartMenu").fadeIn(100);
			});
			_Account.UpdatePlayer(_GameData);
		});
 	};
 	Game.prototype.clear = function() 
 	{
 		_map.destory();
 	}
 	
 	return Game;
 })();
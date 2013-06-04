var app = require('http').createServer();
var io = require('socket.io').listen(app);
var fs = require('fs');
app.listen(8080);
var getIndex = ["Orange","Blue","Yellow","Green"];

var player = (function()
{
	function player(soc)
	{
		this.name;
		this.teamColor;
		this.socket = soc;
		this.active = false;
	}
	return player;
})();

var Lobby = (function()
{
	function Lobby()
	{
		this.map;
		this.numPlayers = 0;
		this.PlayersIn = 0;
		this.Players = {"Orange":null,"Blue":null,"Yellow":null,"Green":null};
		this.name = "";
		this.active = false;
	}
	return Lobby;
})();

function endTurn(data)
{
	if(data.LoobyID == null || data.LoobyID == undefined)
	{
		return;
	}
	var p = getIndex.indexOf(data.Color);
	if(loobies[data.LoobyID].Players[data.Color] != null)
	{
		loobies[data.LoobyID].Players[data.Color].active = false;
	}
	
	var i = p; 
	var passed = true;
	while(passed) 
	{
		i++
		if(4 == i)
		{
			i = 0;
		}
		if(loobies[data.LoobyID].Players[getIndex[i]] != null)
		{

			loobies[data.LoobyID].Players[getIndex[i]].active = true;
			passed = false;
			var d = 
			{
				updateName:"endTurn",
				color:getIndex[i],
				newUpdate:true,
				points:data.points,
				dead:data.dead,
				playerTurn:true
			};
		}
	}
	for(col in loobies[data.LoobyID].Players)
	{
		if(loobies[data.LoobyID].Players[col] != null)
		{	
			if(col == data.Color)
			{
				d.newUpdate = false;
			}
			loobies[data.LoobyID].Players[col].socket.emit("Update",d);
		}
	}
}
var loobies = [];

io.sockets.on('connection', function (socket) 
{
	socket.on('CreateLooby', function (data) 
	{
		var newPlayer = new player(this);
		var newLobby = new Lobby();
		console.log(this.id);
		newPlayer.name = data.Host;
		newPlayer.teamColor = data.TeamColor;
		newPlayer.active = true;
		newLobby.map = data.Map;
		newLobby.numPlayers = data.NumPlayers;
		newLobby.name = data.LobbyName;
		newLobby.PlayersIn++;
		newLobby.Players[data.TeamColor] = newPlayer;
		newLobby.id = this.id;
		loobies[newLobby.id] = newLobby;	
		var m =  new Array();

		for(col in newLobby.Players)
		{
			m.push(col);
		}
		var Data = 
		{
			PlayersMax:data.NumPlayers,
			PlayersIn:newLobby.PlayersIn.toString(),
			Players:m,
			LoobyID:newLobby.id
		};
  	});
  	socket.on('JoinLooby', function (data) 
	{
		var lob = null;
		var lobId = null;
		var newPlayer = new player(this);
		
		if(data.id != null)
		{
			if(loobies[data.id].PlayersIn == loobies[data.id].numPlayers || loobies[data.id] == null)
			{
				return;
			}

			loobies[data.id].Players[data.TeamColor] = newPlayer;
			loobies[data.id].PlayersIn++;
			lob = loobies[data.id]; 
			lobId = data.id;
			newPlayer.name = data.name;
			newPlayer.teamColor = data.TeamColor;
		}
		else
		{
			for (node in loobies)
			{
				for( p in loobies[node].Players)
				{
					if(loobies[node].Players[p] == null)
					{
						newPlayer.name = data.name;
						newPlayer.teamColor = p;
					}
				}
				if(loobies[node].PlayersIn < loobies[node].numPlayers)
				{
					loobies[node].Players[newPlayer.teamColor] = newPlayer;
					loobies[node].PlayersIn++;
					lob = loobies[node]; 
					lobId = node;
				}
			};
			if(lob == null)
			{
				return;
			};
		}
	
		var colors = new Array();
		var names = new Array(); 

		for( p in lob.Players)
		{
			if(lob.Players[p] != null)
			{
				colors.push(p)
				names.push(lob.Players[p].name);
			}
		}
		var Data = 
		{
			MapName:lob.map,
			Colors:colors,
			Players:names,
			MaxPlayers:lob.numPlayers,
			PlayersIn:lob.PlayersIn,
			LoobyID:lob.id,
			LobbyName:lob.name
		};
		
		var data =
		{
 			updateName:"setActivePlayer",
 			playerTurn:true,
	 	};

		for( p in lob.Players)
		{
			if(lob.Players[p] != null)
			{
				lob.Players[p].socket.emit('LobbyJoined', Data );
			}
		};
		if(lob.PlayersIn == lob.numPlayers)
		{
			setTimeout(function()
			{
				var playersData = new Array();
				for( p in lob.Players)
				{
					if(lob.Players[p] != null)
					{
						playersData.push({Type: "online",color:lob.Players[p].teamColor,id: "",playerName:lob.Players[p].name,active:lob.Players[p].active});
					}
				};
				var gameData =
				{
					Type: "Online",
					mapname: lob.map,
					LoobyID: lob.id,
					numPlayers: lob.numPlayers,
					playerData: playersData
				};

				for(p in lob.Players)
				{
					if(lob.Players[p] != null)
					{
						lob.Players[p].socket.emit("StartGame", gameData);
					}
				};

			},5000);
		}
  	});
  	socket.on('Update', function (data)
  	{
  		for( p in loobies[data.LoobyID].Players)
		{
			if(loobies[data.LoobyID].Players[p] != null)
			{
				loobies[data.LoobyID].Players[p].socket.emit('Update', data );
			}
		}
	});
	socket.on('setup', function (data)
  	{
  		var setStartplayer = true;
				
		for(p in loobies[data.LoobyID].Players)
		{
			if(loobies[data.LoobyID].Players[p] != null)
			{
				var d = 
				{
					updateName:"setup",
					color:p,
					playerTurn:setStartplayer
				};
				if(setStartplayer == true)
				{
					loobies[data.LoobyID].Players[p].active = setStartplayer;
					setStartplayer = false;
				}
				loobies[data.LoobyID].Players[p].socket.emit("Update",d);
			}
		};
	});
	socket.on('endTurn',endTurn);
	socket.on('selectLobby', function ()
  	{
  		var data = [];
  		for (lob in loobies) 
  		{
  			if(loobies[lob] != null && loobies[lob].active == false)
  			{
	  			var lobbyData =
	  			{
		  			MapName:loobies[lob].map,
					LobbyID:lob,
					LobbyName:loobies[lob].name,
					NumPlayers:loobies[lob].numPlayers,
					PlayersIn:loobies[lob].PlayersIn,
				}
			
			  	this.emit("displaylobby",lobbyData);
			}
  		};
	});
	socket.on('DiconnectGame', function (data)
  	{
  		if(data.LoobyID == null || data.LoobyID == undefined)
		{
			return;
		}
  		
  		loobies[data.LoobyID].Players[data.Color] = null;
  		loobies[data.LoobyID].numPlayers--;
		loobies[data.LoobyID].PlayersIn--;
		
		if(loobies[data.LoobyID].PlayersIn == 1)
		{
			for(play in loobies[data.LoobyID].Players)
			{
				if(loobies[data.LoobyID].Players[play] != null)
				{
					loobies[data.LoobyID].Players[play].socket.emit('winGame', data );
				}
			}
		}	
		else if(loobies[data.LoobyID].PlayersIn == 0)
		{
			loobies[data.LoobyID] = null;
			var pos = loobies.indexOf(data.LoobyID);
			loobies.splice(pos,1);
		}
	});
	socket.on('LobbyData', function (data)
  	{

  		var pData =
  		{
  			Orange:false,
  			Blue:false,
  			Yellow:false,
  			Green:false
  		}
  		if(loobies[data.LoobyID].Players["Green"] != null)
  		{
  			pData.Green = true;
  		}
  		if(loobies[data.LoobyID].Players["Yellow"] != null)
  		{
  			pData.Yellow = true;
  		}
  		if(loobies[data.LoobyID].Players["Blue"] != null)
  		{
  			pData.Blue = true;
  		}
  		if(loobies[data.LoobyID].Players["Orange"] != null)
  		{
  			pData.Orange = true;
  		}

  		this.emit("LobbyData",pData);
	});
});
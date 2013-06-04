var OnlineMenu = (function(){

	function OnlineMenu()
	{
		this.in = "OnlineMenu"
		
		
		function quick()
		{
			$("#OnlineMenu,#Profile").fadeOut(1000,function(){
				var data = {name:_PlayerMe.name,TeamColor:null,id:null};
				SocketIO.SendData("JoinLooby",data);
			});
		}
		function displayOnlineMenu()
		{
			$("#OnlineMenu").fadeOut(100,function()
			{
				SocketIO.SendData("selectLobby",{})
			});
		}
		function join()
		{
			var id = $(".getDetail.selected").attr("id");
			var col = $(".Box.selected").attr("name");
			$("#Lobbyselect,#Profile").fadeOut("100");
			var data  = {name:_PlayerMe.name,TeamColor:col,id:id};
			SocketIO.SendData("JoinLooby",data);
		}
		var _menu = this;

		if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) )
		{

			$$("#Quick").tap(function()
			{
				quick();
			}); 
			$$("#selectlobby").tap(function()
			{
				displayOnlineMenu();
			});
			$$("#Join").tap(function()
			{
				join();
			});
			$$("#CreateLobby").tap(function()
			{
				_menu.createLooby();
			});
		}
		else
		{
			$("#Quick").click(function()
			{
				quick();
			}); 
			$("#selectlobby").click(function()
			{
				displayOnlineMenu();
			});
			$("#Join").click(function()
			{
				join();
			});
			$("#CreateLobby").click(function()
			{
				_menu.createLooby();
			});
		}
	}
	OnlineMenu.prototype.DisplayLoobeis = function() 
	{

	};
	OnlineMenu.prototype.DisplayQuickPlay = function() 
	{
	};

	OnlineMenu.prototype.SelectLobby = function() 
	{
		
	};
	OnlineMenu.prototype.DisplaycreateLooby = function() 
	{
		$("#OnlineMenu").fadeOut(1000,function(){$("#Create").fadeIn(1000);});
	};
	OnlineMenu.prototype.createLooby = function() 
	{
		
        var numberPlayers = $("#playerNumOnline").val();
        var hostcolor     = $("#onlinecolor").val();
        var mapName       = $("#onlineMap").val();
        var hostName      = $("#lobbyName").val();

    	var lob = $("#lobbyP1");
		lob.children(".name").text(_PlayerMe.name);
		lob.children(".teamcolor").text(hostcolor);
       
		var n = numberPlayers - 1;
		var str = "Waiting for "+ n.toString() +" Others to Join";
		var str2 = "Map:" + mapName;

		$("#LobbyName").text(hostName);
		$("#lobbyHead").children(".name").text(str);
		$("#lobbyHead").children(".teamcolor").text(str2);
		$("#Create,#Profile").fadeOut(1000 ,function()
		{
			$("#lobby").fadeIn(1000, function()
			{
				$("#lobbyP1").fadeIn(1000);
			});
		});

        var Data = 
        {
        	NumPlayers:numberPlayers.toString(),
        	Map:mapName,
        	Host:_PlayerMe.name,
        	LobbyName:hostName,
        	TeamColor:hostcolor
        };
        SocketIO.SendData("CreateLooby",Data);
	};

	return OnlineMenu;
})();
var Account = (function()
{

	function Account()
	{
		this.url = 'http://54.228.194.181:3000';
	};
	Account.prototype.createAccount = function(acc) 
	{
		var data = 
		{
			success:true,
			failure:""
		};
		if(acc[2] != acc[3])
		{
			data.success = false;
			data.failure = "Password"
		};
		var nwAcount = 
		{
			name:acc[0],
			email:acc[1],
			password:acc[2],
			losses:0,
			wins:0,
			gamesPlayed:0
		};
		if(data.success == true)
		{
			$.post(this.url + '/PlayerDataBase',nwAcount).done(
				function(data) 
				{
					if(data != "Already Exits")
					{
						_PlayerMe = new PlayerData(nwAcount);
						_PlayerMe.Display();
					}
					else
					{

					}
				});	
		};
		return data;
	};

	Account.prototype.SignIn = function(username,password,google) 
	{
		var data = username +","+ password;
		if(google == undefined && google == null)
		{
			google = false;
		}
		var _acc = this;
		$.get( this.url + '/PlayerDataBase/' + data, function(data) {
  
			if(data == "Not Found")
			{
				if(google != false)
				{
					var acc = [google.displayName,"google+",google.id,google.id];
					_acc.createAccount(acc);
				}
				else
				{
					Infobox(10,10,"Player Not Found","Create new account or SignIn With Google+","Warning");
				}
			}
			else if( data == "Password Wrong")
			{
				Infobox(10,10,"Wrong Password","","error");
			}
			else
			{
				_PlayerMe = new PlayerData(data);
				_PlayerMe.Display();

				return false;
			}
		});
	}
	Account.prototype.UpdatePlayer = function(data) 
	{
		var _GameData = 
		{
			name:_PlayerMe.name,
			email:_PlayerMe.email,
			losses:_PlayerMe.losses,
			wins:_PlayerMe.wins,
			gamesPlayed:_PlayerMe.gamesPlayed,
			id:_PlayerMe.id
		};
		

		$.ajax({
	    url: this.url + '/PlayerDataBase/' + _PlayerMe.id,
	    type: 'PUT',
	    data : data,
	    contentType: "jsonp",
  		dataType: 'jsonp'
  		});
	}
	
	return Account;
})();
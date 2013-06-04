function createUser(access_token,me) 
{
	var Url = "https://www.googleapis.com/oauth2/v1/userinfo?access_token=" + access_token;
	var t = me;
	 $.ajax(
	 {
		type: 'GET',
		url: Url,
		async: false,
		contentType: "application/json",
		dataType: 'jsonp',
		success: function(data) 
		{
		
			var Url = "https://www.googleapis.com/plus/v1/people/" + data.id +"?key=AIzaSyAmuxxsuYhwrVirJSVux70ZK3uvb9nRfzo";
			 $.ajax(
			 {
				type: 'GET',
				url: Url,
				async: false,
				contentType: "application/json",
				dataType: 'jsonp',
				success: function(data) 
				{

					if(_Account.SignIn(data.displayName,data.id,data))
					{
						var acc = [data.displayName,"google+",data.id];
						_Account.createAccount(acc);
					}
				}
			});
		}
	});
};

(function() 
{
	var po = document.createElement('script'); 
	po.type = 'text/javascript'; 
	po.async = true;
	po.src = 'https://apis.google.com/js/client:plusone.js';
	var s = document.getElementsByTagName('script')[0]; 
	s.parentNode.insertBefore(po, s);
})();

function signinCallback(authResult) 
{
	if (authResult['access_token']) 
	{
		createUser(authResult['access_token'],authResult['id_token']);
	} 
	else if (authResult['error']) 
	{

	}
}
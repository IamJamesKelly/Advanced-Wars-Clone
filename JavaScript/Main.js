function main()
{
    window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       || 
              window.webkitRequestAnimationFrame || 
              window.mozRequestAnimationFrame    || 
              window.oRequestAnimationFrame      || 
              window.msRequestAnimationFrame     || 
              function(/* function */ callback, /* DOMElement */ element){
                window.setTimeout(callback, 1000 / 60);
              };
    })();
    var menuSetup = new loadsetupMenu();
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) )
    {
        $$("#Local").singleTap  (function()
        {
            $("#StartMenu").fadeOut(1000,function()
            {
                menuSetup.toggle();
            });
        });
        $$("#createAccountMenu").singleTap  (function()
        {
            $("#signIn").fadeOut(1000,function()
            {
                $("#signUp").fadeIn(1000);
            });
        });
        $$("#createAccountMenu").singleTap  (function()
        {
            $("#signIn").fadeOut(1000,function()
            {
                $("#signUp").fadeIn(1000);
            });
        });
        $$("#createAccount").singleTap  (function()
        {
            var sign = $("#signUp");
            var i = 0;
            var data = ["","","",""];

            sign.children("input").each(function()
            {
                data[i] =  $(this).val();
                i++;
            });
            var info = _Account.createAccount(data)
            if(info.success == true)
            {

            }
            else 
            {
                
            }
        });
        $$("#playerSignIn").singleTap  (function()
        {
            var sign = $("#signIn");
            var data = ["",""];
            var i = 0;
            
            sign.children("input").each(function()
            {
                data[i] =  $(this).val();
                i++;
            });

            _Account.SignIn(data[0],data[1]);
        });
        $$("#Muitiplyer").singleTap  (function()
        {
            var menu = new OnlineMenu();
            $("#StartMenu").fadeOut(1000,function()
            {
                $("#OnlineMenu").fadeIn(1000);
            });
            $$("#CreateGame").singleTap  (function(){
                menu.DisplaycreateLooby();
            });
        });
        $$("#infoBoxClose").singleTap  (function()
        {
            $("#infoBox").fadeOut(200);
        });
    }
    else
    {
        $("#infoBoxClose").click(function()
        {
            $("#infoBox").fadeOut(200);
        });
        $("#Local").click(function()
        {
        	
        	 $("#StartMenu").fadeOut(1000,function()
        	 	{
        	 		menuSetup.toggle();
        	 	});
        });
        $("#createAccountMenu").click(function()
        {
            $("#signIn").fadeOut(1000,function()
            {
                $("#signUp").fadeIn(1000);
            });
        });
        $("#createAccountMenu").click(function()
        {
            $("#signIn").fadeOut(1000,function()
            {
                $("#signUp").fadeIn(1000);
            });
        });
        
        $("#createAccount").click(function()
        {
            var sign = $("#signUp");
            var i = 0;
            var data = ["","","",""];

            sign.children("input").each(function()
            {
                data[i] =  $(this).val();
                i++;
            });
            var info = _Account.createAccount(data)
            if(info.success == true)
            {

            }
            else 
            {
                
            }
            
        });
        
         $("#playerSignIn").click(function()
         {
            var sign = $("#signIn");
            var data = ["",""];
            var i = 0;
            
            sign.children("input").each(function()
            {
                data[i] =  $(this).val();
                i++;
            });

            _Account.SignIn(data[0],data[1]);
         });

        $("#Muitiplyer").click(function()
        {
        	var menu = new OnlineMenu();
        	$("#StartMenu").fadeOut(1000,function()
    	 	{
    	 		$("#OnlineMenu").fadeIn(1000);
    	 	});
        	$("#CreateGame").click(function(){
        		menu.DisplaycreateLooby();
        	});
        });
    }
    
};
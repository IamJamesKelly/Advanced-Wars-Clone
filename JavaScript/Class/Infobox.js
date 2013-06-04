
var Infobox = (function(){
	
	function Infobox(x,y,header,descrption,type)
	{
		this.InfoboxDiv = $("#infoBox");
		$(this.InfoboxDiv).children("h4").text(header);
		$(this.InfoboxDiv).children("p").text(descrption);
		this.x = x;
		this.y = y;
		$(this.InfoboxDiv).offset({ top:x, left:y})
		$(this.InfoboxDiv).removeClass("alert-error alert-success alert-info");
		if(type == "error")
		{
			$(this.InfoboxDiv).addClass("alert-error");
		}
		else if(type == "Warning")
		{
			$(this.InfoboxDiv).addClass("alert-block");
		}
		else if(type == "Info")
		{
			$(this.InfoboxDiv).addClass("alert-info");
		}
		else if(type == "Success")
		{
			$(this.InfoboxDiv).addClass("alert-success");
		}
		$(this.InfoboxDiv).fadeIn(200,function()
		{
			setTimeout(function()
			{
				$(this.InfoboxDiv).fadeOut(200);
			},10000);
		});
		
	}
	
	return Infobox;

})();
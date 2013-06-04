var battleScreenSprite = (function(){

	function battleScreenSprite(body,scale){
		this.Bodyimages = [];
		this.Bodyimages = body;
		this.x = 0;
		this.y = 0;
		this.scale = scale;
		this.animating = false;
		this.close = false;
		this.timer = 1;
		this.framesPast = 0;
	};
	battleScreenSprite.prototype.Draw = function(ctx,scale,health)
	{
		if(scale != undefined || scale != null)
			this.scale = scale;


		var movex  = 20;
		var movey = 0;
		var move = 0.3;

		var size = ((this.Bodyimages.squadSize/100) * health);
		if(this.Bodyimages.squadSize = 1)
		{
			movex  = 0
		}

		for(var j = 0; j < size; j++)
		{
			for(var i = 0; i < this.Bodyimages.length; i++)
			{

				var x = this.Bodyimages[i].mx  + movex;
				var y = this.Bodyimages[i].my + movey;
			
				ctx.drawImage(this.Bodyimages[i],this.Bodyimages[i].anix,this.Bodyimages[i].aniy,this.Bodyimages[i].srcWidth,this.Bodyimages[i].srcheight,-x,-y,this.Bodyimages[i].srcWidth*this.scale,this.Bodyimages[i].srcheight*this.scale);
			}
			if(j <= 2)
			{
				movey = (this.Bodyimages[0].height*this.scale)* move;
				movex = (this.Bodyimages[0].srcWidth*this.scale) + 10;
				move += 0.6;
			}
			else
			{
				movey += (this.Bodyimages[0].height*this.scale)*0.7;
				movex = 30;
			}
		}
		this.x = 0;
		this.y = 0;
	};
	battleScreenSprite.prototype.update = function()
	{
		this.timer++;
		if( this.timer < 10)
			return;
		if(name == "Bomber" || name == "Fighter" || this.animating == false || this.Bodyimages[0].framesx == 1)
		{
			var _batt = this;
			setTimeout(function()
			{
				_batt.animating = false
				_batt.close = false;
			},3000);
			

			return;
		}
			


		this.timer = 0;
		for(var i = 0; i < this.Bodyimages.length; i++)
		{
			if((this.Bodyimages[i].anix + this.Bodyimages[i].srcWidth) < this.Bodyimages[i].width)
			{
				this.Bodyimages[i].anix += this.Bodyimages[i].srcWidth;
			}
			else
			{
				this.Bodyimages[i].anix = 0;
			}
			this.framesPast++;
		}
		if(this.framesPast == this.Bodyimages[0].framesx)
		{

			var _batt = this;
			setTimeout(function()
			{
				_batt.close = false;
			},3000);
			this.animating = false;
		}
	};
	return battleScreenSprite;
})();
var battleScreenSpriteFactory = (function(){
	
	function battleScreenSpriteFactory(colors)
	{
		this.unitData = BattleUnitData;
		this.battleImages = BattleImages;
	};
	battleScreenSpriteFactory.prototype.saveNewImage = function(name,color,img,Data)
	{
		this.battleImages[name][color] = img;
		this.battleImages[name][color].srcWidth = img.width/Data.widthFrames;
		this.battleImages[name][color].srcheight = img.height/Data.heightFrames;
		this.battleImages[name][color].mx = Data.x;
		this.battleImages[name][color].my = Data.y;
		this.battleImages[name][color].anix = Data.anix;
		this.battleImages[name][color].aniy = Data.aniy;
		this.battleImages[name][color].framesx = Data.widthFrames;
	};
	battleScreenSpriteFactory.prototype.getSprite = function(name,color,scale)
	{
		
		var images = [];
		
		if(name == "Bomber" || name == "Fighter" || name == "submarine")
		{

			var im = this.battleImages[name].cloneNode(true);
			im.srcWidth = this.battleImages[name].srcWidth;
			im.srcheight = this.battleImages[name].srcheight;
			im.mx = this.battleImages[name].mx;
			im.my = this.battleImages[name].my;
			im.anix = this.battleImages[name].anix;
			im.aniy = this.battleImages[name].aniy;
			im.framesx  = this.battleImages[name].framesx;
			images.push(im);
		}
		else
		{
			var im = this.battleImages[name][color].cloneNode(true);
			im.srcWidth = this.battleImages[name][color].srcWidth;
			im.srcheight = this.battleImages[name][color].srcheight;
			im.mx = this.battleImages[name][color].mx;
			im.my = this.battleImages[name][color].my;
			im.anix = this.battleImages[name][color].anix;
			im.aniy = this.battleImages[name][color].aniy;
			im.framesx  = this.battleImages[name][color].framesx;
			images.push(im);
		}


		if(name == "Bomber" || name == "Fighter")
		{
			if(color == "Orange")
				images[0].anix = 3 * images[0].srcWidth;
			else if(color == "Green")
				images[0].anix = 0;
			else if(color == "Yellow")
				images[0].anix = 1 * images[0].srcWidth;
			else if(color == "Blue")
				images[0].anix = 2 * images[0].srcWidth;


			if(name == "Fighter")
				images.squadSize = 5;
			else		
				images.squadSize = 1;
		}
		else if(name == "Artillery")
		{
			images.squadSize = 5;
		}
		else if(name == "Bazooka")
		{
			images.squadSize = 5;
		}
		else if(name == "Infantry")
		{
			images.squadSize = 5;
		}
		else if(name == "Heavy-Tank")
		{
			images.squadSize = 5;
		}
		else if(name == "Tank")
		{
			images.squadSize = 5;
		}
		else if(name == "Recon")
		{

			var im = this.battleImages["drivers"][color]["ongun"].cloneNode(true);
			im.srcWidth = this.battleImages["drivers"][color]["ongun"].srcWidth;
			im.srcheight = this.battleImages["drivers"][color]["ongun"].srcheight;
			im.mx = this.battleImages["drivers"][color]["ongun"].mx;
			im.my = this.battleImages["drivers"][color]["ongun"].my;
			im.anix = this.battleImages["drivers"][color]["ongun"].anix;
			im.aniy = this.battleImages["drivers"][color]["ongun"].aniy;
			im.mx = 14;
			im.my = -7;
			images.push(im);
			images.squadSize = 5;
		}
		


		var sprite = new battleScreenSprite(images,scale);
		return sprite;
	};

	
	return battleScreenSpriteFactory;
})();
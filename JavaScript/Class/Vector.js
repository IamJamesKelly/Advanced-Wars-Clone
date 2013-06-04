var vector = (function(){
	

	function vector(x,y)
	{
		this.x = x;
		this.y = y;
	}
	vector.prototype.add = function(vec) {
		if(vec.x != null)
			return  new vector(this.x + vec.x ,this.y + vec.y)
		else
			return  new vector(this.x + vec ,this.y + vec)
	};
	vector.prototype.sub = function(vec) {
		
		if(vec.x != null)
			return  new vector(this.x - vec.x ,this.y - vec.y)
		else 
			return  new vector(this.x - vec ,this.y - vec);
	};
	vector.prototype.mul = function(vec) {

		if(vec.x != null)
			return  new vector(this.x - vec.x ,this.y - vec.y)
		else
			return  new vector(this.x - vec ,this.y - vec);
	};


	return vector;

})();
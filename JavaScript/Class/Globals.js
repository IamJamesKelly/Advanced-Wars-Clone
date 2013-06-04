
var _onlineGame = false;
var _lobbyId = "";
var _PlayerMe = null;
var _GameData = new GameData();
var _Account = new Account();
var currentGame = null;
var UnitData = {
		"Anti-AirTank":{
			colors:[],
			Ap:10,
			attackRange:5,
			attack:10,
			defence:4,
			critical:["Bomber","Plane"],
			block:["Water","Bank","WaterRocks"],
			srcWidth:0,
			srcHeight:0},
		"APC":{
			colors:[],
			Ap:10,
			attackRange:1,
			attack:5,
			defence:4,
			critical:["Infantry"],
			block:["Water","Bank","WaterRocks"],
			srcWidth:0,
			srcHeight:0},
		"Artillery":{
			colors:[],
			Ap:10,
			attackRange:4,
			attack:8,
			defence:4,
			critical:[],
			block:["Water","Bank","WaterRocks"],
			srcWidth:0,
			srcHeight:0},
		"Bazooka":{
			colors:[],
			Ap:5,
			attackRange:1,
			attack:7,
			defence:4,
			critical:["ArmoredCar","Heavy-Tank","Tank"],
			block:[],
			srcWidth:0,
			srcHeight:0},
		"Bomber":{
			colors:[],
			Ap:10,
			attackRange:1,
			attack:10,
			cost:22000,
			defence:4,
			critical:[],
			block:["Water","Bank","WaterRocks"],
			srcWidth:0,
			srcHeight:0},
		"Heavy-Tank":{
			colors:[],
			Ap:10,
			attackRange:1,
			attack:8,
			defence:4,
			critical:[],
			block:["Water","Bank","WaterRocks"],
			srcWidth:0,
			srcHeight:0},
		"Infantry":{
			colors:[],
			Ap:5,
			attackRange:1,
			attack:4,
			defence:4,
			critical:["Bazooka"],
			block:["Water","Bank","WaterRocks"],
			srcWidth:0,
			srcHeight:0},
		"Recon":{
			colors:[],
			Ap:7,
			attackRange:1,
			attack:4,
			defence:4,
			critical:[],
			block:["Water","Bank","WaterRocks"],
			srcWidth:0,
			srcHeight:0},
		"light-Artillery":{
			colors:[],
			Ap:10,
			attackRange:5,
			attack:6,
			defence:4,
			critical:[""],
			block:["Water","Bank","WaterRocks"],
			srcWidth:0,
			srcHeight:0},
		"MissileLanchers":{
			colors:[],
			Ap:8,
			attackRange:5,
			attack:10,
			defence:4,
			critical:[""],
			block:["Water","Bank","WaterRocks"],
			srcWidth:0,
			srcHeight:0},
		"NeoTank":{
			colors:[],
			Ap:5,
			attackRange:1,
			attack:10,
			defence:4,
			critical:[""],
			cost:22000,
			block:["Water","Bank","WaterRocks"],
			srcWidth:0,
			srcHeight:0},
		"Fighter":{
			colors:[],
			Ap:10,
			attackRange:1,
			attack:7,
			defence:4,
			critical:[""],
			block:["Water","Bank","WaterRocks"],
			srcWidth:0,
			srcHeight:0},
		"Submarine":{
			colors:[],
			Ap:10,
			attackRange:10,
			attack:7,
			defence:4,
			critical:[""],
			cost:7000,
			block:["Water","Bank","WaterRocks"],
			srcWidth:0,
			srcHeight:0},
		"Tank":{
			colors:[],
			Ap:10,
			attackRange:1,
			attack:5,
			defence:4,
			critical:[""],
			cost:7000,
			block:["Water","Bank","WaterRocks"],
			srcWidth:0,
			srcHeight:0
			}};
var BattleUnitData = {

			"Anti-AirTank":{
				widthFrames:4,
				heightFrames:1,
				x:0,
				y:0,
				anix:0,
				aniy:0
			},
			"APC":{
				widthFrames:4,
				heightFrames:1,
				x:0,
				y:0,
				anix:0,
				aniy:0},
			"Artillery":{
				widthFrames:3,
				heightFrames:1,
				x:0,
				y:0,
				anix: 0,
				aniy:0},
			"Bazooka":{
				widthFrames:7,
				heightFrames:2,
				x:0,
				y:0,
				anix: 0,
				aniy:0},
			"Bomber":{
				widthFrames:1,
				heightFrames:1,
				x:0,
				y:0,
				anix: 0,
				aniy:0},
			"Heavy-Tank":{
				widthFrames:4,
				heightFrames:1,
				x:0,
				y:0,
				anix: 0,
				aniy:0},
			"Infantry":{
				widthFrames:4,
				heightFrames:5,
				x:0,
				y:0,
				anix: 0,
				aniy:0},
			"Recon":{
				widthFrames:4,
				heightFrames:1,
				x:0,
				y:0,
				anix: 0,
				aniy:0},
			"light-Artillery":{
				widthFrames:1,
				heightFrames:1,
				x:0,
				y:0,
				anix: 0,
				aniy:0},
			"MissileLanchers":{
				widthFrames:1,
				heightFrames:1,
				x:0,
				y:0,
				anix: 0,
				aniy:0},
			"NeoTank":{
				widthFrames:2,
				heightFrames:1,
				x:0,
				y:0,
				anix: 0,
				aniy:0},
			"Fighter":{
				widthFrames:1,
				heightFrames:1,
				x:0,
				y:0,
				anix: 0,
				aniy:0},
			"submarine":{
				widthFrames:1,
				heightFrames:1,
				x:0,
				y:0,
				anix:0,
				aniy:0},
			"Tank":{
				widthFrames:1,
				heightFrames:1,
				x:0,
				y:0,
				anix: 0,
				aniy:0
			}};		
var BattleImages = {
			"Bomber":[],
			"light-Artillery":[],
			"Fighter":[],
			"submarine":[],
			"Artillery":[],
			"Bazooka":[],
			"Heavy-Tank":[],
			"APC":[],
			"Heavy-Tank":[],
			"Tank":[],
			"Anti-AirTank":[],
			"MissileLanchers":[],
			"Infantry":[],
			"NeoTank":[],
			"Recon":[],
			"drivers":[]};		
var BuildingImages = ["imgBasicBuildings","imgLargeBuilding","imgTimer"];
var unitDataLoaded = false;

var SocketIO = new socketIO();

var _splashScreen = new WinLoseScreen();

function loadImages()
{
	var loadUnitImages = ["Anti-AirTank","APC","Artillery","Bazooka","Bomber","Heavy-Tank","Infantry","Recon","light-Artillery","MissileLanchers","NeoTank","Fighter","Submarine","Tank"];
	var colors = ["Orange","Blue","Green","Yellow"];
	var unitToLoad = 0;
	var imagesLoaded = 0;

	function addImage(newimg,unitType,namecolor)
	{
		unitToLoad++;
		UnitData[unitType].colors[namecolor] = newimg;
		if(UnitData[unitType].srcWidth == 0)
			UnitData[unitType].srcWidth = newimg.width;
		if(UnitData[unitType].srcHeight == 0)
			UnitData[unitType].srcHeight = newimg.height;

		if(unitToLoad == loadUnitImages.length*colors.length)
		{
			unitDataLoaded = true;
		}
	};

	for(unitType in loadUnitImages)
	{
		for(col in colors)
		{
			var img = new Image();
			img.src = "MapUnits/" + colors[col] +"/"+ loadUnitImages[unitType] + ".png";
			img.name = loadUnitImages[unitType];
			img.color = colors[col];

			img.onload = function()
			{
				addImage(this,this.name,this.color);
			}
		}
	};

	function saveNewImage(name,color,img,Data)
	{
		BattleImages[name][color] = img;
		BattleImages[name][color].srcWidth = img.width/Data.widthFrames;
		BattleImages[name][color].srcheight = img.height/Data.heightFrames;
		BattleImages[name][color].mx = Data.x;
		BattleImages[name][color].my = Data.y;
		BattleImages[name][color].anix = Data.anix;
		BattleImages[name][color].aniy = Data.aniy;
		BattleImages[name][color].framesx = Data.widthFrames;
	};
	for(col in colors)
	{
		BattleImages["drivers"][colors[col]] = [];
	};

	for(col in colors)
	{
		for(unit in BattleUnitData)
		{

			if(unit != "Bomber" && unit != "Fighter" &&  unit != "submarine")
			{
				var im = new Image();
				im.color = colors[col];
				im.src = "BattleScreenImages/Units/"+ colors[col]  +"/" +unit+".png";
				im.unit = unit;
				im.data = BattleUnitData[unit];
				im.onload = function()
				{
					saveNewImage(this.unit,this.color,this,this.data);
				};
			}
		}	

		BattleImages["Bomber"] = new Image();
		BattleImages["Bomber"].src = "BattleScreenImages/Units/Bombers.png";
		BattleImages["Bomber"].onload = function()
		{
			BattleImages["bomber"] = this;
			BattleImages["bomber"].srcWidth = this.width/4;
			BattleImages["bomber"].srcheight = this.height;
			BattleImages["bomber"].mx = 0;
			BattleImages["bomber"].my = 0;
			BattleImages["bomber"].movex = 0;
			BattleImages["bomber"].movey = 0;
			BattleImages["bomber"].anix = 0;
			BattleImages["bomber"].aniy = 0;
			BattleImages["bomber"].framesx = 1;
		};

		BattleImages["Fighter"]  = new Image();
		BattleImages["Fighter"].src = "BattleScreenImages/Units/Plane.png";
		BattleImages["Fighter"].onload = function()
		{
			BattleImages["Fighter"] = this;
			BattleImages["Fighter"].srcWidth = this.width/4;
			BattleImages["Fighter"].srcheight = this.height;
			BattleImages["Fighter"].mx = 0;
			BattleImages["Fighter"].my = 0;
			BattleImages["Fighter"].anix = 0;
			BattleImages["Fighter"].aniy = 0;
			BattleImages["Fighter"].framesx = 1;
		};

		BattleImages["submarine"]  = new Image();
		BattleImages["submarine"].src = "BattleScreenImages/Units/submarine.png";
		BattleImages["submarine"].onload = function()
		{
			BattleImages["submarine"] = this;
			BattleImages["submarine"].srcWidth = this.width/4;
			BattleImages["submarine"].srcheight = this.height/4;
			BattleImages["submarine"].mx = 0;
			BattleImages["submarine"].my = 0;
			BattleImages["submarine"].anix = 0;
			BattleImages["submarine"].aniy = 0;
			BattleImages["submarine"].framesx = 1;
		};

		var d1 = new Image();
		d1.color = colors[col];
		d1.src = "BattleScreenImages/Units/"+ colors[col] +"/Diver"+"/offgun.png";
		d1.onload = function()
		{
			
			BattleImages["drivers"][this.color]["offgun"] = this;
			BattleImages["drivers"][this.color]["offgun"].srcWidth = this.width/4;
			BattleImages["drivers"][this.color]["offgun"].srcheight = this.height;
			BattleImages["drivers"][this.color]["offgun"].anix = 0;
			BattleImages["drivers"][this.color]["offgun"].aniy = 0;
			BattleImages["drivers"][this.color]["offgun"].mx = 0;
			BattleImages["drivers"][this.color]["offgun"].my = 0;
		};

		var d2 = new Image();
		d2.color = colors[col];
		d2.src = "BattleScreenImages/Units/"+ colors[col] +"/Diver"+"/ongun.png";
		d2.onload = function()
		{
			var obj = {"ongun":this};
			BattleImages["drivers"][this.color]["ongun"] = this;
			BattleImages["drivers"][this.color]["ongun"].srcWidth = this.width/4;
			BattleImages["drivers"][this.color]["ongun"].srcheight = this.height;
			BattleImages["drivers"][this.color]["ongun"].anix = 0;
			BattleImages["drivers"][this.color]["ongun"].aniy = 0;
			BattleImages["drivers"][this.color]["ongun"].mx = 0;
			BattleImages["drivers"][this.color]["ongun"].my = 0;
		};
	}

	BuildingImages["imgBasicBuildings"] = new Image();
	BuildingImages["imgBasicBuildings"].src ="LevelImages/BasicBuildings.png";
	BuildingImages["imgBasicBuildings"].across = 5;
	BuildingImages["imgBasicBuildings"].down = 4;
	BuildingImages["imgBasicBuildings"].im = 0;
	


	BuildingImages["imgLargeBuilding"] = new Image();
	BuildingImages["imgLargeBuilding"].src ="LevelImages/LargeBuildings.png";
	BuildingImages["imgLargeBuilding"].across = 5;
	BuildingImages["imgLargeBuilding"].down = 5;


	BuildingImages["imgTimer"] = new Image();
	BuildingImages["imgTimer"].src ="Hud-Menu/Numbers.png";
	BuildingImages["imgTimer"].across = 10;
};
loadImages();
var AudioPlayer = new audioPlayer();


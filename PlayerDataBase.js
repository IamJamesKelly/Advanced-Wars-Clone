var mongo = require('mongodb');

var Server = mongo.Server,
	Db = mongo.Db,
	BSON = mongo.BSONPure;

var server = new Server('localhost',  27017, {auto_reconnect: true});
db = new Db('Players', server);
function populateDB() 
{
 
	var Players = [
	{
		username:"temp",
		Email:"",
		wins:"",
		losses:"",
	}];
 
	db.collection('Players', function(err, collection) 
	{
		collection.insert(Players, {safe:true}, function(err, result) {});
	});
};
db.open(function(err, db) 
{
	console.log("opened");
	if(!err) 
	{
		console.log("Connected to 'Players' database");
		db.collection('Players', {safe:true}, function(err, collection) 
		{
			if (err) 
			{
				console.log("The 'wines' collection doesn't exist. Creating it with sample data...");
				populateDB();
			}
		});
	}
});

exports.insertPlayer = function(req, res) 
{
	console.log("here");
	var Player = req.body;
	console.log(req.body);
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");	
	var search = {name:Player.name};
	db.collection('Players', function(err, collection) 
	{
		collection.findOne(search, function(err, item) 
		{
			if (err) 
			{} 
			else
			{
				if(item != null)
				{
					item = "Already Exits";
					res.send(item);
				}
			}
		});
		collection.insert(Player, {safe:true}, function(err, result) 
		{
			if (err) 
			{
				res.send({'error':'An error has occurred insert'});
				console.log("error");
			} 
			else
			{
				console.log("insert");
				res.send(result[0]);
			}
		});
	});
}
exports.updatePlayer = function(req, res) 
{
	var id = req.params.id;
	var player = req.body;
	console.log("here");
	db.collection('Players', function(err, collection) 
	{
		collection.update({'_id':id}, player, {safe:true}, function(err, result) 
		{
			if (err) 
			{
				res.send({'error':'An error has occurred'});
			} 
		});
	});
}
exports.signIn = function(req, res) 
{
	var serach = req.params.signIn;
	var data = serach.split(",");
	console.log("here");
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");	
	var search = { name:data[0]};
	var myCursor = db.Players;
	
	db.collection('Players', function(err, collection) 
	{
		collection.findOne(search, function(err, item) 
		{
			if (err) 
			{
				res.send({'_id':'An error has occurred'});
			} 
			else
			{
				console.log(item);
				if(item == null)
				{
					item = "Not Found";
				}
				else if(item.password != data[1])
				{
					item = "Password Wrong";
				}
				res.send(item);
			}
			
		});
	});
};
exports.deletePlayer = function(req, res) 
{
	console.log("here");
	var id = req.params.id;
	db.collection('Players', function(err, collection) 
	{
		collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) 
		{
			if (err) 
			{
				res.send({'error':'An error has occurred - ' + err});
			} 
			else 
			{
				console.log('' + result + ' document(s) deleted');
			}
		});
	});
}

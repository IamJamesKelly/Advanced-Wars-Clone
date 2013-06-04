function loadsetupMenu()
{   
    this.numPlayers = 2;
    this.displayScreen = false;
    
      
    this.colorTaken = "";
    _menu = this;
    $("#Begin").click(function(){
        $("#SetupMenu").fadeOut(1000);
      
        $("#buildingMenu,#PlayerDetails,#selectedUnit,#gameScreen,#endturn").fadeIn(1000);
        
        var numberPlayers = $("#playerNum").val();
        var gameType = $("#GameType").val();
        var mapName = $("#levelSelect").val();
        var gameData = {numPlayers: numberPlayers,gameType:gameType,mapname: mapName};

        var playerData = new Array();
        var inputData = new Array();
        
        inputData.push($("#p1"));
        inputData.push($("#p2"));
        inputData.push($("#p3"));
        inputData.push($("#p4"));
        var pType = "";

        for(var i = 0; i < numberPlayers;i++)
        {  
        
          var teamColor = $(inputData[i]).children(".input-prepend").children(".Color").val();
          var name = $(inputData[i]).children(".input-prepend").children("input").val();
          if(name == "")
          {
            name = "Player" +(i+1).toString();
          }

          playerData.push({id:"",color: teamColor,playerName: name,Type:"local"});
        }
            
        loadGame(gameData, playerData);
        $("#playerNum").val(2);
         _menu.numPlayers = 2;
         $("#playerNum").change();
    });

    
    function selectUpdate()
    {

      var color = $(".Color option:selected");
      $(".Color  option").attr("disabled",false);
      $(".Color  option").removeClass("selected");
      for(var i = 0; i <  _menu.numPlayers; i++)
      {
        var val = $(color[i]).val();

        if(val == "Orange")
        {
           $(".Color [value ='Orange']").attr("disabled",true);
           $(".Color [value ='Orange']").addClass("selected");
        }
         
        if(val == "Green") 
        {
          $(".Color [value ='Green']").attr("disabled",true);
          $(".Color [value ='Green']").addClass("selected");
        }
        if(val == "Blue") 
        {
            $(".Color [value ='Blue']").attr("disabled",true);
            $(".Color [value ='Blue']").addClass("selected");
        }
          
        if(val == "Yellow") 
        {
          $(".Color [value ='Yellow']").attr("disabled",true);
          $(".Color [value ='Yellow']").addClass("selected");
        }

      }
    }

   function changePlayers()
   {
      var playerNum = $("#playerNum");
      var num = parseInt(playerNum.val());
      var available = $(".Color option").not(".selected").val();
   
      if(num-_menu.numPlayers  < 0)
      {
          if(num == 3)
          {
              _menu.numPlayers = 3;
               $("#p4").fadeOut(1000);
          } 
          else if(num == 2)
          {
               _menu.numPlayers = 2;
               $("#p3").fadeOut(1000);
          }
      }
      else if(num == 3) 
      {
           $("#p3").fadeIn(1000);
           $("#p3").children("div").children(".styled-select").children(".crop").children(".Color").val(available);
          _menu.numPlayers = 3
      }
      else if(num == 4) 
      {
          $("#p4").fadeIn(1000);
          $("#p4").children("div").children(".styled-select").children(".crop").children(".Color").val(available);
          _menu.numPlayers = 4;
      }
      playerNum.val( _menu.numPlayers);

      selectUpdate();
    }
    $("#playerNum").change(function(){changePlayers();});
    
  $(".Color").change(function(){
  selectUpdate()});
}
loadsetupMenu.prototype.toggle = function(){
  
  if( this.displayScreen)
  {
    this.displayScreen = false;
    $("#SetupMenu").fadeOut(1000);
  }
  else if( this.displayScreen == false)
  {
    this.displayScreen = true;
    $("#SetupMenu").fadeIn(1000);
  }
};
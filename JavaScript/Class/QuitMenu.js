function QuitMenu(refreshIntervalId,deleteGame)
{
	$('#Yes').click(function()
	{
		$("#Quitoptions").hide("slow");
		$("#GameWorld,#buildingMenu,#PlayerDetails,#selectedUnit,#X,#endturn").fadeOut(200);
		deleteGame.map.buildingDisplay.toggleDisplay(null,true);
		main();
	});
	$('#X').click(function()
	{
		$("#Quitoptions").show("slow");
	});
	$('#No').click(function()
	{
		$("#Quitoptions").hide("slow");
	});
}
var audioPlayer = (function()
{

	function audioPlayer()
	{  
	 	if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) == false)
		{
			this.names = ["endTurn","unitSelect","bgMusic","startGame"]
			this.audioFileNames = ["/Sounds/endTurn.mp3","/Sounds/unitSelect.mp3"
			,"/Sounds/bgMusic.wav","/Sounds/startGame.wav"];
			this.audioContext = new webkitAudioContext();
			this.bufferArray = [];
			this.grainArray = [];
			this.volume = 0.05;
			context = new webkitAudioContext();
			var _adioBuffer = this;
			function save(bufferlist){
		
					for(buf in bufferlist)
					{

						_adioBuffer.bufferArray[_adioBuffer.names[buf]] = bufferlist[buf];
					}

				//_adioBuffer.Play("bgMusic",true,0.3);
			}
			this.bufferLoader = new BufferLoader(
			this.audioContext,
			this.audioFileNames,
			save
			);

			this.bufferLoader.load();
		}
		
	}
	audioPlayer.prototype.Play = function(name,looped,vol){
		
		if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) == false)
		{
			var source = this.audioContext.createBufferSource();
			var gainNode = this.audioContext.createGainNode();
			source.buffer = this.bufferArray[name];
			// Turn on looping.
			source.loop = true;
			// Connect source to gain.
			gainNode.gain.value = this.volume;
			if(vol != null)
				gainNode.gain.value = vol;
			
			source.connect(gainNode);
			// Connect gain to destination.
			gainNode.connect(this.audioContext.destination);
			source.noteOn(0);  
			if(looped == false)
			{
				setTimeout(function(){source.noteOff(0);}, this.bufferArray[name].duration*1000);
			}
		}
	};

	return audioPlayer;
})();
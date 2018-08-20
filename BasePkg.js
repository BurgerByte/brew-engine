var Message = (function(){
	return {
		attention : function(msg){
			$('#attention').html(msg);
			$('#attention').addClass('show');
		},

		logger : function(msg, ...options){
			let entry = document.createElement('li');
			$('#logger').append(entry);
			//appling options
			for(var i = 0, o; o = options[i]; i++ ) {
				switch(o) {
					case "warn":
					$(entry).css("color", "red");
					break;
				}
			}
			$(entry).html(msg);
		}
	}
})();

var Server = (function(){

	return {
		get : function(url, callback = null) {
			let jqXHR = $.get( url ).done( function( data, textStatus, jqXHR ){
				if( callback) callback(data);
				Message.logger('Server load of ['+url+'] Successful');
			}).fail( function( jqXHR, textStatus, err) {
				console.error(jqXHR, err);
			})
		},

		post : function( url, package ,callback ) {
			package = { data : package }
			let jqXHR = $.post( url, data ).done( function( data, textStatus, jqXHR ){
				if(callback) callback(data);
			}).fail( function( jqXHR, textStatus, err) {
				console.error(jqXHR, err);
			})
		}
	}

})();

var Project = (function(){

	var projects = {};
	var current = null;

	function createProject(name, tilesize, cw, ch) {

		let prj = {
			name : name, scene : {},
			objects : {}, properties : { tilesize : tilesize },
			cam : null
		}

		prj.cam = GameObject.create('camera', cw, ch, true );

		current = prj.name;
		Message.logger('Project [' + prj.name + '] created' );
		return prj;
	}

	function save() {
		if(!current){
			Message.alert("There is not active project. Cannot Save")
			return;
		}
		Server.post('projects/'+current.name+'.json', current, ()=>{
			Message.logger('Save Operation Successful');
		})
	}

	function load(name) {
		Server.get('projects/'+name+'.json', (data)=>{
			current = JSON.parse(data);
		})
	}


	var GameObject = {};
	GameObject.create=(name, width, height, static = false)=>{
		let obj = {
			name : name, width : width, height : height, static : static
		}
	}

	return {
		createProject : createProject,
		save : save,
		load : load
	}

})();

var FileIO = (function(){

	function readImage(file, callback) {
		var reader = new FileReader();
		reader.onload = (function(theFile){
			return function(e){
				callback(e.target.result);
			}
		})(file);
	}

	function readFileEvent(event, callback) {
		var files = event.target.files;
		for(var i = 0, f; f=files[i]; i++ ){
			if(f.type.match('image.*')) {
				readImage(f, function(data){ 
					callback(data);
				});
			}
		}
	}

	return {
		readFileEvent : readFileEvent,
	}

})();


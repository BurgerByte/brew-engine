$(document).ready(function(){
	loadMain();
});

loadMain=()=>{
	Server.get('html/editor.html',(data)=>{
		$('body').html(data);
		$('.nav-list').find('.list').css('display','none');
		init()
	});
	//add listeners
	init=()=>{
		//listener on navigation interface
		$('.nav-list .drop-btn').on('click', function(event){
			let status = $(this).parent().find('.status');
			if(status.html().toString() == '►') {
				status.html('&#9660;');
				//open list
				$(this).parent().find('.list').css('display', 'block');
			} else {
				status.html('&#9658;');
				//close list
				$(this).parent().find('.list').css('display', 'none');
			}
		});

		//overlay listener
		$('.overlay').on('click', function(e){
			$('.over-pane .content').html('')
			$('.over-pane').css('display', 'none')
		})

		//listener on menu button
		$('#menu-btn').on('click', function(e){
			$('#menu').toggleClass('on');
		});
		//Menu-content listeners 
		$('#new-prj').on('click', function(e){
			userPrompt.Project.new();
		});

		$('#new-scn').on('click', function(e){
			console.log('likes');
			userPrompt.Scene.new();
		});
	}

}

var userPrompt = {};
userPrompt.validate=(element)=>{
	let inputs = $(element).find('input');
	for(var i = 0, input; input = inputs[i]; i++ ) {
		if($(input).hasClass('invalid') || $(input).val() == '') {
			return false;
		}
	}
	return true;
}
userPrompt.Project = {};
userPrompt.init=()=>{
	$('.over-pane').css('display', 'block');
	$('button.cancel').on('click', function(e){
		$('.over-pane .content').html('')
		$('.over-pane').css('display', 'none')
	});
}
//User Prompt for new Project
userPrompt.Project.new = ()=>{
	let lts = 16, uts = 64;
	let minCam = 200;

	let content = $('.over-pane .content');
	content.load('html/prompts.html #new-project-prompt', ()=>{
		userPrompt.init();
		//objects
		let inputs = $('.over-pane input');
		///////////////////////////////
		//base listener
		///////////////////////////////
		inputs.on('blur', function(e){
			//start off with a clean tag
			$(this).removeClass('invalid');
			//numbered validation
			if($(this).hasClass('numbered') && isNaN($(this).val())) {
				$(this).addClass('invalid'); $(this).val('');
				$(this).attr('placeholder', 'Warning! Not a Number');
			}
			//title
			if($(this)[0].id == "prjn" ) {
				if($(this).val() == '' ) {
					$(this).val(''); $(this).addClass('invalid');
					$(this).attr('placeholder',"Requires Input");
				}
			}
			//check valid tilesizes
			if($(this)[0].id == "ts") {
				let val = $(this).val();
				if(val < lts || val > uts ) {
					$(this).val(''); 
					$(this).addClass('invalid');
					$(this).attr('placeholder','Between['+lts+','+uts+']');
				}
			}
			//checking valid camera size
			if($(this)[0].id =='cw' || $(this)[0].id == 'ch' ) {
				if($(this).val() < minCam) {
					$(this).val('');$(this).addClass('invalid');
					$(this).attr('placeholder','Must be at least: ' + minCam);
				}
			}
		});
		//////////////////////////////
		// verify button listener
		/////////////////////////////
		$('button.verify').on('click', function(e){
			//checking values
			let test = userPrompt.validate($('#new-project-prompt'));
			if (!test){
				$('.prompt .alert').html('Warning! Invalid input detected');
				return;
			}
			//create a new project
			let name = $('#prjn').val(), tilesize = $('#ts').val();
			let cw = $('#cw').val(), ch = $('#ch').val();
			var prj = Project.createProject(name, tilesize, cw, ch);
			$('#project-name').html("Project: " + prj.name);
			$('.over-pane .content').html('')
			$('.over-pane').css('display', 'none')
		});
	});
}

//Scene user prompts
userPrompt.Scene = {};
userPrompt.Scene.new =()=>{
	let content = $('.over-pane .content');
	content.load('html/prompts.html #new-scene-prompt', ()=>{
		userPrompt.init();
	});
}
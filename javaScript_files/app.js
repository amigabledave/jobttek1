

$('#NewDiaryEntryButton').on('click', function(){
	// console.log('Si esta detectando que se aprieta el boton');
	var ksu = $('#NewDiaryEntry');
	console.log(ksu);
	console.log('Se supone que ya se deberia de haber detectado el KSU')
	var ksu_id = ksu.attr("value");
	var user_action = 'RecordValue';
	var is_private = ksu.find('#is_private').is(':checked');
	var importance = ksu.find('#importance').val()

	var event_comments = ksu.find('#comments').val()
	var event_secondary_comments = ksu.find('#secondary_comments').val()

	var dissapear_before_done = ['RecordValue']

	ksu.fadeOut("slow")

	$.ajax({
		type: "POST",
		url: "/EventHandler",
		dataType: 'json',
		data: JSON.stringify({
			'ksu_id': ksu_id,
			'user_action': user_action,
			'is_private': is_private,
			'importance':importance,
			'kpts_value':0,
			'event_comments':event_comments,
			'event_secondary_comments':event_secondary_comments
		})
	})
	.done(function(data){

		ksu.find('#comments').val('');
		ksu.find('#secondary_comments').val('');
		ksu.find('#importance').val(3);		
		ksu.find('#is_private').prop('checked', false);

		var new_ksu = $('#NewDiaryEntry_Template').clone();
		
		new_ksu.attr("id", "MissionKSU");
		new_ksu.attr("value",data['event_id']);		

		new_ksu.find('#comments').val(event_comments);
		new_ksu.find('#secondary_comments').val(event_secondary_comments);
		new_ksu.find('#importance').val(importance);
				
		new_ksu.find('#event_pretty_datet').val(data['pretty_event_date']);
		new_ksu.find('#is_private').prop('checked', is_private);

		new_ksu.removeClass('hidden');
		new_ksu.prependTo('#NewEventHolder');
		new_ksu.fadeIn("slow");

		ksu.fadeIn("slow");
	});
});



$('#LogInButton').on('click', function(){
	var email = $('#login_email').val();
	var password = $('#login_password').val();

	$.ajax({
		type: "POST",
		url: "/SignUpLogIn",
		dataType: 'json',
		data: JSON.stringify({
			'user_action': 'LogIn',
			'email':email,
			'password':password		
		})
	})
	.done(function(data){
		var next_step = data['next_step'];
		console.log(next_step);

		if (next_step == 'GoToYourTheory'){
			window.location.href = '/MissionViewer?time_frame=Today'
		};

		if (next_step == 'TryAgain'){
			$('#InvalidEmailOrPasswordError').removeClass('hidden');			
			
		};
	})		
});



$('#SignUpButton').on('click', function(){
	console.log('ya se dio cuenta que quiero hacer sign up')
	var first_name = $('#first_name').val()
	var last_name = $('#last_name').val()
	var email = $('#email').val()
	var confirm_email = $('#confirm_email').val()
	var password = $('#password').val()

	$.ajax({
		type: "POST",
		url: "/SignUpLogIn",
		dataType: 'json',
		data: JSON.stringify({
			'user_action': 'SignUp',
			'first_name': first_name,
			'last_name':last_name,
			'email':email,
			'confirm_email':confirm_email,
			'password':password		
		})
	})
	.done(function(data){
		var next_step = data['next_step'];
		console.log(next_step);

		if (next_step == 'CheckYourEmail'){
			window.location.href = '/Accounts?user_request=create_account'			
		};

		if (next_step == 'TryAgain'){
			$('#input_error').text(data['input_error'])						
			
		};
	})		
});



$('#PasswordResetButton').on('click', function(){
	var theory_id = $('#theory_id').val()
	var password_hash = $('#password_hash').val()
	var new_password = $('#NewPassword').val()
	$.ajax({
		type: "POST",
		url: "/Accounts",
		dataType: 'json',
		data: JSON.stringify({
			'user_action': 'SetNewPassword',
			'new_password': new_password,
			'theory_id':theory_id,
			'password_hash':password_hash		
		})
	})
	.done(function(data){
		var next_step = data['next_step'];
		console.log(next_step);

		if (next_step == 'EnterValidPassword'){
			$('#InvalidPasswordError').removeClass('hidden');

		};

		if (next_step == 'GoToYourTheory'){
			// window.location.href = '/MissionViewer?time_frame=Today'
			$('#enter_new_password').toggleClass('hidden');
			$('#password_reseted').toggleClass('hidden');
			
		};
	})		
});


$('#RequestPasswordReset').on('click', function(){
	var user_email = $('#user_email').val()
	$.ajax({
		type: "POST",
		url: "/Accounts",
		dataType: 'json',
		data: JSON.stringify({
			'user_action': 'RequestPasswordReset',
			'user_email': user_email,			
		})
	})
	.done(function(data){
		var next_step = data['next_step'];
		console.log(next_step);

		if (next_step == 'EnterValidEmail'){
			$('#InvalidEmailError').removeClass('hidden');
		};

		if (next_step == 'CheckYourEmail'){
			$('#request_reset_email').toggleClass('hidden');
			$('#reset_email_sent').toggleClass('hidden');
		};
	})		
});


$('#MobileTheorySearchButton').on('click', function(){		
	$('#MobileSearchBar').toggleClass('hidden');	
});


$('#ShowHideTagContents').on('click', function(){		
	$('.tag_content').toggleClass('hidden');
	
	var GlaphiconDiv = $('.TagPlusMinus');
	
	GlaphiconDiv.toggleClass('glyphicon-minus');
	GlaphiconDiv.toggleClass('glyphicon-plus');	
});


$(document).on('focusout', '.SettingsTag', function(){
	var original_tag = $(this).attr("originaltag");
	var new_tag = $(this).val();
	
	console.log(original_tag);
	console.log(new_tag);

	$.ajax({
		type: "POST",
		url: "/EventHandler",
		dataType: 'json',
		data: JSON.stringify({
			'user_action': 'UpdateSettingsTag',
			'original_tag': original_tag,
			'new_tag':new_tag,
		})
	})
	.done(function(data){
		console.log('Tag Succesfully Updated');
	})
});


$('.ExpandColapseSection').on('click', function(){
	var target_section = $(this).attr("targetsection")
	$(target_section).toggleClass('hidden');

	var GlaphiconDiv = $(this).find('#PlusMinusGlyphicon');
	GlaphiconDiv.toggleClass('glyphicon-minus');
	GlaphiconDiv.toggleClass('glyphicon-plus');	
});


$('#ShowHideReactiveMission').on('click', function(){
		
	$('#reactive_mission').toggleClass('hidden');
	// $('#ActionsToExecuteSubTitle').toggleClass('hidden');	
	$('#Upcoming').toggleClass('hidden');

	var GlaphiconDiv = $('#MissionPlusMinusGlyphicon');
	GlaphiconDiv.toggleClass('glyphicon-minus');
	GlaphiconDiv.toggleClass('glyphicon-plus');	

	var time_frame = $(this).attr("timeframe");
	if( time_frame == 'Upcoming'){
		$('#SomedayMaybeTitle').toggleClass('hidden');
		$('#MissionTitle').toggleClass('hidden');
	};
});


$('.DummyInput').on('change',function(){
	console.log(this.value)
	var ksu_attr = $(this).attr("ksuattr");
 
	if (ksu_attr == 'mission_view'){
		$('#mission_view').val(this.value);
	};

	if (ksu_attr == 'kpts_value'){
		$('#kpts_value').val(this.value);
	};

	if (ksu_attr == 'next_event'){
		$('#next_event').val(this.value);
	};

	if (ksu_attr == 'frequency'){
		$('#frequency').val(this.value);
	};

	if (ksu_attr == 'secondary_description'){
		$('#secondary_description').val(this.value);
	};

	if (ksu_attr == 'birthday'){
		$('#birthday').val(this.value);
	};

	if (ksu_attr == 'best_time'){
		$('#best_time').val(this.value);
	};

	if (ksu_attr == 'parent_id'){
		$('#parent_id').val(this.value);
	};

	if (ksu_attr == 'tags_value'){
		$(this).closest('#NewKSU').find('#tags_value').val(this.value);
	};

	if (ksu_attr == 'importance'){
		$(this).closest('#NewKSU').find('#importance').val(this.value);
	};

	if (ksu_attr == 'tags'){
		$(this).closest('#MissionKSU').find('#tags').val(this.value);
	};
});


$('.QuickKsuDescription').on('focusin', function(){
	$('#QuickKsuSubtypeDetails').removeClass('hidden');
	$('#TagsAndImportanceRow').removeClass('hidden');	
	$('#QuickKsuSecondaryDescription').removeClass('hidden');
});


$('#ksu_type').on('change',function(){

	if (this.value == 'KeyA'){
		$('#KeyA').removeClass('hidden');
		if ($('#ksu_id').val() == ''){
			$('#KAS1').prop("checked", true);
			$('#KeyA_KAS1').removeClass('hidden');
		}

	} else {
		$('#KeyA').addClass('hidden');
	}	

	if (this.value == 'OTOA'){
		$('#OTOA').removeClass('hidden');
	} else {
		$('#OTOA').addClass('hidden');
	}

	if (this.value == 'BigO'){
		$('#BigO').removeClass('hidden');
	} else {
		$('#BigO').addClass('hidden');
	}

	if (this.value == 'Wish'){
		$('#Wish').removeClass('hidden');
	} else {
		$('#Wish').addClass('hidden');
	}

	if (this.value == 'EVPo'){
		$('#EVPo').removeClass('hidden');
	} else {
		$('#EVPo').addClass('hidden');
	}

	if (this.value == 'Idea'){
		$('#Idea').removeClass('hidden');
	} else {
		$('#Idea').addClass('hidden');
	}

	if (this.value == 'ImPe'){
		$('#ImPe').removeClass('hidden');
	} else {
		$('#ImPe').addClass('hidden');
	}

	if (this.value == 'RTBG'){
		$('#RTBG').removeClass('hidden');
	} else {
		$('#RTBG').addClass('hidden');
	}

	if (this.value == 'ImIn'){
		$('#ImIn').removeClass('hidden');
	} else {
		$('#ImIn').addClass('hidden');
	}

	if (this.value == 'Diary'){
		$('#Diary').removeClass('hidden');
	} else {
		$('#Diary').addClass('hidden');
	}

	d_EditorTitle = {
		'Gene': 'KASware Standard Unit Editor',
		'KeyA': 'Key Action Editor',

		'BigO': 'Objective Editor',
		'Wish': 'Wish Editor',

		'EVPo': 'End Value Mine Editor',
		'ImPe': 'Important Person Editor',
		'RTBG': 'Reason To Be Grateful Editor',
		'Idea': 'Bit of Wisdom Editor',
		'ImIn': 'Indicator Editor'
	}

	$('#KsuEditorTitle').text(d_EditorTitle[this.value]);
});


$('input[type=radio][name=ksu_subtype]').on('change',function(){
	

	if (this.value == 'KAS1'){
		$('#KeyA_KAS1').removeClass('hidden');
	} else {
		$('#KeyA_KAS1').addClass('hidden');
	}

	if (this.value == 'KAS3'){
		$('#KeyA_KAS3').removeClass('hidden');
	} else {
		$('#KeyA_KAS3').addClass('hidden');	
	}

	if (this.value == 'KAS4'){
		$('#KeyA_KAS4').removeClass('hidden');		
	} else {
		$('#KeyA_KAS4').addClass('hidden');
		
	}

	if (this.value == 'KAS2'){
		$('#BOKA_Specific_TagsAndImportanceRow').removeClass('hidden');
		$('#BOKA_SecondaryDescription').addClass('hidden');
		$('#MiniO_Specific_TagsAndImportanceRow').addClass('hidden');
	}

	if (this.value == 'MiniO'){
		$('#MiniO_Specific_TagsAndImportanceRow').removeClass('hidden');
		$('#BOKA_SecondaryDescription').removeClass('hidden');
		$('#BOKA_Specific_TagsAndImportanceRow').addClass('hidden');
	}

	console.log('Se detecto el cambio de KSU_SUBTYPE');
	console.log(this.value);
	$('#NewKSU').attr("ksusubtype", this.value);
});


$('#repeats').on('change',function(){

	d_repeats_legend = {
	'R001':'Days',
	'R007':'Weeks',
	'R030':'Months',
	'R365':'Years'};

	if (this.value != 'R000') {
		$('#repeatsDetails').removeClass('hidden');
		if (this.value == 'R007'){
			$('#repeats_on').removeClass('hidden');
			$('#repeats_every').addClass('hidden');
		} else {
			$('#repeats_on').addClass('hidden');
			$('#repeats_every').removeClass('hidden');
		}
		$('#repeats_every_footnote').text(d_repeats_legend[this.value]);
	} else {
		$('#repeatsDetails').addClass('hidden');
	}
});


$(document).on('change', '.KsuEditor_Repeats', function(){

	var ksu = $(this).closest('#MissionKSU');

	d_repeats_legend = {
	'R001':'Days',
	'R007':'Weeks',
	'R030':'Months',
	'R365':'Years'};

	if (this.value != 'R000') {
		ksu.find('#repeatsDetails').removeClass('hidden');
		if (this.value == 'R007'){
			ksu.find('#repeats_on').removeClass('hidden');
			ksu.find('#repeats_every').addClass('hidden');
		} else {
			ksu.find('#repeats_on').addClass('hidden');
			ksu.find('#repeats_every').removeClass('hidden');
		}
		ksu.find('#repeats_every_footnote').text(d_repeats_legend[this.value]);
	} else {
		ksu.find('#repeatsDetails').addClass('hidden');
	}
});


// $('.UserActionButton').on('click', function(){
$(document).on('click', '.UserActionButton', function(){
	console.log('Si esta detectando que se aprieta el boton');
	var ksu = $(this).closest('#MissionKSU');
	var ksu_id = ksu.attr("value");
	var user_action = $(this).attr("value");
	var kpts_value = ksu.find('#kpts_value').val();
	var event_comments = ksu.find('#event_comments').val()
	var event_secondary_comments = ksu.find('#event_secondary_comments').val()

	var dissapear_before_done = ['MissionDone', 'MissionPush', 'MissionSkip' ,'MissionDelete', 'ViewerDelete','GraveyardDelete', 'GraveyardReanimate', 'MissionRecordValue']

	if ($.inArray(user_action, dissapear_before_done)!= -1){
		ksu.animate({
			"opacity" : "0",
			},{
				"complete" : function() {
				ksu.remove();
				}
			})
		};


	if (user_action == 'ReactiveMissionDone'){
		user_action = 'MissionDone'};


	if (user_action == 'MissionRecordValue' || user_action == 'ViewerRecordValue'){
		user_action = 'RecordValue'
		kpts_value = ksu.find('#select_indicator_value option:selected').val()
		
		if(kpts_value == undefined){
			kpts_value = ksu.find('#open_indicator_value').val()};	
		};

	if(kpts_value == undefined){
		kpts_value = 0};

	if(event_comments == undefined){
		event_comments = ''};

	if(event_secondary_comments == undefined){
		event_secondary_comments = ''};		

	$.ajax({
		type: "POST",
		url: "/EventHandler",
		dataType: 'json',
		data: JSON.stringify({
			'ksu_id': ksu_id,
			'user_action': user_action,
			'kpts_value':kpts_value,
			'event_comments':event_comments,
			'event_secondary_comments':event_secondary_comments
		})
	})
	.done(function(data){
		console.log(data);
		var EventScore = data['EventScore'];
		var kpts_type = data['kpts_type'];
		var PointsToGoal = data['PointsToGoal']

		if ( PointsToGoal <= 0){
			PointsToGoal = 'Achieved!'
		}; 
	
		$('#PointsToGoal').text(' ' + PointsToGoal);
		$('#EffortReserve').text(' ' + data['EffortReserve']);
		$('#Streak').text(' ' + data['Streak']);


		if ($.inArray(user_action, dissapear_before_done)!= -1){
			$('#MissionValue').text(parseFloat($('#MissionValue').text())-data['kpts_value']);
		};

		var ksu_subtype = data['ksu_subtype'];

		if (user_action == 'SendToMission' || user_action == 'ViewerDone' || user_action == 'RecordValue'){
			ksu.find('#pretty_next_event').text(data['pretty_next_event']);
		};

		if (user_action == 'ViewerOnOff'){
			console.log(data['is_active'])
			if (data['is_active']){
				ksu.find('#is_active').css({'color': 'black'});
				ksu.find('#ViewerOnOffButton').removeClass('btn-success');
				ksu.find('#ViewerOnOffButton').addClass('btn-warning');
			} else {
				ksu.find('#is_active').css({'color': '#b1adad'});
				ksu.find('#ViewerOnOffButton').removeClass('btn-warning');
				ksu.find('#ViewerOnOffButton').addClass('btn-success');				
			}

		};
		
		var dissapear_after_done_subtypes = ['KAS2', 'Wish', 'BigO'];
		var dissapear_after_done_actions = ['ViewerDone'];

		if (($.inArray(ksu_subtype, dissapear_after_done_subtypes)!= -1) && ($.inArray(user_action, dissapear_after_done_actions)!= -1)){
			ksu.animate({
				"opacity" : "0",
				},{
					"complete" : function() {
					ksu.remove();
					}
				})
			};

	});
});


function getURLParameter(url, name) {
    return (RegExp(name + '=' + '(.+?)(&|$)').exec(url)||[,null])[1];
}


$(document).on('click', '.RedirectUserButton', function(){
	var ksu = $(this).closest('#MissionKSU');
	var ksu_id = ksu.attr("value");
	var user_action = $(this).attr("value");

    current_url = return_to = window.location.href

    return_to = '&return_to=' + window.location.pathname

    var set_name = getURLParameter(current_url, 'set_name');
    if (set_name){
    	return_to = return_to + '?set_name=' + set_name 
    }
    var time_frame = getURLParameter(current_url, 'time_frame');
    if (time_frame){
    	return_to = return_to + '?time_frame=' + time_frame
    }
    
	if (user_action == 'EditKSU'){	
		window.location.href = '/KsuEditor?ksu_id=' + ksu_id + return_to;

	} else if ( user_action == 'ViewKSUHistory') {
		window.location.href = '/HistoryViewer?ksu_id='+ksu_id;
	
	} else if ( user_action == 'ViewBigOPlan') {
		window.location.href = '/SetViewer?set_name=BOKA&ksu_id='+ksu_id;

	} else if ( user_action == 'ViewDreamPlan') {
		window.location.href = '/SetViewer?set_name=BigO&ksu_id='+ksu_id;
	}
});



$('.SaveNewKSUButton').on('click', function(){
	var ksu = $(this).closest('#NewKSU');
	var ksu_type = ksu.attr("ksutype");
	var ksu_subtype = ksu.attr("ksusubtype");
	var parent_id = ksu.find('#parent_id').val();
	if (parent_id == undefined){
		parent_id = ksu.find('#parent_id option:selected').val();
	};
	console.log('This is the parentid')
	console.log(parent_id)

	var description = ksu.find('#description').val();
	var secondary_description = ksu.find('#secondary_description').val();
	var next_event = ksu.find('#next_event').val();
	var best_time = ksu.find('#best_time').val();
	var kpts_value = ksu.find('#kpts_value').val();

	var importance = ksu.find('#importance').val();
	var mission_importance = ksu.find('#mission_importance').val();
	var tags = ksu.find('#tags_value').val();
	var comments = ksu.find('#comments').val();

	var frequency = ksu.find('#frequency').val();
	var repeats = ksu.find('#repeats').val();		

	var is_active = ksu.find('#is_active').is(':checked');
	var is_critical = ksu.find('#is_critical').is(':checked');
	var is_private = ksu.find('#is_private').is(':checked');
	
	var repeats_on_Mon = ksu.find('#repeats_on_Mon').is(':checked');
	var repeats_on_Tue = ksu.find('#repeats_on_Tue').is(':checked'); 
	var repeats_on_Wed = ksu.find('#repeats_on_Wed').is(':checked'); 
	var repeats_on_Thu = ksu.find('#repeats_on_Thu').is(':checked');
	var repeats_on_Fri = ksu.find('#repeats_on_Fri').is(':checked');
	var repeats_on_Sat = ksu.find('#repeats_on_Sat').is(':checked');
	var repeats_on_Sun = ksu.find('#repeats_on_Sun').is(':checked');

	var money_cost = ksu.find('#money_cost').val();
	var birthday = ksu.find('#birthday').val();

	
	if (description == ''){
		description = ksu.find('#description').text();
		secondary_description = ksu.find('#secondary_description').text();
	};

	if ((ksu_type == 'BigO' || ksu_type == 'Wish' ) && kpts_value == '0.25'){
		kpts_value = 1
	}

	ksu.fadeOut("slow")
	
	$.ajax({
		type: "POST",
		url: "/EventHandler",
		dataType: 'json',
		data: JSON.stringify({
			'user_action': 'SaveNewKSU',
			'ksu_type': ksu_type,
			'ksu_subtype': ksu_subtype,
			'parent_id': parent_id,
			
			'description':description,
			'secondary_description':secondary_description,
			'next_event':next_event,
			'best_time':best_time,
			'kpts_value': kpts_value,
			
			'importance':importance,
			'mission_importance':mission_importance,
			'tags':tags,
			'comments':comments, 
		
			'is_active':is_active,
			'is_critical':is_critical, 
			'is_private':is_private,

			'frequency':frequency,
			'repeats':repeats,
	
			'repeats_on_Mon':repeats_on_Mon,
			'repeats_on_Tue':repeats_on_Tue,
			'repeats_on_Wed':repeats_on_Wed,
			'repeats_on_Thu':repeats_on_Thu,
			'repeats_on_Fri':repeats_on_Fri,
			'repeats_on_Sat':repeats_on_Sat,
			'repeats_on_Sun':repeats_on_Sun,

			'money_cost':money_cost,
			'birthday':birthday,

		})
	})
	.done(function(data){
		console.log(data);
		ksu.find('#description').val('');
		ksu.find('#comments').val('');
		ksu.find('#is_critical').prop('checked', false);
		ksu.find('#is_private').prop('checked', false);
		ksu.find('#is_active').prop('checked', true);
		
		ksu.find('#secondary_description').val('');
		ksu.find('#BigO_secondary_description').val('');
		ksu.find('#KAS3_secondary_description').val('');
		ksu.find('#KAS4_secondary_description').val('');
		ksu.find('#EVPo_secondary_description').val('');
		ksu.find('#ImPe_secondary_description').val('');
		ksu.find('#Idea_SecondaryDescription').val('');

		ksu.find('#best_time').val('');
		ksu.find('#ImIn_best_time').val('');
		ksu.find('#Diary_best_time').val('');

		// ksu.find('#next_event').val('');
		ksu.find('#BigO_next_event').val('');
		ksu.find('#EVPo_next_event').val('');
		ksu.find('#ImPe_next_event').val('')
		ksu.find('#ImIn_next_event').val('')
		ksu.find('#Diary_next_event').val('')
		
		ksu.find('#tags_value').val('');
		ksu.find('#Dummy_tags_value').val('');			
		
		ksu.find('#importance').val(3);
		ksu.find('#mission_importance').val(3);

		ksu.find('#kpts_value').val(1);
		ksu.find('#KAS3_kpts_value').val(1);
		ksu.find('#KAS4_kpts_value').val(1);
		ksu.find('#BigO_kpts_value').val(1);
		ksu.find('#Wish_kpts_value').val(1);
		ksu.find('#EVPo_kpts_value').val(1);
		ksu.find('#ImPe_kpts_value').val(1);

		ksu.find('#frequency').val('');
		ksu.find('#EVPo_frequency').val('');
		ksu.find('#ImPe_frequency').val('');
		ksu.find('#ImIn_frequency').val('');
		ksu.find('#Diary_frequency').val('');

		ksu.find('#money_cost').val('');
		ksu.find('#birthday').val('');
		
		if (ksu_subtype == ''){
			ksu_subtype = ksu_type
		};

		console.log('Este es el tipo de KSU que ando pidiendo guardar:');
		console.log(ksu_type);
		console.log(ksu_subtype);

		var Templates = {
			'KeyA': $('#NewKSUTemplate_KeyA').clone(),
			'KAS1': $('#NewKSUTemplate_KAS1').clone(),
			'KAS2': $('#NewKSUTemplate_KAS2').clone(),
			'KAS3': $('#NewKSUTemplate_KAS3').clone(),
			'KAS4': $('#NewKSUTemplate_KAS4').clone(),
			
			'BigO': $('#NewKSUTemplate_BigO').clone(),
			'MiniO': $('#NewKSUTemplate_MiniO').clone(),
			'Wish': $('#NewKSUTemplate_Wish').clone(),
			
			'EVPo': $('#NewKSUTemplate_EVPo').clone(),
			'ImPe': $('#NewKSUTemplate_ImPe').clone(),
			'Idea': $('#NewKSUTemplate_Idea').clone(),
			'RTBG': $('#NewKSUTemplate_RTBG').clone(),

			'RealitySnapshot': $('#NewKSUTemplate_RealitySnapshot').clone(),
			'BinaryPerception': $('#NewKSUTemplate_BinaryPerception').clone(),
			'FibonacciPerception': $('#NewKSUTemplate_FibonacciPerception').clone(),
			'Diary': $('#NewKSUTemplate_Diary').clone()
		}


		var new_ksu = Templates[ksu_subtype];

		new_ksu.attr("id", "MissionKSU");
		new_ksu.attr("value",data['ksu_id']);
		new_ksu.find('#ksu_id').attr("value",data['ksu_id']);

		new_ksu.find('#description').val(description);
		new_ksu.find('#secondary_description').val(secondary_description);
		new_ksu.find('#kpts_value').val(kpts_value);
		new_ksu.find('#best_time').val(best_time);
		new_ksu.find('#next_event').val(next_event);

		new_ksu.find('#importance').val(importance);
		new_ksu.find('#mission_importance').val(mission_importance);
		
		new_ksu.find('#tags').val(tags);
		new_ksu.find('#ksu_subtype').text(ksu_subtype);

		new_ksu.find('#is_critical').prop('checked', is_critical);
		new_ksu.find('#is_active').prop('checked', is_active);
		new_ksu.find('#is_private').prop('checked', is_private);

		new_ksu.find('#money_cost').val(money_cost);
		new_ksu.find('#birthday').val(birthday);

		new_ksu.find('#frequency').val(frequency);
		new_ksu.find('#comments').val(comments);

		new_ksu.removeClass('hidden');
		new_ksu.prependTo('#NewKSUsHolder');
		new_ksu.fadeIn("slow");

		if(is_critical && is_active){
			new_ksu.find('#description').css('color', '#B22222');				
		} else if (is_active){
			new_ksu.find('#description').css('color', 'black');				
		} else {
			new_ksu.find('#description').css('color', '#b1adad');
		};

		$('#TagsAndImportanceRow').addClass('hidden');	
		$('#QuickKsuSecondaryDescription').addClass('hidden');
		$('#QuickKsuSubtypeDetails').addClass('hidden');
		ksu.fadeIn("slow");

	});
});


$('.DeleteEventButton').on('click', function(){
	var event = $(this).closest('#MissionKSU');
	var event_id = event.attr("value");
		
	event.fadeOut("slow")
	
	$.ajax({
		type: "POST",
		url: "/EventHandler",
		dataType: 'json',
		data: JSON.stringify({
			'user_action': 'DeleteEvent',
			'event_id': event_id,
		})
	})
	.done(function(data){
		console.log(data);

		var PointsToGoal = data['PointsToGoal'];

		if ( PointsToGoal <= 0){
			PointsToGoal = 'Achieved!'
		}; 
	
		$('#PointsToGoal').text(' ' + PointsToGoal);
		$('#EffortReserve').text(' ' + data['EffortReserve']);
		$('#Streak').text(' ' + data['Streak']);
	
	});
});


// $('.ShowDetailViewerButton').on('click', function(){
$(document).on('click', '.ShowDetailViewerButton', function(){

	var ksu = $(this).closest('#MissionKSU');
	
	var ScoreDetail = ksu.find('#ScoreDetail');
	ScoreDetail.toggleClass('hidden');

	var GlaphiconDiv = ksu.find('#PlusMinusGlyphicon');
	GlaphiconDiv.toggleClass('glyphicon-minus');
	GlaphiconDiv.toggleClass('glyphicon-plus');	
});


// $('.QuickAttributeUpdate').on('focusout', function(){
$(document).on('focusout', '.QuickAttributeUpdate', function(){
	var attr_key = $(this).attr("name");
	var attr_type = $(this).attr("type");
	var attr_value = $(this).val();
	if( attr_type == 'checkbox'){
		attr_value = $(this).is(':checked');
	};

	var ksu = $(this).closest('#MissionKSU');
	var ksu_id = ksu.attr("value");
	var content_type = 'KSU';
	console.log(ksu.attr("KSUorEvent") == 'Event');

	if (ksu.attr("KSUorEvent") == 'Event'){ 
		content_type = 'Event'
	};
	console.log(content_type);
	
	console.log(attr_key);
	console.log(attr_value);

	$.ajax({
		type: "POST",
		url: "/EventHandler",
		dataType: 'json',
		data: JSON.stringify({
			'ksu_id': ksu_id,
			'content_type':content_type,
			'user_action': 'UpdateKsuAttribute',
			'attr_key':attr_key,
			'attr_value':attr_value,
		})
	})
	
	.done(function(data){
		console.log(data['updated_value']);

		if( attr_type == 'checkbox'){
			var description = ksu.find('#description');
			var secondary_description = ksu.find('#secondary_description');
			var is_critical = ksu.find('#is_critical').is(':checked');
			var is_active = ksu.find('#is_active').is(':checked');
			console.log(is_active, is_critical);
			if(is_critical && is_active){
				description.css('color', '#B22222');				
			} else if (is_active){
				description.css('color', 'black');				
			} else {
				description.css('color', '#b1adad');
			};
		};

		if (attr_key == 'description'){
			ksu.find('#description').val(data['updated_value'])};
	})
});



// Hace que sea posible desseleccionar radios    
var allRadios = document.getElementsByName('ksu_subtype');
var booRadio;
var x = 0;
for(x = 0; x < allRadios.length; x++){

    allRadios[x].onclick = function() {
        if(booRadio == this){
            this.checked = false;
            booRadio = null;
        }else{
            booRadio = this;
        }
    };
}


// Hace que se resize las cajas de texto con autoexpand
$(document)
    .one('focus.textarea', '.autoExpand', function(){
        var savedValue = this.value;
        this.value = '';
        this.baseScrollHeight = this.scrollHeight;
        this.value = savedValue;
    })
    .on('input.textarea', '.autoExpand', function(){
        var minRows = this.getAttribute('data-min-rows')|0,
            rows;
        this.rows = minRows;
        rows = Math.ceil((this.scrollHeight - this.baseScrollHeight) / 16);
        this.rows = minRows + rows;
    });


// $('.SetViewerKSU').hover(	
// 	function(){
// 		$(this).find('#TagsImportanceRow').toggleClass('hidden');
// 	},
// 	function(){
// 		$(this).find('#TagsImportanceRow').toggleClass('hidden');
// 	}
// );


// function al_cargar(){
// 	console.log('mas o menos ahi va')
// };
// $(al_cargar);

// $('body').on('click', function(){
// 	console.log('Logre linkear un archivo de JS a KASware!!! :)')
// });

// $(document).ready(function(){
// 	$('body').on('click', function(){
// 		console.log('Logre linkear un archivo de JS a KASware!!! :)')
// 	});
// });

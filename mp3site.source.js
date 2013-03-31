var mp3site = {
	about : {
		whatsThis : 'Complete application code for the music playback-and-download site on http://dj-firesnake.info/',
		copyright : '(c) (r) 2011-2012 by Rene AJM Veerman <rene.veerman.netherlands@gmail.com> aka DJ FireSnake',
		license : 'http://www.gnu.org/licenses/lgpl.html, free for any type of use.',
		version : '1.2.1',
		firstReleased : '2011',
		lastUpdated : ' 2013, January 19, 13:42 CET AMS',
		knownBugs : {
			1 : "None atm, I think. Please report any bugs you find.."
		},
		downloadURLs : [ 'http://fancywebapps.com/', 'http://dj-firesnake.info/' ]
	},
	settings : {
		playingIndex : 0,
		paused : false,
		stopped : true,
		repeating : false
	},
	language : {
		siteTitle : 'DJ FireSnake\'s mixes'
	},
	startApp : function () {
		$(window).resize(function () {
			mp3site.onWindowResize();
		});
		
		fwa.comments.globals = {
			removeCallback : mp3site.removeComment
		};
		
		fwa.animatedJavascriptControlCenter.init(document.body, mp3site.animatedJavascriptsInitialized);
	},
	
	animatedJavascriptsInitialized : function () {
		mp3site.onWindowResize();
		mp3site.setupDragNDrop();
	
		// initialize the audio player
		$.jPlayer.timeFormat.showHour = true;
		$("#jplayer").jPlayer({
			ready: function () {
			},
			ended: function (event) {
				var pl = $('#playlist')[0];
				mp3site.settings.playingIndex++;
				if (mp3site.settings.playingIndex >= pl.children.length) {
					if (mp3site.settings.repeating) {
						mp3site.settings.playingIndex = 0;
						var fileID = $(pl.children[mp3site.settings.playingIndex]).attr('file');
						mp3site.selectMP3 (pl.children[mp3site.settings.playingIndex].id, fileID, false);
					} else {
						mp3site.stop();
					}
				} else {
						var fileID = $(pl.children[mp3site.settings.playingIndex]).attr('file');
						mp3site.selectMP3 (pl.children[mp3site.settings.playingIndex].id, fileID, false);
				}
			},
			supplied: "mp3",
			nativeSupport: false, //attempt to force this component to using swf (flash) for playback, because that shows a progress bar as mix downloads to browser;
			swfPath: fwa.globals.urls.os + "/lib/jquery.jPlayer.2.1.0/"
		});
		
		// initially the comment editor is hidden:
		$('#comment_editor').slideUp (1);
		$('#comments, #comments__container').css ({height:($('#infoWindow_comments__dialog').height()-130) + 'px'});
		fwa.ajss.containerSizeChanged($('#comments')[0]);
		
		// note paths to tinyMCE CSS files
		var css_e = fwa.globals.urls.os + '/lib/tinymce-3.5b3/jscripts/tiny_mce/themes/advanced/skins/default/ui_rajmvTransparency.css';
		var path = fwa.globals.urls.os + "/lib/tinymce-3.5b3/rajmvTransparency/";
		var css_c = path + 'editor_comment.css,';
		if (navigator.userAgent.match(/MSIE/)) {
			css_c += path + 'editor_comment_ie5.css';
		} else {
			css_c += path + 'editor_comment_css3.css';
		};

		tinyMCE.init({
			mode : "textareas",
			theme : "advanced",
			init_instance_callback : mp3site.editorInitialized, 
			theme_advanced_buttons1 : "inlinepopups,bold,italic,underline,strikethrough,indent,outdent,bullist,numlist,justifyleft,justifycenter,justifyright,justifyfull,link,unlink",
			theme_advanced_buttons2: "fontselect,fontsizeselect,forecolor,backcolor,undo,redo",
			theme_advanced_buttons3: "",
			theme_advanced_buttons4: "",
			theme_advanced_toolbar_location : "top",
			theme_advanced_toolbar_align : "center",
			font_size_style_values : "8px,10px,12px,14px,18px,24px,36px",
			keep_style : true, 
			content_css : css_c,
			editor_css : css_e,
			inline_styles : true,
			theme_advanced_resize_horizontal : false,
			theme_advanced_resizing : false,
			apply_source_formatting : true,
			convert_fonts_to_spans : true
		});
	},
	
	editorInitialized : function () {
		mp3site.hideCommentsEditor();

		// get rid of that spinning icon:		
		mp3site.settings.loaderIcon.parentNode.removeChild (mp3site.settings.loaderIcon);

		fwa.serviceLog.makeLogEntry();

		mp3site.onWindowResize();
		$('#siteLoadingMsg,#siteBootLog').fadeOut (350);
		$('#siteBackground_img').fadeIn (700);
		setTimeout (function() {
			// now show the previously hidden site widgets and dialogs
			$('.animatedJavascriptDialog, .animatedJavascriptScrollpane, .animatedJavascriptDialog_dialog, .ajss_container, #heading_wrapper, #siteIntroText, #mp3s, #player, #player_table, #playlist_wrapper, #infoWindow_help, #comments')
				.not ('#infoWindow_info, #infoWindow_tools, #infoWindow_tools__dialog, #infoWindow_info__dialog')
				.css ({visibility:'visible',display:'none'}).fadeIn(700);
				setTimeout (function() {
					mp3site.onWindowResize();
					
					// use HTML5 History API if available:
					History.Adapter.bind(window,'statechange',function(){ 
						var state = History.getState(); 
						fwa.googleAnalyticsMakeHit();
						fwa.serviceLog.makeLogEntry();
					});
					// For browsers that do not support the HTML5 History API:
					if (window.location.hash!=='') mp3site.selectMP3fromLocation (window.location.hash.replace(/#/,''));
					// For browsers that do support the HTML5 History API:
					if (window.location.href.match('play/')) mp3site.selectMP3fromLocation(window.location.href.replace(fwa.globals.urls.app,'').replace(/#.*/,''));
				},710);
		},710);
	},
	
	enterNewComment : function () {
		var ed = tinyMCE.get('newComment');
		var entry = {
			subscription : 'all',
			from : $('#newCommentFrom')[0].value,
			when : '' + (new Date()),
			comment : ed.getContent()
		};
		fwa.comments.newComment (entry, function (result, statusAsText) {
			$('#comments').prepend (result);
			mp3site.hideCommentsEditor();
		});
	},
	
	removeComment : function (subscriptionName, commentIdx, result, statusAsText) {
		var $c = $('#fwaComment_subscription_' + subscriptionName + '_item_' + commentIdx);
		$c.slideUp('slow', function () {
			$c.remove();
			fwa.ajss.containerSizeChanged($('#comments')[0]);
		});
	},
	
	hideCommentsEditor : function () {
		$('#comment_editor').slideUp ('slow');
		$('#newCommentShowEditor_td').animate ({height:'35px'},500);
		$('#newCommentShowEditor').fadeIn (500);
		$('#comments, #comments__container').animate ({height:($('#infoWindow_comments__dialog').height()-130) + 'px'},500);
		setTimeout (function() {
			fwa.ajss.containerSizeChanged($('#comments')[0]);
		}, 550);					
	},
	
	showCommentsEditor : function () {
		$('#comments, #comments__container').animate ({height:($('#infoWindow_comments__dialog').height()-510) + 'px'}, 'slow', function () {
			fwa.ajss.containerSizeChanged($('#comments')[0]);
		});
		$('#newCommentShowEditor').fadeOut ('slow', function () {
			$('#newCommentShowEditor_td').animate ({height:'1px'},'slow');
			$('#comment_editor').show ('slow');
		});
	},
	
	toggleView : function (buttonID, divID) {
		var d = $('#'+divID)[0];
		if (!mp3site.settings.toggleView) mp3site.settings.toggleView = {};
		if (!mp3site.settings.toggleView[divID]) mp3site.settings.toggleView[divID] = false;
		mp3site.settings.toggleView[divID] = !mp3site.settings.toggleView[divID];
		$('#'+divID).css ({visibility:'visible'});
		if (divID=='infoWindow_tools') $('#infoWindow_tools_content').css ({display:'block'});
		if (mp3site.settings.toggleView[divID]) {
			fwa.animatedJavascriptControlCenter.changeState (
				document.getElementById(buttonID),
				document.getElementById(buttonID+'__item__0'),
				'selected'
			);
			$('#'+divID+'__dialog').css ({
				display : 'block',
				visibility : 'hidden'
			});
			$('#'+divID+'__dialog').css ({
				display : 'none',
				visibility : 'visible',
				top : ($('#'+buttonID).offset().top + $('#'+buttonID)[0].offsetHeight + 10) + 'px',
				left : ($('#'+buttonID).offset().left + $('#'+buttonID)[0].offsetWidth - $('#'+divID+'__dialog')[0].offsetWidth) + 'px'
			}).fadeIn('slow');
		} else {
			fwa.animatedJavascriptControlCenter.changeState (
				document.getElementById(buttonID),
				document.getElementById(buttonID+'__item__0'),
				'normal'
			);
			$('#'+divID+'__dialog').fadeOut ('slow');
		}
	},
	
	queueMP3 : function (id, file) {
		var pl = document.getElementById('playlist');
		var pc = mp3site.playlistCount++;
		
		var newPlaylistItem = npi = document.createElement('div');
		npi.setAttribute ('file', file);
		npi.id = 'playlist_' + pc;
		npi.style.padding = '2px';
		npi.className = 'mp3 animatedJavascriptButton animatedTheme__lava_002';
		npi.innerHTML = 
			'<a href="javascript:mp3site.selectMP3(\'' + npi.id + '\', \'' + file + '\');">'
			+ file.replace(' - DJ FireSnake.mp3', '')
			+ '</a>';
		
		pl.appendChild (npi);
		fwa.ajcc.init (npi, function () {
			fwa.ajss.containerSizeChanged($('#playlist_wrapper__scrollpane')[0]);
			if (mp3site.settings.stopped) {		
				mp3site.selectMP3 (npi.id, file);
			}
		});
	},
	
	selectMP3fromLocation : function (location) {
		location = location.replace ('/play/', '').replace(/_/g,' ');

		// check if mix to play is already in playlist;
		var winner = null;
		var pl = document.getElementById('playlist');
		for (var i=0; i<pl.children.length; i++) {
			if (pl.children[i].getAttribute('file').match(location)) winner = pl.children[i];
		};
		if (winner) {
			mp3site.selectMP3 (winner, winner.getAttribute('file'));
		} else {
			// mix to play is not in playlist, add it to playlist if we can find it in the main mp3 list;
			var mp3list = document.getElementById('mp3s');
			
			for (var i=0; i<mp3list.children.length; i++) {
				if (mp3list.children[i].id!='mp3s__images' && mp3list.children[i].getAttribute('file').match(location)) winner = mp3list.children[i];
			};
			if (winner) mp3site.queueMP3 (winner, winner.getAttribute('file'));
		}
	},

	selectMP3 : function (id, file, firstRun) {
		mp3site.settings.activeID = id;
		
		var pl = $('#playlist')[0];
		for (var i=0; i<pl.children.length; i++) {
			if (pl.children[i].id==id) mp3site.settings.playingIndex = i;
		};

		var ajaxCommand = {
			type : 'GET',
			url : fwa.globals.urls.app + '/mixes/' + file + '.json',
			success : function (json, ts) {
				var mixTitle = file.replace (' - DJ FireSnake.mp3','');
				var mixLoc = file.replace (' - DJ FireSnake.mp3','').replace(/ /g, '_');
				window.History.pushState (null, mp3site.language.siteTitle + ' - ' + mixTitle, fwa.globals.urls.app+'/play/'+mixLoc);
			
				if (typeof json!=='object') json = eval ('('+json+') ');
				var html = '';
				html += '<table style="width:100%">';
				html += '<tr><td colspan="2" style="text-align:center"><a href="' + fwa.globals.urls.app + '/download_mp3.php?file='+file+'">download</a></td></tr>';
				html += '<tr><td><span class="mp3_info_label mp3_title_label">title</span></td><td><span class="mp3_title">'+json.title+'</span></td></tr>';
				html += '<tr><td><span class="mp3_info_label mp3_album_label">album</span></td><td><span class="mp3_album">' + json.album + '</span></td></tr>';
				html += '<tr><td><span class="mp3_info_label mp3_length_label">length</span></td><td><span class="mp3_length">' + json.length + '</span></td></tr>';
				html += '<tr><td><span class="mp3_info_label mp3_year_label">year</span></td><td><span class="mp3_year">'+json.year+'</span></td></tr>';
				html += '<tr><td><span class="mp3_info_label mp3_description_label">description</span></td><td><span class="mp3_description">' + json.description + '</span></td></tr>';
				html += '</table>';

				$('#siteIntroText').fadeOut (1000);
				setTimeout (function () {

					$('.mp3').each (function (index,element) {
						if (this.id=='') return false;
						if (this.id==id) var state = 'selected'; else var state='normal';
						fwa.animatedJavascriptControlCenter.changeState (
							document.getElementById(this.id),
							document.getElementById(this.id+'__item__0'),
							state
						);
					});
					
					$('#mp3descText').css({display:'none'}).html (html).fadeIn(1000);
					setTimeout (function () {
						if ($('#mp3desc__container').length>0) {
							$('#mp3desc__container').css ({
								height : $('#infoWindow_mp3desc').height() + 'px'
							});
							fwa.ajss.containerSizeChanged($('#infoWindow_mp3desc__scrollpane')[0]);
						};
						fwa.ajss.containerSizeChanged($('#infoWindow_mp3desc__scrollpane')[0]);

/*
						if ($('#infoWindow_mp3desc').css('visibility')=='hidden') {
							$('#infoWindow_mp3desc__dialog').css ({
								display : 'none',
								visibility:'visible'
							}).fadeIn ('slow');
							$('#infoWindow_mp3desc').css({visibility:'visible'});
						}
*/
						if (!firstRun) {
							$('#jplayer.jp-jplayer').jPlayer("setMedia", {
								mp3: fwa.globals.urls.app + '/mixes/' + file
							}).jPlayer("play");
							mp3site.settings.stopped = false;
						}
		
						if (document.getElementById('btn_playpause__item__0') )
						fwa.animatedJavascriptControlCenter.changeState (
							document.getElementById('btn_playpause'),
							document.getElementById('btn_playpause__item__0'),
							'selected'
						);
					}, 100);
				}, 1010);

			}
		};
		jQuery.ajax(ajaxCommand);

	},
	
	playpause : function () {
		if (mp3site.settings.stopped || mp3site.settings.paused) {
			fwa.animatedJavascriptControlCenter.changeState(
				document.getElementById('btn_playpause'),
				document.getElementById('btn_playpause__item__0'),
				'selected'
			);
			$('#jplayer').jPlayer('play');
			mp3site.settings.paused = false;
			mp3site.settings.stopped = false;
		} else {
			fwa.animatedJavascriptControlCenter.changeState(
				document.getElementById('btn_playpause'),
				document.getElementById('btn_playpause__item__0'),
				'normal'
			);
			$('#jplayer').jPlayer('pause');
			mp3site.settings.paused = true;
			mp3site.settings.stopped = false;
		}
	},
	
	stop : function () {
		fwa.animatedJavascriptControlCenter.changeState(
			document.getElementById('btn_playpause'),
			document.getElementById('btn_playpause__item__0'),
			'normal'
		);
		$('#jplayer').jPlayer('stop');
		mp3site.settings.stopped = true;

		$('.mp3').each (function (index,element) {
			if (this.id=='') return false;
			fwa.animatedJavascriptControlCenter.changeState (
				document.getElementById(this.id),
				document.getElementById(this.id+'__item__0'),
				'normal'
			);
		});
		$('#mp3descText').fadeOut (1000);
		setTimeout (function () {
			$('#siteIntroText').fadeIn (1000);
			setTimeout (function () {
				fwa.ajss.containerSizeChanged($('#infoWindow_mp3desc__scrollpane')[0]);
			}, 100);
		}, 1010);
	},	
	
	mute : function () {
		if (mp3site.settings.muted) {
			fwa.animatedJavascriptControlCenter.changeState(
				document.getElementById('btn_mute'),
				document.getElementById('btn_mute__item__0'),
				'normal'
			);
			$('#jplayer').jPlayer('unmute');
			mp3site.settings.muted = false;
		} else {
			fwa.animatedJavascriptControlCenter.changeState(
				document.getElementById('btn_mute'),
				document.getElementById('btn_mute__item__0'),
				'selected'
			);
			$('#jplayer').jPlayer('mute');
			mp3site.settings.muted = true;
		}
	},
	
	toggleRepeat : function () {
		mp3site.settings.repeating = !mp3site.settings.repeating;
			fwa.animatedJavascriptControlCenter.changeState(
				document.getElementById('btn_repeat'),
				document.getElementById('btn_repeat__item__0'),
				mp3site.settings.repeating ? 'selected' : 'normal'
			);
	},
	
	setupDragNDrop : function () {
		var mp3s = $('.mp3');
		$('.mp3').draggable ({
			containment : 'window',
			connectToSortable : '#playlist',
			helper : function (evt, ui) {
				var div = document.createElement ('div');
				if (this) div.appendChild (this.cloneNode(true));
				document.body.appendChild (div);
				return div;
			}
		});
		$('#playlist').sortable({
			revert : true,
			start : function (evt, ui) {
				var buttonID = ui.item[0].children[0].id.replace(/__item__0/,'');
				fwa.ajcc.settings[buttonID].items[0].ignoreClickEvent = true;
			},
			stop : function (evt, ui) {
				var buttonID = ui.item[0].children[0].id.replace(/__item__0/,'');
				//fwa.ajcc.settings[buttonID].items[0].statePrevious = 'normal';
				fwa.ajcc.settings[buttonID].items[0].ignoreClickEvent = false;
			}
		});
		$('#playlist').droppable ({
			drop : function (evt, ui) {
				var pl = $('#playlist')[0];
				var dragged = ui.draggable[0];
				var pc = mp3site.playlistCount++;
				setTimeout (function () {
					var oldDI = ui.helper[0].children[0].id;
					dragged.id = 'playlist_'+pc;
					dragged.className = 'mp3 animatedJavascriptButton animatedTheme__lava_002';

					var listItemID = ui.helper[0].children[0].children[0].id.replace('__item__0','');
					if (listItemID=='') listItemID = ui.helper[0].children[0].id.replace('__item__0','');
					var listItem = fwa.ajcc.settings[listItemID].items[0];
//						listItem.url = listItem.url.replace (new RegExp(oldDI), dragged.id);
					var sc = listItem.stateCurrent;
					if (listItem.stateCurrent!='selected') listItem.stateCurrent = 'normal';
					listItem.statePrevious = 'normal';

					fwa.ajcc.init (dragged);
					var playlistItem = fwa.ajcc.settings[dragged.id].items[0];
					playlistItem.url = playlistItem.url.replace (/\('.*?'/, "('"+dragged.id+"'");
					playlistItem.stateCurrent = sc;
					
					var pl = $('#playlist')[0];
					for (var i=0; i<pl.children.length; i++) {
						//console.log (pl.children[i].id + ' - ' +fwa.ajcc.settings[pl.children[i].id].items[0].stateCurrent);
						if (fwa.ajcc.settings[pl.children[i].id].items[0].stateCurrent=='selected') mp3site.settings.playingIndex = i;
					};
					//debugger;
					
					fwa.ajss.containerSizeChanged($('#playlist_wrapper__scrollpane')[0]);

					if (mp3site.settings.stopped) mp3site.selectMP3 (dragged.id, $(dragged).attr('file'), false);
				}, 1000);
				
			}
		});
	},
	playlistCount : 0,

	onWindowResize : function () {
		var myWidth = $(window).width();
		var myHeight = $(window).height();
	 
		$('#siteBackground, #siteBackground_img').css({
			height : myHeight,
			width : myWidth
		});
		
		if ($('#mp3s__container').length>0) var dialogMP3sList = '#mp3s__container'; else var dialogMP3sList = '#mp3s';
		if ($('#infoWindow_mp3desc__dialog').length>0) var dialogMP3desc = '#infoWindow_mp3desc__dialog'; else var dialogMP3desc = '#infoWindow_mp3desc';
		if ($('#playlist_wrapper__dialog').length>0) var dialogPlaylist = '#playlist_wrapper__dialog'; else var dialogPlaylist = '#playlist_wrapper';
		if ($('#player__dialog').length>0) var dialogPlayer = '#player__dialog'; else var dialogPlayer = '#player';
		if ($('#infoWindow_comments__dialog').length>0) var dialogComments = '#infoWindow_comments__dialog'; else var dialogComments = '#infoWindow_comments';
		var $dialogHeading = $('#heading_wrapper');
		var $dialogMP3sList = $(dialogMP3sList);
		var $dialogMP3desc = $(dialogMP3desc);
		var $dialogPlaylist = $(dialogPlaylist);
		var $dialogPlayer = $(dialogPlayer);
		var $dialogComments = $(dialogComments);
		
		var centerDialogsWidth = $(dialogMP3sList).width() + $dialogPlaylist.width() + $dialogComments.width();
		var dialogsLeft = Math.round ((myWidth-centerDialogsWidth)/2);
		var dialogsTop = $dialogHeading[0].offsetTop + $dialogHeading.height() + 10;
		var dialogsHeight = (myHeight - dialogsTop - 10);
		
		$dialogMP3sList.css ({
			left : dialogsLeft + 'px',
			height : dialogsHeight + 'px',
			top : dialogsTop + 'px'
		});
		if ($('#mp3s__container').length>0) fwa.ajss.containerSizeChanged($('#mp3s')[0]);

		var playerLeft = ($dialogMP3sList[0].offsetLeft + $dialogMP3sList.width() + 10);
		$dialogPlayer.css ({
			left : playerLeft + 'px',
			top : dialogsTop + 'px'
		});
		
		$dialogMP3desc.css ({
			left : playerLeft + 'px',
			height : Math.round( (dialogsHeight - $dialogPlayer.height() - 20) / 2 ) + 'px',
			top : ($dialogPlayer[0].offsetTop + $dialogPlayer.height() + 10) + 'px'
		});
		if ($('#mp3desc__container').length>0) {
			$('#mp3desc__container').css ({
				height : ( $('#infoWindow_mp3desc').height() - 20 -  (2 * ($('#mp3desc__container')[0].style.paddingTop.replace('px','')))) + 'px'
			});
			fwa.ajss.containerSizeChanged($('#infoWindow_mp3desc__scrollpane')[0]);
		};
		fwa.ajss.containerSizeChanged($('#infoWindow_mp3desc__scrollpane')[0]);

		$dialogPlaylist.css ({
			left : playerLeft + 'px',
			height : Math.round( (dialogsHeight - $dialogPlayer.height() - 20) / 2 ) + 'px',
			top : ($dialogMP3desc[0].offsetTop + $dialogMP3desc.height() + 10) + 'px'
		});
		if ($('#playlist_scroller__container').length>0) fwa.ajss.containerSizeChanged($('#playlist_wrapper__scrollpane')[0]);
		$('#playlist_inner, #playlist').css ({
			height : ($('#playlist_scroller').height()) + 'px'
		});

		$dialogComments.css ({
			left : (playerLeft + $dialogPlaylist.width() + 10) + 'px',
			height : (dialogsHeight) + 'px',
			top : dialogsTop + 'px'
		});
		$('#comments').css ({
			width : $('#infoWindow_comments').width()-30
		});
		var $cc = $('#comments__container');
		if ($cc.length>0) {
			var $ce = $('#comment_editor');
			$('#comments__container').css ({
				height : ( $('#infoWindow_comments').height() - 26 - ($ce.css('display')==='none'? 0 : $ce.height()) - $('#newCommentShowEditor').height()  ) + 'px'
			});
			//console.log ('t1: '+$('#comments__container').height());
			fwa.ajss.containerSizeChanged($('#comments')[0]);
		};
	}
};

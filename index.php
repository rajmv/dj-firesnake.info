<?php
//define ('FWA_SHOW_CONSTANTS', true); //un-comment this to only show the define()s that my FancyWebApps framework exposes
require_once ('fancywebapps/sitewide/boot.php');
require_once ('fancywebapps/com/comments/fwaComments-1.0.0.php');

lah_resetSessionLog();
//fwaServiceLog_makeLogEntry_php();

define ("FILE_FORMATS", "/(.*\.mp3$)/");
$files = getFilePathList (FWA_APP_HD.'/mixes/', true, FILE_FORMATS, array('file'));

$authorEmail = 'rene7705@gmail.com';
$spacer = "\n\t\t\t\t";
$htmlIntro = 
	'<h1>DJ FireSnake\'s mixes</h1>'.$spacer
	.'<p>'.$spacer
	.'Latest mix : Goa Gregorian 3, added on August 28, 2012, 21:14 <a href="http://en.wikipedia.org/wiki/Central_European_Time" target="_blank">CEST</a>.<br/>'.$spacer
	.'Total mixes : 32.<br/>'.$spacer
	.'Total duration : 38h 40m 03s.<br/>'.$spacer
	.'Code or layout last modified :  August 30, 2012, 08:53 <a href="http://en.wikipedia.org/wiki/Central_European_Time" target="_blank">CEST</a>.<br/>'.$spacer
	.'</p>'.$spacer
	.'<p>'.$spacer
	.'To start the music, click on any of the mix titles in the list on the left.'.$spacer
	.'</p>'.$spacer
	.'<p>'.$spacer
	.'You can re-order the playlist with drag and drop.<br/>'.$spacer
	.'You can also drag from the list on the left, and drop into the playlist at any spot.<br/>'.$spacer
	.'To empty the playlist, please refresh this page (F5).<br/>'.$spacer
	.'</p>'.$spacer
	.'<p>'.$spacer
	.'The code for this site is fairly easy to understand, and completely opensourced by myself and some 3rd parties.<br/>'.$spacer
	.'I do this as thanks for the many opensource tools and music tracks I used to create this page.<br/>'.$spacer
	.'See these sources; <a href="'.FWA_APP_SUBDIR.'/viewSource.php?file=index.php" target="_new">index.php</a>, '.$spacer
	.'<a href="'.FWA_APP_SUBDIR.'/mp3site.source.js" target="_new">mp3site.source.js</a>, '.$spacer
	.'<a href="'.FWA_APP_SUBDIR.'/index.css" target="_new">index.css</a>, '.$spacer
	.'<a href="'.FWA_APP_SUBDIR.'/viewSource.php?file=download_mp3.php" target="_new">download_mp3.php</a>.<br/>'.$spacer
	.'</p>'.$spacer
	.'<p>Copyright Disclaimer Under Section 107 of the Copyright Act 1976, allowance is made for "fair use" for purposes such as criticism, comment, news reporting, teaching, scholarship, and research. Fair use is a use permitted by copyright statute that might otherwise be infringing. <span style="color:lime">Non-profit</span>, educational or personal use tips the balance in favor of fair use.</p>'.$spacer
	.'</p>'.$spacer
	.'<p>'.$spacer
	.'<a href="'.FWA_APP_SUBDIR.'/ad_003_600dpi.png">Promotional sticker</a> (<a href="'.FWA_APP_SUBDIR.'/ad_003_600dpi-a4.png">10pcs on A4/letter size</a>)'.$spacer
	.'</p>'.$spacer
	.'<p>'.$spacer
	.'<a href="'.FWA_APP_SUBDIR.'/index.old.php">Older, simpler code and layout</a>.<br/>'.$spacer
	.'</p>'."\n";

?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
<head>
	<title>DJ FireSnake's mixes</title>
	<!--
			This page's code is completely opensourced, by myself (Rene) and several 3rd parties, as thanks for the many free opensource tools and music tracks I use.
			Feel free to rip it for yourself, commercially or not.
			
			The javascript framework that this site is built on can be downloaded via http://fancywebapps.com

			See also:
				/viewSource.php?file=index.php
				/mp3site.source.js
				/index.css
				/viewSource.php?file=download_mp3.php
	-->
	<meta name="keywords" content="free, music, free music, mixes, free mixes, mixtape, mixtapes, free mixtape, free mixtapes, DJ, house, goa, rap, hardrock, rock, pop"/>
	<meta name="description" content="The free music mixtapes by DJ FireSnake"/>
	<meta name="robots" content="all">
	<meta name="copyright" content="Rene AJM Veerman, Netherlands">
	<meta name="author" content="Rene AJM Veerman, Netherlands">
	<meta name="DJ" content="Rene AJM 'DJ FireSnake' Veerman, Netherlands">
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta http-equiv="content-language" content="en">
	<meta http-equiv="content-language" content="english">
	<link type="text/css" rel="StyleSheet" media="screen" href="<?php echo FWA_APP_SUBDIR?>/index.css"/>
	<link rel="shortcut icon" href="<?php echo FWA_APP_SUBDIR?>/favicon.ico"/>
	<script type="text/javascript" src="<?php echo FWA_WEB?>/get_javascript.php?want=all"></script> <!-- jQuery + FancyWebApps frameworks; available for download soon at http://fancywebapps.com/ -->
	<script type="text/javascript" src="<?php echo FWA_WEB?>/lib/tinymce-3.5b3/jscripts/tiny_mce/tiny_mce.js"></script> <!-- tinyMCE rich text editor - originally from http://www.tinymce.com/ -->
	<script type="text/javascript" src="<?php echo FWA_WEB?>/lib/jquery-ui-1.10.0.custom/js/jquery-ui-1.10.0.custom.min.js"></script> <!-- jQuery UI (drag and drop functionality); originally from http://jqueryui.com/ -->
	<script type="text/javascript" src="<?php echo FWA_WEB?>/lib/jquery.history/jquery.history.js"></script> 
	<script type="text/javascript" src="<?php echo FWA_WEB?>/lib/jQuery.jPlayer.2.2.0/jquery.jplayer.min.js"></script> <!-- Music-file playback code; originally from http://jplayer.org/ -->
	<link type="text/css" rel="StyleSheet" media="screen" href="<?php echo FWA_WEB?>/lib/jQuery.jPlayer.2.2.0/jplayer.animatedJavascript.css"/>
	<script type="text/javascript" src="<?php echo FWA_APP_SUBDIR?>/mp3site.source.js"></script> <!-- The opensourced application code for this website that may be used commercially without cost-->
	<?php echo_googleAnalyticsTrackingCode (thisSiteGoogleAnalyticsTrackingID());?>
</head>
<body style="overflow:hidden" onload="mp3site.startApp();">
	<div id="siteLoadingMsg" style="position:absolute; width:100%;text-align:center;">
		<span id="javascriptEnabledTest" style="color:red">This free music mixtapes website requires javascript enabled in your browser.</span>
	</div>
	<!-- <?php //un-comment this section to show your visitors exactly what happens during startup of this website, but might be too distracting for most; ?>
	<div id="siteBootLog" style="position:absolute;width:100%;">
		<img src="<?php echo FWA_WEB?>/com/animatedJavascriptThemes/mask_fadeToWhite_top.png" style="position:absolute;width:100%;z-index:10;"/>
		<div id="consoleMsg" style="position:absolute;width:100%;text-align:left;top:20px;height:300px; overflow:auto;z-index:9;"></div>
		<img src="<?php echo FWA_WEB?>/com/animatedJavascriptThemes/mask_fadeToWhite_bottom.png" style="position:absolute;width:100%;top:280px;z-index:10;"/>
	</div>
	-->
	<script type="text/javascript">
		$('#javascriptEnabledTest').css({color:'green'}).html ('You have javascript enabled, this free music mixtapes site will show soon<br/>(after loading a few megabytes worth of artwork).');
		fwa.settings.logLevel = 2; //increase to 3 to see all debug information in your console log or in #siteBootLog to your visitors

		// position on the screen the boot-up message and possibly the #siteBootLog as well:
		var $slm = $('#siteLoadingMsg');
		$slm.css({
			top : (($(window).height() - $slm.height())/6) + 'px',
			left : (($(window).width() - $slm.width())/2) + 'px'
		});
		var $sbl = $('#siteBootLog');
		var $cm = $('#consoleMsg');
		$sbl.css({
			top : (($(window).height() - $cm.height())/2) + 'px',
			left : (($(window).width() - $cm.width())/2) + 'px'
		});

		// show spinning icon while artwork loads and site initializes:
		var loaderIconTheme = {
			centerGapRadius: 30,
			stripes: [
				fwa.globals.urls.os + '/com/animatedJavascriptThemes/spinner/transGreenOuter/stripe_1.png', 
				fwa.globals.urls.os + '/com/animatedJavascriptThemes/spinner/transGreenOuter/stripe_2.png', 
				fwa.globals.urls.os + '/com/animatedJavascriptThemes/spinner/transGreenOuter/stripe_3.png',
			]
		};
		mp3site.settings.loaderIcon = fwa.acs.addIcon(
			true, //whether or not to absolutely position
			document.body, //parent element to stick icon to (will be positioned in the middle of the parent element)
			180, 180, //width and height in pixels
			loaderIconTheme, //see var theme above
			true //start running immediately
		);
		
		// the rest of the site initialization code will start to initalize in window.onload by calling mp3site.source.js::mp3site.startApp()
	</script>

	<div id="siteBackground" style="position:absolute; z-index:-1">
		<img id="siteBackground_img" src="<?php echo FWA_APP_SUBDIR?>/images/blue/blue-dragon-black-fire-wallpaper-modified.jpg" style="z-index:-1; display:none;">
	</div>

	<div id="heading_wrapper" style="visibility:hidden">
		<table id="heading_table" border="0" width="100%" cellpadding="5" cellspacing="5">
			<tr>
				<td valign="top" style="text-align:right; width:350px;">
					<div id="siteLogo" class="animatedJavascriptButton animatedTheme__siteLogo_djFireSnake_001" title="Clear out playlist and reload this page" style="position:absolute;"><a href="<?php echo (FWA_APP_SUBDIR==''?'/':FWA_APP_SUBDIR)?>"> </a></div>
				</td>
				<td> </td>
				<td style="width:120px;">
					<div id="siteMenu" class="animatedJavascriptDialog ajsd_relative animatedTheme__dialog_005 animatedScrollpane__hidden" style="overflow:visible;position:relative; width:110px;height:60px;">
						<table style="z-index:1000;">
							<tr>
								<td style="width:50px;">
									<div id="menu_info" class="animatedJavascriptButton animatedTheme__question_001" style="position:absolute;"><a href="javascript:mp3site.toggleView('menu_info', 'infoWindow_info');"> </a></div>
								</td>
								<td>
									<div id="menu_tools" class="animatedJavascriptButton animatedTheme__tools_001" style="position:absolute;"><a href="javascript:mp3site.toggleView('menu_tools', 'infoWindow_tools');"> </a></div>
								</td>
							</tr>
						</table>
					</div>
				</td>
			</tr>
		</table>
	</div>
	
	<div id="infoWindow_info" class="animatedJavascriptDialog animatedTheme__dialog_005 animatedScrollpane__hidden" style="overflow:visible; visibility:hidden; position:absolute; visibility:hidden; width:450px; height:600px; z-index:10000;">
		<div id="infoWindow_info_content" style="padding:5px;z-index:10;">
			<?php echo $htmlIntro?>
		</div>
	</div>

	<div id="infoWindow_tools" class="animatedJavascriptDialog animatedTheme__dialog_005 animatedScrollpane__hidden" style="overflow:visible; visibility:hidden; position:absolute; visibility:hidden; width:350px; height:480px;margin : 5px; z-index:11000;">
		<div id="infoWindow_tools_content" style="padding:5px; display:none;">
			<script type="text/javascript">
			  (function() {
			    var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
			    po.src = 'https://apis.google.com/js/plusone.js';
			    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
			  })();
			</script>
			<table>
				<tr>
				<td>
					<g:plusone annotation="inline" width="200"></g:plusone><br/><br/>
				</td>
				<td>	
					<a href="https://twitter.com/share" class="twitter-share-button" data-count="vertical" data-via="DJFireSnake">Tweet</a><script type="text/javascript" src="http://platform.twitter.com/widgets.js"></script>
				</td>
				</tr>
			</table>
			
			<iframe src="http://www.facebook.com/plugins/likebox.php?href=http%3A%2F%2Fwww.facebook.com%2Fpages%2FDJ-FireSnake%2F117316308362040&amp;width=292&amp;colorscheme=dark&amp;show_faces=true&amp;border_color&amp;stream=false&amp;header=true&amp;height=290" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:292px; height:290px;" allowTransparency="true"></iframe>
		
			<br/>
			<br/>
			<a href="<?php echo FWA_APP_SUBDIR?>/ad_003_600dpi.png">Promotional sticker</a> (<a href="<?php echo FWA_APP_SUBDIR?>/ad_003_600dpi-a4.png">10pcs on A4/letter size</a>)<br/>
			<br/>
 			<a href="mailto:<?php echo $authorEmail?>">E-mail DJ FireSnake</a>.<br/>
		</div>
	</div>

	<div id="mp3s" class="animatedJavascriptScrollpane animatedOptions__noXbar animatedTheme__scroll_black_left" style="visibility:hidden;position:absolute;text-align:center;width:230px; color:yellow;font-weight:bold">
<?php
			$filez = array();
			foreach ($files as $idx=>$file) {
				$fn = basename($file);
				$filez[$idx] = str_replace (' - DJ FireSnake.mp3', '', $fn);
			}
			asort ($filez);
			foreach ($filez as $idx=>$fn) {
				$id = 'mp3_'.$idx;
				echo "\t\t".'<div id="'.$id.'" file="'.basename($files[$idx]).'" class="mp3 animatedJavascriptButton animatedTheme__lava_002" style="padding:2px;"><a href="javascript:mp3site.queueMP3(\''.$id.'\', \''.basename($files[$idx]).'\');">'.$fn.'</a></div>'."\n";
			}
?> 
	</div>
		
	<div id="player" class="animatedJavascriptDialog animatedTheme__dialog_firesnake_002 animatedScrollpane__hidden" style="overflow:visible; visibility:hidden;position:absolute; width:300px; height:110px; ">
		<table id="player_table" style="width:100%; visibility:hidden;">
			<tr>
				<td>
					<div id="jplayer" class="jp-jplayer"></div>
					<div id="jp_container_1" class="jp-audio">
						<div class="jp-type-single">
							<div id="jp_interface_1" class="jp-gui jp-interface">
								<table border="0" class="jp-controls" cellspacing="5" style="width:100%">
									<tr>
										<td class="jp-button"><div id="btn_playpause" title="Toggle play / pause" class="animatedJavascriptButton animatedTheme__playpause_001"><a href="javascript:mp3site.playpause();" class="jp-play" tabindex="1"></a></div></td>
										<td class="jp-button"><div id="btn_stop" title="Stop" class="animatedJavascriptButton animatedTheme__stop_001"><a href="javascript:mp3site.stop();" class="jp-pause" tabindex="2"></a></div></td>
										<td class="jp-button"><div id="btn_mute" title="Mute / un-mute"class="animatedJavascriptButton animatedTheme__mute_001"><a href="javascript:mp3site.mute();" class="jp-pause" tabindex="3"></a></div></td>
										<td class="jp-button"><div id="btn_repeat" title="Toggle repeating of playlist" class="animatedJavascriptButton animatedTheme__repeat_001"><a href="javascript:mp3site.toggleRepeat();" tabindex="4"></a></div></td>
									</tr>
									<tr>
										<td style="vertical-align:top;">
											<div class="jp-volume-bar" title="Volume">
												<div class="jp-volume-bar-value"></div>
											</div>
										</td>
										<td colspan="3" style="vertical-align:top;">
											<div class="jp-progress" title="Position in track">
												<div class="jp-seek-bar">
													<div class="jp-play-bar"></div>
												</div>
											</div>
											<div class="jp-time-holder">
												<div class="jp-current-time"></div>
												<div class="jp-duration"></div>
											</div>
										</td>
									</tr>
								</table>
							</div>
						</div>
					</div>
				</td>
			</tr>
		</table>
	</div>

	<div id="playlist_wrapper" class="animatedJavascriptDialog animatedTheme__dialog_005" style="overflow:visible; visibility:hidden; position:absolute; width:300px;height:300px;">
		<ul id="playlist" style="padding-left:30px;width:100%;"></ul>
	</div>
	
	<div id="infoWindow_mp3desc" class="animatedJavascriptDialog animatedTheme__dialog_005" style="overflow:visible; visibility:hidden; position:absolute;width:300px;height:300px;">
		<div id="mp3descText"></div>
		<div id="siteIntroText" style="visibility:hidden;">
			<?php echo $htmlIntro?>
		</div>
	</div>
	
	<div id="infoWindow_comments" class="animatedJavascriptDialog animatedTheme__dialog_005 animatedScrollpane__hidden" style="overflow:visible; visibility:hidden;position:absolute;width:400px;height:300px;">
		<table id="comments_table" style="width:100%;height:100%;">
			<tr>
				<td style="vertical-align:top">	
					<div id="comments" class="animatedJavascriptScrollpane animatedTheme__scroll_black" style="margin:10px;visibility:hidden; width:100%;height:100%;">
					<?php
						fwaComments_echoSubscription ('all');
					?>
					</div>
				</td>
			</tr><tr>
				<td id="newCommentShowEditor_td" colspan="2" style="height:40px;padding-left:80px;">
					<div id="newCommentShowEditor" class="animatedJavascriptButton animatedTheme__menu_001"><a href="javascript:mp3site.showCommentsEditor();">Enter New Comment</a></div>
				</td>
			</tr><tr>
				<td style="height:1px;">
					<div id="comment_editor" style="display:none">
						<form>
							<table style="width:300px;padding-left:10px;">
								<tr>
									<td colspan="2">
										<span style="font-size:9px; color:red;background:white;">
										Comments can only be removed by the IP address they were posted from..
										</span>
									</td>
								</tr>
								<tr>
									<td>From : </td>
									<td><input id="newCommentFrom" name="newCommentFrom" style="width:100%;"/></td>
								</tr>
								<tr><td colspan="2">
									<textarea id="newComment" name="newComment" style="width:300px; height:300px;"> </textarea>
								</td></tr>
							</table>
							<table>
								<tr><td style="width:20px">&nbsp;</td><td>
									<div id="newCommentSubmit" class="animatedJavascriptButton animatedTheme__menu_002"><a href="javascript:mp3site.enterNewComment();">Make Comment</a></div>
								</td><td>
									<div id="cancelCommentSubmit" class="animatedJavascriptButton animatedTheme__menu_002"><a href="javascript:mp3site.hideCommentsEditor();">Cancel</a></div>
								</td></tr>
							</table>
						</form>
					</div>
				</td>
			</tr>
		</table>
	</div>
</body>
</html>
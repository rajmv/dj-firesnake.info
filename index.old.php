<?php
error_reporting (E_ALL);
require_once ('fancywebapps/sitewide/boot.php');

define ("FILE_FORMATS", "/(.*\.mp3$)/");
$files = getFilePathList (FWA_APP_HD.'/mixes/', true, FILE_FORMATS, array('file'));
sort ($files);

$xml = 
	'<?xml version="1.0" encoding="UTF-8"?>' .
	'<xml>';
	
$htmlDownloads = '<br/><br/>Download MP3 file links :<br/>';
	
foreach ($files as $idx=>$filepath) {
	$fp = str_replace ('/mixes/', '', $filepath);
	$mp3Path = str_replace (FWA_APP_HD, FWA_APP_WEB, $filepath);
	$title = str_replace (FWA_APP_HD, '', $fp);
	$mp3Path = substr(str_replace (FWA_APP_HD, '', $filepath), 1);
	$mp3Path2 = str_replace (FWA_APP_HD.'/mixes/', '', $filepath);
	$title = str_replace (' - DJ FireSnake.mp3', '', $title);
	$xml.= '<track><path>'.$mp3Path.'</path><title>'.$title.'</title></track>';
	$htmlDownloads.='<a href="'.FWA_APP_WEB.'/download_mp3.php?file='.$mp3Path2.'">'.$title.'</a> ('.filesizeHumanReadable(filesize($filepath)).')<br/>';
}
$xml.='</xml>';

$f = fopen (FWA_APP_HD.'/playlist.xml', 'w');
fwrite ($f, $xml);
fclose ($f);
?>
<html>
<head>
	<title>DJ FireSnake's mixes (simple interface)</title>
	<script type="text/javascript" src="swfobject.js"></script>
	<?php echo_googleAnalyticsTrackingCode (thisSiteGoogleAnalyticsTrackingID());?>
</head>
<body>
<table cellpadding="0" cellspacing="5" border="0" style="width:100%; margin:15px;">
	<tr>
		<td style="text-align:right"> </td>
		<td>
			<table>
				<tr>
					<td style="vertical-align:middle"><h1>DJ FireSnake's mixes (simple interface)</h1></td>
					<td style="vertical-align:middle"><img src="images/avatar.gif"></td>
				</tr>
			</table>
			<p style="font-size:85%">
			Non-profit, claiming fair use rights.<br/>
			<br/>
			Content last modified : 2012 April 8, 14:00 CEST.<br/>
			Code / Layout last modified : 2012 April 8, 14:00 CEST.<br/>
			<a href="index.php">New layout</a>.<br/>
			<br/>
			<a href="mailto:djfiresnake@gmail.com">E-mail DJ FireSnake</a>.<br/>
			</p>
			
		</td>
		<td style="">		<iframe src="http://www.facebook.com/plugins/likebox.php?href=http%3A%2F%2Fwww.facebook.com%2Fpages%2FDJ-FireSnake%2F117316308362040&amp;width=200&amp;colorscheme=light&amp;show_faces=true&amp;border_color&amp;stream=false&amp;header=false&amp;height=200" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:200px; height:200px;" allowTransparency="true"></iframe>
 </td>
		<td style=""> </td>
		<td style=""> </td>
		<td style=""> </td>
	</tr>
	<tr style="height:25px">
		<td colspan="3"> </td>
	</tr>
	<tr>
		<td style="text-align:right"> </td>
		<td>
		</td>
		<td style=""> </td>
	</tr>
	<tr>
		<td style="text-align:center;vertical-align:middle;">
		<img src="images/avatar2.jpg" style="border:3px groove black"/>
		</td>
		<td style="width:460px; text-align:center; ">
		
			<b>MP3 Player:</b>
			<div id="flashPlayer" style="border:3px groove black">
			  Loading MP3 Player.
			</div>
			<script type="text/javascript">
			   var so = new SWFObject("playerMultipleList.swf", "mymovie", "450", "345", "7", "#FFFFFF");  
			   so.addVariable("autoPlay","no")
			   so.addVariable("playlistPath","playlist.xml")
			   so.write("flashPlayer");
			</script>
		</td>
		<td style="text-align:center;vertical-align:middle">
			<img src="images/avatar.jpg" style="border:3px groove black"/><br/>
		</td>
	</tr>
	<tr>
		<td colspan="3" style="padding-left:180px">
			<?php echo $htmlDownloads ?>
			<br/>
			<br/>
		</td>
	</tr>
</table>
</body>
</html>
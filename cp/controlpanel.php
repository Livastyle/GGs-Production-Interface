<?php
defined("MAIN") or die();

$content = "";
$pages = scandir ( "./pages");
unset($pages[0],$pages[1]);
foreach($pages as $page){
	$pageArr = explode('.', $page);
	$name = $pageArr[0];
	$cont = file_get_contents("./pages/".$name.".html");
	$content .= '<div id="content-'.$name.'" class="contentpage">'."\n".$cont."\n".'</div>'."\n";
}
?>

<!doctype html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<script type="text/javascript">
		<!--
		var serverip = '<?=$_SERVER['SERVER_ADDR'];?>';
		//-->
		</script>
		<script type="text/javascript" src="js/jquery-3.1.1.min.js"></script>
		<script type="text/javascript" src="js/id3.js"></script>
		<script type="text/javascript" src="js/controlpanel.js"></script>
		<script type="text/javascript" src="js/hotkeys.js"></script>
		<script type="text/javascript" src="js/events.js"></script>
		<link rel="stylesheet" type="text/css" href="controlpanel.css" />
	</head>
	<body>
		<div id="main">
			<div id="topbar">
				<div id="update-area" class="unselectable">
					<button id="update-btn" class="green" onclick="update();">Update</button>
					<div id="autoupdate-checkbox" onclick="toggleAutoUpdate();">
						<div class="box"></div>
						<div class="text">Autoupdate</div>
					</div>
				</div>
				<div id="quick-sb-control">
					<button class="score" id="qsb-score1" onclick="quickSBScorePlus(1,this.innerHTML);">0</button>
					<div class="team" id="qsb-team1">
						<div class="player" id="qsb-player1"></div>
						<div class="player" id="qsb-player12"></div>
					</div>
					<div class="team" id="qsb-team2">
						<div class="player" id="qsb-player2"></div>
						<div class="player" id="qsb-player22"></div>
					</div>
					<button class="score" id="qsb-score2" onclick="quickSBScorePlus(2,this.innerHTML);">0</button>
				</div>
			</div>
			<div id="sidebar" class="unselectable">
				<div id="topleft-logo">
					<img src="img/ggs_logo_100.png" alt="" />
					<div class="text">
						<div>GeekyGoonSquad</div>
						<div>Production Control Panel</div>
					</div>
				</div>
				<div id="nav-menu">
					<div class="item" id="nav-menu-btn-scoreboard" onclick="showContent('scoreboard');">Scoreboard</div>
					<div class="item" id="nav-menu-btn-lowerthirds" onclick="showContent('lowerthirds');">Lower thirds</div>
					<div class="item" id="nav-menu-btn-player">
						<div class="label" onclick="showContent('player');">Player Database</div>
						<div class="opt">
							<button onclick="openPlayerSidePanel(0);">+</button>
						</div>
					</div>
					<div class="item" id="nav-menu-btn-casino" onclick="showContent('casino');">Casino</div>
					<div class="item" id="nav-menu-btn-thumnails" onclick="showContent('thumnails');">Thumbnails</div>
					<div class="item" id="nav-menu-btn-games" onclick="showContent('games');">Games</div>
					<div class="item" id="nav-menu-btn-teams" onclick="showContent('teams');">
						<div class="label" onclick="showContent('teams');">Teams</div>
						<div class="opt">
							<button onclick="showTeamsEditPanel(0);">+</button>
						</div>
					</div>
					<div class="item" id="nav-menu-btn-smashgg" onclick="showContent('smashgg');">Smash.gg</div>
					<div class="item" id="nav-menu-btn-music" onclick="showContent('music');">Music player</div>
					<div class="item" id="nav-menu-btn-youtube" onclick="showContent('youtube');">
						<div class="label" onclick="showContent('youtube');">YouTube</div>
						<div class="opt">
							<button onclick="" class="notify" id="nav-menu-youtube-notifiy">0</button>
						</div>
					</div>
					<div class="item" id="nav-menu-btn-themes" onclick="showContent('themes');">Themes</div>
					<div class="item" id="nav-menu-btn-displays" onclick="showContent('displays');">Displays</div>
					<div class="item" id="nav-menu-btn-schedule" onclick="showContent('schedule');">Schedule</div>
					<div class="item" id="nav-menu-btn-credits" onclick="showContent('credits');">Credits</div>
				</div>
				
				<div id="sidebar-smashgg-queue"></div>
				
				<div id="sidebar-settings">
					<select id="gameselect" class="global_gamelist" onchange="changeGame(this.value);"></select>
					<select id="playstyleselect" onchange="changePlaystyle(this.value);">
						<option value="singles">Singles</option>
						<option value="doubles">Doubles</option>
						<option value="crews">Crews</option>
						<option value="ironman">Iron Man</option>
					</select>
					<select id="themeselect" class="global_themelist" onchange="changeTheme(this.value);"></select>
				</div>
				<div id="sidebar-musicplayer">
					<div class="title"></div>
					<button onclick="mpPrev();" ><img src="img/mp-prev.png" alt="" /></button>
					<button onclick="mpPlay();" ><img src="img/mp-play.png" alt="" /></button>
					<button onclick="mpPause();" ><img src="img/mp-pause.png" alt="" /></button>
					<button onclick="mpNext();" ><img src="img/mp-next.png" alt="" /></button>
				</div>
			</div>
			<div id="content">
				<?=$content;?>
				<div id="clock" style="">21:22</div>
			</div>
			<div id="sideedit">
				<div class="title">Create new player</div>
				<input type="hidden" disabled id="se-userid" value="0" />
				<span class="label">Nickname</span>
				<input type="text" disabled id="se-nickname" value="" />
				<span class="label">Smash.gg</span>
				<div>
					<input type="text" disabled id="se-smashgg-id" class="non-enable" style="width:65px;text-align:center;display:inline-block;" value="" placeholder="" />
					<button style="margin:0;padding:2px 5px;" onclick="openPlayerSmashggAssignPanel('se-smashgg-id', $('#se-nickname').val());">Assign</button>
					<button style="margin:0;padding:2px 5px;" onclick="$('#se-smashgg-id').val('');">Clear</button>
				</div>
				<span class="label">Country</span>
				<select id="se-country" disabled class="global_countrylist"></select>
				<span class="label">Team</span>
				<select id="se-team" disabled class="global_teamlist" multiple></select>
				<span class="label">Display name</span>
				<input type="text" disabled id="se-displayname" value="" placeholder="Empty = Nickname" />
				<span class="label">Firstname</span>
				<input type="text" disabled id="se-firstname" value="" />
				<span class="label">Lastname</span>
				<input type="text" disabled id="se-lastname" value="" />
				<span class="label">Twitter</span>
				<input type="text" disabled id="se-twitter" value="" />
				<span class="label">Twitch</span>
				<input type="text" disabled id="se-twitch" value="" />
				<span class="label">Youtube</span>
				<input type="text" disabled id="se-youtube" value="" />
				<div class="options">
					<button disabled clasS="save" onclick="savePlayerSidePanel();">Save</button>
					<button disabled onclick="closePlayerSidePanel();">Cancel</button>
					<button disabled onclick="savePlayerSidePanel(true);">Create</button>
					<button disabled class="red" onclick="removePlayerSidePanel();">Remove</button>
				</div>
			</div>
		</div>
		<div id="modal-bg" onclick="hideModal();"></div>
		<div id="modal-cont"></div>
	</body>
</html>
<?php
include("./../config.php");
include("./../func/general.php");
$_THEME = getTheme();


?>
<!doctype html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<script type="text/javascript">
		<!--
		var serverip = '<?=$_SERVER['SERVER_ADDR'];?>';
		var themePath = '<?=$_THEME['path'];?>';
		//-->
		</script>
		<script type="text/javascript" src="js/jquery-3.1.1.min.js"></script>
		<script type="text/javascript" src="js/general.js"></script>
		<script type="text/javascript" src="js/smashggprofile.js"></script>
		<script type="text/javascript" src="<?=$_THEME['path'];?>/smashggprofile.js"></script>
		<link rel="stylesheet" type="text/css" href="css/main.css" />
		<link rel="stylesheet" type="text/css" href="<?=$_THEME['path'];?>/smashggprofile.css" />
	</head>
	<body style="width:<?=$_THEME['resolution'][0];?>px;height:<?=$_THEME['resolution'][1];?>px;">
		<?php themeLoad($_THEME['path']."/smashggprofile.html");?> 
	</body>
</html>
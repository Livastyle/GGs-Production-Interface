<?php
include("./../config.php");
include("./../func/general.php");
$_THEME = getTheme();

$sub = "";
if(isset($_GET['sub']) && strlen($_GET['sub']) > 0){
	$sub = "_".$_GET['sub'];
}
?>
<!doctype html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<script type="text/javascript">
		<!--
		var serverip = location.host;
		var themePath = '<?=(isset($_THEME['basepath']) ? $_THEME['basepath'] : $_THEME['path']);?>';
		//-->
		</script>
		<script type="text/javascript" src="js/jquery-3.1.1.min.js"></script>
		<script type="text/javascript" src="js/general.js"></script>
		<script type="text/javascript" src="js/lowerthird.js"></script>
		<?php if(!empty($_THEME['base'])){ ?>
		<script type="text/javascript" src="<?=$_THEME['basepath'];?>/lowerthird.js"></script>
		<link rel="stylesheet" type="text/css" href="<?=$_THEME['basepath'];?>/lowerthird.css" />
		<?php } ?>
		<script type="text/javascript" src="<?=$_THEME['path'];?>/lowerthird<?=$sub;?>.js"></script>
		<link rel="stylesheet" type="text/css" href="css/main.css" />
		<link rel="stylesheet" type="text/css" href="<?=$_THEME['path'];?>/lowerthird<?=$sub;?>.css" />
	</head>
	<body style="width:<?=$_THEME['resolution'][0];?>px;height:<?=$_THEME['resolution'][1];?>px;">
		<?php themeLoad($_THEME, "/lowerthird".$sub.".html");?> 
	</body>
</html>
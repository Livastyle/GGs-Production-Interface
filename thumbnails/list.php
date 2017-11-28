<?php
$del = false;
if(isset($_GET['del']) && $_GET['del'] == "all"){
	$del = true;
}
?>

<div>
	<a href="list.php?del=all">DELETE ALL</a>
</div>

<?php

$dir = "./";

// Sort in ascending order - this is default
$a = scandir($dir);

// Sort in descending order
$b = scandir($dir,1);


foreach($b as $img){
	if(substr($img,-3) == "png"){
		
		if($del){
			unlink("./".$img);
			if(file_Exists("./tn/".$img)){
				unlink("./tn/".$img);
			}
		}else{
		
			$file = $img;
			if(file_Exists("./tn/".$img)){
				$file = "./tn/".$file;
			}else{
				$file = "./tn.php?file=".$img;
			}
?>

<a href="./<?=$img;?>">
	<img src="<?=$file;?>" width="200" alt="" />
</a>

<?php	
		}
	}
}

if($del){
	header("Location: list.php");
}
?>
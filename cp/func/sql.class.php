<?php
defined("MAIN") or die();

class sql {
	private $link;
	
	function __construct($host, $username, $password, $database){
		$this->link = mysqli_connect($host, $username, $password, $database);
	}
	
	public function query($cmd){
		return mysqli_query($this->link, $cmd);
	}
	
	public function fetch($result){
		$row = mysqli_fetch_array($result, MYSQLI_ASSOC);
		if(gettype($row) == "array"){
			foreach($row as $key => $value){
				$row[$key] = utf8_encode($value);
			}
		}
		return $row;
	}
	
	public function num_rows($result){
		return mysqli_num_rows($result);
	}	
	public function last_id(){
		return mysqli_insert_id($this->link);
	}
	
	public function escape($str){
		return mysqli_real_escape_string($this->link, $str);
	}
	
	public function utf8decodeArray($arr){
		foreach($arr as $key => $val){
			if(is_array($val)){
				$arr[$key] = $this->utf8decodeArray($val);
			}else{
				$arr[$key] = utf8_decode($val);
			}
		}
		return $arr;
	}	
	public function utf8encodeArray($arr){
		foreach($arr as $key => $val){
			if(is_array($val)){
				$arr[$key] = $this->utf8encodeArray($val);
			}else{
				$arr[$key] = utf8_encode($val);
			}
		}
		return $arr;
	}
	
}

?>
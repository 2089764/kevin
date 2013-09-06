<?php
/**
*  @desc  处理xml数据成数组
*  @Author kevin
*  @time 2012 
*/
function getCdata($str) {
	$str = preg_replace ( "/[\\x00-\\x08\\x0b-\\x0c\\x0e-\\x1f]/", ' ', $str );
	return "<![CDATA[{$str}]]>";
}
// 处理XML转成数组
function objToArray($object) {
	$object = ( array ) $object;
	if (empty ( $object ))
		return "";
	foreach ( $object as $key => $value ) {
		if (is_object ( $value )) {
			$value = objToArray ( $value );
			$object [$key] = str_replace ( array ("\r\n", "\n", "\r" ), "", $value );
		}
		if (is_array ( $value )) {
			$value = objToArray ( $value );
			$object [$key] = str_replace ( array ("\r\n", "\n", "\r" ), "", $value );
		}
	}
	return str_replace ( array ("\r\n", "\n", "\r" ), "", $object );
}
function urlToArray($url) {
	$str = file_get_contents ( $url );
	$contents = simplexml_load_string ( $str, 'SimpleXMLElement', LIBXML_NOCDATA );
	$allGoods = objToArray ( $contents );
	return $allGoods;
} 

function calculate_compare($this, $that) {
	if ($that <= 0) {
		return '0';
	}
	$result = round ( (($this / $that) - 1) * 100, 1 ) . '%';
	if ($result < 0) {
		$color = '#008000';
	} else {
		$color = '#FF0000';
	}
	return '<font color = "' . $color . '">' . $result . '</font>';
} 
 
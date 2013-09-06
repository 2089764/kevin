<?php
/**
 * Created by JetBrains PhpStorm.
 * User: v_xiaolfang
 * Date: 13-4-11
 * Time: 上午11:22
 * To change this template use File | Settings | File Templates.
 */

/**
 * 记录日志
 * @param string $name 日志文件名
 * @param string $msg 日志内容
 * @return boolean
 */
function _log($name, $msg) {
    $filepath = APPPATH . 'logs/' . $name . '-' . date('Y-m-d') . '.php';
    $message = '';
    if (!file_exists($filepath)) {
        $message .= "<" . "?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed'); ?" . ">\n\n";
    }

    if (!$fp = @fopen($filepath, FOPEN_WRITE_CREATE)) {
        return FALSE;
    }

    $message .= date('Y-m-d H:i:s') . '-->    ' . $msg . "\n";

    flock($fp, LOCK_EX);
    fwrite($fp, $message);
    flock($fp, LOCK_UN);
    fclose($fp);

    @chmod($filepath, FILE_WRITE_MODE);
    return TRUE;
}

<?php

$permissionFileName = "BWScigli9keQ";

$request_body = file_get_contents('php://input');
$data = json_decode($request_body,true);

$thumbnail = $data[ "thumbnail" ];
$value = $data[ "value" ];
$pass = $data[ "pass" ];
$id = $data[ "id" ];

$permission = json_decode( file_get_contents("$permissionFileName.json"), true );
$permissionList = &$permission[ $pass ];


$worksList = json_decode( file_get_contents('worksList.json') );

function createShortHash($str1, $str2, $algo = 'CRC32') {
    return rtrim(strtr(base64_encode(hash("crc32b", time().$str1."+".$str2,true)), '+/', '-_'), '=');
}

function createFiles( $path, $imgText, $fileText ) {
  $imgData = str_replace(' ','+',$imgText);
  $imgData =  substr($imgData,strpos($imgData,",")+1);
  $imgData = base64_decode($imgData);
  file_put_contents( $path."/thumbnail.jpg", $imgData );
  file_put_contents( $path."/index.msx", $fileText );
  chmod( $path."/thumbnail.jpg", 0777 );
  chmod( $path."/index.msx", 0777 );
}

if ( in_array( $id, $permissionList ) ) { //上書き
  createFiles( $id, $thumbnail, $value );
} else if ( !empty( $permissionList ) ) { //作品追加
  $id = createShortHash( $thumbnail, $value );

  mkdir( $id );
  chmod( $id, 0777 );
  createFiles( $id, $thumbnail, $value );
  array_push( $permissionList, $id );
  array_unshift( $worksList, array( id => $id, time => time() ) );
} else { //新規作成
  $id = createShortHash( $thumbnail, $value );
  $pass = createShortHash( $value, $thumbnail );

  mkdir( $id );
  chmod( $id, 0777 );
  createFiles( $id, $thumbnail, $value );
  $permission[ $pass ] = array( $id );
  array_unshift( $worksList, array( id => $id, time => time() ) );
}

file_put_contents( "$permissionFileName.json", json_encode( $permission ) );
file_put_contents( "worksList.json", json_encode( $worksList ) );


echo json_encode( array( id => $id, pass => $pass ) );

?>

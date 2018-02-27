<?php

$cam = $_POST[ "cam" ];
$num = $_POST[ "num" ];
$path = "./video/$cam/$num.jpg";

if ( $num == 0 ) {
  $p = './video/'.$cam;
  $res_dir = opendir( $p );
  while( $file_name = readdir( $res_dir ) ){
    if(is_file($p.'/'.$file_name)) unlink($p.'/'.$file_name);
  }
}

move_uploaded_file($_FILES['img']['tmp_name'], $path );
chmod( $path, 0777 );

?>

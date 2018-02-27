<?php

$dir_n = count( glob( "./video/*/" ) );
$result = array();

for ($count = 0; $count < $dir_n; $count++) {
  array_push( $result, count( glob("./video/$count/*.jpg") ) );
}

echo json_encode( $result );


?>

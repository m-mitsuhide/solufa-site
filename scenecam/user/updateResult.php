<?php


$request_body = file_get_contents('php://input');
$data = json_decode($request_body,true);

$imgText = $data[ "result" ];

$imgData = str_replace(' ','+',$imgText);
$imgData =  substr($imgData,strpos($imgData,",")+1);
$imgData = base64_decode($imgData);

file_put_contents( "./result.jpg", $imgData );
chmod( "./result.jpg", 0777 );


echo json_encode( array( status => "success" ) );

?>

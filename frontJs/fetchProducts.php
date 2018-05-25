<?php
session_start();
header('Access-Control-Allow-Origin: *');
require '../vendor/autoload.php';
require '../app/conf.php';
require '../app/connection.php';
use Bigcommerce\Api\Client as Bigcommerce;
error_reporting(E_ALL); 
ini_set('display_errors', 1);

$productID = $_REQUEST['productID'];
$storeHash = $_REQUEST['storeHash'];

$access_token = ""; 
$sql = "SELECT * FROM Store WHERE storeHash='".$storeHash."'"; 
$result = mysqli_query ($conn, $sql);
while ($row = mysqli_fetch_assoc($result)) {  
	$access_token = $row['authToken'];
}
Bigcommerce::configure(array(
    'client_id' => BC_CLIENT_ID,
    'auth_token' => $access_token,
    'store_hash' => $storeHash
));

$ping = Bigcommerce::getTime();

if($ping) {
    // Create table query
    if(mysqli_query($conn,"DESCRIBE ProductData")) {
        $sql = "SELECT * FROM ProductData WHERE productID='".$productID."' AND storeHash='".$storeHash."' ";
        $result = mysqli_query($conn, $sql);
        if(mysqli_num_rows($result) > 0){
            while ($row = mysqli_fetch_assoc($result)) {
                echo json_encode($row);
            }
        } else {
            echo 'No ProductData';
        }
    } 
}

?>
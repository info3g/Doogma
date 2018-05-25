<?php
session_start();
require '../vendor/autoload.php';
require __DIR__.'/conf.php';
require __DIR__.'/connection.php';
use Bigcommerce\Api\Client as Bigcommerce;
// Required File END...........
error_reporting(E_ALL); 
ini_set('display_errors', 1);

$storeHash = $_REQUEST['storeHash'];

if(isset($_REQUEST['addDoogma'])){
    $addDoogma = $_REQUEST['addDoogma'];
} else {
    $addDoogma = 'no';
}
$doogmaCode = $_REQUEST['doogmaCode'];
$doogmaProductId = $_REQUEST['doogmaProductId'];
$productID = $_REQUEST['productID'];

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

// Create table query
if(mysqli_query($conn,"DESCRIBE ProductData")) {
    //echo 'Table already Exist';
} else {
	$sql = "CREATE TABLE ProductData(
	    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
	    productID VARCHAR(255) NOT NULL,
	    doogmaCode VARCHAR(255) NOT NULL,
	    doogmaProductId VARCHAR(255) NOT NULL,
	    addDoogma VARCHAR(255) NOT NULL,
	    storeHash VARCHAR(255) NOT NULL)";
	
	if(mysqli_query($conn, $sql)){
	    //echo "Table created successfully.";
	} else{
	    echo "ERROR: Could not able to execute $sql. " . mysqli_error($conn);
	}
}

if(isset($_REQUEST['mode'])) {
    $mode = $_REQUEST['mode'];    
}

if($mode == 'saveData') {
    $sql = "SELECT * FROM ProductData WHERE productID='".$productID."' AND storeHash='".$storeHash."' ";
    $result = mysqli_query($conn, $sql);
    if(mysqli_num_rows($result) > 0){
    	$sql = 'UPDATE ProductData SET doogmaCode="'.$doogmaCode.'", doogmaProductId="'.$doogmaProductId.'", addDoogma="'.$addDoogma.'" WHERE productID="'.$productID.'" AND storeHash="'.$storeHash.'" ';
    	mysqli_query($conn, $sql);
    } else {
    	$sql = "INSERT INTO ProductData (productID, doogmaCode, doogmaProductId, addDoogma, storeHash) VALUES ('".$productID."', '".$doogmaCode."', '".$doogmaProductId."', '".$addDoogma."', '".$storeHash."' )";
    	mysqli_query($conn, $sql);
    }
} else if($mode == 'getData') {
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
?>
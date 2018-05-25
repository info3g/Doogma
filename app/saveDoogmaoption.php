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

if(isset($_REQUEST['doogmaClass'])){
    $doogmaClass = $_REQUEST['doogmaClass'];
} else {
    $doogmaClass = ' ';
}
if(isset($_REQUEST['hidefieldClass'])){
    $hidefieldClass = $_REQUEST['hidefieldClass'];
} else {
    $hidefieldClass = 'no';
}
$optionID = $_REQUEST['optionID'];

if(isset($_REQUEST['productID'])) {
	$productID = $_REQUEST['productID'];
} else {
    $productID = '';
}

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
if(mysqli_query($conn,"DESCRIBE OptionData")) {
    //echo 'Table already Exist';
} else {
	$sql = "CREATE TABLE OptionData (
	    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
	    optionID VARCHAR(255) NOT NULL,
	    productID VARCHAR(255) NOT NULL,
	    hidefieldClass VARCHAR(255) NOT NULL,
	    doogmaClass VARCHAR(255) NOT NULL,
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
    $sql = "SELECT * FROM OptionData WHERE optionID='".$optionID."' AND storeHash='".$storeHash."' ";
    $result = mysqli_query($conn, $sql);
    if(mysqli_num_rows($result) > 0){
    	$sql = 'UPDATE OptionData SET doogmaClass="'.$doogmaClass.'", productID="'.$productID.'", hidefieldClass="'.$hidefieldClass.'" WHERE optionID="'.$optionID.'" AND storeHash="'.$storeHash.'" ';
    	mysqli_query($conn, $sql);
    } else {
    	$sql = "INSERT INTO OptionData (optionID, productID, hidefieldClass, doogmaClass, storeHash) VALUES ( '".$optionID."', '".$productID."', '".$hidefieldClass."', '".$doogmaClass."', '".$storeHash."' )";
    	mysqli_query($conn, $sql);
    }
} else if($mode == 'getData') {
    $sql = "SELECT * FROM OptionData WHERE optionID='".$optionID."' AND storeHash='".$storeHash."' ";
    $result = mysqli_query($conn, $sql);
    if(mysqli_num_rows($result) > 0){
        while ($row = mysqli_fetch_assoc($result)) {
			$sql = 'UPDATE OptionData SET productID="'.$productID.'" WHERE optionID="'.$optionID.'" AND storeHash="'.$storeHash.'" ';
			mysqli_query($conn, $sql);
            echo json_encode($row);
        }
    } else {
        echo 'No OptionData';
    }
}
?>
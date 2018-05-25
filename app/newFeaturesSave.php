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
if(isset($_REQUEST['mobileImageFloat'])){
    $mobileImageFloat = $_REQUEST['mobileImageFloat'];
} else {
    $mobileImageFloat = 'no';    
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
if(mysqli_query($conn,"DESCRIBE Settings")) {
    //echo 'Table already Exist';
} else {
	$sql = "CREATE TABLE Settings(
	    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
	    mobileImageFloat VARCHAR(255) NOT NULL,
	    storeHash VARCHAR(255) NOT NULL)";
	
	if(mysqli_query($conn, $sql)){
	    //echo "Table created successfully.";
	} else{
	    echo "ERROR: Could not able to execute $sql. " . mysqli_error($conn);
	}
}
if($_REQUEST['mode'] == 'Clickfalse') {
   $sql = "SELECT * FROM Settings WHERE storeHash='".$storeHash."' ";
    $result = mysqli_query($conn, $sql);
    if(mysqli_num_rows($result) == 0){
        $sql = "INSERT INTO Settings (mobileImageFloat, storeHash) VALUES ('".$mobileImageFloat."', '".$storeHash."' )";
    	mysqli_query($conn, $sql);
    	echo 'Settings Saved!';
    }
} else if($_REQUEST['mode'] == 'Clicktrue') {
    $sql = "SELECT * FROM Settings WHERE storeHash='".$storeHash."' ";
    $result = mysqli_query($conn, $sql);
    if(mysqli_num_rows($result) > 0){
    	$sql = 'UPDATE Settings SET mobileImageFloat="'.$mobileImageFloat.'" WHERE storeHash="'.$storeHash.'" ';
    	mysqli_query($conn, $sql);
    	echo 'Settings Updated!';
    } else {
    	$sql = "INSERT INTO Settings (mobileImageFloat, storeHash) VALUES ('".$mobileImageFloat."', '".$storeHash."' )";
    	mysqli_query($conn, $sql);
    	echo 'Settings Saved!';
    }
}
?>
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
if(isset($_REQUEST['defaultValue'])){
    $defaultValue = $_REQUEST['defaultValue'];
} else {
    $defaultValue = 'no';
}

$optionID = $_REQUEST['optionID'];
$optionValueID = $_REQUEST['optionValueID'];
$optionValueLabel = $_REQUEST['optionValueLabel'];

if(isset($_REQUEST['optionName'])) {
	$optionName = $_REQUEST['optionName'];
} else {
    $optionName = '';
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
if(mysqli_query($conn,"DESCRIBE OptionValues")) {
    //echo 'Table already Exist';
} else {
	$sql = "CREATE TABLE OptionValues (
	    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
	    optionValueID VARCHAR(255) NOT NULL,
	    optionValueLabel VARCHAR(255) NOT NULL,
	    optionID VARCHAR(255) NOT NULL,
	    optionName VARCHAR(255) NOT NULL,
	    hidefieldClass VARCHAR(255) NOT NULL,
	    doogmaClass VARCHAR(255) NOT NULL,
	    storeHash VARCHAR(255) NOT NULL,
		defaultValue VARCHAR(255) NOT NULL )";
	
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
    $sql = "SELECT * FROM OptionValues WHERE optionValueID='".$optionValueID."' AND storeHash='".$storeHash."' ";
    $result = mysqli_query($conn, $sql);
    if(mysqli_num_rows($result) > 0){
    	$sql = 'UPDATE OptionValues SET optionValueLabel="'.$optionValueLabel.'", doogmaClass="'.$doogmaClass.'", optionName="'.htmlentities($optionName).'", hidefieldClass="'.$hidefieldClass.'", defaultValue="'.$defaultValue.'" WHERE optionValueID="'.$optionValueID.'" AND optionID="'.$optionID.'" AND storeHash="'.$storeHash.'" ';
    	mysqli_query($conn, $sql);
		$sql1 = "SELECT * FROM OptionValues WHERE optionValueID='".$optionValueID."' AND optionID='".$optionID."' AND storeHash='".$storeHash."' ";
		$result1 = mysqli_query($conn, $sql1);
		if(mysqli_num_rows($result1) > 0){
			while ($row1 = mysqli_fetch_assoc($result1)) {
				echo json_encode($row1);
			}
		}
    } else {
    	$sql = "INSERT INTO OptionValues (optionValueID, optionValueLabel, optionID, optionName, hidefieldClass, doogmaClass, storeHash, defaultValue) VALUES ( '".$optionValueID."', '".$optionValueLabel."', '".$optionID."', '".htmlentities($optionName)."', '".$hidefieldClass."', '".$doogmaClass."', '".$storeHash."', '".$defaultValue."' )";
    	mysqli_query($conn, $sql);
		echo 'Save Data!';
    }
} else if($mode == 'getData') {
    $sql = "SELECT * FROM OptionValues WHERE optionValueID='".$optionValueID."' AND optionID='".$optionID."' AND storeHash='".$storeHash."' ";
    $result = mysqli_query($conn, $sql);
    if(mysqli_num_rows($result) > 0){
        while ($row = mysqli_fetch_assoc($result)) {
			//$sql = 'UPDATE OptionValues SET optionName="'.htmlentities($optionName).'" WHERE optionValueID="'.$optionValueID.'" AND optionID="'.$optionID.'" AND storeHash="'.$storeHash.'" ';
			$sql = 'UPDATE OptionValues SET optionValueLabel="'.$optionValueLabel.'", optionName="'.htmlentities($optionName).'" WHERE optionValueID="'.$optionValueID.'" AND optionID="'.$optionID.'" AND storeHash="'.$storeHash.'" ';
			mysqli_query($conn, $sql);
            $sql1 = "SELECT * FROM OptionValues WHERE optionValueID='".$optionValueID."' AND optionID='".$optionID."' AND storeHash='".$storeHash."' ";
			$result1 = mysqli_query($conn, $sql1);
			if(mysqli_num_rows($result1) > 0){
				while ($row = mysqli_fetch_assoc($result1)) {
					echo json_encode($row);
				}
			}
        }
    } else {
		$sql = "INSERT INTO OptionValues (optionValueID, optionValueLabel, optionID, optionName, hidefieldClass, doogmaClass, storeHash, defaultValue) VALUES ( '".$optionValueID."', '".$optionValueLabel."', '".$optionID."', '".htmlentities($optionName)."', '".$hidefieldClass."', '".$doogmaClass."', '".$storeHash."', '".$defaultValue."' )";
    	mysqli_query($conn, $sql);
		$sql1 = "SELECT * FROM OptionValues WHERE optionValueID='".$optionValueID."' AND optionID='".$optionID."' AND storeHash='".$storeHash."' ";
		$result = mysqli_query($conn, $sql1);
		if(mysqli_num_rows($result) > 0){
			while ($row = mysqli_fetch_assoc($result)) {
				echo json_encode($row);
			}
		}
    }
}
?>
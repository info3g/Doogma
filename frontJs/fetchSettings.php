<?php
session_start();
header('Access-Control-Allow-Origin: *');
require '../vendor/autoload.php';
require '../app/conf.php';
require '../app/connection.php';
use Bigcommerce\Api\Client as Bigcommerce;
error_reporting(E_ALL); 
ini_set('display_errors', 1);

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
    
    $settings_sql = "SELECT * FROM Settings WHERE storeHash='".$storeHash."' ";
    $settings_result = mysqli_query($conn, $settings_sql);
    if(mysqli_num_rows($settings_result) > 0){
    	while ($row = mysqli_fetch_assoc($settings_result)) {
            echo json_encode($row);
        }
    } else {
        $insert_sql = "INSERT INTO Settings (mobileImageFloat, storeHash) VALUES ('yes', '".$storeHash."' )";
    	mysqli_query($conn, $insert_sql);
    	$sql = "SELECT * FROM Settings WHERE storeHash='".$storeHash."' ";
        $result = mysqli_query($conn, $sql);
        if(mysqli_num_rows($result) > 0){
            while ($row = mysqli_fetch_assoc($result)) {
                echo json_encode($row);
            }
        }
    }

}

?>
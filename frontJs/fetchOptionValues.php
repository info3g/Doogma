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

$optionName = htmlentities($_REQUEST['optionName']);

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
    if(mysqli_query($conn,"DESCRIBE OptionValues")) {
        $sql = "SELECT * FROM OptionValues WHERE storeHash='".$storeHash."' AND optionName LIKE '%".$optionName."%' ";
        $result = mysqli_query($conn, $sql);
        if(mysqli_num_rows($result) > 0){
            while ($row = mysqli_fetch_assoc($result)) {
				$OptionData = "SELECT doogmaClass,hidefieldClass FROM OptionData WHERE storeHash='".$storeHash."' AND optionID='".$row['optionID']."' ";
				$Optionresult = mysqli_query($conn, $OptionData);
				if(mysqli_num_rows($Optionresult) > 0){
					while ($Optionrow = mysqli_fetch_assoc($Optionresult)) {
						if($Optionrow['doogmaClass'] != '') {
							$fetchdata[] = array('optionName' => $row['optionName'], 'optionValueID' => $row['optionValueID'], 'optionValueLabel' => $row['optionValueLabel'], 'optionID' => $row['optionID'], 'hidefieldClass' => $row['hidefieldClass'], 'doogmaClass' => $row['doogmaClass'], 'defaultValue' => $row['defaultValue'], 'parentClass' => $Optionrow['doogmaClass'], 'parenthidefieldClass' => $Optionrow['hidefieldClass'] );
						}
					}
				}
            }
			if(isset($fetchdata)) {
				echo json_encode($fetchdata);
			}
        } else {
            echo 'No OptionData';
        }
    } 
}

?>
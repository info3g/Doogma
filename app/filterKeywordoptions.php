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

if(isset($_REQUEST['keywordOption'])) {
    $keywordOption = $_REQUEST['keywordOption'];   
}

$count = ceil(Bigcommerce::getOptionsCount()/50);
if($count >= 1) {
	echo '<div class="productoptions"><div class="headings"><p>Option Name</p><p>Display Name</p><p>Hide Field On Product Page</p><p>Doogma Class Name</p><p>Default Option</p><p></p></div>';
	echo '<div class="contents">';
	echo '<div class="contents">';
	for($i=1;$i<=$count;$i++) {
		$filter = array('limit' => 50, 'page' => $i);
		$options = Bigcommerce::getOptions($filter);
		if($options) {
			foreach($options as $option) {
				$Optionwords = $option->name.' '.$option->display_name;
				if (stripos($Optionwords, $keywordOption) !== false) {
					$oValuedata = Bigcommerce::getOption($option->id);
					if($oValuedata) {
						$curl = curl_init();
						curl_setopt_array($curl, array(
						  CURLOPT_URL => "https://api.bigcommerce.com/stores/".$storeHash."/v2/options/".$option->id."/values.json?limit=250",
						  CURLOPT_RETURNTRANSFER => true,
						  CURLOPT_ENCODING => "",
						  CURLOPT_MAXREDIRS => 10,
						  CURLOPT_TIMEOUT => 30,
						  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
						  CURLOPT_CUSTOMREQUEST => "GET",
						  CURLOPT_HTTPHEADER => array(
							"x-auth-client: BC_CLIENT_ID",
							"x-auth-token: $access_token"
						  ),
						));

						$response = curl_exec($curl);
						$err = curl_error($curl);

						curl_close($curl);

						if ($err) {
						  echo "cURL Error #:" . $err;
						} else {
						  $odatavalues = json_decode($response);
						  //print_r($odatavalues);
						}
						//$odatavalues = $oValuedata->values;
						//print_r($oValuedata->values);
					}
					echo '<div class="content mainOptions">';
					echo '<form action="#" name="saveDoogmaoption">';
					echo '<p>';
					if(isset($odatavalues)) {
						echo '<a href="javascript:void(0);" class="values_dropdown"><i class="fa fa-angle-right" aria-hidden="true"></i></a> ';
					}
					echo '<strong>'.$option->name.'</strong></p>';
					echo '<p><strong>'.$option->display_name.'</strong></p>';
					echo '<p class="doogma_fields"><label class="switch"><input type="checkbox" name="hidefieldClass" value="yes" /><span class="slider round"></span></label></p>';
					echo '<p class="doogma_fields"><input type="text" name="doogmaClass" /></p>';
					echo '<input type="hidden" name="optionID" value="'.$option->id.'" /><p></p>';
					echo '<p class="doogma_fields"><input type="button" name="saveDoogmaoption" class="saveDoogmaoption" value="Save" style="display:none;" /></p>';
					echo '</form>';
					echo '</div>';
					
					if(isset($odatavalues)) {
						foreach($odatavalues as $odatavalue) {
							$valuesArray[$odatavalue->option_id][$odatavalue->id] = $odatavalue->label;
						}
						echo '<div class="values-container" style="display:none;">';
						$intial = 1;
						foreach($valuesArray[$option->id] as $key => $values) {
							$data_value = strtolower($values);
							if (stripos($data_value, ' ') !== false) {
								$data_value = str_replace(' ', '' ,$data_value);
							}
							echo '<div class="content">';
							echo '<form action="#" name="saveOptionvalue">';
							echo '<p><strong>'.$values.'</strong></p>';
							echo '<p><strong>'.$values.'</strong></p>';
							echo '<p class="doogma_fields"><label class="switch"><input type="checkbox" name="hidefieldClass" value="yes" /><span class="slider round"></span></label></p>';
							echo '<p class="doogma_fields"><input type="text" name="doogmaClass" value="'.$data_value.'" placeholder="'.$data_value.'" /></p>';
							echo '<input type="hidden" name="optionID" value="'.$option->id.'" />';
							echo '<input type="hidden" name="optionName" value="'.htmlentities($option->display_name).'" />';
							echo '<input type="hidden" name="optionValueID" value="'.$key.'" />';
							echo '<input type="hidden" name="optionValueLabel" value="'.$values.'" />';
							if($intial == 1) {
								echo '<p class="doogma_fields defaultOption"><label class="switch"><input type="checkbox" name="defaultValue" checked="checked" value="yes" /><span class="slider round"></span></label></p>';
							} else {
								echo '<p class="doogma_fields defaultOption"><label class="switch"><input type="checkbox" name="defaultValue" value="yes" /><span class="slider round"></span></label></p>';
							}
							echo '<p class="doogma_fields"><input type="button" name="saveOptionvalue" class="saveOptionvalue" value="Save" style="display:none;" /></p>';
							echo '</form>';
							echo '</div>';
							$intial++;
						}
						echo '</div>';
					}
				}
			}
		}
	}
	echo '</div></div>';
}

?>
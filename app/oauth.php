<?php
session_start();
require '../vendor/autoload.php';
require __DIR__.'/conf.php';
require __DIR__.'/connection.php';
use Bigcommerce\Api\Client as Bigcommerce;
// Required File END...........
error_reporting(E_ALL); 
ini_set('display_errors', 1);

// Create table query
if(mysqli_query($conn,"DESCRIBE Store")) {
    //echo 'Table already Exist';
} else {
	$sql = "CREATE TABLE Store(
	    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
	    authToken VARCHAR(255) NOT NULL,
	    storeHash VARCHAR(255) NOT NULL)";
	
	if(mysqli_query($conn, $sql)){
	    //echo "Table created successfully.";
	} else{
	    echo "ERROR: Could not able to execute $sql. " . mysqli_error($conn);
	}
}

$object = new \stdClass();
$object->client_id = BC_CLIENT_ID;
$object->client_secret = BC_CLIENT_SECRET;
$object->redirect_uri = BC_CALLBACK_URL;
$object->code = $_REQUEST['code'];
$object->context = $_REQUEST['context'];
$object->scope = $_REQUEST['scope'];

$authTokenResponse = Bigcommerce::getAuthToken($object);
if($authTokenResponse) {
	list($context, $storeHash) = explode('/', $authTokenResponse->context, 2);
	$access_token = $authTokenResponse->access_token;
	
	$sql = "SELECT * FROM Store WHERE storeHash='".$storeHash."'";
	$result = mysqli_query($conn, $sql);
	if(mysqli_num_rows($result) > 0){
		$sql = 'UPDATE Store SET authToken="'.$access_token.'" WHERE storeHash="'.$storeHash.'" ';
		$finalres = mysqli_query($conn, $sql);
	} else {
		$sql = "INSERT INTO Store (authToken, storeHash) VALUES ('".$access_token."', '".$storeHash."')";
		$finalres = mysqli_query($conn, $sql);
	}

	Bigcommerce::configure(array(
		'client_id' => BC_CLIENT_ID,
		'auth_token' => $access_token,
		'store_hash' => $storeHash
	));
} else {
	//print_r($authTokenResponse);
	$storeHash = explode('stores/',$_REQUEST['context']);
	//print_r($storeHash);
}
$ping = Bigcommerce::getTime();
if ($ping) {

	$store = Bigcommerce::getStore();
	$name = $store->first_name.' '.$store->last_name;
	$postData = array('email' => $store->admin_email, 'name' => $name, 'phone' => $store->phone, 'companies' => array(array('company_id' => $store->id, 'name' => $store->name, 'website' => $store->domain)));
	
	if($finalres == 1) {
		$curl = curl_init();
		curl_setopt_array($curl, array(
		  CURLOPT_URL => "https://api.intercom.io/users",
		  CURLOPT_RETURNTRANSFER => true,
		  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
		  CURLOPT_CUSTOMREQUEST => "POST",
		  CURLOPT_POSTFIELDS => json_encode($postData),
		  CURLOPT_HTTPHEADER => array(
			"accept: application/json",
			"authorization: Bearer dG9rOmRlODhmNTVhX2IwN2NfNDdhM184YTIwXzcxM2E0Yjg5NzBlMjoxOjA=",
			"content-type: application/json"
		  ),
		));
		$response = curl_exec($curl);
		$err = curl_error($curl);
		curl_close($curl);
		if ($err) {
		  //echo "cURL Error #:" . $err;
		} else {
		  //echo $response;
		}
	}
	
	$count = ceil(Bigcommerce::getProductsCount()/10);
	$Optionscount = ceil(Bigcommerce::getOptionsCount()/10);
	?>
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
	<link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
	<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
	<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
	<script src="https://use.fontawesome.com/236c415748.js"></script>
	<link href="../css/style.css" rel="stylesheet" type="text/css" />
	<script src="../js/jquery.twbsPagination.js" type="text/javascript" ></script>
	<div class="container">
		<h2 class="appTitle">Doogma Designer<sup>TM</sup> App</h2>
		<div class="loaderOuter" style="display:none;"><span>Loading...Please Wait...</span></div>
		<div id="tabs">
		  <ul>
			<li><a href="#subscribe.doogma.com">Your Account</a></li>
		    <li><a href="#products">Products</a></li>
		    <li><a href="#productOptions">Options</a></li>
		    <li><a href="#manualSettings">Installation Info</a></li>
			<li><a href="#newFeatures">Settings</a></li>
		  </ul>
		  <div class="mobile-outer">
		  <div class="mobile-inner">
		  <div id="subscribe.doogma.com">
			<!-- doogma -->
			<div class="doogma-container">
				<div class="your_account_main">
					<div class="account_left">
						<h2>Customize<br>Products<br>Easier,<br>Faster!</h2>
					</div>
					<div class="account_right">
						<a href="https://app.doogma.com/" target="_blank"><img src="../images/BigCommerceDLogo.png" /></a>
						<p>A variety of packages are offered, starting at $199 per month. A one time sign up fee of $900 includes up to 6 hours of support to assist you in getting started</p>
						<a class="manage_btn" href="https://app.doogma.com/pricing" target="_blank">Setup \ Manage your Account</a>
					</div>
					<div class="account_bottom">
						<img src="../images/BigCommerceMainImg.png" />
					</div>
				</div>
			</div>
			<!-- /doogma -->
		  </div>
		  <div id="products">
		  	<div class="products-container-main">
				<nav aria-label="Page navigation" class="top-pagination">
					<div class="searchBYsku">
						<form name="searchSKU">
							<input type="text" name="sku" placeholder="Search by SKU" />
							<input type="button" class="searchSKU" name="search" value="Search" />
							<button type="reset" value="Reset" class="resetskuForm"><i class="fa fa-times" aria-hidden="true"></i></button>
						</form>
					</div>
					<div class="filterBYkeyword">
						<form name="filterKeyword">
							<input type="text" name="keyword" placeholder="Filter by keyword" />
							<input type="button" class="filterKeyword" name="filter" value="Filter" />
							<button type="reset" value="Reset" class="resetkeywordForm"><i class="fa fa-times" aria-hidden="true"></i></button>
						</form>
					</div>
					<div class="rightside-product">
						<div class="pagination-outer">
							<ul class="pagination" id="pagination"></ul>
						</div>
						<div class="productlimit">
							<span>View</span>
							<select name="productlimit">
								<option value="10" class="pager">10</option>
								<option value="20" class="pager">20</option>
								<option value="30" class="pager">30</option>
								<option href="50" class="pager">50</option>
								<option href="100" class="pager">100</option>
							</select>
						</div>
					</div>
				</nav>
				<div class="products-container">
					<div class="product-container-inner"></div>
				</div>
			</div>
		  </div>
		  <div id="productOptions">
			<div class="options-container-main">
				<nav aria-label="Page navigation" class="top-pagination">
					<div class="filterBYkeywordOptions">
						<form name="filterKeywordOptions">
							<input type="text" name="keywordOption" placeholder="Filter by keyword" />
							<input type="button" class="filterKeywordOptions" name="filter" value="Filter" />
							<button type="reset" value="Reset" class="resetFormOptions"><i class="fa fa-times" aria-hidden="true"></i></button>
						</form>
					</div>
					<div class="rightside-options">
						<div class="pagination-outer">
							<ul class="optionpagination" id="optionpagination"></ul>
						</div>
						<div class="optionslimit">
							<span>View</span>
							<select name="optionslimit">
								<option value="10" class="pager">10</option>
								<option value="20" class="pager">20</option>
								<option value="30" class="pager">30</option>
								<option href="50" class="pager">50</option>
							</select>
						</div>
					</div>
				</nav>
				<div class="options-container-main">
					<div class="optionProducts-container"></div>
				</div>
			</div>
		  </div>
		  <div id="manualSettings">
		  	<div class="manual-container">
		  		<div class="important_note">
		  			<h4>Thank you for using the Doogma Designer<sup>TM</sup> App, Version 1.0.a</h4>
					<h4>In order for the Designer to work:</h4>
					<p>a. Please contact Doogma and ensure that you have a license to use the Doogma Designer<sup>TM</sup></p>
					<p>b. Please add the following code to the footer of your template:</p>
		  			<textarea style="width: 100%;" readonly id="testNote"><script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>&nbsp;&nbsp;&nbsp;<script src="https://bc.doogma.com/frontJs/doogma.js?storeHash=<?php echo $storeHash; ?>"></script></textarea>
		  			<p>c. For any questions, please contact support@doogma.com</p>
		  		</div>
		  	</div>
		  </div>
		  <div id="newFeatures">
		  	<div class="newFeatures-container">
		  		<div class="newFeatures">
		  			<form action="#" name="newFeatures">
						<p class="doogma_fields">
						<span class="float_text">Float Designer in Responsive mode</span>
						<label class="switch"><input type="checkbox" name="mobileImageFloat" value="yes" checked /><span class="slider round"></span></label>
						</p>
						<p class="doogma_fields"><input type="button" name="newFeature" class="newFeature" value="Save" /></p>
					</form>
		  		</div>
		  	</div>
		  </div>
		  </div>
		  </div>
		</div>
	</div>
	<script src="../index.js?storeHash=<?php echo $storeHash; ?>&count=<?php echo $count; ?>&Optionscount=<?php echo $Optionscount; ?>"></script>
<?php }
?>
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

if (isset($_REQUEST['page'])) {
 $page = $_REQUEST['page']; 
} else { 
 $page = 1; 
}

$pagelimit = $_REQUEST['pagelimit'];

$filter = array('limit' => $pagelimit, 'page' => $page);
$products = Bigcommerce::getProducts($filter);
if (!$products) {
    echo '<div class="BCerror">';
    $error = Bigcommerce::getLastError();
    echo $error->code;
    echo $error->message;
    echo '</div>';
} else {
    echo '<div class="products"><div class="headings"><p>Image</p><p>Product SKU</p><p>Product Name</p><p>Price</p><p>Doogma Designer™</p><p>Doogma Code</p><p>Doogma Product ID</p><p></p></div>';
    echo '<div class="contents">';
    foreach ($products as $product) {
        echo '<div class="content">';
        echo '<form action="#" name="saveDoogma">';
		if($product->images) {
			$productImages = $product->images;
			foreach ($productImages as $productImage) {
				if($productImage->is_thumbnail == 1) {
					echo '<p><img src="'.$productImage->tiny_url.'" alt="productImage" /></p>';
				}
			}
		} else {
				echo '<p>No image</p>';
		}
        echo '<p>'.$product->sku.'</p>';
        echo '<p class="productname"><strong>'.$product->name.'</strong></p>';
        echo '<p>' . number_format($product->price, 2, '.', '') . '</p>';
        echo '<p class="doogma_fields"><label class="switch"><input type="checkbox" name="addDoogma" value="yes" /><span class="slider round"></span></label></p>';
        echo '<p class="doogma_fields"><input type="text" name="doogmaCode" /></p>';
        echo '<p class="doogma_fields"><input type="text" name="doogmaProductId" /></p>';
        echo '<input type="hidden" name="productID" value="'.$product->id.'" />';
        echo '<p class="doogma_fields"><input type="button" name="saveDoogma" class="saveDoogma" value="Save" style="display:none;" /></p>';
        echo '</form>';
        //echo '<p><a class="edit_product" href="javascript:void(0);" data-productId="'.$product->id.'">Edit</a></p>';
        echo '</div>';
    }
    echo '</div></div>';
}
?>
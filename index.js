function getDoogma(storeHash) {
$('.products-container .content').each(function(){
	var _thisform =	$('form[name=saveDoogma]',this);
	var formdata = $('form[name=saveDoogma]',this).serialize();
	$.ajax({
      	url: '/app/saveDoogma.php'+'?storeHash='+storeHash+'&mode=getData&'+formdata,
      	type: 'GET',
      	async: true,
      	success: function(response) {
    		if(response == 'No ProductData') {
    			console.log(response);
    		} else {
				if (!$.trim(response)){  
					console.log('No Data found!');
				} else {
					var getData = $.parseJSON(response);
					_thisform.find('input[name=doogmaCode]').val(getData.doogmaCode);
					if(getData.addDoogma == 'yes') {
						_thisform.find('input[name=addDoogma]').attr('checked', 'checked');
						_thisform.find('input[name=doogmaCode]').addClass('active').removeClass('disable_input');
					} else {
						_thisform.find('input[name=addDoogma]').removeAttr('checked');
						_thisform.find('input[name=doogmaCode]').removeClass('active').addClass('disable_input');
					}
				}
    		}
		},
		complete: function(response) {
		   $('.loaderOuter').hide(); 
		}
	});
});
}

function allProducts(pagenum,pagelimit,storeHash){
$.ajax({
  	url: '/app/allProducts.php'+'?storeHash='+storeHash+'&page='+pagenum+'&pagelimit='+pagelimit,
  	type: 'GET',
  	async: true,
  	success: function(response) {
		$('.product-container-inner').html(response);
		getDoogma(storeHash);
	}
});
}

function getClassDoogma(storeHash) {
$('.optionProducts-container .content.mainOptions').each(function(){
	var _thisform =	$('form[name=saveDoogmaoption]',this);
	var formdata = $('form[name=saveDoogmaoption]',this).serialize();
	$.ajax({
      	url: '/app/saveDoogmaoption.php'+'?storeHash='+storeHash+'&mode=getData&'+formdata,
      	type: 'GET',
      	async: true,
      	success: function(response) {
      		if(response == 'No OptionData') {
      			console.log(response);
      		} else {
				if (!$.trim(response)){  
					console.log('No Data found!');
				} else {
					var getData = $.parseJSON(response);
					_thisform.find('input[name=doogmaClass]').val(getData.doogmaClass);
					if(getData.hidefieldClass == 'yes') {
						_thisform.find('input[name=hidefieldClass]').attr('checked', 'checked');
						_thisform.find('input[name=doogmaClass]').addClass('disable_input');
					} else {
						_thisform.find('input[name=hidefieldClass]').removeAttr('checked');
						_thisform.find('input[name=doogmaClass]').removeClass('disable_input');
					}
				}
      		}
		},
		complete: function(response) {
		   //$('.loaderOuter').hide(); 
		}
	});
});
}

function Productoptions(pagenum,pagelimit,storeHash){
$.ajax({
  	url: '/app/Productoptions.php'+'?storeHash='+storeHash+'&page='+pagenum+'&pagelimit='+pagelimit,
  	type: 'GET',
  	async: true,
  	success: function(response) {
		$('.optionProducts-container').html(response);
		getClassDoogma(storeHash);
	},
	complete: function(response) {
		 getOptionValues(storeHash);	
	}
});
}

//Option Values
function getOptionValues(storeHash) {
$('.optionProducts-container .values-container .content').each(function(){
	var _thisform =	$('form[name=saveOptionvalue]',this);
	var formdata = $('form[name=saveOptionvalue]',this).serialize();
	$.ajax({
      	url: '/app/saveOptionvalue.php'+'?storeHash='+storeHash+'&mode=getData&'+formdata,
      	type: 'GET',
      	async: true,
      	success: function(response) {
      		if(response == 'No OptionValues') {
      			console.log(response);
      		} else {
				if (!$.trim(response)){  
					console.log('No Data found!');
				} else {
					//console.log(response);
					var getData = $.parseJSON(response);
					_thisform.find('input[name=doogmaClass]').val(getData.doogmaClass);
					if(getData.hidefieldClass == 'yes') {
						_thisform.find('input[name=hidefieldClass]').attr('checked', 'checked');
						_thisform.find('input[name=doogmaClass]').addClass('disable_input');
					} else {
						_thisform.find('input[name=hidefieldClass]').removeAttr('checked');
						_thisform.find('input[name=doogmaClass]').removeClass('disable_input');
					}
					if(getData.defaultValue == 'yes') {
						_thisform.find('input[name=defaultValue]').attr('checked', 'checked');
					} else {
						_thisform.find('input[name=defaultValue]').removeAttr('checked');
					}
				}
      		}
		}, 
		complete: function(response) {
			$('.loaderOuter').hide(); 
		}
	});
});
}
// filter Product Keyword
function filterKeywordProductsfunc(storeHash) {
    var formdata = $('form[name=filterKeyword]').serialize();
    var keyword = $('input[name=keyword]').val();
    if(keyword) {
        $('.loaderOuter').show();
    	$.ajax({
    		url: '/app/filterKeywordproducts.php'+'?storeHash='+storeHash+'&'+formdata,
    		type: 'GET',
    		async: true,
    		success: function(response) {
    			if($('.content', response).length) {
    				$('#pagination').twbsPagination('destroy');
    				$('.product-container-inner').html(response);
    				getDoogma(storeHash);
    			} else {
    				$('#pagination').twbsPagination('destroy');
    				$('.product-container-inner').html('<p class="err_msg">No products matched your search criteria. Please try again.</p>');
    			}
    		},
    		complete: function(response) {
    		   $('.loaderOuter').hide(); 
    		}
    	});
    }
}
// search Product SKU
function searchSKUProductsfunc(storeHash) {
    var formdata = $('form[name=searchSKU]').serialize();
    var sku = $('input[name=sku]').val();
    if(sku) {
        $('.loaderOuter').show();
    	$.ajax({
    		url: '/app/searchProductwithSku.php'+'?storeHash='+storeHash+'&'+formdata,
    		type: 'GET',
    		async: true,
    		success: function(response) {
    			console.log(response);
    			if($('.content', response).length) {
    				$('#pagination').twbsPagination('destroy');
    				$('.product-container-inner').html(response);
    				getDoogma(storeHash);
    			} else {
    				$('#pagination').twbsPagination('destroy');
    				$('.product-container-inner').html('<p class="err_msg">No products matched your search criteria. Please try again.</p>');
    			}
    		},
    		complete: function(response) {
    		   $('.loaderOuter').hide(); 
    		}
    	});
    }
}
// filter Options Keyword
function filterKeywordOptionsfunc(storeHash) {
    var formdata = $('form[name=filterKeywordOptions]').serialize();
    var keywordOption = $('input[name=keywordOption]').val();
    if(keywordOption) {
        $('.loaderOuter').show();
    	$.ajax({
    		url: '/app/filterKeywordoptions.php'+'?storeHash='+storeHash+'&'+formdata,
    		type: 'GET',
    		async: true,
    		success: function(response) {
    			if($('.content.mainOptions', response).length) {
    				$('.optionProducts-container').html(response);
    				getClassDoogma(storeHash);
    			} else {
    				$('.optionProducts-container').html('<p class="err_msg">No options matched your search criteria. Please try again.</p>');
    			}
    		},
    		complete: function(response) {
				getOptionValues(storeHash);
				$('.loaderOuter').hide(); 
    		}
    	});
    }
}

// New Feature function
function newFeatures(storeHash,checkForm) {
	var formdata = $('.newFeatures form[name=newFeatures]').serialize();
	$('.loaderOuter').show();
	$.ajax({
		url: '/app/newFeaturesSave.php'+'?storeHash='+storeHash+'&'+formdata+'&mode='+checkForm,
		type: 'GET',
		async: true,
		success: function(response) {
			console.log(response);
		},
		complete: function(response) {
		   $('.loaderOuter').hide(); 
		}
	});
}

$(function() {
var data = $("script[src*='index.js']").attr('src').split('?')[1];
data = data.split('&');
var storeHash = data[0].split('storeHash=')[1];
var count = data[1].split('count=')[1];
var Optionscount = data[2].split('Optionscount=')[1];

	$(document).on('keypress','form[name=filterKeyword]',function(event){
		if(event.keyCode == 13 ) {
			event.preventDefault();
			filterKeywordProductsfunc(storeHash);
		}
	});
	
	$(document).on('keypress','form[name=searchSKU]',function(event){
		if(event.keyCode == 13 ) {
			event.preventDefault();
			searchSKUProductsfunc(storeHash);
		}
	});
	
	$(document).on('keypress','form[name=filterKeywordOptions]',function(event){
		if(event.keyCode == 13 ) {
			event.preventDefault();
			filterKeywordOptionsfunc(storeHash);
		}
	});
	
	$(document).on('keypress','form[name=saveDoogmaoption]',function(event){
		if(event.keyCode == 13 ) {
			event.preventDefault();
		}
	});
	
	$(document).on('keypress','form[name=saveOptionvalue]',function(event){
		if(event.keyCode == 13 ) {
			event.preventDefault();
		}
	});
	
	$('[data-toggle="tooltip"]').tooltip();
	$( "#tabs" ).tabs();
	
	$('body').on('keyup', 'input[name=doogmaCode]', function(){
		$(this).parent().siblings().find('.saveDoogma').show().addClass('highlighted').removeClass('grey_out');
	});
	$('body').on('keyup', 'input[name=doogmaProductId]', function(){
		$(this).parent().siblings().find('.saveDoogma').show().addClass('highlighted').removeClass('grey_out');
	}); 
	$('body').on('click', 'form[name=saveDoogma] span.slider.round', function(){
		$(this).parents('p').siblings().find('.saveDoogma').show().removeClass('highlighted grey_out');
	});
	
	$('body').on('keyup', 'form[name=saveDoogmaoption] input[name=doogmaClass]', function(){
		$(this).parent().siblings().find('.saveDoogmaoption').show().removeClass('grey_out');
	});
	$('body').on('click', 'form[name=saveDoogmaoption] span.slider.round', function(){
		$(this).parents('p').siblings().find('.saveDoogmaoption').show().removeClass('grey_out');
	});
	
	$('body').on('keyup', 'form[name=saveOptionvalue] input[name=doogmaClass]', function(){
		$(this).parent().siblings().find('.saveOptionvalue').show().removeClass('grey_out');
	});
	$('body').on('click', 'form[name=saveOptionvalue] span.slider.round', function(){
		$(this).parents('p').siblings().find('.saveOptionvalue').show().removeClass('grey_out');
	});
	
	$('body').on('click', 'form[name=saveOptionvalue] .defaultOption span.slider.round', function(){
		if($(this).parents('.defaultOption').find('input[name=defaultValue]').is(':checked')) {
			//alert('Already checked');
		} else {
			$(this).parents('.values-container').find('.content').each(function() {
				if($('.defaultOption input[name=defaultValue]',this).is(':checked')) {
					$('.defaultOption .slider.round',this).trigger('click');
					$('.defaultOption',this).next('.doogma_fields').find('.saveOptionvalue').trigger('click');
				}
			});
			$(this).parent('.defaultOption').find('input[name=defaultValue]').attr('checked','checked');
		}
	});
	
	//Products section
    var obj = $('#pagination').twbsPagination({
        totalPages: count,
        visiblePages: 7,
        first: '',
        last: '',
        onPageClick: function (event, page) {
        	$('.loaderOuter').show();
            allProducts(page,10,storeHash);
        }
    });
	
	$('select[name=productlimit]').on('change', function() {
		var pagelimit = $(this).val();
		if(pagelimit) {
		    $('.loaderOuter').show();
    		$.ajax({
    			url: '/app/allProductslimit.php'+'?storeHash='+storeHash+'&pagelimit='+pagelimit,
    			type: 'GET',
    			async: true,
    			success: function(response) {
    				console.log(response);
    				$('#pagination').twbsPagination('destroy');
    				var obj = $('#pagination').twbsPagination({
    			        totalPages: response,
    			        visiblePages: 7,
    			        first: '',
    			        last: '',
    			        onPageClick: function (event, page) {
    			            allProducts(page,pagelimit,storeHash);
    			        }
    			    });
    			}
    		});
		}
	});
    
    $('body').on('click', '.saveDoogma', function() {
    	var _this = $(this);
    	var formdata = _this.parents('form[name=saveDoogma]').serialize();
    	$.ajax({
	      	url: '/app/saveDoogma.php'+'?storeHash='+storeHash+'&mode=saveData&'+formdata,
	      	type: 'GET',
	      	async: true,
	      	success: function(response) {
	      		console.log(response);
	      		if(_this.parents('form[name=saveDoogma]').find('input[name=addDoogma]').is(':checked')) {
	      			_this.parents('form[name=saveDoogma]').find('input[name=doogmaCode]').addClass('active').removeClass('disable_input');
	      		} else {
	      			_this.parents('form[name=saveDoogma]').find('input[name=doogmaCode]').removeClass('active').addClass('disable_input');	
	      		}
	      		_this.after('<span class="update_msg"><img src="https://bc.doogma.com/images/loading_icon.gif" /></span>');
	      		$('body .update_msg').fadeOut(2000);
	      		_this.addClass('grey_out').removeClass('highlighted');
			}
    	});
    });
    
	$('.searchSKU').on('click', function() {
		searchSKUProductsfunc(storeHash);
	});
	
	$('.filterKeyword').on('click', function() {
		filterKeywordProductsfunc(storeHash);
	});
	
	$('.resetkeywordForm').on('click', function() {
		var keyword = $('input[name=keyword]').val();
		$('.loaderOuter').show();
		$('#pagination').twbsPagination('destroy');
		var obj = $('#pagination').twbsPagination({
			totalPages: count,
			visiblePages: 7,
			first: '',
			last: '',
			onPageClick: function (event, page) {
				allProducts(page,10,storeHash);
			}
		});
	});
	
	$('.resetskuForm').on('click', function() {
		var sku = $('input[name=sku]').val();
		$('.loaderOuter').show();
		$('#pagination').twbsPagination('destroy');
		var obj = $('#pagination').twbsPagination({
			totalPages: count,
			visiblePages: 7,
			first: '',
			last: '',
			onPageClick: function (event, page) {
				allProducts(page,10,storeHash);
			}
		});
	});
	
	//Options section
	var obj = $('#optionpagination').twbsPagination({
        totalPages: Optionscount,
        visiblePages: 7,
        first: '',
        last: '',
        onPageClick: function (event, page) {
        	$('.loaderOuter').show();
			Productoptions(page,10,storeHash);
        }
    });
	
	$('select[name=optionslimit]').on('change', function() {
		var pagelimit = $(this).val();
		if(pagelimit) {
		    $('.loaderOuter').show();
    		$.ajax({
    			url: '/app/allOptionslimit.php'+'?storeHash='+storeHash+'&pagelimit='+pagelimit,
    			type: 'GET',
    			async: true,
    			success: function(response) {
    				console.log(response);
    				$('#optionpagination').twbsPagination('destroy');
    				var obj = $('#optionpagination').twbsPagination({
    			        totalPages: response,
    			        visiblePages: 7,
    			        first: '',
    			        last: '',
    			        onPageClick: function (event, page) {
    			            Productoptions(page,pagelimit,storeHash);
    			        }
    			    });
    			}
    		});
		}
	});
	
	$('body').on('click', '.saveDoogmaoption', function() {
    	var _this = $(this);
		var doogmaClass_val = _this.parents('form[name=saveDoogmaoption]').find('input[name=doogmaClass]').val();
		var allowedChars = new RegExp("^[a-z0-9 -]+$");
		if (allowedChars.test(doogmaClass_val) || doogmaClass_val == '') {
			var formdata = _this.parents('form[name=saveDoogmaoption]').serialize();
			$.ajax({
				url: '/app/saveDoogmaoption.php'+'?storeHash='+storeHash+'&mode=saveData&'+formdata,
				type: 'GET',
				async: true,
				success: function(response) {
					console.log(response);
					if(_this.parents('form[name=saveDoogmaoption]').find('input[name=hidefieldClass]').is(':checked')) {
						_this.parents('form[name=saveDoogmaoption]').find('input[name=doogmaClass]').addClass('disable_input');
					} else {
						_this.parents('form[name=saveDoogmaoption]').find('input[name=doogmaClass]').removeClass('disable_input');	
					}
					_this.after('<span class="update_msg"><img src="https://bc.doogma.com/images/loading_icon.gif" /></span>');
					$('body .update_msg').fadeOut(2000);
					_this.addClass('grey_out').removeClass('highlighted');
				},
				complete: function(response) {
					getOptionValues(storeHash);	
				}
			});
		} else {
			alert('Please enter lowercase letters, numbers and hyphen only');
		}
    });
	
	$('.filterKeywordOptions').on('click', function() {
		filterKeywordOptionsfunc(storeHash);
	});
	
	$('.resetFormOptions').on('click', function() {
		var keywordOption = $('input[name=keywordOption]').val();
		$('.loaderOuter').show();
		$('#optionpagination').twbsPagination('destroy');
		var obj = $('#optionpagination').twbsPagination({
			totalPages: Optionscount,
			visiblePages: 7,
			first: '',
			last: '',
			onPageClick: function (event, page) {
				Productoptions(page,10,storeHash);
			}
		});
	});
	
	// Option Values
	getOptionValues(storeHash);
	
	$('body').on('click', '.values_dropdown', function() {
		$(this).toggleClass('show_dropdown');
		if($(this).hasClass('show_dropdown')){
			$(this).html('<i class="fa fa-angle-down" aria-hidden="true"></i>');
		} else {
			$(this).html('<i class="fa fa-angle-right" aria-hidden="true"></i>');	
		}
		$(this).parents('.content').next('.values-container').slideToggle();
	});
	
	$('body').on('click', '.saveOptionvalue', function() {
    	var _this = $(this);
		var doogmaClass_val = _this.parents('form[name=saveOptionvalue]').find('input[name=doogmaClass]').val();
		var allowedChars = new RegExp("^[a-z0-9 -]+$");
		if (allowedChars.test(doogmaClass_val) || doogmaClass_val == '') {
			var formdata = _this.parents('form[name=saveOptionvalue]').serialize();
			$.ajax({
				url: '/app/saveOptionvalue.php'+'?storeHash='+storeHash+'&mode=saveData&'+formdata,
				type: 'GET',
				async: true,
				success: function(response) {
					console.log(response);
					if(_this.parents('form[name=saveOptionvalue]').find('input[name=hidefieldClass]').is(':checked')) {
						_this.parents('form[name=saveOptionvalue]').find('input[name=doogmaClass]').addClass('disable_input');
					} else {
						_this.parents('form[name=saveOptionvalue]').find('input[name=doogmaClass]').removeClass('disable_input');	
					}
					_this.after('<span class="update_msg"><img src="https://bc.doogma.com/images/loading_icon.gif" /></span>');
					$('body .update_msg').fadeOut(2000);
					_this.addClass('grey_out').removeClass('highlighted');
				}
			});
		} else {
			alert('Please enter lowercase letters, numbers and hyphen only');
		}
    });
	
	// New Features
	newFeatures(storeHash,'Clickfalse');
	
	$('body').on('click', '.newFeature', function() {
		newFeatures(storeHash,'Clicktrue');
	});
	
//# sourceURL=//bc.doogma.com/index.js
});
/**************Doogma JS*******************/
(function() {
	// Developer Instructions:
	// To Execute this script in Test environment - Add query paramater "ddtest"
	// To Prevent browser caching - Add query parameter "nocache=somevalue"
	
	// Load Test version of script if query parameter contains "ddtest" and current script is not test version.
	if(docurl().hasSearch('ddtest') && !document.currentScript.hasAttribute('data-ddtest')) {
		var testSrc = document.currentScript.src.replace('.js','-test.js');
		var noCache = docurl().getSearch('nocache');
		if(noCache) {
			testSrc = docurl(testSrc).setSearch('nocache',noCache).href;
		}
		var testScript = document.createElement('script');
		testScript.setAttribute('src', testSrc);
		testScript.setAttribute('data-ddtest','');
		document.head.appendChild(testScript);
		return;
	}
	
	var storehash = 'storeHash=' + docurl(document.currentScript.src).getSearch('storeHash');
	var designerDiv;
	var isDoogmaClassNameReady = false;
	var isDoogmaDataValueReady = false;
	
	function isReady() {
		return isDoogmaClassNameReady && isDoogmaDataValueReady;
	}
	
	function fetchOptions(productID,storehash) {
		$.ajax({
			url: 'https://bc.doogma.com/frontJs/fetchOptions.php'+'?productID='+productID+'&'+storehash,
			crossDomain: true,
			type: 'GET',
			dataType: 'json',
			processData: false,
			header: {
				"Access-Control-Allow-Origin": "*",
			},
			success: function(response) {
				if ($.trim(response)){
					if($('form .form-field').length) {
						$('form .form-field').each(function(index) {
							var _this = $(this);
							var name = $.trim($('label.form-label',this).text().split(':')[0]);
							$.each(response, function(index, value){
								if(name == value.optionName && value.doogmaClass) {
									if((_this).data('product-attribute') == 'input-text' || (_this).data('product-attribute') == 'input-number' || (_this).data('product-attribute') == 'input-checkbox' || (_this).data('product-attribute') == 'input-file') {
										(_this).find('input').addClass('doogma-'+value.doogmaClass)
									} else if((_this).data('product-attribute') == 'textarea' ) {
										(_this).find('textarea').addClass('doogma-'+value.doogmaClass)
									}
								}
								if(name == value.optionName && value.hidefieldClass == 'yes') {
									_this.hide();
								}
							});
						});
					}
					if($('form .productAttributeRow').length) {
						
						$('form .productAttributeRow').each(function(index) {
							var _this = $(this);
							var name = $.trim($('.productAttributeLabel label span.name',this).text().split(':')[0]);
							$.each(response, function(index, value){
								if(name == value.optionName && value.doogmaClass) {
									if((_this).find('.productAttributeValue input').length) {
										(_this).find('input').addClass('doogma-'+value.doogmaClass);
									} else if((_this).find('.productAttributeValue textarea').length) {
										(_this).find('textarea').addClass('doogma-'+value.doogmaClass);
									}
								}
								if(name == value.optionName && value.hidefieldClass == 'yes') {
									_this.hide();
								}
							});
						});
					}
				}
			}, complete: function() {
				isDoogmaClassNameReady = true;
				if(isReady()) {
					signalNavigationReady();
				}
			}
		});
	}
	
	function fetchOptionValues(productID,storehash) {
		var options = $('form .form-field[data-product-attribute]');
		var pending = options.length;
		options.each(function(index) {
			var _this = $(this);
			var optionName = $.trim($('label.form-label',this).text().split(':')[0]);
			$.ajax({
				url: 'https://bc.doogma.com/frontJs/fetchOptionValues.php'+'?optionName='+optionName+'&'+storehash,
				crossDomain: true,
				type: 'GET',
				aysnc: false,
				dataType: 'json',
				processData: false,
				header: {
					"Access-Control-Allow-Origin": "*",
				},
				success: function(response) {
					if ($.trim(response)){
						$.each(response, function(index, value){
							if((_this).data('product-attribute') == 'swatch' || (_this).data('product-attribute') == 'set-rectangle' || (_this).data('product-attribute') == 'set-radio' || (_this).data('product-attribute') == 'product-list') {
								_this.find('input').each(function() {
									var _inthis = $(this);
									if(value.parentClass != '') {
										if(_inthis.val() == value.optionValueID) {
											_inthis.addClass('doogma-'+value.parentClass);
											if(value.parenthidefieldClass == 'yes') {
												_this.hide();
											}
											if(value.doogmaClass == '') {
												var data_value = _inthis.next('label').find('span').attr('title');
												data_value = data_value.toLowerCase().split(' ').join('');
												_inthis.attr('data-doogma-value',data_value);
												if(value.defaultValue == 'yes'){
													_inthis.attr('checked','checked');
												} else {
													_inthis.removeAttr('checked');
												}
											} else {
												_inthis.attr('data-doogma-value',value.doogmaClass);
												if(value.defaultValue == 'yes'){
													_inthis.attr('checked','checked');
												} else {
													_inthis.removeAttr('checked');
												}
											}
											if(value.hidefieldClass == 'yes') {
												_inthis.hide();
											}
										}
									}
								});
							} else if((_this).data('product-attribute') == 'set-select') {
								_this.find('select option').each(function() {
									var _inthis = $(this);
									if(value.parentClass != '') {
										if(_inthis.val() == value.optionValueID) {
											_inthis.parent('select').addClass('doogma-'+value.parentClass);
											if(value.parenthidefieldClass == 'yes') {
												_this.hide();
											}
											if(value.doogmaClass == '') {
												var data_value = _inthis.text();
												data_value = data_value.toLowerCase().split(' ').join('');
												_inthis.attr('data-doogma-value',data_value);
												if(value.defaultValue == 'yes'){
													_inthis.parent('select').val(value.optionValueID).trigger('change');
												} else {
													_inthis.removeAttr('selected');
												}
											} else {
												_inthis.attr('data-doogma-value',value.doogmaClass);
												if(value.defaultValue == 'yes'){
													_inthis.parent('select').val(value.optionValueID).trigger('change');
												} else {
													_inthis.removeAttr('selected');
												}
											}
											if(value.hidefieldClass == 'yes') {
												_inthis.hide();
											}
										}
									}
								});
							}
						});
					}
				}, complete: function() {
					if(--pending == 0) {
						isDoogmaDataValueReady = true;
						if(isReady()) {
							signalNavigationReady();
						}
					}
				}
			});
		});
		
		options = $('form .productAttributeRow');
		pending = options.length;
		options.each(function(index) {
			var _this = $(this);
			var optionName = $.trim($('.productAttributeLabel label span.name',this).text().split(':')[0]);
			$.ajax({
				url: 'https://bc.doogma.com/frontJs/fetchOptionValues.php'+'?optionName='+optionName+'&'+storehash,
				crossDomain: true,
				type: 'GET',
				dataType: 'json',
				processData: false,
				header: {
					"Access-Control-Allow-Origin": "*",
				},
				success: function(response) {
					if ($.trim(response)){
						$.each(response, function(index, value){
							if((_this).find('.productAttributeValue ul').length) {
								_this.find('.productAttributeValue ul li').each(function() {
									var _lithis = $(this);
									var _inthis = $('input',this);
									if(value.parentClass != '') {
										if(_inthis.val() == value.optionValueID) {
											_inthis.addClass('doogma-'+value.parentClass);
											if(value.parenthidefieldClass == 'yes') {
												_this.hide();
											}
											if(value.doogmaClass == '') {
												var data_value = _inthis.next('span.name').text();
												data_value = data_value.toLowerCase().split(' ').join('');
												_inthis.attr('data-doogma-value',data_value);
												if(value.defaultValue == 'yes'){
													_inthis.attr('checked','checked');
													_lithis.addClass('selectedValue');
												} else {
													_inthis.removeAttr('checked');
												}
											} else {
												_inthis.attr('data-doogma-value',value.doogmaClass);
												if(value.defaultValue == 'yes'){
													_inthis.attr('checked','checked');
													_lithis.addClass('selectedValue');
												} else {
													_inthis.removeAttr('checked');
												}
											}
											if(value.hidefieldClass == 'yes') {
												_inthis.hide();
											}
										}
									}
								});
							} else if((_this).find('.productAttributeValue select').length) {
								_this.find('.productAttributeValue select option').each(function() {
									var _inthis = $(this);
									if(value.parentClass != '') {
										if(_inthis.val() == value.optionValueID) {
											_inthis.parent('select').addClass('doogma-'+value.parentClass);
											if(value.parenthidefieldClass == 'yes') {
												_this.hide();
											}
											if(value.doogmaClass == '') {
												var data_value = _inthis.text();
												data_value = data_value.toLowerCase().split(' ').join('');
												_inthis.attr('data-doogma-value',data_value);
												if(value.defaultValue == 'yes'){
													_inthis.parent('select').val(value.optionValueID).trigger('change');
												} else {
													_inthis.removeAttr('selected');	
												}
											} else {
												_inthis.attr('data-doogma-value',value.doogmaClass);
												if(value.defaultValue == 'yes'){
													_inthis.parent('select').val(value.optionValueID).trigger('change');
												} else {
													_inthis.removeAttr('selected');	
												}
											}
											if(value.hidefieldClass == 'yes') {
												_inthis.hide();
											}
										}
									}
								});
							}
						});
					}
				}, complete: function() {
					if(--pending == 0) {
						isDoogmaDataValueReady = true;
						if(isReady()) {
							signalNavigationReady();
						}
					}
				}
			});
		});
		if(options.length == 0) {
			isDoogmaDataValueReady = true;
			if(isReady()) {
				signalNavigationReady();
			}
		}
	}
	
	function fetchProducts(productID,storehash) {
		$.ajax({
			url: 'https://bc.doogma.com/frontJs/fetchProducts.php'+'?productID='+productID+'&'+storehash,
			crossDomain: true,
			type: 'GET',
			dataType: 'json',
			processData: false,
			header: {
				"Access-Control-Allow-Origin": "*",
			},
			success: function(response) {
				if ($.trim(response)){
					var getData = response;
					//console.log(getData);
					if(getData.addDoogma == 'yes') {
						if($('.productView-images').length) {
							var designerParentDiv = $('.productView-images').addClass('VisualizationContainer')[0];
							$('.productView-details').addClass('NavigationContainer');
						}
						else if($('.ProductThumb').length) {
							designerParentDiv = $('.ProductThumb').addClass('VisualizationContainer')[0];
							$('.ProductMain').addClass('NavigationContainer');
							if($('#fancy_outer').length)
							$('#fancy_outer').remove();
						}
						else if($('.ProductThumbImage').length) {
							designerParentDiv = $('.ProductThumbImage').addClass('VisualizationContainer')[0];
							$('.ProductDetailsGrid').addClass('NavigationContainer');
						}
						else if($('.product-images-wrapper').length) {
							designerParentDiv = $('.product-images-wrapper').addClass('VisualizationContainer')[0];
							$('.product-customization-wrapper').addClass('NavigationContainer');
						}
						if(designerParentDiv) {
							designerParentDiv.innerHTML = '';
							addDesignerElement(designerParentDiv, getData.doogmaCode);
							setTimeout(function() {  // Give some network bandwidth to Designer to load and show the loading image.
								var script = '<script type="text/javascript" src="https://bc.doogma.com/js/mybigcommerce-doogma-test-store-float-designer.js"></script>';
								$('body').append(script);
							},500);
						}
						if(getData.doogmaProductId) {
						  $('input[name=product_id]').after('<input type="hidden" class="doogma-product-id" value="'+getData.doogmaProductId+'">');
						}
					} else {
						$('body .doogma-plugin').remove();
					}
				}
			}
		});
	}
	
	function scrollToOption() {
		if($('form .form-field').length) {
			var options = $('form .form-field[data-product-attribute]');
			for(var i=0; i<options.length; i++) {
				var divOpt = options[i];
				var _this = $(divOpt);
				var optionName = $.trim($('label.form-label',divOpt).text().split(':')[0]);
				if(optionName == 'doogma-selected-heading') {
					var doogmaSelected = $('input',divOpt).val();
					for(var i=0; i<options.length; i++) {
						divOpt = options[i];
						var _inthis = $(divOpt);
						var seloptionName = divOpt.querySelector('[class*="doogma-"]').className.match(/doogma-\S+/)[0];
						if(seloptionName == doogmaSelected) {
							$('html,body').animate({ scrollTop: $(_inthis).offset().top}, 'slow');
							return;
						}
					}
				}
			}
		}
		if($('form .productAttributeRow').length) {
			var options = $('form .productAttributeRow');
			for(var i=0; i<options.length; i++) {
				var divOpt = options[i];
				var _this = $(divOpt);
				var optionName = $.trim($('.productAttributeLabel label span.name',divOpt).text().split(':')[0]);
				if( optionName == 'doogma-selected-heading') {
					var doogmaSelected = $('.productAttributeValue input',divOpt).val();
					for(var i=0; i<options.length; i++) {
						divOpt = options[i];
						var _inthis = $(divOpt);
						var seloptionName = divOpt.querySelector('[class*="doogma-"]').className.match(/doogma-\S+/)[0];
						if(seloptionName == doogmaSelected) {
							$('html,body').animate({ scrollTop: $(_inthis).offset().top}, 'slow');
							return;
						}
					}
				}
			}
		}
	}
	
	function createCookie(name,value,days) {
		var expires = "";
		if (days) {
			var date = new Date();
			date.setTime(date.getTime() + (days*24*60*60*1000));
			expires = "; expires=" + date.toUTCString();
		}
		document.cookie = name + "=" + value + expires + "; path=/";
	}
	
	function readCookie(name) {
		var nameEQ = name + "=";
		var ca = document.cookie.split(';');
		for(var i=0;i < ca.length;i++) {
			var c = ca[i];
			while (c.charAt(0)==' ') c = c.substring(1,c.length);
			if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
		}
		return null;
	}
	
	function eraseCookie(name) {
		createCookie(name,"",-1);
	}
	
	function addDesignerElement(parentDiv, uid) {
		designerDiv = document.createElement('div');
		designerDiv.setAttribute('class','doogma-plugin');
		if(uid) {
			designerDiv.setAttribute('data-uid',uid);
		}
		designerDiv.setAttribute('data-nav-ready',isReady());
		parentDiv.appendChild(designerDiv);

		var script = document.createElement('script');
		script.setAttribute('src', '//cdne2im.doogma.com/smartmobile-v2/loader.js');
		parentDiv.appendChild(script);
	}
	
	function signalNavigationReady() {
		if(designerDiv) {
			designerDiv.setAttribute('data-nav-ready', 'true');
		}
	}
	
	function StenciladdtoCart() {
		if($('.productView-details .productView-info').length) {
			$('.productView-details .productView-info').each(function() {
				console.log($.trim($('.productView-info-name',this).text()));
				if($.trim($('.productView-info-name',this).text()).indexOf('doogma-thumb') > -1) {
					var imageLink = $('.productView-info-value',this).text();
					$('.productView-image img').attr('src',imageLink);
					console.log(imageLink);
				}
			});
		}
	}
	
	$(function() {
	    if($('input[name=product_id]').length) {
	        var productID = $('input[name=product_id]').val();
			fetchProducts(productID,storehash);
	        fetchOptions(productID,storehash);		
	        fetchOptionValues(productID,storehash);
			$('body').on('click', '#swipeTarget', function() {
				scrollToOption(productID);
			});
	    }
		
		if($('form[name=cartForm]').length) {
			if($('form[name=cartForm] .CartContents').length) {
				$('form[name=cartForm] .CartContents tbody tr').each(function() {
					var _tr = $(this);
					if($('td',this).hasClass('ProductName')) {
						var _thisName = $('td.ProductName',this);
						if(_thisName.find('table.productAttributes').length) {
							_thisName.find('table.productAttributes tbody tr').each(function() {
								if($.trim($(this).text()).indexOf('doogma-thumb') > -1 ) {
									var imageLink = $.trim($(this).text()).split('doogma-thumb:')[1];
									if(_tr.find('td').hasClass('CartThumb')) {
										var _this = _tr.find('td.CartThumb');
										_this.find('img').attr('src',imageLink);
									}
								}
								if($.trim($(this).text()).indexOf('saved design link') > -1 ) {
									var productLink = $.trim($(this).text()).split('saved design link:')[1];
									_thisName.find(' a:first').attr('href',productLink);
									if(_tr.find('td').hasClass('CartThumb')) {
										var _this = _tr.find('td.CartThumb');
										_this.find('a').attr('href',productLink);
									}
								}
							});
						}
					}
				});
			}
			
			if($('form[name=cartForm] .CartList').length) {
				$('form[name=cartForm] .CartList li').each(function() {
					var _tr = $(this);
					if($('.ProductDetails',this).length) {
						var _thisName = $('.ProductDetails',this);
						if(_thisName.find('table.productAttributes').length) {
							_thisName.find('table.productAttributes tbody tr').each(function() {
								if($.trim($(this).text()).indexOf('doogma-thumb') > -1 ) {
									var imageLink = $.trim($(this).text()).split('doogma-thumb:')[1];
									if(_tr.find('.ProductImage').length) {
										var _this = _tr.find('.ProductImage');
										_this.find('img').attr('src',imageLink);
									}
								}
								if($.trim($(this).text()).indexOf('saved design link') > -1 ) {
									var productLink = $.trim($(this).text()).split('saved design link:')[1];
									_thisName.find(' a:first').attr('href',productLink);
									if(_tr.find('.ProductImage').length) {
										var _this = _tr.find('.ProductImage');
										_this.find('a').attr('href',productLink);
									}
								}
							});
						}
					}
				});
			}
		}
		
		if($('.cart').length) {
			$('.cart tbody.cart-list tr').each(function(index) {
				var _tr = $(this);
				if($('td',this).hasClass('cart-item-title')) {
					var _thisName = $('td.cart-item-title',this);
					$('td.cart-item-title .definitionList-key',this).each(function() {
						if($.trim($(this).text()).indexOf('saved design link') > -1 ) {
							var productLink = $.trim($(this).next('.definitionList-value').text());
							_thisName.find('.cart-item-name a').attr('href',productLink);
						}
						if($.trim($(this).text()).indexOf('doogma-thumb') > -1 ) {
							var imageLink = $.trim($(this).next('.definitionList-value').text());
							if(_tr.find('td').hasClass('cart-item-figure')) {
								var _this = _tr.find('td.cart-item-figure');
								_this.html('<img src="'+imageLink+'" />');
								//_this.find('img').attr('src',imageLink);
							}
						}
					});
				}
			});
			$('body').on('click', '.cart-remove', function() {
				setTimeout(function(){ location.reload(); }, 2500);
			});
		}
		
		if($('div[data-cart-content]').length) {
			$('div[data-cart-content] .cart-item').each(function(index) {
				var _tr = $(this);
				if($('.cart-item-name',this)) {
					var _thisName = $('.cart-item-name',this);
					_thisName.next('.cart-item-option-item').each(function() {
						if($.trim($('.cart-item-option-label',this).text()).indexOf('saved design link') > -1 ) {
							var productLink = $.trim($('.cart-item-option-value',this).text());
							_thisName.find('a').attr('href',productLink);
						}
						if($.trim($('.cart-item-option-label',this).text()).indexOf('doogma-thumb') > -1 ) {
							var imageLink = $.trim($('.cart-item-option-value',this).text());
							if(_tr.find('.cart-item-image')) {
								var _this = _tr.find('.cart-item-image');
								_this.html('<img src="'+imageLink+'" />');
								//_this.find('img').attr('src',imageLink);
							}
						}
					});
				}
			});
			$('body').on('click', 'a[data-cart-item-remove]', function() {
				setTimeout(function(){ location.reload(); }, 2500);
			});
		}
		
	});
	
	if($('#form-action-addToCart').length) {
		$('body').on('click', '#form-action-addToCart', function (){
			if($('form .form-field').length) {
				var ProName = $('.productView-title').text();
				$('form .form-field[data-product-attribute]').each(function() {
					var _this = $(this);
					var optionName = $.trim($('label.form-label',this).text().split(':')[0]);
					if( optionName == 'saved design link') {
						var productLink = $('input',this).val();
						createCookie(ProName+'link',productLink,1);
					}
					if( optionName == 'doogma-thumb') {
						var doogmaThumb = $('textarea',this).val();
						createCookie(ProName+'thumb',doogmaThumb,1);
					}
				});
			}
			setTimeout(function(){ StenciladdtoCart(); }, 3000);
		});
	}
	
	if($('.AddCartButton').length) {
		$('body').on('click', '.AddCartButton', function (){
			if($('form .productAttributeRow').length) {
				var ProName = $('.ProductDetailsGrid h1').text();
				$('form .productAttributeRow').each(function() {
					var optionName = $.trim($('.productAttributeLabel label span.name',this).text().split(':')[0]);
					if( optionName == 'saved design link') {
						var productLink = $('.productAttributeValue input',this).val();
						createCookie('currentProductLink',productLink,1);
					}
					if( optionName == 'doogma-thumb') {
						var doogmaThumb = $('.productAttributeValue textarea',this).val();
						createCookie('currentProductThumb',doogmaThumb,1);
					}
				});
			}
		});
	}
	
	/* $('body').on('click', 'a[data-dropdown=cart-preview-dropdown]', function(){
		setTimeout(function(){
			if($('#cart-preview-dropdown .previewCartList').length) {
				$('#cart-preview-dropdown .previewCartList li').each(function() {
					var Prolink = $('.previewCartItem-content .previewCartItem-name a:first',this).text();
					$('.previewCartItem-content .previewCartItem-name a:first',this).attr('href',readCookie(Prolink+'link'));
					$('.previewCartItem-image img',this).attr('src',readCookie(Prolink+'thumb'));
				});
			}
		}, 2000);
	}); */
	
	$('body').on('click', '.quickview', function(){
		setTimeout(function(){
			var productID = $('input[name=product_id]').val();
			fetchProducts(productID,storehash);
			fetchOptions(productID,storehash);
			fetchOptionValues(productID,storehash);
			$('body').on('click', '#form-action-addToCart', function (){
				setTimeout(function(){ StenciladdtoCart(); }, 3000);
			});
		}, 1500);
	});
	
	$(document).ajaxComplete(function( event, xhr, settings ) {
		if (settings.url.indexOf('/remote.php?w=getproductquickview') > -1) {
			setTimeout(function(){
				var productID = $('input[name=product_id]').val();
				fetchProducts(productID,storehash);
				fetchOptions(productID,storehash);
				fetchOptionValues(productID,storehash);
			}, 1500);
		}
		if (settings.url.indexOf('/cart.php') > -1) {
			$('.fastCartThumb img').attr('src',readCookie('currentProductThumb'));
			$('.fastCartThumb img').attr('width','200px');
			$('.fastCartItemBox div a').attr('href',readCookie('currentProductLink'));
		}
	});
	
	
	// +---------------------+
	// |  Utility Functions  |
	// +---------------------+
	/**
	 * Manipulates a URL by using "a" (Anchor) DOMElement. If input url is not absolute url then computation is done relative to document's current page.
	 * It means if protocol and host in input url is missing then the current document protocol and host is used as protocol and host of input url.
	 * If url starts without a forwarding slash then current page's base path is used as base of input url.
	 * 
	 * Important: Do not set a url directly through 'href' property, instead set url through 'setUrl()' function.
	 * 
	 * @param value {String} URL value. If it is missing then document URL is used instead.
	 * 
	 * @returns a {DOMElement} An anchor DOMElement with extended functionalities for URL manipulation 
	 */
	function docurl(value) {
	    var a = document.createElement('a');
	    if(typeof value == 'undefined') {
	    	setUrl(document.location.href);
	    } else {
	    	setUrl(value);
	    }
	    a.setUrl = setUrl;
	    a.hasSearch = hasSearch;
	    a.getSearch = getSearch;
	    a.setSearch = setSearch;
	    a.removeSearch = removeSearch;
	    return a;
	    
	    
	    function setUrl(value) {
	        if(value = value.trim()) {
	            a.setAttribute('href',value);
	        } else {
	            a.removeAttribute('href');
	        }
	        return this;
	    }
	    
	    function hasSearch(prop) {
	        return typeof getSearch(prop)=='string';
	    }
	    
	    function getSearch(prop) {
	        var s = a.search;
	        if(s.length<2) {
	            return undefined;
	        }
	        var m = s.match(new RegExp('[\\?&]'+prop+'(=[^&]*)?(&|$)'));
	        if(!m) {
	            return undefined;
	        }
	        m = m[0];
	        s = m.slice(1, m[m.length-1]=='&'?-1:m.length);
	        m = s.indexOf('=');
	        return m == -1? '' : decodeURIComponent(s.slice(m+1));
	    }
	    
	    function setSearch(prop,val) {
	        if(typeof val=='undefined') {
	            var val = '';
	        } else {
	            val = decodeURIComponent(val)==val? encodeURIComponent(val) : val;
	        }
	        var s = a.search;
	                
	        // search
	        var f = new RegExp('[\\?&]'+prop+'(=[^&]*)?(&|$)').exec(s);
	        
	        if(val) {
	            prop += '=' + val;
	        }
	        if(f) {  // replace existing
	            var e = f.index+f[0].length;
	            e = e==s.length? '' : s.slice(e-1);
	            s = s.slice(0, f.index+1) + prop + e;
	        } else { // add new
	            if(s.length>1) {
	                s += '&' + prop;
	            } else {
	                s += prop;
	            }
	        }
	        a.search = s;
	        return this;
	    }
	    
	    function removeSearch(prop) {
	        var s = a.search;
	        var f = new RegExp('[\\?&]'+prop+'(=[^&]*)?(&|$)').exec(s);
	        if(!f) {
	            return this;
	        }
	        var e = f.index+f[0].length;
	        if(f.index>0 && e<s.length) {
	            e--;
	        }
	        a.search = s.slice(0, f.index) + s.slice(e);
	        return this;
	    }
	}
})();
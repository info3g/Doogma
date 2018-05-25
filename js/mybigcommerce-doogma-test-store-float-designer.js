'use strict';
(function() {
	if(window.location.search.match(getSearchRegExp('nodoogma'))) {
		return;
	}
	
	function getSearchRegExp(parameter) {
    	return new RegExp('[\?&]'+parameter+'(=[^&]*|&|$)');
    }
	
	// Scroll Behavior: Product Image scrolls with Navigation options.
	(function ImageScrollsWithOption() {
	
		var divImage = document.querySelector('.VisualizationContainer');
		var divImageStyle = {};
		var dummyDivImage;
		var dummyDivCopyStyles = ['margin'];
		var divOption = document.querySelectorAll('.NavigationContainer');
		var divOption_lowWidth = divOption[divOption.length-1].querySelector('[data-product-option-change]');
		var widthThreshold = 801;
		var headerHeight = 0;
		
		// Is Option's div layout neutral relative to divImage?
		// it means option's div layout doesn't break on inserting a dummy div with height greater than divImage's height.
		var isDivOptionLayoutNeutral = true;
	
		var isFloating = false;
	
		var onResize_previousWidth = document.body.clientWidth >= widthThreshold? 0 : Infinity;
		var onResize_ticking = false;
	
		var onScroll_reqToken;
		var prevDivImageTop = 0;
		var loopbackEffect = false;
		
		var onScrollLowWidth_reqToken;

	
		// Initialize
		(function() {
			// Add a dummy div for divImage (used for preventing layout break when the divImage position is set to fixed)
			dummyDivImage = divImage.cloneNode(false);
			for(var i=0; i<dummyDivCopyStyles.length; i++) {
				var styleName = dummyDivCopyStyles[i];
				dummyDivImage.style[styleName] = window.getComputedStyle(divImage).getPropertyValue(styleName);
			}
			dummyDivImage.setAttribute('id','doogmaVisDummyPlaceholder');
			dummyDivImage.style.display = 'none';
			divImage.parentElement.insertBefore(dummyDivImage, divImage);
			
			divImageStyle.position = divImage.style.position;
			divImageStyle.top = divImage.style.top;
			divImageStyle.left = divImage.style.left;
			divImageStyle.width = divImage.style.width;
			divImageStyle.textAlign = divImage.style.textAlign;
			divImageStyle.zIndex = divImage.style.zIndex;
			divImageStyle.backgroundColor = divImage.style.backgroundColor;
		
			onResize();
			window.addEventListener('resize',onResize);
		})();
		// End: Initialize

	
		function onResize() {
			if(!onResize_ticking) {
				window.requestAnimationFrame(function() {
					if(document.body.clientWidth >= widthThreshold) {
						if(onResize_previousWidth < widthThreshold) {
							onScroll_lowWidth.abort();
							window.removeEventListener('scroll',onScroll_lowWidth);
							revertImageContainerStyle();
							revertImageContainerStyle_lowWidth();
							
							window.addEventListener('scroll',onScroll);
						}						
						isFloating = true;  // Set value to force conditional block to execute in onScroll() function.
						onScroll();
					} else {
						if(onResize_previousWidth >= widthThreshold) {
							onScroll.abort();
							window.removeEventListener('scroll',onScroll);							
							revertImageContainerStyle();
							
							var header = document.querySelector('header');
							if(header) {
								headerHeight = header.clientHeight;
							}
							divImage.style.zIndex = 1;
							divImage.style.backgroundColor = 'white';
							divImage.style.textAlign = 'center';
							window.addEventListener('scroll',onScroll_lowWidth);
						}
						isFloating = false;  // Reset value to force conditional block to execute in onScroll_lowWidth() function.
						onScroll_lowWidth();
					}
					onResize_previousWidth = document.body.clientWidth;
					
					dummyDivImage.style.width = divImage.style.width;
					
					onResize_ticking = false;
				});
				onResize_ticking = true;
			}
		}
	
		function revertImageContainerStyle() {
			dummyDivImage.style.display = 'none';
			divImage.style.position = divImageStyle.position;
			divImage.style.top = divImageStyle.top;
			divImage.style.left = divImageStyle.left;
			divImage.style.width = divImageStyle.width;
		}

		function revertImageContainerStyle_lowWidth() {
			divImage.style.textAlign = divImageStyle.textAlign;
			divImage.style.zIndex = divImageStyle.zIndex;
			divImage.style.backgroundColor = divImageStyle.backgroundColor;
		}	
	
		function onScroll() {
			if (!onScroll_reqToken && !loopbackEffect) {
				onScroll_reqToken = window.requestAnimationFrame(function() {
					onScroll_reqToken = 0;
				
					var navBound = getBoundingClientRect(divOption);
					if(navBound.top >= 0) {
						if(isFloating) {
							revertImageContainerStyle();
							isFloating = false;
						}
					} else {
						var prevScrollY = window.scrollY;
						loopbackEffect = true;
						
						// Reset divImage's styles to get natural bounds
						revertImageContainerStyle();
						var imgBound = divImage.getBoundingClientRect();

						divImage.style.position = 'fixed';
						divImage.style.left = imgBound.left + 'px';
						divImage.style.width = imgBound.width + 'px';
						
						var dummyDivImageHeight = -imgBound.top + imgBound.height;

						var divImageTop = navBound.top + navBound.height - imgBound.height;
						if(divImageTop >= 0) {
							divImage.style.top = '0px';
							dummyDivImage.style.height = dummyDivImageHeight + 'px';
						} else {
							divImage.style.top = divImageTop+'px';
							if(prevDivImageTop >= 0) {
								dummyDivImage.style.height = dummyDivImageHeight + divImageTop + 'px';
							}
						}
						if(isDivOptionLayoutNeutral) {
							dummyDivImage.style.display = '';
							var navBound2 = getBoundingClientRect(divOption);
							if(navBound2.height != navBound.height) {
								dummyDivImage.style.display = 'none';
								isDivOptionLayoutNeutral = false;
							}
						}
						
						prevDivImageTop = divImageTop;
						isFloating = true;
						
						if(window.scrollY != prevScrollY) {
							window.scroll(window.scrollX,prevScrollY);
						}
						window.requestAnimationFrame(function() {
							loopbackEffect = false;
						});
					}
				});
			}
		}
		onScroll.abort = function() {
			if(onScroll_reqToken) {
				window.cancelAnimationFrame(onScroll_reqToken);
				onScroll_reqToken = 0;
			}
		};
		
		
		function onScroll_lowWidth() {
			if (!onScrollLowWidth_reqToken) {
				onScrollLowWidth_reqToken = window.requestAnimationFrame(function() {
					onScrollLowWidth_reqToken = 0;
					
					if(isFloating) {
						if(dummyDivImage.getBoundingClientRect().top >= headerHeight) {
							revertImageContainerStyle();
							isFloating = false;
						} else {
							positionDivImageLowWidth();
						}
					} else {
						if(divImage.getBoundingClientRect().top < headerHeight) {
							var prevScrollY = window.scrollY;
							divImage.style.position = 'fixed';
							divImage.style.width = divImage.parentElement.clientWidth + 'px';  // Fix for minor "x" position glitch on scroll
							positionDivImageLowWidth();
							dummyDivImage.style.display = '';
							if(window.scrollY != prevScrollY) {
								window.scroll(window.scrollX,prevScrollY);
							}
							isFloating = true;
						}
					}
				});
			}
		}
		
		onScroll_lowWidth.abort = function() {
			if(onScrollLowWidth_reqToken) {
				window.cancelAnimationFrame(onScrollLowWidth_reqToken);
				onScrollLowWidth_reqToken = 0;
			}
		};
		
		function positionDivImageLowWidth() {
			var divOptionLowWidthBound = divOption_lowWidth.getBoundingClientRect();
			var divOptionBottom = divOptionLowWidthBound.top + divOptionLowWidthBound.height;
			var divImageTop = divOptionBottom - divImage.clientHeight;
			divImage.style.top = (divImageTop <= headerHeight? divImageTop : headerHeight) + 'px';
			dummyDivImage.style.height = divImage.clientHeight + 'px';
		}
		
		function getBoundingClientRect(arrDiv) {
			var top = Infinity;
			var bottom = -Infinity;
			for(var i=0; i<arrDiv.length; i++) {
				var r = arrDiv[i].getBoundingClientRect();
				top = Math.min(top,r.top);
				bottom = Math.max(bottom,r.bottom);
			}
			return {
				top: top,
				height: bottom-top
			};
		}
	})();
	// END: Scroll Behavior
})();

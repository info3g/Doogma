'use strict';
(function() {
	// Scroll Behavior: Product Image scrolls with Navigation options.
	(function ImageScrollsWithOption() {
	
		var divImage = document.querySelector('.VisualizationContainer');
		var divImageStyle = {};
		var dummyDivImage;
		var dummyDivCopyStyles = ['margin'];
		var divOption = document.querySelectorAll('.NavigationContainer');
		
		// Is Option's div layout neutral relative to divImage?
		// it means option's div layout doesn't break on inserting a dummy div with height greater than divImage's height.
		var isDivOptionLayoutNeutral = true;
	
		var isFloating = false;
	
		// Initialize
		(function() {
			// Add a dummy div for divImage (used for preventing layout break when the divImage position is set to fixed)
			dummyDivImage = document.createElement('div');
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
		
			onResize();
			window.addEventListener('resize',onResize);
		})();
		// End: Initialize

	
		var onResize_previousWidth = 0;
		var onResize_ticking = false;
	
		function onResize() {
			if(!onResize_ticking) {
				window.requestAnimationFrame(function() {
					if(document.body.clientWidth >= 769) {
						if(onResize_previousWidth < 769) {
							window.addEventListener('scroll',onScroll);
						}						
						isFloating = true;  // Set value to force conditional block to execute in onScroll() function.
						onScroll();
					} else {
						if(onResize_previousWidth >= 770) {
							window.removeEventListener('scroll',onScroll);
							onScroll.abort();
							revertImageContainerStyle();
						}
					}
					onResize_previousWidth = document.body.clientWidth;
					
					dummyDivImage.style.width = divImage.style.width;
					
					onResize_ticking = false;
				});
				onResize_ticking = true;
			}
		}
	
		function revertImageContainerStyle() {
			divImage.style.position = divImageStyle.position;
			divImage.style.top = divImageStyle.top;
			divImage.style.left = divImageStyle.left;
			divImage.style.width = divImageStyle.width;
		}
	
	
		var onScroll_reqToken;
		var prevDivImageTop = 0;
		var loopbackEffect = false;
	
		function onScroll() {
			if (!onScroll_reqToken && !loopbackEffect) {
				onScroll_reqToken = window.requestAnimationFrame(function() {
					onScroll_reqToken = 0;
				
					var navBound = getBoundingClientRect(divOption);
					if(navBound.top >= 0) {
						if(isFloating) {
							dummyDivImage.style.display = 'none';
							divImage.style.position = divImageStyle.position;
							divImage.style.top = divImageStyle.top;
							divImage.style.left = divImageStyle.left;
							divImage.style.width = divImageStyle.width;
							isFloating = false;
						}
					} else {
						var prevScrollY = window.scrollY;
						loopbackEffect = true;
						
						// Reset divImage's styles to get natural bounds
						dummyDivImage.style.display = 'none';
						divImage.style.position = divImageStyle.position;
						divImage.style.top = divImageStyle.top;
						divImage.style.left = divImageStyle.left;
						divImage.style.width = divImageStyle.width;
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

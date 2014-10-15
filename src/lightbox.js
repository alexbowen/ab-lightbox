/**
 *  File: lightbox.js
 *  Directive: abLightbox
 *  Description: Adds a lightbox to the page. Compiles a remove directive when initialised
 *  Demo:
 *
 *  <button ab-lightbox='{"element" : "lbContent"}'>open lightbox</button>
 *
 *  <div class="lightbox" id="lbContent">
 *     <h2>Light box content</h2>
 *  </div>
 *
 *  Options:
 *
 *  className - class name to be added to active lightbox
 *  trigger - auto/manual
 *  element - content element
 *  type - normal/iframe
 */
 .directive('abLightbox', ['$compile', function ($compile) {
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {

                    var lightbox, options, overlay;

                    var defaults = {
                        'className' : false,
                        'trigger'   : 'manual',
                        'element'   : 'info',
                        'type'      : 'normal'
                    };

                    options = angular.extend(defaults, angular.fromJson(attrs.abLightbox));

                    // check if element is passed by the user
                    options.element = typeof options.element === 'string' ? document.getElementById(options.element) : options.element;

                    var addOverlay = function () {
                        if (document.getElementById('overlay')) return;

                        // compiling when we add it to have the close directive kick in
                        overlay = $compile('<div id="overlay" ab-lightbox-close/>')(scope);

                        // add a custom class if specified
                        if (options.className) overlay.addClass(options.className);

                        // append to dom
                        angular.element(document.body).append(overlay);

                        // load iframe options if defined
                        if (options.type === 'iframe') loadIframe();

                        // we need to flush the styles before applying a class for animations
                        window.getComputedStyle(overlay[0]).opacity;
                        overlay.addClass('overlay-active');
                        angular.element(options.element).addClass('lightbox-active');
                    };

                    var loadIframe = function () {
                        options.element = options.element || 'lightbox-iframe';
                        var iframe = "<div id='" + options.element + "' class='lightbox'><iframe frameBorder=0 width='100%' height='100%' src='" + attr.href + "'></iframe></div>";
                        angular.element(document.body).append(iframe);
                    };

                    if (options.trigger === 'auto') {
                        addOverlay();
                    } else {

                        element.bind('click', function (event) {
                            addOverlay();
                            event.preventDefault();
                            return false;
                        });
                    }
                }
            };
        }])
        .directive('abLightboxClose', function () {
            return {
                restrict: 'A',
                link: function (scope, element) {
                    var transition_events = ['webkitTransitionEnd', 'mozTransitionEnd', 'msTransitionEnd', 'oTransitionEnd', 'transitionend'];

                    angular.forEach(transition_events, function (event) {
                        element.bind(event, function () {
                            // on transitions, when the overlay doesnt have a class active, remove it
                            if (!angular.element(document.getElementById('overlay')).hasClass('overlay-active')) {
                                angular.element(document.getElementById('overlay')).remove();
                            }
                        });
                    });

                    // binding esc key to close
                    angular.element(document.body).bind('keydown', function (event) {
                        if (event.keyCode === 27) removeOverlay();
                    });

                    // binding click on overlay to close
                    element.bind('click', function () {
                        removeOverlay();
                    });

                    var removeOverlay = function () {
                        var overlay = document.getElementById('overlay');
                        angular.element(document.getElementsByClassName('lightbox-active')[0]).removeClass('lightbox-active');

                        // fallback for ie8 and lower to handle the overlay close without animations
                        if (angular.element(document.documentElement).hasClass('lt-ie9')) {
                            angular.element(overlay).remove();
                        } else {
                            angular.element(overlay).removeClass('overlay-active');
                        }
                    };
                }
            };
        });

/*
 * jQuery stayStill V1.0.0
 * Don't move !
 * tries to keep elements on screen when height of the container changes
 * https://github.com/jadus/jquery-stayStill
 * lucas.menant@gmail.com
 * Licensed under the MIT license
 */
;
(function ($, window, document, undefined) {

    "use strict";
    var defaults = {
        fixedHeaderSelector : "",// if you have a fixed header hidding the top of your screen
        fixedFooterSelector : ""// if you have a fixed footer hiding the bottom of your screen
    };

    function StayStill(container, options) {
        this.container = $(container);
        this.settings = $.extend({}, defaults, options);
        this.stayStillElementSelector = ".stay-still";
        this.stayStillElement = null;
        this.stayStillElementModify = null;
    }

    $.extend(StayStill.prototype, {
        saveState: function () {
            var self = this,
                minDistanceToScreenMiddle = null,
                scrollTop = $(window).scrollTop(),
                visibleScrollTop = scrollTop + $(self.settings.fixedHeaderSelector).outerHeight(),
                visibleScrollBottom = scrollTop + document.documentElement.clientHeight - $(self.settings.fixedFooterSelector).outerHeight(),
                visibleScrollMiddle = (visibleScrollTop + visibleScrollBottom) / 2;//the middle of your view

            self.stayStillElement = null;
            self.stayStillElementModify = null;

            //for each visible element
            self.container.find(self.stayStillElementSelector).filter(":visible").each(function(){
                var element = $(this),
                    elementTop = element.offset().top,
                    elementHeight = element.outerHeight(),
                    elementBottom = elementTop + elementHeight;

                //if the element is visible in the view
                if(elementTop < visibleScrollBottom && elementBottom > visibleScrollTop)
                {
                    var visibleElementTop = Math.max(elementTop, visibleScrollTop),
                        visibleElementBottom = Math.min(elementBottom, visibleScrollBottom),
                        elementDistanceToScreenMiddle = Math.min(Math.abs(visibleElementTop - visibleScrollMiddle), Math.abs(visibleElementBottom - visibleScrollMiddle));
                    //we choose the element closest to the middle of the view
                    if(minDistanceToScreenMiddle === null || elementDistanceToScreenMiddle < minDistanceToScreenMiddle)
                    {
                        minDistanceToScreenMiddle = elementDistanceToScreenMiddle;
                        self.stayStillElement = $(this);
                        self.stayStillElementModify = elementTop - scrollTop;
                    }
                }
            })
        },
        resetState: function () {
            var self = this;
            if(self.stayStillElement)
            {
                var maxScroll = document.documentElement.scrollHeight - document.documentElement.clientHeight,
                    scroll = Math.round(self.stayStillElement.offset().top) - Math.round(self.stayStillElementModify),
                    scroll = Math.min(scroll, maxScroll),
                    scroll = Math.max(scroll, 0);
                //we're scrolling immediatly to put back the chosen element to were it was before
                $(window).scrollTop(scroll);
                self.stayStillElement = null;
                self.stayStillElementModify = null;
            }
        }
    });

    $.fn.stayStill = function (opt) {
        var args = Array.prototype.slice.call(arguments, 1);
        return this.each(function () {
            var item = $(this), instance = item.data("stayStill");
            if (!instance) {
                instance = new StayStill(this, args);
                item.data("stayStill", instance);
            }
            if (typeof opt === "string") {
                instance[opt].apply(instance, args);
            }
        });
    };

})(jQuery, window, document);

(function ($) {
    "use strict";

    $.fn.countUp = function (options) {

        var settings = $.extend({
            time: 1500,    // faster
            delay: 15      // faster
        }, options);

        return this.each(function () {

            var $this = $(this);
            var rawText = $this.text().replace(/,/g, "").replace(/\+/g, "");
            var target = parseFloat(rawText);

            var duration = $this.data("counter-time") || settings.time;
            var delay = $this.data("counter-delay") || settings.delay;

            if (isNaN(target)) return;

            var steps = Math.ceil(duration / delay);
            var increment = target / steps;
            var current = 0;

            $this.text("0");

            function updateCounter() {
                current += increment;

                if (current >= target) {
                    $this.text(target.toLocaleString() + "+"); // Final output with "+"
                } else {
                    $this.text(Math.floor(current).toLocaleString());
                    setTimeout(updateCounter, delay);
                }
            }

            updateCounter();
        });
    };

})(jQuery);

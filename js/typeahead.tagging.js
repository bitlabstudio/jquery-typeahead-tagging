/*
 * jQuery Typeahead Tagging v0.2.1
 *
 * A jQuery plugin to allow managing tags with typeahead autocompletion.
 *
 * Latest source at https://github.com/bitmazk/jquery-typeahead-tagging
 *
 * Current issues/TODO:
 *  - prevent already added tags from showing up in the autocomplete results
 *  - prevent umlauts from being cleaned out
 *
 */
(function( $ ) {

    var globals = {
        $TAGGING_TAG: $('<li class="tagging_tag"></li>')
        , TAG_DELETE: '<span class="tag_delete">x</span>'
        , $TAGGING_NEW: $(
            '<li class="tagging_new"><input type="text" class="tagging_new_input" /></li>')
        , CLEANING_PATTERN: /[^\w\s-]+/g
    };

    // Plugin Methods =========================================================
    $.fn.tagging = function(tagsource) {

        // plugin code
        $(this).each(function(){

            // variable definition
            var $tagging_ul = $('<ul class="tagging_ul"></ul>'),
                $tagging_new = globals.$TAGGING_NEW.clone(),
                $tagging_new_input = $tagging_new.find('.tagging_new_input'),
                datasetname = 'tagging',
                original_input = $(this);

            // Item data
            original_input.taglist = [];

            // hide the original input
            original_input.hide();

            // split initial input value and put each in one li
            // ul styled like an input. li has tag style.
            $tagging_ul = append_ul(original_input, $tagging_ul, $tagging_new);

            // append another li with an input for new tags
            append_new($tagging_ul, $tagging_new, tagsource, datasetname);


            // Events =================================================================
            // Tag Input events
            $tagging_new_input.on('keydown', function(e) {

                if (e.keyCode === 13 || e.keyCode === 188) {
                    if ($(this).val()) {
                        e.preventDefault();
                        add_tag( $(this), original_input );
                        $(this).typeahead('val', '');
                        $(this).typeahead('close');
                    }
                }
                // if pressing backspace in an empty input, remove previous tag
                if (e.keyCode === 8) {
                    if (this.selectionStart === 0 && this.selectionEnd === 0) {
                        (function($this) {
                            var $tagging_tag = $this.parents('ul').find('li.tagging_tag').last();
                            e.preventDefault();
                            delete_tag($tagging_tag, original_input);
                        })($(this));
                    }
                }

            });

            // when clicking x inside taglike li remove tag
            $tagging_ul.find('.tag_delete').on('click', function() {
                delete_tag( $(this).parent(), original_input );
            });

            // focus the input for new tags when clicking the ul looking like an input
            $tagging_ul.on('click', function(e) {
                e.preventDefault();
                $tagging_new_input.focus();
            });

        });

        // Keep the chain
        return $(this);
    };


    // Private Function Definition ============================================
    function add_tag( $input, original_input ){

        // create a new tag from the input's value and insert it before the
        // input's parent li
        var $new_tag = globals.$TAGGING_TAG.clone()
          , value = $input.val().replace(globals.CLEANING_PATTERN, '').trim()
          , limit_exceeded = false;

        if (original_input.data('max-tags') && original_input.data('max-tags') <= original_input.taglist.length) {
            limit_exceeded = true;
        }

        if (value && !limit_exceeded) {
            $new_tag.html(value + globals.TAG_DELETE);
            $new_tag.insertBefore($input.parents('li'));
            original_input.taglist.push(value);

            // Add the delete event to the new tag
            $new_tag.find('.tag_delete').on('click', function() {
                delete_tag( $(this).parent(), original_input );
            });
        }

        sync_input( original_input );

    }

    function append_new($element, $tagging_new, tagsource, datasetname) {
        // append a new li to the tagging ul element with an input to add new
        // tags
        $element.append($tagging_new);
        // init typeahead
        init_typeahead($element.find('input.tagging_new_input'), tagsource, datasetname);
    }

    function append_ul($input, $tagging_ul, $tagging_new) {
        // splits a comma separated string of tags into an array of strings
        var tags = []
          , value
          , $tagging_tag;

        if ($input.val()) {
            tags = $input.val().split(',');
        }
        // fill the ul with li containing the tag names
        for (var i=0; i<tags.length; i++) {
            $tagging_tag = globals.$TAGGING_TAG.clone();
            value = tags[i].replace(globals.CLEANING_PATTERN, '').trim();
            $tagging_tag.html(value + globals.TAG_DELETE);
            $tagging_ul.append($tagging_tag);
            $input.taglist.push(value);
        }

        // append the new li with the input
        append_new($tagging_ul, $tagging_new);

        $tagging_ul.insertAfter($input);
        return $tagging_ul;
    }

    function delete_tag($tagging_tag, original_input) {
        // removes a tag and updates the hidden input
        var removed_tag = $tagging_tag.clone().children().remove().end().text(),
            tag_index = original_input.taglist.indexOf(removed_tag);

        original_input.taglist.splice(tag_index, 1);
        $tagging_tag.remove();

        sync_input( original_input );
    }

    function init_typeahead($input, tagsource, datasetname) {
        if (tagsource) {
            var substringMatcher = function(tagsource) {
                return function findMatches(q, cb) {
                    var matches, substrRegex;

                    // an array that will be populated with substring matches
                    matches = [];

                    // regex used to determine if a string contains the
                    // substring `q`
                    substrRegex = new RegExp(q, 'i');

                    // iterate through the pool of strings and for any string
                    // that contains the substring `q`, add it to the `matches`
                    // array
                    $.each(tagsource, function(i, str) {
                        if (substrRegex.test(str)) {
                            matches.push({ value: str });
                        }
                    });

                    cb(matches);
                };
            };

            $input.typeahead({
                hint: true
                , highlight: true
                , minLength: 1
            },
            {
                name: datasetname
                , displayKey: 'value'
                , source: substringMatcher(tagsource)
            });
        }
    }

    function sync_input( original_input ) {

        // updates the hidden input from the current taglist
        original_input.val(original_input.taglist.join(','));

    }

}( jQuery ));

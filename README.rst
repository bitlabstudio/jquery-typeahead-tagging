jQuery Typeahead Tagging
========================

A jQuery plugin to turn a regular input into a tag input with typeahead
autocompletion.

Check the example at `the project page
<https://bitmazk.github.io/jquery-typeahead-tagging/>`_.

Usage
-----

You need a regular text input.

.. code-block:: html

    <input type="text" id="taginput" value="">

And then you initialize the script.

.. code-block:: javascript

    // The source of the tags for autocompletion
    var tagsource = ['Foo', 'Bar', 'Anoter Tag', 'Even more tags',
                     'Such autocomplete', 'Many tags', 'Wow'];

    // Turn the input into the tagging input
    $('#taginput').tagging(tagsource);

There you go. All done.


If you want to limit the maximum amount of tags, that can be added, specify the maximum
amount as data attribute.

.. code-block:: html

    <!-- this input will only take 3 tags -->
    <input type="text" data-max-tags="3" id="taginput" value="">


The value of the input will be all tags separated by comma. E.g. ``Foo,Bar``.

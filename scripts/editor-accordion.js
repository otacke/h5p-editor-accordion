H5PEditor.Accordion = (function () {
  // Main widget class constructor
  function Accordion(parent, field, params, setValue) {
    const that = this;

    that.field = field;

    // Outsource readies
    that.passReadies = true;

    // No particular DOM for widget, just used to override Column's library options
    that.libraryAccordion = new H5PEditor.widgets[field.type](parent, field, params, setValue);

    // Remove Accordion as option from subcontent
    that.libraryAccordion.change(function () {
      // H5P.Column editor list (children[0]) has been loaded
      that.libraryAccordion.children[0].forEachChild(function (child) {
        const libraryColumn = H5PEditor.findField('content', child);
        libraryColumn.field.options = libraryColumn.field.options.filter(function (option) {
          return option.indexOf('H5P.Accordion ') === -1;
        });
      });
    });

    /**
     * Add to DOM.
     * @public
     * @param {H5P.jQuery} $container Editor container.
     */
    that.appendTo = function ($container) {
      that.libraryAccordion.appendTo($container);
    };

    /**
     * Validate.
     * @public
     * @return {boolean} True, because H5P.Column os always used.
     */
    that.validate = function () {
      return true;
    };

    that.remove = function () {
      // Can't be removed as H5P.Column is only option
    };
  }

  return Accordion;
})();

// Register widget
H5PEditor.widgets.editorAccordion = H5PEditor.Accordion;

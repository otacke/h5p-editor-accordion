H5PEditor.Accordion = (function () {
  // Main widget class constructor
  function Accordion(parent, field, params, setValue) {
    const that = this;

    that.field = field;

    // Outsource readies
    that.passReadies = true;

    /**
     * Sanitize Column options.
     */
    const sanitizeColumnOptions = function () {
      // H5P.Column editor list needs to be loaded
      if (!that.libraryAccordion || !that.libraryAccordion.children || that.libraryAccordion.children.length === 0) {
        return;
      }

      // Remove Accordion from Column options
      that.libraryAccordion.children[0].forEachChild(function (child) {
        const libraryColumn = H5PEditor.findField('content', child);
        libraryColumn.field.options = libraryColumn.field.options.filter(function (option) {
          return option.indexOf('H5P.Accordion ') === -1;
        });
      });
    };

    /**
     * Find ids of Accordion instances in Column.
     * @return {number[]} Ids of Accordion instances in Column.
     */
    const findAccordionIds = function () {
      if (!that.libraryAccordion || !that.libraryAccordion.params || !that.libraryAccordion.params.params || !that.libraryAccordion.params.params.content) {
        return;
      }

      const columnContents = that.libraryAccordion.params.params.content;

      // Get ids of Accordions inside Column
      const columnAccordionIds = [];
      for (let i = columnContents.length - 1; i >= 0; i--) {
        if (columnContents[i].content && columnContents[i].content.library && columnContents[i].content.library.indexOf('H5P.Accordion ') !== -1) {
          columnAccordionIds.push(i);
        }
      }

      return columnAccordionIds;
    };

    /**
     * Sanitize Column parameters.
     * @param {number[]} columnAccordionIds Ids of Accordion instances in Column.
     */
    const sanitizeColumnParams = function (columnAccordionIds) {
      if (!columnAccordionIds) {
        return;
      }

      if (!that.libraryAccordion || !that.libraryAccordion.params || !that.libraryAccordion.params.params || !that.libraryAccordion.params.params.content) {
        return;
      }

      // Remove Accordions from params
      that.libraryAccordion.params.params.content = that.libraryAccordion.params.params.content.filter(function (content, index) {
        return columnAccordionIds.indexOf(index) === -1;
      });
    };

    /**
     * Sanitize Column DOM in editor.
     * @param {number[]} columnAccordionIds Ids of Accordion instances in Column.
     */
    const sanitizeColumnDOM = function (columnAccordionIds) {
      if (!columnAccordionIds) {
        return;
      }

      // Remove Accordions from editor DOM
      const columnContentsDOM = that.libraryAccordion.$libraryWrapper.get(0).querySelector('.list > .h5peditor-widget-wrapper > ul');
      if (!columnContentsDOM.childNodes) {
        return;
      }

      columnAccordionIds.forEach(function (id) {
        that.libraryAccordion.children[0].removeItem(id);
        if (columnContentsDOM.childNodes.length > id) {
          columnContentsDOM.removeChild(columnContentsDOM.childNodes[id]);
        }
      });
    };

    // No particular DOM for widget, just used to override Column's library options
    that.libraryAccordion = new H5PEditor.widgets[field.type](parent, field, params, setValue);

    // Remove Accordion as option from subcontent
    that.libraryAccordion.change(function () {
      const columnAccordionIds = findAccordionIds();
      sanitizeColumnParams(columnAccordionIds);
      sanitizeColumnDOM(columnAccordionIds);
      sanitizeColumnOptions();
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

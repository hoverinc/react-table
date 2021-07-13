'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.advancedExpandTableHOC = exports.columnsWithToggle = exports.subComponentWithToggle = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _lodash = require('lodash.set');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require('lodash.get');

var _lodash4 = _interopRequireDefault(_lodash3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
  AdvancedExpandTableHOC for ReactTable

  HOC which allows any Cell in the row to toggle the row's
  SubComponent. Also allows the SubComponent to toggle itself.

  Expand functions available to any SubComponent or Column Cell:
    toggleRowSubComponent
    showRowSubComponent
    hideRowSubComponent

  Each Column Renderer (E.g. Cell ) gets the expand functions in its props
  And Each SubComponent gets the expand functions in its props

  Expand functions takes the `rowInfo` given to each
  Column Renderer and SubComponent already by ReactTable.
*/

var subComponentWithToggle = exports.subComponentWithToggle = function subComponentWithToggle(SubComponent, expandFuncs) {
  return function (props) {
    return _react2.default.createElement(SubComponent, _extends({}, props, expandFuncs));
  };
};

// each cell in the column gets passed the function to toggle a sub component
var columnsWithToggle = exports.columnsWithToggle = function columnsWithToggle(columns, expandFuncs) {
  return columns.map(function (column) {
    if (column.columns) {
      return _extends({}, column, {
        columns: columnsWithToggle(column.columns, expandFuncs)
      });
    }
    return _extends({}, column, {
      getProps: function getProps() {
        return _extends({}, expandFuncs);
      }
    });
  });
};

var advancedExpandTableHOC = function advancedExpandTableHOC(TableComponent) {
  var _class, _temp;

  return _temp = _class = function (_Component) {
    _inherits(AdvancedExpandTable, _Component);

    _createClass(AdvancedExpandTable, null, [{
      key: 'getDerivedStateFromProps',

      // after initial render if we get new
      // data, columns, page changes, etc.
      // we reset expanded state.
      value: function getDerivedStateFromProps() {
        return {
          expanded: {}
        };
      }
    }]);

    function AdvancedExpandTable(props) {
      _classCallCheck(this, AdvancedExpandTable);

      var _this = _possibleConstructorReturn(this, (AdvancedExpandTable.__proto__ || Object.getPrototypeOf(AdvancedExpandTable)).call(this, props));

      _this.state = {
        expanded: {}
      };
      _this.toggleRowSubComponent = _this.toggleRowSubComponent.bind(_this);
      _this.showRowSubComponent = _this.showRowSubComponent.bind(_this);
      _this.hideRowSubComponent = _this.hideRowSubComponent.bind(_this);
      _this.getTdProps = _this.getTdProps.bind(_this);
      _this.fireOnExpandedChange = _this.fireOnExpandedChange.bind(_this);
      _this.expandFuncs = {
        toggleRowSubComponent: _this.toggleRowSubComponent,
        showRowSubComponent: _this.showRowSubComponent,
        hideRowSubComponent: _this.hideRowSubComponent
      };
      return _this;
    }

    _createClass(AdvancedExpandTable, [{
      key: 'fireOnExpandedChange',
      value: function fireOnExpandedChange(rowInfo, e) {
        // fire callback once state has changed.
        if (this.props.onExpandedChange) {
          this.props.onExpandedChange(rowInfo, e);
        }
      }
    }, {
      key: 'resolveNewTableState',
      value: function resolveNewTableState(rowInfoOrNestingPath, e, expandType) {
        var _this2 = this;

        // derive nestingPath if only rowInfo is passed
        var nestingPath = rowInfoOrNestingPath;

        if (rowInfoOrNestingPath.nestingPath) {
          nestingPath = rowInfoOrNestingPath.nestingPath;
        }

        this.setState(function (prevState) {
          var isExpanded = (0, _lodash4.default)(prevState.expanded, nestingPath);
          // since we do not support nested rows, a shallow clone is okay.
          var newExpanded = _extends({}, prevState.expanded);

          switch (expandType) {
            case 'show':
              (0, _lodash2.default)(newExpanded, nestingPath, {});
              break;
            case 'hide':
              (0, _lodash2.default)(newExpanded, nestingPath, false);
              break;
            default:
              // toggle
              (0, _lodash2.default)(newExpanded, nestingPath, isExpanded ? false : {});
          }
          return _extends({}, prevState, {
            expanded: newExpanded
          });
        }, function () {
          return _this2.fireOnExpandedChange(rowInfoOrNestingPath, e);
        });
      }
    }, {
      key: 'toggleRowSubComponent',
      value: function toggleRowSubComponent(rowInfo, e) {
        this.resolveNewTableState(rowInfo, e);
      }
    }, {
      key: 'showRowSubComponent',
      value: function showRowSubComponent(rowInfo, e) {
        this.resolveNewTableState(rowInfo, e, 'show');
      }
    }, {
      key: 'hideRowSubComponent',
      value: function hideRowSubComponent(rowInfo, e) {
        this.resolveNewTableState(rowInfo, e, 'hide');
      }
    }, {
      key: 'getTdProps',
      value: function getTdProps(tableState, rowInfo, column) {
        var _this3 = this;

        var expander = column.expander;


        if (!expander) {
          // no overrides
          return {};
        }

        return {
          // only override onClick for column Td
          onClick: function onClick(e) {
            _this3.toggleRowSubComponent(rowInfo, e);
          }
        };
      }
    }, {
      key: 'getWrappedInstance',
      value: function getWrappedInstance() {
        if (!this.wrappedInstance) {
          console.warn('AdvancedExpandTable - No wrapped instance');
        }
        if (this.wrappedInstance.getWrappedInstance) {
          return this.wrappedInstance.getWrappedInstance();
        }
        return this.wrappedInstance;
      }
    }, {
      key: 'render',
      value: function render() {
        var _props = this.props,
            columns = _props.columns,
            SubComponent = _props.SubComponent,
            onExpandedChange = _props.onExpandedChange,
            rest = _objectWithoutProperties(_props, ['columns', 'SubComponent', 'onExpandedChange']);

        var wrappedColumns = columnsWithToggle(columns, this.expandFuncs);
        var WrappedSubComponent = subComponentWithToggle(SubComponent, this.expandFuncs);

        return _react2.default.createElement(TableComponent, _extends({}, rest, {
          columns: wrappedColumns,
          expanded: this.state.expanded,
          getTdProps: this.getTdProps,
          SubComponent: WrappedSubComponent,
          TdComponent: AdvancedExpandTable.TdComponent
        }));
      }
    }], [{
      key: 'TdComponent',


      // since we pass the expand functions to each Cell,
      // we need to filter it out from being passed as an
      // actual DOM attribute. See getProps in columnsWithToggle above.
      value: function TdComponent(_ref) {
        var toggleRowSubComponent = _ref.toggleRowSubComponent,
            showRowSubComponent = _ref.showRowSubComponent,
            hideRowSubComponent = _ref.hideRowSubComponent,
            rest = _objectWithoutProperties(_ref, ['toggleRowSubComponent', 'showRowSubComponent', 'hideRowSubComponent']);

        // eslint-disable-next-line react/jsx-pascal-case
        return _react2.default.createElement(TableComponent.defaultProps.TdComponent, rest);
      }
    }]);

    return AdvancedExpandTable;
  }(_react.Component), _class.propTypes = {
    columns: _propTypes2.default.array.isRequired,
    SubComponent: _propTypes2.default.oneOfType([_propTypes2.default.func, _propTypes2.default.element]).isRequired,
    onExpandedChange: _propTypes2.default.func
  }, _class.defaultProps = {
    onExpandedChange: null
  }, _class.DisplayName = 'AdvancedExpandTable', _temp;
};
exports.advancedExpandTableHOC = advancedExpandTableHOC;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9ob2MvYWR2YW5jZWRFeHBhbmRUYWJsZS9pbmRleC5qcyJdLCJuYW1lcyI6WyJzdWJDb21wb25lbnRXaXRoVG9nZ2xlIiwiU3ViQ29tcG9uZW50IiwiZXhwYW5kRnVuY3MiLCJwcm9wcyIsImNvbHVtbnNXaXRoVG9nZ2xlIiwiY29sdW1ucyIsIm1hcCIsImNvbHVtbiIsImdldFByb3BzIiwiYWR2YW5jZWRFeHBhbmRUYWJsZUhPQyIsImV4cGFuZGVkIiwic3RhdGUiLCJ0b2dnbGVSb3dTdWJDb21wb25lbnQiLCJiaW5kIiwic2hvd1Jvd1N1YkNvbXBvbmVudCIsImhpZGVSb3dTdWJDb21wb25lbnQiLCJnZXRUZFByb3BzIiwiZmlyZU9uRXhwYW5kZWRDaGFuZ2UiLCJyb3dJbmZvIiwiZSIsIm9uRXhwYW5kZWRDaGFuZ2UiLCJyb3dJbmZvT3JOZXN0aW5nUGF0aCIsImV4cGFuZFR5cGUiLCJuZXN0aW5nUGF0aCIsInNldFN0YXRlIiwiaXNFeHBhbmRlZCIsInByZXZTdGF0ZSIsIm5ld0V4cGFuZGVkIiwicmVzb2x2ZU5ld1RhYmxlU3RhdGUiLCJ0YWJsZVN0YXRlIiwiZXhwYW5kZXIiLCJvbkNsaWNrIiwid3JhcHBlZEluc3RhbmNlIiwiY29uc29sZSIsIndhcm4iLCJnZXRXcmFwcGVkSW5zdGFuY2UiLCJyZXN0Iiwid3JhcHBlZENvbHVtbnMiLCJXcmFwcGVkU3ViQ29tcG9uZW50IiwiQWR2YW5jZWRFeHBhbmRUYWJsZSIsIlRkQ29tcG9uZW50IiwiQ29tcG9uZW50IiwicHJvcFR5cGVzIiwiUHJvcFR5cGVzIiwiYXJyYXkiLCJpc1JlcXVpcmVkIiwib25lT2ZUeXBlIiwiZnVuYyIsImVsZW1lbnQiLCJkZWZhdWx0UHJvcHMiLCJEaXNwbGF5TmFtZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBa0JPLElBQU1BLDBE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ZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50IH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnXG5pbXBvcnQgc2V0IGZyb20gJ2xvZGFzaC5zZXQnXG5pbXBvcnQgZ2V0IGZyb20gJ2xvZGFzaC5nZXQnXG5cbi8qXG4gIEFkdmFuY2VkRXhwYW5kVGFibGVIT0MgZm9yIFJlYWN0VGFibGVcblxuICBIT0Mgd2hpY2ggYWxsb3dzIGFueSBDZWxsIGluIHRoZSByb3cgdG8gdG9nZ2xlIHRoZSByb3cnc1xuICBTdWJDb21wb25lbnQuIEFsc28gYWxsb3dzIHRoZSBTdWJDb21wb25lbnQgdG8gdG9nZ2xlIGl0c2VsZi5cblxuICBFeHBhbmQgZnVuY3Rpb25zIGF2YWlsYWJsZSB0byBhbnkgU3ViQ29tcG9uZW50IG9yIENvbHVtbiBDZWxsOlxuICAgIHRvZ2dsZVJvd1N1YkNvbXBvbmVudFxuICAgIHNob3dSb3dTdWJDb21wb25lbnRcbiAgICBoaWRlUm93U3ViQ29tcG9uZW50XG5cbiAgRWFjaCBDb2x1bW4gUmVuZGVyZXIgKEUuZy4gQ2VsbCApIGdldHMgdGhlIGV4cGFuZCBmdW5jdGlvbnMgaW4gaXRzIHByb3BzXG4gIEFuZCBFYWNoIFN1YkNvbXBvbmVudCBnZXRzIHRoZSBleHBhbmQgZnVuY3Rpb25zIGluIGl0cyBwcm9wc1xuXG4gIEV4cGFuZCBmdW5jdGlvbnMgdGFrZXMgdGhlIGByb3dJbmZvYCBnaXZlbiB0byBlYWNoXG4gIENvbHVtbiBSZW5kZXJlciBhbmQgU3ViQ29tcG9uZW50IGFscmVhZHkgYnkgUmVhY3RUYWJsZS5cbiovXG5cbmV4cG9ydCBjb25zdCBzdWJDb21wb25lbnRXaXRoVG9nZ2xlID0gKFN1YkNvbXBvbmVudCwgZXhwYW5kRnVuY3MpID0+IHByb3BzID0+IChcbiAgPFN1YkNvbXBvbmVudCB7Li4ucHJvcHN9IHsuLi5leHBhbmRGdW5jc30gLz5cbilcblxuLy8gZWFjaCBjZWxsIGluIHRoZSBjb2x1bW4gZ2V0cyBwYXNzZWQgdGhlIGZ1bmN0aW9uIHRvIHRvZ2dsZSBhIHN1YiBjb21wb25lbnRcbmV4cG9ydCBjb25zdCBjb2x1bW5zV2l0aFRvZ2dsZSA9IChjb2x1bW5zLCBleHBhbmRGdW5jcykgPT5cbiAgY29sdW1ucy5tYXAoY29sdW1uID0+IHtcbiAgICBpZiAoY29sdW1uLmNvbHVtbnMpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLmNvbHVtbixcbiAgICAgICAgY29sdW1uczogY29sdW1uc1dpdGhUb2dnbGUoY29sdW1uLmNvbHVtbnMsIGV4cGFuZEZ1bmNzKSxcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLmNvbHVtbixcbiAgICAgIGdldFByb3BzICgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAuLi5leHBhbmRGdW5jcyxcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICB9XG4gIH0pXG5cbmV4cG9ydCBjb25zdCBhZHZhbmNlZEV4cGFuZFRhYmxlSE9DID0gVGFibGVDb21wb25lbnQgPT5cbiAgY2xhc3MgQWR2YW5jZWRFeHBhbmRUYWJsZSBleHRlbmRzIENvbXBvbmVudCB7XG4gICAgLy8gYWZ0ZXIgaW5pdGlhbCByZW5kZXIgaWYgd2UgZ2V0IG5ld1xuICAgIC8vIGRhdGEsIGNvbHVtbnMsIHBhZ2UgY2hhbmdlcywgZXRjLlxuICAgIC8vIHdlIHJlc2V0IGV4cGFuZGVkIHN0YXRlLlxuICAgIHN0YXRpYyBnZXREZXJpdmVkU3RhdGVGcm9tUHJvcHMgKCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZXhwYW5kZWQ6IHt9LFxuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0cnVjdG9yIChwcm9wcykge1xuICAgICAgc3VwZXIocHJvcHMpXG4gICAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgICBleHBhbmRlZDoge30sXG4gICAgICB9XG4gICAgICB0aGlzLnRvZ2dsZVJvd1N1YkNvbXBvbmVudCA9IHRoaXMudG9nZ2xlUm93U3ViQ29tcG9uZW50LmJpbmQodGhpcylcbiAgICAgIHRoaXMuc2hvd1Jvd1N1YkNvbXBvbmVudCA9IHRoaXMuc2hvd1Jvd1N1YkNvbXBvbmVudC5iaW5kKHRoaXMpXG4gICAgICB0aGlzLmhpZGVSb3dTdWJDb21wb25lbnQgPSB0aGlzLmhpZGVSb3dTdWJDb21wb25lbnQuYmluZCh0aGlzKVxuICAgICAgdGhpcy5nZXRUZFByb3BzID0gdGhpcy5nZXRUZFByb3BzLmJpbmQodGhpcylcbiAgICAgIHRoaXMuZmlyZU9uRXhwYW5kZWRDaGFuZ2UgPSB0aGlzLmZpcmVPbkV4cGFuZGVkQ2hhbmdlLmJpbmQodGhpcylcbiAgICAgIHRoaXMuZXhwYW5kRnVuY3MgPSB7XG4gICAgICAgIHRvZ2dsZVJvd1N1YkNvbXBvbmVudDogdGhpcy50b2dnbGVSb3dTdWJDb21wb25lbnQsXG4gICAgICAgIHNob3dSb3dTdWJDb21wb25lbnQ6IHRoaXMuc2hvd1Jvd1N1YkNvbXBvbmVudCxcbiAgICAgICAgaGlkZVJvd1N1YkNvbXBvbmVudDogdGhpcy5oaWRlUm93U3ViQ29tcG9uZW50LFxuICAgICAgfVxuICAgIH1cblxuICAgIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgICBjb2x1bW5zOiBQcm9wVHlwZXMuYXJyYXkuaXNSZXF1aXJlZCxcbiAgICAgIFN1YkNvbXBvbmVudDogUHJvcFR5cGVzLm9uZU9mVHlwZShbUHJvcFR5cGVzLmZ1bmMsIFByb3BUeXBlcy5lbGVtZW50XSlcbiAgICAgICAgLmlzUmVxdWlyZWQsXG4gICAgICBvbkV4cGFuZGVkQ2hhbmdlOiBQcm9wVHlwZXMuZnVuYyxcbiAgICB9O1xuXG4gICAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IHtcbiAgICAgIG9uRXhwYW5kZWRDaGFuZ2U6IG51bGwsXG4gICAgfTtcblxuICAgIHN0YXRpYyBEaXNwbGF5TmFtZSA9ICdBZHZhbmNlZEV4cGFuZFRhYmxlJztcblxuICAgIC8vIHNpbmNlIHdlIHBhc3MgdGhlIGV4cGFuZCBmdW5jdGlvbnMgdG8gZWFjaCBDZWxsLFxuICAgIC8vIHdlIG5lZWQgdG8gZmlsdGVyIGl0IG91dCBmcm9tIGJlaW5nIHBhc3NlZCBhcyBhblxuICAgIC8vIGFjdHVhbCBET00gYXR0cmlidXRlLiBTZWUgZ2V0UHJvcHMgaW4gY29sdW1uc1dpdGhUb2dnbGUgYWJvdmUuXG4gICAgc3RhdGljIFRkQ29tcG9uZW50ICh7XG4gICAgICB0b2dnbGVSb3dTdWJDb21wb25lbnQsXG4gICAgICBzaG93Um93U3ViQ29tcG9uZW50LFxuICAgICAgaGlkZVJvd1N1YkNvbXBvbmVudCxcbiAgICAgIC4uLnJlc3RcbiAgICB9KSB7XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcmVhY3QvanN4LXBhc2NhbC1jYXNlXG4gICAgICByZXR1cm4gPFRhYmxlQ29tcG9uZW50LmRlZmF1bHRQcm9wcy5UZENvbXBvbmVudCB7Li4ucmVzdH0gLz5cbiAgICB9XG5cbiAgICBmaXJlT25FeHBhbmRlZENoYW5nZSAocm93SW5mbywgZSkge1xuICAgICAgLy8gZmlyZSBjYWxsYmFjayBvbmNlIHN0YXRlIGhhcyBjaGFuZ2VkLlxuICAgICAgaWYgKHRoaXMucHJvcHMub25FeHBhbmRlZENoYW5nZSkge1xuICAgICAgICB0aGlzLnByb3BzLm9uRXhwYW5kZWRDaGFuZ2Uocm93SW5mbywgZSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXNvbHZlTmV3VGFibGVTdGF0ZSAocm93SW5mb09yTmVzdGluZ1BhdGgsIGUsIGV4cGFuZFR5cGUpIHtcbiAgICAgIC8vIGRlcml2ZSBuZXN0aW5nUGF0aCBpZiBvbmx5IHJvd0luZm8gaXMgcGFzc2VkXG4gICAgICBsZXQgbmVzdGluZ1BhdGggPSByb3dJbmZvT3JOZXN0aW5nUGF0aFxuXG4gICAgICBpZiAocm93SW5mb09yTmVzdGluZ1BhdGgubmVzdGluZ1BhdGgpIHtcbiAgICAgICAgbmVzdGluZ1BhdGggPSByb3dJbmZvT3JOZXN0aW5nUGF0aC5uZXN0aW5nUGF0aFxuICAgICAgfVxuXG4gICAgICB0aGlzLnNldFN0YXRlKFxuICAgICAgICBwcmV2U3RhdGUgPT4ge1xuICAgICAgICAgIGNvbnN0IGlzRXhwYW5kZWQgPSBnZXQocHJldlN0YXRlLmV4cGFuZGVkLCBuZXN0aW5nUGF0aClcbiAgICAgICAgICAvLyBzaW5jZSB3ZSBkbyBub3Qgc3VwcG9ydCBuZXN0ZWQgcm93cywgYSBzaGFsbG93IGNsb25lIGlzIG9rYXkuXG4gICAgICAgICAgY29uc3QgbmV3RXhwYW5kZWQgPSB7IC4uLnByZXZTdGF0ZS5leHBhbmRlZCB9XG5cbiAgICAgICAgICBzd2l0Y2ggKGV4cGFuZFR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgJ3Nob3cnOlxuICAgICAgICAgICAgICBzZXQobmV3RXhwYW5kZWQsIG5lc3RpbmdQYXRoLCB7fSlcbiAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgJ2hpZGUnOlxuICAgICAgICAgICAgICBzZXQobmV3RXhwYW5kZWQsIG5lc3RpbmdQYXRoLCBmYWxzZSlcbiAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgIC8vIHRvZ2dsZVxuICAgICAgICAgICAgICBzZXQobmV3RXhwYW5kZWQsIG5lc3RpbmdQYXRoLCBpc0V4cGFuZGVkID8gZmFsc2UgOiB7fSlcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIC4uLnByZXZTdGF0ZSxcbiAgICAgICAgICAgIGV4cGFuZGVkOiBuZXdFeHBhbmRlZCxcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgICgpID0+IHRoaXMuZmlyZU9uRXhwYW5kZWRDaGFuZ2Uocm93SW5mb09yTmVzdGluZ1BhdGgsIGUpXG4gICAgICApXG4gICAgfVxuXG4gICAgdG9nZ2xlUm93U3ViQ29tcG9uZW50IChyb3dJbmZvLCBlKSB7XG4gICAgICB0aGlzLnJlc29sdmVOZXdUYWJsZVN0YXRlKHJvd0luZm8sIGUpXG4gICAgfVxuXG4gICAgc2hvd1Jvd1N1YkNvbXBvbmVudCAocm93SW5mbywgZSkge1xuICAgICAgdGhpcy5yZXNvbHZlTmV3VGFibGVTdGF0ZShyb3dJbmZvLCBlLCAnc2hvdycpXG4gICAgfVxuXG4gICAgaGlkZVJvd1N1YkNvbXBvbmVudCAocm93SW5mbywgZSkge1xuICAgICAgdGhpcy5yZXNvbHZlTmV3VGFibGVTdGF0ZShyb3dJbmZvLCBlLCAnaGlkZScpXG4gICAgfVxuXG4gICAgZ2V0VGRQcm9wcyAodGFibGVTdGF0ZSwgcm93SW5mbywgY29sdW1uKSB7XG4gICAgICBjb25zdCB7IGV4cGFuZGVyIH0gPSBjb2x1bW5cblxuICAgICAgaWYgKCFleHBhbmRlcikge1xuICAgICAgICAvLyBubyBvdmVycmlkZXNcbiAgICAgICAgcmV0dXJuIHt9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIC8vIG9ubHkgb3ZlcnJpZGUgb25DbGljayBmb3IgY29sdW1uIFRkXG4gICAgICAgIG9uQ2xpY2s6IGUgPT4ge1xuICAgICAgICAgIHRoaXMudG9nZ2xlUm93U3ViQ29tcG9uZW50KHJvd0luZm8sIGUpXG4gICAgICAgIH0sXG4gICAgICB9XG4gICAgfVxuXG4gICAgZ2V0V3JhcHBlZEluc3RhbmNlICgpIHtcbiAgICAgIGlmICghdGhpcy53cmFwcGVkSW5zdGFuY2UpIHsgY29uc29sZS53YXJuKCdBZHZhbmNlZEV4cGFuZFRhYmxlIC0gTm8gd3JhcHBlZCBpbnN0YW5jZScpIH1cbiAgICAgIGlmICh0aGlzLndyYXBwZWRJbnN0YW5jZS5nZXRXcmFwcGVkSW5zdGFuY2UpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMud3JhcHBlZEluc3RhbmNlLmdldFdyYXBwZWRJbnN0YW5jZSgpXG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy53cmFwcGVkSW5zdGFuY2VcbiAgICB9XG5cbiAgICByZW5kZXIgKCkge1xuICAgICAgY29uc3Qge1xuICAgICAgICBjb2x1bW5zLCBTdWJDb21wb25lbnQsIG9uRXhwYW5kZWRDaGFuZ2UsIC4uLnJlc3RcbiAgICAgIH0gPSB0aGlzLnByb3BzXG5cbiAgICAgIGNvbnN0IHdyYXBwZWRDb2x1bW5zID0gY29sdW1uc1dpdGhUb2dnbGUoY29sdW1ucywgdGhpcy5leHBhbmRGdW5jcylcbiAgICAgIGNvbnN0IFdyYXBwZWRTdWJDb21wb25lbnQgPSBzdWJDb21wb25lbnRXaXRoVG9nZ2xlKFxuICAgICAgICBTdWJDb21wb25lbnQsXG4gICAgICAgIHRoaXMuZXhwYW5kRnVuY3NcbiAgICAgIClcblxuICAgICAgcmV0dXJuIChcbiAgICAgICAgPFRhYmxlQ29tcG9uZW50XG4gICAgICAgICAgey4uLnJlc3R9XG4gICAgICAgICAgY29sdW1ucz17d3JhcHBlZENvbHVtbnN9XG4gICAgICAgICAgZXhwYW5kZWQ9e3RoaXMuc3RhdGUuZXhwYW5kZWR9XG4gICAgICAgICAgZ2V0VGRQcm9wcz17dGhpcy5nZXRUZFByb3BzfVxuICAgICAgICAgIFN1YkNvbXBvbmVudD17V3JhcHBlZFN1YkNvbXBvbmVudH1cbiAgICAgICAgICBUZENvbXBvbmVudD17QWR2YW5jZWRFeHBhbmRUYWJsZS5UZENvbXBvbmVudH1cbiAgICAgICAgLz5cbiAgICAgIClcbiAgICB9XG4gIH1cbiJdfQ==
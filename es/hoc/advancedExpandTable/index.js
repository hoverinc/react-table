var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import set from 'lodash.set';
import get from 'lodash.get';

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

export var subComponentWithToggle = function subComponentWithToggle(SubComponent, expandFuncs) {
  return function (props) {
    return React.createElement(SubComponent, _extends({}, props, expandFuncs));
  };
};

// each cell in the column gets passed the function to toggle a sub component
export var columnsWithToggle = function columnsWithToggle(columns, expandFuncs) {
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
          var isExpanded = get(prevState.expanded, nestingPath);
          // since we do not support nested rows, a shallow clone is okay.
          var newExpanded = _extends({}, prevState.expanded);

          switch (expandType) {
            case 'show':
              set(newExpanded, nestingPath, {});
              break;
            case 'hide':
              set(newExpanded, nestingPath, false);
              break;
            default:
              // toggle
              set(newExpanded, nestingPath, isExpanded ? false : {});
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

        return React.createElement(TableComponent, _extends({}, rest, {
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
        return React.createElement(TableComponent.defaultProps.TdComponent, rest);
      }
    }]);

    return AdvancedExpandTable;
  }(Component), _class.propTypes = {
    columns: PropTypes.array.isRequired,
    SubComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.element]).isRequired,
    onExpandedChange: PropTypes.func
  }, _class.defaultProps = {
    onExpandedChange: null
  }, _class.DisplayName = 'AdvancedExpandTable', _temp;
};
export { advancedExpandTableHOC };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9ob2MvYWR2YW5jZWRFeHBhbmRUYWJsZS9pbmRleC5qcyJdLCJuYW1lcyI6WyJSZWFjdCIsIkNvbXBvbmVudCIsIlByb3BUeXBlcyIsInNldCIsImdldCIsInN1YkNvbXBvbmVudFdpdGhUb2dnbGUiLCJTdWJDb21wb25lbnQiLCJleHBhbmRGdW5jcyIsInByb3BzIiwiY29sdW1uc1dpdGhUb2dnbGUiLCJjb2x1bW5zIiwibWFwIiwiY29sdW1uIiwiZ2V0UHJvcHMiLCJhZHZhbmNlZEV4cGFuZFRhYmxlSE9DIiwiZXhwYW5kZWQiLCJzdGF0ZSIsInRvZ2dsZVJvd1N1YkNvbXBvbmVudCIsImJpbmQiLCJzaG93Um93U3ViQ29tcG9uZW50IiwiaGlkZVJvd1N1YkNvbXBvbmVudCIsImdldFRkUHJvcHMiLCJmaXJlT25FeHBhbmRlZENoYW5nZSIsInJvd0luZm8iLCJlIiwib25FeHBhbmRlZENoYW5nZSIsInJvd0luZm9Pck5lc3RpbmdQYXRoIiwiZXhwYW5kVHlwZSIsIm5lc3RpbmdQYXRoIiwic2V0U3RhdGUiLCJpc0V4cGFuZGVkIiwicHJldlN0YXRlIiwibmV3RXhwYW5kZWQiLCJyZXNvbHZlTmV3VGFibGVTdGF0ZSIsInRhYmxlU3RhdGUiLCJleHBhbmRlciIsIm9uQ2xpY2siLCJ3cmFwcGVkSW5zdGFuY2UiLCJjb25zb2xlIiwid2FybiIsImdldFdyYXBwZWRJbnN0YW5jZSIsInJlc3QiLCJ3cmFwcGVkQ29sdW1ucyIsIldyYXBwZWRTdWJDb21wb25lbnQiLCJBZHZhbmNlZEV4cGFuZFRhYmxlIiwiVGRDb21wb25lbnQiLCJwcm9wVHlwZXMiLCJhcnJheSIsImlzUmVxdWlyZWQiLCJvbmVPZlR5cGUiLCJmdW5jIiwiZWxlbWVudCIsImRlZmF1bHRQcm9wcyIsIkRpc3BsYXlOYW1lIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSxPQUFPQSxLQUFQLElBQWdCQyxTQUFoQixRQUFpQyxPQUFqQztBQUNBLE9BQU9DLFNBQVAs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LHNCQUFrQnZCLFVBQVVnRDtBQUpYLEdBNUJlLFNBbUMzQkUsWUFuQzJCLEdBbUNaO0FBQ3BCM0Isc0JBQWtCO0FBREUsR0FuQ1ksU0F1QzNCNEIsV0F2QzJCLEdBdUNiLHFCQXZDYTtBQUFBLENBQS9CIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IENvbXBvbmVudCB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJ1xuaW1wb3J0IHNldCBmcm9tICdsb2Rhc2guc2V0J1xuaW1wb3J0IGdldCBmcm9tICdsb2Rhc2guZ2V0J1xuXG4vKlxuICBBZHZhbmNlZEV4cGFuZFRhYmxlSE9DIGZvciBSZWFjdFRhYmxlXG5cbiAgSE9DIHdoaWNoIGFsbG93cyBhbnkgQ2VsbCBpbiB0aGUgcm93IHRvIHRvZ2dsZSB0aGUgcm93J3NcbiAgU3ViQ29tcG9uZW50LiBBbHNvIGFsbG93cyB0aGUgU3ViQ29tcG9uZW50IHRvIHRvZ2dsZSBpdHNlbGYuXG5cbiAgRXhwYW5kIGZ1bmN0aW9ucyBhdmFpbGFibGUgdG8gYW55IFN1YkNvbXBvbmVudCBvciBDb2x1bW4gQ2VsbDpcbiAgICB0b2dnbGVSb3dTdWJDb21wb25lbnRcbiAgICBzaG93Um93U3ViQ29tcG9uZW50XG4gICAgaGlkZVJvd1N1YkNvbXBvbmVudFxuXG4gIEVhY2ggQ29sdW1uIFJlbmRlcmVyIChFLmcuIENlbGwgKSBnZXRzIHRoZSBleHBhbmQgZnVuY3Rpb25zIGluIGl0cyBwcm9wc1xuICBBbmQgRWFjaCBTdWJDb21wb25lbnQgZ2V0cyB0aGUgZXhwYW5kIGZ1bmN0aW9ucyBpbiBpdHMgcHJvcHNcblxuICBFeHBhbmQgZnVuY3Rpb25zIHRha2VzIHRoZSBgcm93SW5mb2AgZ2l2ZW4gdG8gZWFjaFxuICBDb2x1bW4gUmVuZGVyZXIgYW5kIFN1YkNvbXBvbmVudCBhbHJlYWR5IGJ5IFJlYWN0VGFibGUuXG4qL1xuXG5leHBvcnQgY29uc3Qgc3ViQ29tcG9uZW50V2l0aFRvZ2dsZSA9IChTdWJDb21wb25lbnQsIGV4cGFuZEZ1bmNzKSA9PiBwcm9wcyA9PiAoXG4gIDxTdWJDb21wb25lbnQgey4uLnByb3BzfSB7Li4uZXhwYW5kRnVuY3N9IC8+XG4pXG5cbi8vIGVhY2ggY2VsbCBpbiB0aGUgY29sdW1uIGdldHMgcGFzc2VkIHRoZSBmdW5jdGlvbiB0byB0b2dnbGUgYSBzdWIgY29tcG9uZW50XG5leHBvcnQgY29uc3QgY29sdW1uc1dpdGhUb2dnbGUgPSAoY29sdW1ucywgZXhwYW5kRnVuY3MpID0+XG4gIGNvbHVtbnMubWFwKGNvbHVtbiA9PiB7XG4gICAgaWYgKGNvbHVtbi5jb2x1bW5zKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5jb2x1bW4sXG4gICAgICAgIGNvbHVtbnM6IGNvbHVtbnNXaXRoVG9nZ2xlKGNvbHVtbi5jb2x1bW5zLCBleHBhbmRGdW5jcyksXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICAuLi5jb2x1bW4sXG4gICAgICBnZXRQcm9wcyAoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgLi4uZXhwYW5kRnVuY3MsXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgfVxuICB9KVxuXG5leHBvcnQgY29uc3QgYWR2YW5jZWRFeHBhbmRUYWJsZUhPQyA9IFRhYmxlQ29tcG9uZW50ID0+XG4gIGNsYXNzIEFkdmFuY2VkRXhwYW5kVGFibGUgZXh0ZW5kcyBDb21wb25lbnQge1xuICAgIC8vIGFmdGVyIGluaXRpYWwgcmVuZGVyIGlmIHdlIGdldCBuZXdcbiAgICAvLyBkYXRhLCBjb2x1bW5zLCBwYWdlIGNoYW5nZXMsIGV0Yy5cbiAgICAvLyB3ZSByZXNldCBleHBhbmRlZCBzdGF0ZS5cbiAgICBzdGF0aWMgZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzICgpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGV4cGFuZGVkOiB7fSxcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdHJ1Y3RvciAocHJvcHMpIHtcbiAgICAgIHN1cGVyKHByb3BzKVxuICAgICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgICAgZXhwYW5kZWQ6IHt9LFxuICAgICAgfVxuICAgICAgdGhpcy50b2dnbGVSb3dTdWJDb21wb25lbnQgPSB0aGlzLnRvZ2dsZVJvd1N1YkNvbXBvbmVudC5iaW5kKHRoaXMpXG4gICAgICB0aGlzLnNob3dSb3dTdWJDb21wb25lbnQgPSB0aGlzLnNob3dSb3dTdWJDb21wb25lbnQuYmluZCh0aGlzKVxuICAgICAgdGhpcy5oaWRlUm93U3ViQ29tcG9uZW50ID0gdGhpcy5oaWRlUm93U3ViQ29tcG9uZW50LmJpbmQodGhpcylcbiAgICAgIHRoaXMuZ2V0VGRQcm9wcyA9IHRoaXMuZ2V0VGRQcm9wcy5iaW5kKHRoaXMpXG4gICAgICB0aGlzLmZpcmVPbkV4cGFuZGVkQ2hhbmdlID0gdGhpcy5maXJlT25FeHBhbmRlZENoYW5nZS5iaW5kKHRoaXMpXG4gICAgICB0aGlzLmV4cGFuZEZ1bmNzID0ge1xuICAgICAgICB0b2dnbGVSb3dTdWJDb21wb25lbnQ6IHRoaXMudG9nZ2xlUm93U3ViQ29tcG9uZW50LFxuICAgICAgICBzaG93Um93U3ViQ29tcG9uZW50OiB0aGlzLnNob3dSb3dTdWJDb21wb25lbnQsXG4gICAgICAgIGhpZGVSb3dTdWJDb21wb25lbnQ6IHRoaXMuaGlkZVJvd1N1YkNvbXBvbmVudCxcbiAgICAgIH1cbiAgICB9XG5cbiAgICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgICAgY29sdW1uczogUHJvcFR5cGVzLmFycmF5LmlzUmVxdWlyZWQsXG4gICAgICBTdWJDb21wb25lbnQ6IFByb3BUeXBlcy5vbmVPZlR5cGUoW1Byb3BUeXBlcy5mdW5jLCBQcm9wVHlwZXMuZWxlbWVudF0pXG4gICAgICAgIC5pc1JlcXVpcmVkLFxuICAgICAgb25FeHBhbmRlZENoYW5nZTogUHJvcFR5cGVzLmZ1bmMsXG4gICAgfTtcblxuICAgIHN0YXRpYyBkZWZhdWx0UHJvcHMgPSB7XG4gICAgICBvbkV4cGFuZGVkQ2hhbmdlOiBudWxsLFxuICAgIH07XG5cbiAgICBzdGF0aWMgRGlzcGxheU5hbWUgPSAnQWR2YW5jZWRFeHBhbmRUYWJsZSc7XG5cbiAgICAvLyBzaW5jZSB3ZSBwYXNzIHRoZSBleHBhbmQgZnVuY3Rpb25zIHRvIGVhY2ggQ2VsbCxcbiAgICAvLyB3ZSBuZWVkIHRvIGZpbHRlciBpdCBvdXQgZnJvbSBiZWluZyBwYXNzZWQgYXMgYW5cbiAgICAvLyBhY3R1YWwgRE9NIGF0dHJpYnV0ZS4gU2VlIGdldFByb3BzIGluIGNvbHVtbnNXaXRoVG9nZ2xlIGFib3ZlLlxuICAgIHN0YXRpYyBUZENvbXBvbmVudCAoe1xuICAgICAgdG9nZ2xlUm93U3ViQ29tcG9uZW50LFxuICAgICAgc2hvd1Jvd1N1YkNvbXBvbmVudCxcbiAgICAgIGhpZGVSb3dTdWJDb21wb25lbnQsXG4gICAgICAuLi5yZXN0XG4gICAgfSkge1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHJlYWN0L2pzeC1wYXNjYWwtY2FzZVxuICAgICAgcmV0dXJuIDxUYWJsZUNvbXBvbmVudC5kZWZhdWx0UHJvcHMuVGRDb21wb25lbnQgey4uLnJlc3R9IC8+XG4gICAgfVxuXG4gICAgZmlyZU9uRXhwYW5kZWRDaGFuZ2UgKHJvd0luZm8sIGUpIHtcbiAgICAgIC8vIGZpcmUgY2FsbGJhY2sgb25jZSBzdGF0ZSBoYXMgY2hhbmdlZC5cbiAgICAgIGlmICh0aGlzLnByb3BzLm9uRXhwYW5kZWRDaGFuZ2UpIHtcbiAgICAgICAgdGhpcy5wcm9wcy5vbkV4cGFuZGVkQ2hhbmdlKHJvd0luZm8sIGUpXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmVzb2x2ZU5ld1RhYmxlU3RhdGUgKHJvd0luZm9Pck5lc3RpbmdQYXRoLCBlLCBleHBhbmRUeXBlKSB7XG4gICAgICAvLyBkZXJpdmUgbmVzdGluZ1BhdGggaWYgb25seSByb3dJbmZvIGlzIHBhc3NlZFxuICAgICAgbGV0IG5lc3RpbmdQYXRoID0gcm93SW5mb09yTmVzdGluZ1BhdGhcblxuICAgICAgaWYgKHJvd0luZm9Pck5lc3RpbmdQYXRoLm5lc3RpbmdQYXRoKSB7XG4gICAgICAgIG5lc3RpbmdQYXRoID0gcm93SW5mb09yTmVzdGluZ1BhdGgubmVzdGluZ1BhdGhcbiAgICAgIH1cblxuICAgICAgdGhpcy5zZXRTdGF0ZShcbiAgICAgICAgcHJldlN0YXRlID0+IHtcbiAgICAgICAgICBjb25zdCBpc0V4cGFuZGVkID0gZ2V0KHByZXZTdGF0ZS5leHBhbmRlZCwgbmVzdGluZ1BhdGgpXG4gICAgICAgICAgLy8gc2luY2Ugd2UgZG8gbm90IHN1cHBvcnQgbmVzdGVkIHJvd3MsIGEgc2hhbGxvdyBjbG9uZSBpcyBva2F5LlxuICAgICAgICAgIGNvbnN0IG5ld0V4cGFuZGVkID0geyAuLi5wcmV2U3RhdGUuZXhwYW5kZWQgfVxuXG4gICAgICAgICAgc3dpdGNoIChleHBhbmRUeXBlKSB7XG4gICAgICAgICAgICBjYXNlICdzaG93JzpcbiAgICAgICAgICAgICAgc2V0KG5ld0V4cGFuZGVkLCBuZXN0aW5nUGF0aCwge30pXG4gICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBjYXNlICdoaWRlJzpcbiAgICAgICAgICAgICAgc2V0KG5ld0V4cGFuZGVkLCBuZXN0aW5nUGF0aCwgZmFsc2UpXG4gICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAvLyB0b2dnbGVcbiAgICAgICAgICAgICAgc2V0KG5ld0V4cGFuZGVkLCBuZXN0aW5nUGF0aCwgaXNFeHBhbmRlZCA/IGZhbHNlIDoge30pXG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAuLi5wcmV2U3RhdGUsXG4gICAgICAgICAgICBleHBhbmRlZDogbmV3RXhwYW5kZWQsXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICAoKSA9PiB0aGlzLmZpcmVPbkV4cGFuZGVkQ2hhbmdlKHJvd0luZm9Pck5lc3RpbmdQYXRoLCBlKVxuICAgICAgKVxuICAgIH1cblxuICAgIHRvZ2dsZVJvd1N1YkNvbXBvbmVudCAocm93SW5mbywgZSkge1xuICAgICAgdGhpcy5yZXNvbHZlTmV3VGFibGVTdGF0ZShyb3dJbmZvLCBlKVxuICAgIH1cblxuICAgIHNob3dSb3dTdWJDb21wb25lbnQgKHJvd0luZm8sIGUpIHtcbiAgICAgIHRoaXMucmVzb2x2ZU5ld1RhYmxlU3RhdGUocm93SW5mbywgZSwgJ3Nob3cnKVxuICAgIH1cblxuICAgIGhpZGVSb3dTdWJDb21wb25lbnQgKHJvd0luZm8sIGUpIHtcbiAgICAgIHRoaXMucmVzb2x2ZU5ld1RhYmxlU3RhdGUocm93SW5mbywgZSwgJ2hpZGUnKVxuICAgIH1cblxuICAgIGdldFRkUHJvcHMgKHRhYmxlU3RhdGUsIHJvd0luZm8sIGNvbHVtbikge1xuICAgICAgY29uc3QgeyBleHBhbmRlciB9ID0gY29sdW1uXG5cbiAgICAgIGlmICghZXhwYW5kZXIpIHtcbiAgICAgICAgLy8gbm8gb3ZlcnJpZGVzXG4gICAgICAgIHJldHVybiB7fVxuICAgICAgfVxuXG4gICAgICByZXR1cm4ge1xuICAgICAgICAvLyBvbmx5IG92ZXJyaWRlIG9uQ2xpY2sgZm9yIGNvbHVtbiBUZFxuICAgICAgICBvbkNsaWNrOiBlID0+IHtcbiAgICAgICAgICB0aGlzLnRvZ2dsZVJvd1N1YkNvbXBvbmVudChyb3dJbmZvLCBlKVxuICAgICAgICB9LFxuICAgICAgfVxuICAgIH1cblxuICAgIGdldFdyYXBwZWRJbnN0YW5jZSAoKSB7XG4gICAgICBpZiAoIXRoaXMud3JhcHBlZEluc3RhbmNlKSB7IGNvbnNvbGUud2FybignQWR2YW5jZWRFeHBhbmRUYWJsZSAtIE5vIHdyYXBwZWQgaW5zdGFuY2UnKSB9XG4gICAgICBpZiAodGhpcy53cmFwcGVkSW5zdGFuY2UuZ2V0V3JhcHBlZEluc3RhbmNlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLndyYXBwZWRJbnN0YW5jZS5nZXRXcmFwcGVkSW5zdGFuY2UoKVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMud3JhcHBlZEluc3RhbmNlXG4gICAgfVxuXG4gICAgcmVuZGVyICgpIHtcbiAgICAgIGNvbnN0IHtcbiAgICAgICAgY29sdW1ucywgU3ViQ29tcG9uZW50LCBvbkV4cGFuZGVkQ2hhbmdlLCAuLi5yZXN0XG4gICAgICB9ID0gdGhpcy5wcm9wc1xuXG4gICAgICBjb25zdCB3cmFwcGVkQ29sdW1ucyA9IGNvbHVtbnNXaXRoVG9nZ2xlKGNvbHVtbnMsIHRoaXMuZXhwYW5kRnVuY3MpXG4gICAgICBjb25zdCBXcmFwcGVkU3ViQ29tcG9uZW50ID0gc3ViQ29tcG9uZW50V2l0aFRvZ2dsZShcbiAgICAgICAgU3ViQ29tcG9uZW50LFxuICAgICAgICB0aGlzLmV4cGFuZEZ1bmNzXG4gICAgICApXG5cbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxUYWJsZUNvbXBvbmVudFxuICAgICAgICAgIHsuLi5yZXN0fVxuICAgICAgICAgIGNvbHVtbnM9e3dyYXBwZWRDb2x1bW5zfVxuICAgICAgICAgIGV4cGFuZGVkPXt0aGlzLnN0YXRlLmV4cGFuZGVkfVxuICAgICAgICAgIGdldFRkUHJvcHM9e3RoaXMuZ2V0VGRQcm9wc31cbiAgICAgICAgICBTdWJDb21wb25lbnQ9e1dyYXBwZWRTdWJDb21wb25lbnR9XG4gICAgICAgICAgVGRDb21wb25lbnQ9e0FkdmFuY2VkRXhwYW5kVGFibGUuVGRDb21wb25lbnR9XG4gICAgICAgIC8+XG4gICAgICApXG4gICAgfVxuICB9XG4iXX0=
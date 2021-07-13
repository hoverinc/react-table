'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

exports.default = function (Base) {
  return function (_Base) {
    _inherits(_class, _Base);

    function _class() {
      _classCallCheck(this, _class);

      return _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).apply(this, arguments));
    }

    _createClass(_class, [{
      key: 'UNSAFE_componentWillMount',

      // eslint-disable-next-line camelcase
      value: function UNSAFE_componentWillMount() {
        this.setStateWithData(this.getDataModel(this.getResolvedState()));
      }
    }, {
      key: 'componentDidMount',
      value: function componentDidMount() {
        this.fireFetchData();
      }

      // eslint-disable-next-line camelcase

    }, {
      key: 'UNSAFE_componentWillReceiveProps',
      value: function UNSAFE_componentWillReceiveProps(nextProps, nextState) {
        var oldState = this.getResolvedState();
        var newState = this.getResolvedState(nextProps, nextState);

        // Do a deep compare of new and old `defaultOption` and
        // if they are different reset `option = defaultOption`
        var defaultableOptions = ['sorted', 'filtered', 'resized', 'expanded'];
        defaultableOptions.forEach(function (x) {
          var defaultName = 'default' + (x.charAt(0).toUpperCase() + x.slice(1));
          if (JSON.stringify(oldState[defaultName]) !== JSON.stringify(newState[defaultName])) {
            newState[x] = newState[defaultName];
          }
        });

        // If they change these table options, we need to reset defaults
        // or else we could get into a state where the user has changed the UI
        // and then disabled the ability to change it back.
        // e.g. If `filterable` has changed, set `filtered = defaultFiltered`
        var resettableOptions = ['sortable', 'filterable', 'resizable'];
        resettableOptions.forEach(function (x) {
          if (oldState[x] !== newState[x]) {
            var baseName = x.replace('able', '');
            var optionName = baseName + 'ed';
            var defaultName = 'default' + (optionName.charAt(0).toUpperCase() + optionName.slice(1));
            newState[optionName] = newState[defaultName];
          }
        });

        // Props that trigger a data update
        if (oldState.data !== newState.data || oldState.columns !== newState.columns || oldState.pivotBy !== newState.pivotBy || oldState.sorted !== newState.sorted || oldState.filtered !== newState.filtered) {
          this.setStateWithData(this.getDataModel(newState));
        }
      }
    }, {
      key: 'setStateWithData',
      value: function setStateWithData(newState, cb) {
        var _this2 = this;

        var oldState = this.getResolvedState();
        var newResolvedState = this.getResolvedState({}, newState);
        var freezeWhenExpanded = newResolvedState.freezeWhenExpanded;

        // Default to unfrozen state

        newResolvedState.frozen = false;

        // If freezeWhenExpanded is set, check for frozen conditions
        if (freezeWhenExpanded) {
          // if any rows are expanded, freeze the existing data and sorting
          var keys = Object.keys(newResolvedState.expanded);
          for (var i = 0; i < keys.length; i += 1) {
            if (newResolvedState.expanded[keys[i]]) {
              newResolvedState.frozen = true;
              break;
            }
          }
        }

        // If the data isn't frozen and either the data or
        // sorting model has changed, update the data
        if (oldState.frozen && !newResolvedState.frozen || oldState.sorted !== newResolvedState.sorted || oldState.filtered !== newResolvedState.filtered || oldState.showFilters !== newResolvedState.showFilters || !newResolvedState.frozen && oldState.resolvedData !== newResolvedState.resolvedData) {
          // Handle collapseOnsortedChange & collapseOnDataChange
          if (oldState.sorted !== newResolvedState.sorted && this.props.collapseOnSortingChange || oldState.filtered !== newResolvedState.filtered || oldState.showFilters !== newResolvedState.showFilters || oldState.sortedData && !newResolvedState.frozen && oldState.resolvedData !== newResolvedState.resolvedData && this.props.collapseOnDataChange) {
            newResolvedState.expanded = {};
          }

          Object.assign(newResolvedState, this.getSortedData(newResolvedState));
        }

        // Set page to 0 if filters change
        if (oldState.filtered !== newResolvedState.filtered) {
          newResolvedState.page = 0;
        }

        // Calculate pageSize all the time
        if (newResolvedState.sortedData) {
          newResolvedState.pages = newResolvedState.manual ? newResolvedState.pages : Math.ceil(newResolvedState.sortedData.length / newResolvedState.pageSize);
          newResolvedState.page = Math.max(newResolvedState.page >= newResolvedState.pages ? newResolvedState.pages - 1 : newResolvedState.page, 0);
        }

        return this.setState(newResolvedState, function () {
          if (cb) {
            cb();
          }
          if (oldState.page !== newResolvedState.page || oldState.pageSize !== newResolvedState.pageSize || oldState.sorted !== newResolvedState.sorted || oldState.filtered !== newResolvedState.filtered) {
            _this2.fireFetchData();
          }
        });
      }
    }]);

    return _class;
  }(Base);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9saWZlY3ljbGUuanMiXSwibmFtZXMiOlsic2V0U3RhdGVXaXRoRGF0YSIsImdldERhdGFNb2RlbCIsImdldFJlc29sdmVkU3RhdGUiLCJmaXJlRmV0Y2hEYXRhIiwibmV4dFByb3BzIiwibmV4dFN0YXRlIiwib2xkU3RhdGUiLCJuZXdTdGF0ZSIsImRlZmF1bHRhYmxlT3B0aW9ucyIsImZvckVhY2giLCJkZWZhdWx0TmFtZSIsIngiLCJjaGFyQXQiLCJ0b1VwcGVyQ2FzZSIsInNsaWNlIiwiSlNPTiIsInN0cmluZ2lmeSIsInJlc2V0dGFibGVPcHRpb25zIiwiYmFzZU5hbWUiLCJyZXBsYWNlIiwib3B0aW9uTmFtZSIsImRhdGEiLCJjb2x1bW5zIiwicGl2b3RCeSIsInNvcnRlZCIsImZpbHRlcmVkIiwiY2IiLCJuZXdSZXNvbHZlZFN0YXRlIiwiZnJlZXplV2hlbkV4cGFuZGVkIiwiZnJvemVuIiwia2V5cyIsIk9iamVjdCIsImV4cGFuZGVkIiwiaSIsImxlbmd0aCIsInNob3dGaWx0ZXJzIiwicmVzb2x2ZWREYXRhIiwicHJvcHMiLCJjb2xsYXBzZU9uU29ydGluZ0NoYW5nZSIsInNvcnRlZERhdGEiLCJjb2xsYXBzZU9uRGF0YUNoYW5nZSIsImFzc2lnbiIsImdldFNvcnRlZERhdGEiLCJwYWdlIiwicGFnZXMiLCJtYW51YWwiLCJNYXRoIiwiY2VpbCIsInBhZ2VTaXplIiwibWF4Iiwic2V0U3RhdGUiLCJCYXNlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztrQkFBZTtBQUFBO0FBQUE7O0FBQUE7QUFBQTs7QUFBQTtBQUFBOztBQUFBO0FBQUE7O0FBRVg7QUFGVyxrREFHa0I7QUFDM0IsYUFBS0EsZ0JBQUwsQ0FBc0IsS0FBS0MsWUFBTCxDQUFrQixLQUFLQyxnQkFBTCxFQUFsQixDQUF0QjtBQUNEO0FBTFU7QUFBQTtBQUFBLDBDQU9VO0FBQ25CLGFBQUtDLGFBQUw7QUFDRDs7QUFFRDs7QUFYVztBQUFBO0FBQUEsdURBWXVCQyxTQVp2QixFQVlrQ0MsU0FabEMsRUFZNkM7QUFDdEQsWUFBTUMsV0FBVyxLQUFLSixnQkFBTCxFQUFqQjtBQUNBLFlBQU1LLFdBQVcsS0FBS0wsZ0JBQUwsQ0FBc0JFLFNBQXRCLEVBQWlDQyxTQUFqQyxDQUFqQjs7QUFFQTtBQUNBO0FBQ0EsWUFBTUcscUJBQXFCLENBQUMsUUFBRCxFQUFXLFVBQVgsRUFBdUIsU0FBdkIsRUFBa0MsVUFBbEMsQ0FBM0I7QUFDQUEsMkJBQW1CQyxPQUFuQixDQUEyQixhQUFLO0FBQzlCLGNBQU1DLDJCQUF3QkMsRUFBRUMsTUFBRixDQUFTLENBQVQsRUFBWUMsV0FBWixLQUE0QkYsRUFBRUcsS0FBRixDQUFRLENBQVIsQ0FBcEQsQ0FBTjtBQUNBLGNBQ0VDLEtBQUtDLFNBQUwsQ0FBZVYsU0FBU0ksV0FBVCxDQUFmLE1BQ0FLLEtBQUtDLFNBQUwsQ0FBZVQsU0FBU0csV0FBVCxDQUFmLENBRkYsRUFHRTtBQUNBSCxxQkFBU0ksQ0FBVCxJQUFjSixTQUFTRyxXQUFULENBQWQ7QUFDRDtBQUNGLFNBUkQ7O0FBVUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFNTyxvQkFBb0IsQ0FBQyxVQUFELEVBQWEsWUFBYixFQUEyQixXQUEzQixDQUExQjtBQUNBQSwwQkFBa0JSLE9BQWxCLENBQTBCLGFBQUs7QUFDN0IsY0FBSUgsU0FBU0ssQ0FBVCxNQUFnQkosU0FBU0ksQ0FBVCxDQUFwQixFQUFpQztBQUMvQixnQkFBTU8sV0FBV1AsRUFBRVEsT0FBRixDQUFVLE1BQVYsRUFBa0IsRUFBbEIsQ0FBakI7QUFDQSxnQkFBTUMsYUFBZ0JGLFFBQWhCLE9BQU47QUFDQSxnQkFBTVIsMkJBQXdCVSxXQUFXUixNQUFYLENBQWtCLENBQWxCLEVBQXFCQyxXQUFyQixLQUM1Qk8sV0FBV04sS0FBWCxDQUFpQixDQUFqQixDQURJLENBQU47QUFFQVAscUJBQVNhLFVBQVQsSUFBdUJiLFNBQVNHLFdBQVQsQ0FBdkI7QUFDRDtBQUNGLFNBUkQ7O0FBVUE7QUFDQSxZQUNFSixTQUFTZSxJQUFULEtBQWtCZCxTQUFTYyxJQUEzQixJQUNBZixTQUFTZ0IsT0FBVCxLQUFxQmYsU0FBU2UsT0FEOUIsSUFFQWhCLFNBQVNpQixPQUFULEtBQXFCaEIsU0FBU2dCLE9BRjlCLElBR0FqQixTQUFTa0IsTUFBVCxLQUFvQmpCLFNBQVNpQixNQUg3QixJQUlBbEIsU0FBU21CLFFBQVQsS0FBc0JsQixTQUFTa0IsUUFMakMsRUFNRTtBQUNBLGVBQUt6QixnQkFBTCxDQUFzQixLQUFLQyxZQUFMLENBQWtCTSxRQUFsQixDQUF0QjtBQUNEO0FBQ0Y7QUF0RFU7QUFBQTtBQUFBLHVDQXdET0EsUUF4RFAsRUF3RGlCbUIsRUF4RGpCLEVBd0RxQjtBQUFBOztBQUM5QixZQUFNcEIsV0FBVyxLQUFLSixnQkFBTCxFQUFqQjtBQUNBLFlBQU15QixtQkFBbUIsS0FBS3pCLGdCQUFMLENBQXNCLEVBQXRCLEVBQTBCSyxRQUExQixDQUF6QjtBQUY4QixZQUd0QnFCLGtCQUhzQixHQUdDRCxnQkFIRCxDQUd0QkMsa0JBSHNCOztBQUs5Qjs7QUFDQUQseUJBQWlCRSxNQUFqQixHQUEwQixLQUExQjs7QUFFQTtBQUNBLFlBQUlELGtCQUFKLEVBQXdCO0FBQ3RCO0FBQ0EsY0FBTUUsT0FBT0MsT0FBT0QsSUFBUCxDQUFZSCxpQkFBaUJLLFFBQTdCLENBQWI7QUFDQSxlQUFLLElBQUlDLElBQUksQ0FBYixFQUFnQkEsSUFBSUgsS0FBS0ksTUFBekIsRUFBaUNELEtBQUssQ0FBdEMsRUFBeUM7QUFDdkMsZ0JBQUlOLGlCQUFpQkssUUFBakIsQ0FBMEJGLEtBQUtHLENBQUwsQ0FBMUIsQ0FBSixFQUF3QztBQUN0Q04sK0JBQWlCRSxNQUFqQixHQUEwQixJQUExQjtBQUNBO0FBQ0Q7QUFDRjtBQUNGOztBQUVEO0FBQ0E7QUFDQSxZQUNHdkIsU0FBU3VCLE1BQVQsSUFBbUIsQ0FBQ0YsaUJBQWlCRSxNQUF0QyxJQUNBdkIsU0FBU2tCLE1BQVQsS0FBb0JHLGlCQUFpQkgsTUFEckMsSUFFQWxCLFNBQVNtQixRQUFULEtBQXNCRSxpQkFBaUJGLFFBRnZDLElBR0FuQixTQUFTNkIsV0FBVCxLQUF5QlIsaUJBQWlCUSxXQUgxQyxJQUlDLENBQUNSLGlCQUFpQkUsTUFBbEIsSUFDQ3ZCLFNBQVM4QixZQUFULEtBQTBCVCxpQkFBaUJTLFlBTi9DLEVBT0U7QUFDQTtBQUNBLGNBQ0c5QixTQUFTa0IsTUFBVCxLQUFvQkcsaUJBQWlCSCxNQUFyQyxJQUNDLEtBQUthLEtBQUwsQ0FBV0MsdUJBRGIsSUFFQWhDLFNBQVNtQixRQUFULEtBQXNCRSxpQkFBaUJGLFFBRnZDLElBR0FuQixTQUFTNkIsV0FBVCxLQUF5QlIsaUJBQWlCUSxXQUgxQyxJQUlDN0IsU0FBU2lDLFVBQVQsSUFDQyxDQUFDWixpQkFBaUJFLE1BRG5CLElBRUN2QixTQUFTOEIsWUFBVCxLQUEwQlQsaUJBQWlCUyxZQUY1QyxJQUdDLEtBQUtDLEtBQUwsQ0FBV0csb0JBUmYsRUFTRTtBQUNBYiw2QkFBaUJLLFFBQWpCLEdBQTRCLEVBQTVCO0FBQ0Q7O0FBRURELGlCQUFPVSxNQUFQLENBQWNkLGdCQUFkLEVBQWdDLEtBQUtlLGFBQUwsQ0FBbUJmLGdCQUFuQixDQUFoQztBQUNEOztBQUVEO0FBQ0EsWUFBSXJCLFNBQVNtQixRQUFULEtBQXNCRSxpQkFBaUJGLFFBQTNDLEVBQXFEO0FBQ25ERSwyQkFBaUJnQixJQUFqQixHQUF3QixDQUF4QjtBQUNEOztBQUVEO0FBQ0EsWUFBSWhCLGlCQUFpQlksVUFBckIsRUFBaUM7QUFDL0JaLDJCQUFpQmlCLEtBQWpCLEdBQXlCakIsaUJBQWlCa0IsTUFBakIsR0FDckJsQixpQkFBaUJpQixLQURJLEdBRXJCRSxLQUFLQyxJQUFMLENBQ0FwQixpQkFBaUJZLFVBQWpCLENBQTRCTCxNQUE1QixHQUFxQ1AsaUJBQWlCcUIsUUFEdEQsQ0FGSjtBQUtBckIsMkJBQWlCZ0IsSUFBakIsR0FBd0JHLEtBQUtHLEdBQUwsQ0FDdEJ0QixpQkFBaUJnQixJQUFqQixJQUF5QmhCLGlCQUFpQmlCLEtBQTFDLEdBQ0lqQixpQkFBaUJpQixLQUFqQixHQUF5QixDQUQ3QixHQUVJakIsaUJBQWlCZ0IsSUFIQyxFQUl0QixDQUpzQixDQUF4QjtBQU1EOztBQUVELGVBQU8sS0FBS08sUUFBTCxDQUFjdkIsZ0JBQWQsRUFBZ0MsWUFBTTtBQUMzQyxjQUFJRCxFQUFKLEVBQVE7QUFBRUE7QUFBTTtBQUNoQixjQUNFcEIsU0FBU3FDLElBQVQsS0FBa0JoQixpQkFBaUJnQixJQUFuQyxJQUNBckMsU0FBUzBDLFFBQVQsS0FBc0JyQixpQkFBaUJxQixRQUR2QyxJQUVBMUMsU0FBU2tCLE1BQVQsS0FBb0JHLGlCQUFpQkgsTUFGckMsSUFHQWxCLFNBQVNtQixRQUFULEtBQXNCRSxpQkFBaUJGLFFBSnpDLEVBS0U7QUFDQSxtQkFBS3RCLGFBQUw7QUFDRDtBQUNGLFNBVk0sQ0FBUDtBQVdEO0FBdElVOztBQUFBO0FBQUEsSUFDQ2dELElBREQ7QUFBQSxDIiwiZmlsZSI6ImxpZmVjeWNsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IEJhc2UgPT5cbiAgY2xhc3MgZXh0ZW5kcyBCYXNlIHtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgY2FtZWxjYXNlXG4gICAgVU5TQUZFX2NvbXBvbmVudFdpbGxNb3VudCAoKSB7XG4gICAgICB0aGlzLnNldFN0YXRlV2l0aERhdGEodGhpcy5nZXREYXRhTW9kZWwodGhpcy5nZXRSZXNvbHZlZFN0YXRlKCkpKVxuICAgIH1cblxuICAgIGNvbXBvbmVudERpZE1vdW50ICgpIHtcbiAgICAgIHRoaXMuZmlyZUZldGNoRGF0YSgpXG4gICAgfVxuXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGNhbWVsY2FzZVxuICAgIFVOU0FGRV9jb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzIChuZXh0UHJvcHMsIG5leHRTdGF0ZSkge1xuICAgICAgY29uc3Qgb2xkU3RhdGUgPSB0aGlzLmdldFJlc29sdmVkU3RhdGUoKVxuICAgICAgY29uc3QgbmV3U3RhdGUgPSB0aGlzLmdldFJlc29sdmVkU3RhdGUobmV4dFByb3BzLCBuZXh0U3RhdGUpXG5cbiAgICAgIC8vIERvIGEgZGVlcCBjb21wYXJlIG9mIG5ldyBhbmQgb2xkIGBkZWZhdWx0T3B0aW9uYCBhbmRcbiAgICAgIC8vIGlmIHRoZXkgYXJlIGRpZmZlcmVudCByZXNldCBgb3B0aW9uID0gZGVmYXVsdE9wdGlvbmBcbiAgICAgIGNvbnN0IGRlZmF1bHRhYmxlT3B0aW9ucyA9IFsnc29ydGVkJywgJ2ZpbHRlcmVkJywgJ3Jlc2l6ZWQnLCAnZXhwYW5kZWQnXVxuICAgICAgZGVmYXVsdGFibGVPcHRpb25zLmZvckVhY2goeCA9PiB7XG4gICAgICAgIGNvbnN0IGRlZmF1bHROYW1lID0gYGRlZmF1bHQke3guY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyB4LnNsaWNlKDEpfWBcbiAgICAgICAgaWYgKFxuICAgICAgICAgIEpTT04uc3RyaW5naWZ5KG9sZFN0YXRlW2RlZmF1bHROYW1lXSkgIT09XG4gICAgICAgICAgSlNPTi5zdHJpbmdpZnkobmV3U3RhdGVbZGVmYXVsdE5hbWVdKVxuICAgICAgICApIHtcbiAgICAgICAgICBuZXdTdGF0ZVt4XSA9IG5ld1N0YXRlW2RlZmF1bHROYW1lXVxuICAgICAgICB9XG4gICAgICB9KVxuXG4gICAgICAvLyBJZiB0aGV5IGNoYW5nZSB0aGVzZSB0YWJsZSBvcHRpb25zLCB3ZSBuZWVkIHRvIHJlc2V0IGRlZmF1bHRzXG4gICAgICAvLyBvciBlbHNlIHdlIGNvdWxkIGdldCBpbnRvIGEgc3RhdGUgd2hlcmUgdGhlIHVzZXIgaGFzIGNoYW5nZWQgdGhlIFVJXG4gICAgICAvLyBhbmQgdGhlbiBkaXNhYmxlZCB0aGUgYWJpbGl0eSB0byBjaGFuZ2UgaXQgYmFjay5cbiAgICAgIC8vIGUuZy4gSWYgYGZpbHRlcmFibGVgIGhhcyBjaGFuZ2VkLCBzZXQgYGZpbHRlcmVkID0gZGVmYXVsdEZpbHRlcmVkYFxuICAgICAgY29uc3QgcmVzZXR0YWJsZU9wdGlvbnMgPSBbJ3NvcnRhYmxlJywgJ2ZpbHRlcmFibGUnLCAncmVzaXphYmxlJ11cbiAgICAgIHJlc2V0dGFibGVPcHRpb25zLmZvckVhY2goeCA9PiB7XG4gICAgICAgIGlmIChvbGRTdGF0ZVt4XSAhPT0gbmV3U3RhdGVbeF0pIHtcbiAgICAgICAgICBjb25zdCBiYXNlTmFtZSA9IHgucmVwbGFjZSgnYWJsZScsICcnKVxuICAgICAgICAgIGNvbnN0IG9wdGlvbk5hbWUgPSBgJHtiYXNlTmFtZX1lZGBcbiAgICAgICAgICBjb25zdCBkZWZhdWx0TmFtZSA9IGBkZWZhdWx0JHtvcHRpb25OYW1lLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICtcbiAgICAgICAgICAgIG9wdGlvbk5hbWUuc2xpY2UoMSl9YFxuICAgICAgICAgIG5ld1N0YXRlW29wdGlvbk5hbWVdID0gbmV3U3RhdGVbZGVmYXVsdE5hbWVdXG4gICAgICAgIH1cbiAgICAgIH0pXG5cbiAgICAgIC8vIFByb3BzIHRoYXQgdHJpZ2dlciBhIGRhdGEgdXBkYXRlXG4gICAgICBpZiAoXG4gICAgICAgIG9sZFN0YXRlLmRhdGEgIT09IG5ld1N0YXRlLmRhdGEgfHxcbiAgICAgICAgb2xkU3RhdGUuY29sdW1ucyAhPT0gbmV3U3RhdGUuY29sdW1ucyB8fFxuICAgICAgICBvbGRTdGF0ZS5waXZvdEJ5ICE9PSBuZXdTdGF0ZS5waXZvdEJ5IHx8XG4gICAgICAgIG9sZFN0YXRlLnNvcnRlZCAhPT0gbmV3U3RhdGUuc29ydGVkIHx8XG4gICAgICAgIG9sZFN0YXRlLmZpbHRlcmVkICE9PSBuZXdTdGF0ZS5maWx0ZXJlZFxuICAgICAgKSB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGVXaXRoRGF0YSh0aGlzLmdldERhdGFNb2RlbChuZXdTdGF0ZSkpXG4gICAgICB9XG4gICAgfVxuXG4gICAgc2V0U3RhdGVXaXRoRGF0YSAobmV3U3RhdGUsIGNiKSB7XG4gICAgICBjb25zdCBvbGRTdGF0ZSA9IHRoaXMuZ2V0UmVzb2x2ZWRTdGF0ZSgpXG4gICAgICBjb25zdCBuZXdSZXNvbHZlZFN0YXRlID0gdGhpcy5nZXRSZXNvbHZlZFN0YXRlKHt9LCBuZXdTdGF0ZSlcbiAgICAgIGNvbnN0IHsgZnJlZXplV2hlbkV4cGFuZGVkIH0gPSBuZXdSZXNvbHZlZFN0YXRlXG5cbiAgICAgIC8vIERlZmF1bHQgdG8gdW5mcm96ZW4gc3RhdGVcbiAgICAgIG5ld1Jlc29sdmVkU3RhdGUuZnJvemVuID0gZmFsc2VcblxuICAgICAgLy8gSWYgZnJlZXplV2hlbkV4cGFuZGVkIGlzIHNldCwgY2hlY2sgZm9yIGZyb3plbiBjb25kaXRpb25zXG4gICAgICBpZiAoZnJlZXplV2hlbkV4cGFuZGVkKSB7XG4gICAgICAgIC8vIGlmIGFueSByb3dzIGFyZSBleHBhbmRlZCwgZnJlZXplIHRoZSBleGlzdGluZyBkYXRhIGFuZCBzb3J0aW5nXG4gICAgICAgIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhuZXdSZXNvbHZlZFN0YXRlLmV4cGFuZGVkKVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICBpZiAobmV3UmVzb2x2ZWRTdGF0ZS5leHBhbmRlZFtrZXlzW2ldXSkge1xuICAgICAgICAgICAgbmV3UmVzb2x2ZWRTdGF0ZS5mcm96ZW4gPSB0cnVlXG4gICAgICAgICAgICBicmVha1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBJZiB0aGUgZGF0YSBpc24ndCBmcm96ZW4gYW5kIGVpdGhlciB0aGUgZGF0YSBvclxuICAgICAgLy8gc29ydGluZyBtb2RlbCBoYXMgY2hhbmdlZCwgdXBkYXRlIHRoZSBkYXRhXG4gICAgICBpZiAoXG4gICAgICAgIChvbGRTdGF0ZS5mcm96ZW4gJiYgIW5ld1Jlc29sdmVkU3RhdGUuZnJvemVuKSB8fFxuICAgICAgICBvbGRTdGF0ZS5zb3J0ZWQgIT09IG5ld1Jlc29sdmVkU3RhdGUuc29ydGVkIHx8XG4gICAgICAgIG9sZFN0YXRlLmZpbHRlcmVkICE9PSBuZXdSZXNvbHZlZFN0YXRlLmZpbHRlcmVkIHx8XG4gICAgICAgIG9sZFN0YXRlLnNob3dGaWx0ZXJzICE9PSBuZXdSZXNvbHZlZFN0YXRlLnNob3dGaWx0ZXJzIHx8XG4gICAgICAgICghbmV3UmVzb2x2ZWRTdGF0ZS5mcm96ZW4gJiZcbiAgICAgICAgICBvbGRTdGF0ZS5yZXNvbHZlZERhdGEgIT09IG5ld1Jlc29sdmVkU3RhdGUucmVzb2x2ZWREYXRhKVxuICAgICAgKSB7XG4gICAgICAgIC8vIEhhbmRsZSBjb2xsYXBzZU9uc29ydGVkQ2hhbmdlICYgY29sbGFwc2VPbkRhdGFDaGFuZ2VcbiAgICAgICAgaWYgKFxuICAgICAgICAgIChvbGRTdGF0ZS5zb3J0ZWQgIT09IG5ld1Jlc29sdmVkU3RhdGUuc29ydGVkICYmXG4gICAgICAgICAgICB0aGlzLnByb3BzLmNvbGxhcHNlT25Tb3J0aW5nQ2hhbmdlKSB8fFxuICAgICAgICAgIG9sZFN0YXRlLmZpbHRlcmVkICE9PSBuZXdSZXNvbHZlZFN0YXRlLmZpbHRlcmVkIHx8XG4gICAgICAgICAgb2xkU3RhdGUuc2hvd0ZpbHRlcnMgIT09IG5ld1Jlc29sdmVkU3RhdGUuc2hvd0ZpbHRlcnMgfHxcbiAgICAgICAgICAob2xkU3RhdGUuc29ydGVkRGF0YSAmJlxuICAgICAgICAgICAgIW5ld1Jlc29sdmVkU3RhdGUuZnJvemVuICYmXG4gICAgICAgICAgICBvbGRTdGF0ZS5yZXNvbHZlZERhdGEgIT09IG5ld1Jlc29sdmVkU3RhdGUucmVzb2x2ZWREYXRhICYmXG4gICAgICAgICAgICB0aGlzLnByb3BzLmNvbGxhcHNlT25EYXRhQ2hhbmdlKVxuICAgICAgICApIHtcbiAgICAgICAgICBuZXdSZXNvbHZlZFN0YXRlLmV4cGFuZGVkID0ge31cbiAgICAgICAgfVxuXG4gICAgICAgIE9iamVjdC5hc3NpZ24obmV3UmVzb2x2ZWRTdGF0ZSwgdGhpcy5nZXRTb3J0ZWREYXRhKG5ld1Jlc29sdmVkU3RhdGUpKVxuICAgICAgfVxuXG4gICAgICAvLyBTZXQgcGFnZSB0byAwIGlmIGZpbHRlcnMgY2hhbmdlXG4gICAgICBpZiAob2xkU3RhdGUuZmlsdGVyZWQgIT09IG5ld1Jlc29sdmVkU3RhdGUuZmlsdGVyZWQpIHtcbiAgICAgICAgbmV3UmVzb2x2ZWRTdGF0ZS5wYWdlID0gMFxuICAgICAgfVxuXG4gICAgICAvLyBDYWxjdWxhdGUgcGFnZVNpemUgYWxsIHRoZSB0aW1lXG4gICAgICBpZiAobmV3UmVzb2x2ZWRTdGF0ZS5zb3J0ZWREYXRhKSB7XG4gICAgICAgIG5ld1Jlc29sdmVkU3RhdGUucGFnZXMgPSBuZXdSZXNvbHZlZFN0YXRlLm1hbnVhbFxuICAgICAgICAgID8gbmV3UmVzb2x2ZWRTdGF0ZS5wYWdlc1xuICAgICAgICAgIDogTWF0aC5jZWlsKFxuICAgICAgICAgICAgbmV3UmVzb2x2ZWRTdGF0ZS5zb3J0ZWREYXRhLmxlbmd0aCAvIG5ld1Jlc29sdmVkU3RhdGUucGFnZVNpemUsXG4gICAgICAgICAgKVxuICAgICAgICBuZXdSZXNvbHZlZFN0YXRlLnBhZ2UgPSBNYXRoLm1heChcbiAgICAgICAgICBuZXdSZXNvbHZlZFN0YXRlLnBhZ2UgPj0gbmV3UmVzb2x2ZWRTdGF0ZS5wYWdlc1xuICAgICAgICAgICAgPyBuZXdSZXNvbHZlZFN0YXRlLnBhZ2VzIC0gMVxuICAgICAgICAgICAgOiBuZXdSZXNvbHZlZFN0YXRlLnBhZ2UsXG4gICAgICAgICAgMCxcbiAgICAgICAgKVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5zZXRTdGF0ZShuZXdSZXNvbHZlZFN0YXRlLCAoKSA9PiB7XG4gICAgICAgIGlmIChjYikgeyBjYigpIH1cbiAgICAgICAgaWYgKFxuICAgICAgICAgIG9sZFN0YXRlLnBhZ2UgIT09IG5ld1Jlc29sdmVkU3RhdGUucGFnZSB8fFxuICAgICAgICAgIG9sZFN0YXRlLnBhZ2VTaXplICE9PSBuZXdSZXNvbHZlZFN0YXRlLnBhZ2VTaXplIHx8XG4gICAgICAgICAgb2xkU3RhdGUuc29ydGVkICE9PSBuZXdSZXNvbHZlZFN0YXRlLnNvcnRlZCB8fFxuICAgICAgICAgIG9sZFN0YXRlLmZpbHRlcmVkICE9PSBuZXdSZXNvbHZlZFN0YXRlLmZpbHRlcmVkXG4gICAgICAgICkge1xuICAgICAgICAgIHRoaXMuZmlyZUZldGNoRGF0YSgpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuICB9XG4iXX0=
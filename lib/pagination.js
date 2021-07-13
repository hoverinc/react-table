'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//
// import _ from './utils'

var defaultButton = function defaultButton(props) {
  return _react2.default.createElement(
    'button',
    _extends({ type: 'button' }, props, { className: '-btn' }),
    props.children
  );
};

var ReactTablePagination = function (_Component) {
  _inherits(ReactTablePagination, _Component);

  function ReactTablePagination(props) {
    _classCallCheck(this, ReactTablePagination);

    var _this = _possibleConstructorReturn(this, (ReactTablePagination.__proto__ || Object.getPrototypeOf(ReactTablePagination)).call(this));

    _this.getSafePage = _this.getSafePage.bind(_this);
    _this.changePage = _this.changePage.bind(_this);
    _this.applyPage = _this.applyPage.bind(_this);

    _this.state = {
      page: props.page
    };
    return _this;
  }

  _createClass(ReactTablePagination, [{
    key: 'getSafePage',
    value: function getSafePage(page) {
      if (isNaN(page)) {
        page = this.props.page;
      }
      return Math.min(Math.max(page, 0), this.props.pages - 1);
    }

    // eslint-disable-next-line camelcase

  }, {
    key: 'UNSAFE_componentWillReceiveProps',
    value: function UNSAFE_componentWillReceiveProps(nextProps) {
      this.setState({ page: nextProps.page });
    }
  }, {
    key: 'changePage',
    value: function changePage(page) {
      page = this.getSafePage(page);
      this.setState({ page: page });
      if (this.props.page !== page) {
        this.props.onPageChange(page);
      }
    }
  }, {
    key: 'applyPage',
    value: function applyPage(e) {
      if (e) {
        e.preventDefault();
      }
      var page = this.state.page;
      this.changePage(page === '' ? this.props.page : page);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          pages = _props.pages,
          page = _props.page,
          showPageSizeOptions = _props.showPageSizeOptions,
          pageSizeOptions = _props.pageSizeOptions,
          pageSize = _props.pageSize,
          showPageJump = _props.showPageJump,
          canPrevious = _props.canPrevious,
          canNext = _props.canNext,
          onPageSizeChange = _props.onPageSizeChange,
          className = _props.className,
          _props$PreviousCompon = _props.PreviousComponent,
          PreviousComponent = _props$PreviousCompon === undefined ? defaultButton : _props$PreviousCompon,
          _props$NextComponent = _props.NextComponent,
          NextComponent = _props$NextComponent === undefined ? defaultButton : _props$NextComponent;


      return _react2.default.createElement(
        'div',
        {
          className: (0, _classnames2.default)(className, '-pagination'),
          style: this.props.paginationStyle
        },
        _react2.default.createElement(
          'div',
          { className: '-previous' },
          _react2.default.createElement(
            PreviousComponent,
            {
              onClick: function onClick() {
                if (!canPrevious) return;
                _this2.changePage(page - 1);
              },
              disabled: !canPrevious
            },
            this.props.previousText
          )
        ),
        _react2.default.createElement(
          'div',
          { className: '-center' },
          _react2.default.createElement(
            'span',
            { className: '-pageInfo' },
            this.props.pageText,
            ' ',
            showPageJump ? _react2.default.createElement(
              'div',
              { className: '-pageJump' },
              _react2.default.createElement('input', {
                type: this.state.page === '' ? 'text' : 'number',
                onChange: function onChange(e) {
                  var val = e.target.value;
                  var page = val - 1;
                  if (val === '') {
                    return _this2.setState({ page: val });
                  }
                  _this2.setState({ page: _this2.getSafePage(page) });
                },
                value: this.state.page === '' ? '' : this.state.page + 1,
                onBlur: this.applyPage,
                onKeyPress: function onKeyPress(e) {
                  if (e.which === 13 || e.keyCode === 13) {
                    _this2.applyPage();
                  }
                }
              })
            ) : _react2.default.createElement(
              'span',
              { className: '-currentPage' },
              page + 1
            ),
            ' ',
            this.props.ofText,
            ' ',
            _react2.default.createElement(
              'span',
              { className: '-totalPages' },
              pages || 1
            )
          ),
          showPageSizeOptions && _react2.default.createElement(
            'span',
            { className: 'select-wrap -pageSizeOptions' },
            _react2.default.createElement(
              'select',
              {
                onChange: function onChange(e) {
                  return onPageSizeChange(Number(e.target.value));
                },
                value: pageSize
              },
              pageSizeOptions.map(function (option, i) {
                return (
                  // eslint-disable-next-line react/no-array-index-key
                  _react2.default.createElement(
                    'option',
                    { key: i, value: option },
                    option,
                    ' ',
                    _this2.props.rowsText
                  )
                );
              })
            )
          )
        ),
        _react2.default.createElement(
          'div',
          { className: '-next' },
          _react2.default.createElement(
            NextComponent,
            {
              onClick: function onClick() {
                if (!canNext) return;
                _this2.changePage(page + 1);
              },
              disabled: !canNext
            },
            this.props.nextText
          )
        )
      );
    }
  }]);

  return ReactTablePagination;
}(_react.Component);

exports.default = ReactTablePagination;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wYWdpbmF0aW9uLmpzIl0sIm5hbWVzIjpbImRlZmF1bHRCdXR0b24iLCJwcm9wcyIsImNoaWxkcmVuIiwiUmVhY3RUYWJsZVBhZ2luYXRpb24iLCJnZXRTYWZlUGFnZSIsImJpbmQiLCJjaGFuZ2VQYWdlIiwiYXBwbHlQYWdlIiwic3RhdGUiLCJwYWdlIiwiaXNOYU4iLCJNYXRoIiwibWluIiwibWF4IiwicGFnZXMiLCJuZXh0UHJvcHMiLCJzZXRTdGF0ZSIsIm9uUGFnZUNoYW5nZSIsImUiLCJwcmV2ZW50RGVmYXVsdCIsInNob3dQYWdlU2l6ZU9wdGlvbnMiLCJwYWdlU2l6ZU9wdGlvbnMiLCJwYWdlU2l6ZSIsInNob3dQYWdlSnVtcCIsImNhblByZXZpb3VzIiwiY2FuTmV4dCIsIm9uUGFnZVNpemVDaGFuZ2UiLCJjbGFzc05hbWUiLCJQcmV2aW91c0NvbXBvbmVudCIsIk5leHRDb21wb25lbnQiLCJwYWdpbmF0aW9uU3R5bGUiLCJwcmV2aW91c1RleHQiLCJwYWdlVGV4dCIsInZhbCIsInRhcmdldCIsInZhbHVlIiwid2hpY2giLCJrZXlDb2RlIiwib2ZUZXh0IiwiTnVtYmVyIiwibWFwIiwib3B0aW9uIiwiaSIsInJvd3NUZXh0IiwibmV4dFRleHQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7QUFDQTtBQUNBOztBQUVBLElBQU1BLGdCQUFnQixTQUFoQkEsYUFBZ0I7QUFBQSxTQUNwQjtBQUFBO0FBQUEsZUFBUSxNQUFLLFFBQWIsSUFBMEJDLEtBQTFCLElBQWlDLFdBQVUsTUFBM0M7QUFDR0EsVUFBTUM7QUFEVCxHQURvQjtBQUFBLENBQXRCOztJQU1xQkMsb0I7OztBQUNuQixnQ0FBYUYsS0FBYixFQUFvQjtBQUFBOztBQUFBOztBQUdsQixVQUFLRyxXQUFMLEdBQW1CLE1BQUtBLFdBQUwsQ0FBaUJDLElBQWpCLE9BQW5CO0FBQ0EsVUFBS0MsVUFBTCxHQUFrQixNQUFLQSxVQUFMLENBQWdC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QUwsQ0FBVzBDO0FBRHZCO0FBRm1CO0FBQUEsZUFBcEI7QUFKSDtBQURGO0FBL0JKLFNBZkY7QUE0REU7QUFBQTtBQUFBLFlBQUssV0FBVSxPQUFmO0FBQ0U7QUFBQyx5QkFBRDtBQUFBO0FBQ0UsdUJBQVMsbUJBQU07QUFDYixvQkFBSSxDQUFDbEIsT0FBTCxFQUFjO0FBQ2QsdUJBQUtuQixVQUFMLENBQWdCRyxPQUFPLENBQXZCO0FBQ0QsZUFKSDtBQUtFLHdCQUFVLENBQUNnQjtBQUxiO0FBT0csaUJBQUt4QixLQUFMLENBQVcyQztBQVBkO0FBREY7QUE1REYsT0FERjtBQTBFRDs7Ozs7O2tCQW5Ja0J6QyxvQiIsImZpbGUiOiJwYWdpbmF0aW9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IENvbXBvbmVudCB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IGNsYXNzbmFtZXMgZnJvbSAnY2xhc3NuYW1lcydcbi8vXG4vLyBpbXBvcnQgXyBmcm9tICcuL3V0aWxzJ1xuXG5jb25zdCBkZWZhdWx0QnV0dG9uID0gcHJvcHMgPT4gKFxuICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiB7Li4ucHJvcHN9IGNsYXNzTmFtZT1cIi1idG5cIj5cbiAgICB7cHJvcHMuY2hpbGRyZW59XG4gIDwvYnV0dG9uPlxuKVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZWFjdFRhYmxlUGFnaW5hdGlvbiBleHRlbmRzIENvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yIChwcm9wcykge1xuICAgIHN1cGVyKClcblxuICAgIHRoaXMuZ2V0U2FmZVBhZ2UgPSB0aGlzLmdldFNhZmVQYWdlLmJpbmQodGhpcylcbiAgICB0aGlzLmNoYW5nZVBhZ2UgPSB0aGlzLmNoYW5nZVBhZ2UuYmluZCh0aGlzKVxuICAgIHRoaXMuYXBwbHlQYWdlID0gdGhpcy5hcHBseVBhZ2UuYmluZCh0aGlzKVxuXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIHBhZ2U6IHByb3BzLnBhZ2UsXG4gICAgfVxuICB9XG5cbiAgZ2V0U2FmZVBhZ2UgKHBhZ2UpIHtcbiAgICBpZiAoaXNOYU4ocGFnZSkpIHtcbiAgICAgIHBhZ2UgPSB0aGlzLnByb3BzLnBhZ2VcbiAgICB9XG4gICAgcmV0dXJuIE1hdGgubWluKE1hdGgubWF4KHBhZ2UsIDApLCB0aGlzLnByb3BzLnBhZ2VzIC0gMSlcbiAgfVxuXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBjYW1lbGNhc2VcbiAgVU5TQUZFX2NvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMgKG5leHRQcm9wcykge1xuICAgIHRoaXMuc2V0U3RhdGUoeyBwYWdlOiBuZXh0UHJvcHMucGFnZSB9KVxuICB9XG5cbiAgY2hhbmdlUGFnZSAocGFnZSkge1xuICAgIHBhZ2UgPSB0aGlzLmdldFNhZmVQYWdlKHBhZ2UpXG4gICAgdGhpcy5zZXRTdGF0ZSh7IHBhZ2UgfSlcbiAgICBpZiAodGhpcy5wcm9wcy5wYWdlICE9PSBwYWdlKSB7XG4gICAgICB0aGlzLnByb3BzLm9uUGFnZUNoYW5nZShwYWdlKVxuICAgIH1cbiAgfVxuXG4gIGFwcGx5UGFnZSAoZSkge1xuICAgIGlmIChlKSB7IGUucHJldmVudERlZmF1bHQoKSB9XG4gICAgY29uc3QgcGFnZSA9IHRoaXMuc3RhdGUucGFnZVxuICAgIHRoaXMuY2hhbmdlUGFnZShwYWdlID09PSAnJyA/IHRoaXMucHJvcHMucGFnZSA6IHBhZ2UpXG4gIH1cblxuICByZW5kZXIgKCkge1xuICAgIGNvbnN0IHtcbiAgICAgIC8vIENvbXB1dGVkXG4gICAgICBwYWdlcyxcbiAgICAgIC8vIFByb3BzXG4gICAgICBwYWdlLFxuICAgICAgc2hvd1BhZ2VTaXplT3B0aW9ucyxcbiAgICAgIHBhZ2VTaXplT3B0aW9ucyxcbiAgICAgIHBhZ2VTaXplLFxuICAgICAgc2hvd1BhZ2VKdW1wLFxuICAgICAgY2FuUHJldmlvdXMsXG4gICAgICBjYW5OZXh0LFxuICAgICAgb25QYWdlU2l6ZUNoYW5nZSxcbiAgICAgIGNsYXNzTmFtZSxcbiAgICAgIFByZXZpb3VzQ29tcG9uZW50ID0gZGVmYXVsdEJ1dHRvbixcbiAgICAgIE5leHRDb21wb25lbnQgPSBkZWZhdWx0QnV0dG9uLFxuICAgIH0gPSB0aGlzLnByb3BzXG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdlxuICAgICAgICBjbGFzc05hbWU9e2NsYXNzbmFtZXMoY2xhc3NOYW1lLCAnLXBhZ2luYXRpb24nKX1cbiAgICAgICAgc3R5bGU9e3RoaXMucHJvcHMucGFnaW5hdGlvblN0eWxlfVxuICAgICAgPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIi1wcmV2aW91c1wiPlxuICAgICAgICAgIDxQcmV2aW91c0NvbXBvbmVudFxuICAgICAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgICBpZiAoIWNhblByZXZpb3VzKSByZXR1cm5cbiAgICAgICAgICAgICAgdGhpcy5jaGFuZ2VQYWdlKHBhZ2UgLSAxKVxuICAgICAgICAgICAgfX1cbiAgICAgICAgICAgIGRpc2FibGVkPXshY2FuUHJldmlvdXN9XG4gICAgICAgICAgPlxuICAgICAgICAgICAge3RoaXMucHJvcHMucHJldmlvdXNUZXh0fVxuICAgICAgICAgIDwvUHJldmlvdXNDb21wb25lbnQ+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIi1jZW50ZXJcIj5cbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCItcGFnZUluZm9cIj5cbiAgICAgICAgICAgIHt0aGlzLnByb3BzLnBhZ2VUZXh0fXsnICd9XG4gICAgICAgICAgICB7c2hvd1BhZ2VKdW1wXG4gICAgICAgICAgICAgID8gPGRpdiBjbGFzc05hbWU9XCItcGFnZUp1bXBcIj5cbiAgICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICAgIHR5cGU9e3RoaXMuc3RhdGUucGFnZSA9PT0gJycgPyAndGV4dCcgOiAnbnVtYmVyJ31cbiAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXtlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdmFsID0gZS50YXJnZXQudmFsdWVcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcGFnZSA9IHZhbCAtIDFcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbCA9PT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5zZXRTdGF0ZSh7IHBhZ2U6IHZhbCB9KVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBwYWdlOiB0aGlzLmdldFNhZmVQYWdlKHBhZ2UpIH0pXG4gICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgdmFsdWU9e3RoaXMuc3RhdGUucGFnZSA9PT0gJycgPyAnJyA6IHRoaXMuc3RhdGUucGFnZSArIDF9XG4gICAgICAgICAgICAgICAgICBvbkJsdXI9e3RoaXMuYXBwbHlQYWdlfVxuICAgICAgICAgICAgICAgICAgb25LZXlQcmVzcz17ZSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlLndoaWNoID09PSAxMyB8fCBlLmtleUNvZGUgPT09IDEzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgdGhpcy5hcHBseVBhZ2UoKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA6IDxzcGFuIGNsYXNzTmFtZT1cIi1jdXJyZW50UGFnZVwiPlxuICAgICAgICAgICAgICAgIHtwYWdlICsgMX1cbiAgICAgICAgICAgICAgPC9zcGFuPn17JyAnfVxuICAgICAgICAgICAge3RoaXMucHJvcHMub2ZUZXh0fXsnICd9XG4gICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCItdG90YWxQYWdlc1wiPntwYWdlcyB8fCAxfTwvc3Bhbj5cbiAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAge3Nob3dQYWdlU2l6ZU9wdGlvbnMgJiZcbiAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInNlbGVjdC13cmFwIC1wYWdlU2l6ZU9wdGlvbnNcIj5cbiAgICAgICAgICAgICAgPHNlbGVjdFxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXtlID0+IG9uUGFnZVNpemVDaGFuZ2UoTnVtYmVyKGUudGFyZ2V0LnZhbHVlKSl9XG4gICAgICAgICAgICAgICAgdmFsdWU9e3BhZ2VTaXplfVxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAge3BhZ2VTaXplT3B0aW9ucy5tYXAoKG9wdGlvbiwgaSkgPT4gKFxuICAgICAgICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHJlYWN0L25vLWFycmF5LWluZGV4LWtleVxuICAgICAgICAgICAgICAgICAgPG9wdGlvbiBrZXk9e2l9IHZhbHVlPXtvcHRpb259PlxuICAgICAgICAgICAgICAgICAgICB7b3B0aW9ufSB7dGhpcy5wcm9wcy5yb3dzVGV4dH1cbiAgICAgICAgICAgICAgICAgIDwvb3B0aW9uPlxuICAgICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgICA8L3NlbGVjdD5cbiAgICAgICAgICAgIDwvc3Bhbj59XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIi1uZXh0XCI+XG4gICAgICAgICAgPE5leHRDb21wb25lbnRcbiAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgaWYgKCFjYW5OZXh0KSByZXR1cm5cbiAgICAgICAgICAgICAgdGhpcy5jaGFuZ2VQYWdlKHBhZ2UgKyAxKVxuICAgICAgICAgICAgfX1cbiAgICAgICAgICAgIGRpc2FibGVkPXshY2FuTmV4dH1cbiAgICAgICAgICA+XG4gICAgICAgICAgICB7dGhpcy5wcm9wcy5uZXh0VGV4dH1cbiAgICAgICAgICA8L05leHRDb21wb25lbnQ+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG59XG4iXX0=
import { Pagination as FeblrPagination } from 'feblr-view-model';
import React, { Component, PropTypes } from 'react';

export default class Pagination extends Component {
  static propTypes = {
    onPageChange: PropTypes.func,
    feblrPagination: PropTypes.instanceOf(FeblrPagination)
  };

  constructor(props) {
    super(props);

    this.gotoPrevPage = this.gotoPrevPage.bind(this);
    this.gotoNextPage = this.gotoNextPage.bind(this);
    this.gotoPage = this.gotoPage.bind(this);
    this.updateJumper = this.updateJumper.bind(this);

    this.state = {
      jumper: {
        page: 1
      }
    }
  }

  gotoPrevPage() {
    this.props.onPageChange({
      page: this.props.feblrPagination.currPage - 1
    });
  }

  gotoNextPage() {
    this.props.onPageChange({
      page: this.props.feblrPagination.currPage + 1
    });
  }

  gotoPage(event) {
    var targetPage = this.props.feblrPagination.currPage;
    if (event.target.tagName === 'BUTTON') {
      targetPage = parseInt(event.target.textContent) - 1;
    } else {
      targetPage = parseInt(this.state.jumper.page) - 1;
    }

    this.props.onPageChange({
      page: targetPage
    });
  }

  updateJumper(event) {
    this.setState({
      jumper: {
        page: parseInt(event.target.value)
      }
    });
  }

  render() {
    var pages = this.props.feblrPagination.pages.map(page => {
      return (
        <li className="page" key={page.index} >
          <button type="button" onClick={this.gotoPage}>{page.index + 1}</button>
        </li>
      )
    });

    return (
      <div className="feblr-pagination">
        <ul>
          <li className="prev">
            <button type="button" onClick={this.gotoPrevPage}><i className="feblr-icon-arrow-left icon"></i></button>
          </li>
          {pages}
          <li className="next">
            <button type="button" onClick={this.gotoNextPage}><i className="feblr-icon-arrow-right icon"></i></button>
          </li>
        </ul>
        <div className="jumper">
          <form onSubmit={this.gotoPage}>
            <input type="number" value={this.state.jumper.page} onChange={this.updateJumper} />
          </form>
        </div>
      </div>
    )
  }
}

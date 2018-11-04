import React from 'react';

import { connect } from 'react-redux';
import { setIndicatorGroupPage, setIndicatorGroupRowsPerPage, setIndicatorGroupRowTotal } from './../../actions/indicatorGroupList';

import { Query } from 'react-apollo';
import IndicatorGroupRepository from './../../repository/IndicatorGroupRepository';
import { GraphQLError } from './../Error/GraphQLError';

import ListTable from '../ListTable/ListTable';
import LinkButton from './../../Components/FormInput/LinkButton';

class IndicatorGroupList extends React.Component {
  render() {
    return (
      <Query
        query={IndicatorGroupRepository.getListPage()}
        variables={{ 'first': this.props.indicatorGroupRowsPerPage, 'offset': this.props.indicatorGroupPage * this.props.indicatorGroupRowsPerPage }}
        fetchPolicy={this.props.refetch ? 'cache-and-network' : 'cache-first'}
      >
        {({ loading, error, data }) => {
          if (loading) {
            return <p>Loading...</p>;
          }
          if (error) {
            return <GraphQLError error={error} />;
          }
          this.props.setIndicatorGroupRowTotal(data.allIndicatorGroups.totalCount);
          return (
            <div>
              <div style={{ 'float': 'left', 'marginLeft': '60px' }}>
                Indicator Groups
              </div>
              <div style={{ 'float': 'right' }}>
                <LinkButton label="Create" type="Create" color="primary"
                  variant="contained" to={'/indicator-group/new'} />
              </div>
              <ListTable
                data={data.allIndicatorGroups.nodes}
                buttons={[
                  { 'function': 'execute', 'parameter': this._buildExecuteParam() },
                  { 'function': 'edit', 'parameter': '/indicator-group' },
                  { 'function': 'delete', 'parameter': this._buildDeleteParam() }
                ]}
                footerParams={this._buildFooterParam()}
              />
            </div>
          );
        }}
      </Query>
    );
  }

  _buildExecuteParam() {
    return {
      'repository': IndicatorGroupRepository
    };
  }

  _buildDeleteParam() {
    return {
      'page': this.props.indicatorGroupPage,
      'rowTotal': this.props.indicatorGroupRowTotal,
      'rowsPerPage': this.props.indicatorGroupRowsPerPage,
      'setPage': this.props.setIndicatorGroupPage,
      'repository': IndicatorGroupRepository
    };
  }

  _buildFooterParam() {
    return {
      'page': this.props.indicatorGroupPage,
      'rowTotal': this.props.indicatorGroupRowTotal,
      'rowsPerPage': this.props.indicatorGroupRowsPerPage,
      'setPage': this.props.setIndicatorGroupPage,
      'setRowsPerPage': this.props.setIndicatorGroupRowsPerPage
    };
  }
}

const mapStateToProps = (state) => ({
  'indicatorGroupPage': state.indicatorGroupPage,
  'indicatorGroupRowsPerPage': state.indicatorGroupRowsPerPage,
  'indicatorGroupRowTotal': state.indicatorGroupRowTotal
});

const mapDispatchToProps = (dispatch) => ({
  'setIndicatorGroupPage': (page) => dispatch(setIndicatorGroupPage(page)),
  'setIndicatorGroupRowsPerPage': (rowsPerPage) => dispatch(setIndicatorGroupRowsPerPage(rowsPerPage)),
  'setIndicatorGroupRowTotal': (rowTotal) => dispatch(setIndicatorGroupRowTotal(rowTotal))
});

export default connect(mapStateToProps, mapDispatchToProps)(IndicatorGroupList);


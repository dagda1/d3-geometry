import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import FunctionPlot from './function-plot';

import * as actions from "../actions/fuction-actions";

function mapStateToProps(state) {
  return {
    expression: state.func.expression
  };
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actions, dispatch);
};


export default connect(mapStateToProps, mapDispatchToProps)(FunctionPlot);

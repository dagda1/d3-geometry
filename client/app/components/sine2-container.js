import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Sine from './sine2';

function mapStateToProps(state) {
  return state;
}

export default connect(mapStateToProps)(Sine);

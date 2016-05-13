import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import SineWave from './sine-wave';

function mapStateToProps(state) {
  return state;
}

export default connect(mapStateToProps)(SineWave);

import { combineReducers } from 'redux';

import Prss from './Prss';
import Prjs from './Prjs';
import Errs from './Errs';
import Cmts from './Cmts';
import Liks from './Liks';

const rootReducer = combineReducers({Prss, Prjs, Errs, Cmts, Liks});

export default rootReducer;



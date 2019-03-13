import { combineReducers } from 'redux';

import Prss from './Prss';
import Prjs from './Prjs';
import Errs from './Errs';
import Cmts from './Cmts';

const rootReducer = combineReducers({Prss, Prjs, Errs, Cmts});

export default rootReducer;



import * as api from '../api';

export function signIn(credentials, cb) {
   return (dispatch, prevState) => {
      api.signIn(credentials)
      .then((userInfo) => dispatch({type: "SIGN_IN", user: userInfo}))
      .then(() => {if (cb) cb();})
      .catch(error => dispatch({type: 'LOGIN_ERR', details: error}));
   };
}

export function clearErrors(){
   return (dispatch, prevState)=>{
      dispatch({type:'CLEAR_ERR'});
   }
}

export function getCmts(id, cb){
   return (dispatch, prevState) => {
      api.getCmts(id)
         .then((cmts) => dispatch({type: 'UPDATE_CMTS', cmts}))
         .then(() => {if (cb) cb();})
         .catch(error => dispatch({type: 'LOGIN_ERR', details: error}));
   };
}

export function newCmt(prjId, cmt, cb){
   return (dispatch, prevState) => {
   api.postCmt(prjId, cmt)
      .then(api.getCmts(prjId)
      .then((cmts) => dispatch({type: 'UPDATE_CMTS', cmts})))
      .then(() => {if (cb) cb();})
      .catch(error => dispatch({type: 'LOGIN_ERR', details: error}));
   };
}

export function signOut(cb) {
   return (dispatch, prevState) => {
      api.signOut()
      .then(() => dispatch({ type: 'SIGN_OUT' }))
      .then(() => {if (cb) cb();})
      .catch(error => dispatch({type: 'LOGIN_ERR', details: error}));
   };
}

export function register(data, cb) {
   return (dispatch, prevState) => {
      api.postPrs(data)
      .then(() => {if (cb) cb();})
      .catch(error => dispatch({type: 'REGISTER_ERR', details: error}));
   };
}

/*
export function updatePrjs(timePosted, limit, offset, cb) {
   return (dispatch, prevState) => {
      api.getPrjs(timePosted, limit, offset)
      .then((prjs) => {console.log("here: "+JSON.stringify(prjs)); return dispatch({ type: 'UPDATE_PRJS', prjs })})
*/
export function updatePrjs(page, selectedTags, userId, cb) {
   return (dispatch, prevState) => {
      console.log(page)
      api.getPrjs(page, selectedTags, userId)
      .then((prjs) => {console.log("PROJECTS: "+JSON.stringify(prjs)); return dispatch({ type: 'UPDATE_PRJS', prjs })})
      .then(() => {if (cb) cb();})
      .catch(error => dispatch({type: 'LOGIN_ERR', details: error}));
   };
}

export function clearPrjs() {
   return (dispatch, prevState) => {
      dispatch({ type: 'CLEAR_PRJS' });
   }
}

export function addPrj(newPrj, cb) {
   return (dispatch, prevState) => {
      api.postPrj(newPrj)
      .then(prjRsp => dispatch({type: 'ADD_PRJ', prj: prjRsp}))
      .then(() => {if (cb) cb();})
      .catch(error => dispatch({type: 'LOGIN_ERR', details: error}));
   };
}

export function getPrj(id, cb) {
   return (dispatch, prevState) => {
      api.getPrj(id)
      .then(prjRsp => dispatch({type: 'GET_PRJ', prj: prjRsp}))
      .then(() => {if (cb) cb();})
      .catch(error => dispatch({type: 'LOGIN_ERR', details: error}));
   }
}

export function delPrj(id, cb) {
   return (dispatch, prevState) => {
      api.deletePrj(id)
      .then(console.log("deleted prj"))
      .then(() =>{if(cb) cb()})
      .catch(error => dispatch({type: 'LOGIN_ERR', details: error}));
   };
}

export function modPrj(prjId, body, cb) {
   return (dispatch, prevState) => {
      api.putPrj(prjId, body)
      .then((prjs) => dispatch({type: 'UPDATE_PRJ', data:{id:prjId, body}}))
      .then(() => {if (cb) cb();})
      .catch(error => dispatch({type: 'LOGIN_ERR', details: error}));
   };
}

export function getLik(prjId, cb) {
   return (dispatch, prevState) => {
      api.getLik(prjId)
      .then(likRsp => dispatch({type: 'GET_LIK', lik: likRsp}))
      .then(() => {if (cb) cb();})
      .catch(error => dispatch({type: 'LOGIN_ERR', details: error}));
   }
}

export function addLik(prjId, cb) {
   return (dispatch, prevState) => {
      api.addLik(prjId)
      .then(() => api.getLik(prjId))
      .then(likRsp => dispatch({type: 'GET_LIK', lik: likRsp}))
      .then(() => api.getPrj(prjId))
      .then(prjRsp => dispatch({type: 'GET_PRJ', prj: prjRsp}))
      .then(() => {if (cb) cb();})
      .catch(error => dispatch({type: 'LOGIN_ERR', details: error}));
   }
}

export function removeLik(prjId, cb) {
   return (dispatch, prevState) => {
      api.removeLik(prjId)
      .then(() => api.getLik(prjId))
      .then(likRsp => dispatch({type: 'GET_LIK', lik: likRsp}))
      .then(() => api.getPrj(prjId))
      .then(prjRsp => dispatch({type: 'GET_PRJ', prj: prjRsp}))
      .then(() => {if (cb) cb();})
      .catch(error => dispatch({type: 'LOGIN_ERR', details: error}));
   }
}
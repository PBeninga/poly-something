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

export function updatePrjs(page, selectedTags, userId, cb) {
   return (dispatch, prevState) => {
      console.log(selectedTags)
      api.getPrjs(page, selectedTags, userId)
      .then((prjs) => {console.log("PROJECTS: "+JSON.stringify(prjs)); return dispatch({ type: 'UPDATE_PRJS', prjs })})
      .then(() => {if (cb) cb();})
      .catch(error => dispatch({type: 'LOGIN_ERR', details: error}));
   };
}

export function addPrj(newPrj, cb) {
   return (dispatch, prevState) => {
      api.postPrj(newPrj)
      .then(prjRsp => dispatch({type: 'ADD_PRJ', prj: newPrj}))
      .then(() => {if (cb) cb();})
      .catch(error => dispatch({type: 'LOGIN_ERR', details: error}));
   };
}

export function delPrj(id, cb) {
   return (dispatch, prevState) => {
      api.deletePrj(id)
      .then(console.log("deleted prj"))
      .then(() =>{if(cb) cb()})
      .catch(error => dispatch({type: 'LOGIN_ERR', details: error}));
   };
}

export function modPrj(prjId, title, cb) {
   return (dispatch, prevState) => {
      api.putPrj(prjId, {title})
      .then((prjs) => dispatch({type: 'UPDATE_PRJ', data:{title, id:prjId}}))
      .then(() => {if (cb) cb();})
      .catch(error => dispatch({type: 'LOGIN_ERR', details: error}));
   };
}
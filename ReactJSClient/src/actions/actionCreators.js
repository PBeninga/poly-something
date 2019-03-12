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
export function getMsgs(id, cb){
   return (dispatch, prevState) => {
      api.getMsgs(id)
         .then((msgs) => dispatch({type:'UPDATE_MSGS', msgs:msgs}))
         .then(() => {if (cb) cb();})
         .catch(error => dispatch({type: 'LOGIN_ERR', details: error}));
   };
}
export function newMsg(cnvId, msg, cb){
   return (dispatch, prevState) => {
   api.sendMsg(cnvId, msg)
      .then(api.getMsgs(cnvId)
      .then((msgs) => dispatch({type:'UPDATE_MSGS', msgs:msgs})))
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

export function updateCnvs(userId, cb) {
   return (dispatch, prevState) => {
      api.getCnvs(userId)
      .then((cnvs) => {console.log("here: "+JSON.stringify(cnvs)); return dispatch({ type: 'UPDATE_CNVS', cnvs })})
      .then(() => {if (cb) cb();})
      .catch(error => dispatch({type: 'LOGIN_ERR', details: error}));
   };
}

export function addCnv(newCnv, cb) {
   return (dispatch, prevState) => {
      api.postCnv(newCnv)
      .then(cnvRsp => dispatch({type: 'ADD_CNV', cnv: newCnv}))
      .then(() => {if (cb) cb();})
      .catch(error => dispatch({type: 'LOGIN_ERR', details: error}));
   };
}
export function delCnv(id, cb) {
   return (dispatch, prevState) => {
      api.deleteCnv(id)
      .then(console.log("deleted cnv"))
      .then(() =>{if(cb) cb()})
      .catch(error => dispatch({type: 'LOGIN_ERR', details: error}));
   };
}


export function modCnv(cnvId, title, cb) {
   return (dispatch, prevState) => {
      api.putCnv(cnvId, {"title":title})
      .then((cnvs) => dispatch({type: 'UPDATE_CNV', data:{title:title, id:cnvId}}))
      .then(() => {if (cb) cb();})
      .catch(error => dispatch({type: 'LOGIN_ERR', details: error}));
   };
}
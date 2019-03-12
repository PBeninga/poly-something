var Errs = function(state = {}, action) {
   console.log("Errs reducing action " + action.type);
   console.log(action.details)
   switch(action.type) {
   case 'LOGIN_ERR':
      return action.details
   case 'REGISTER_ERR':
      return action.details;
   case 'CLEAR_ERR':
      return {}
   default:
      return state;
   }
}
export default Errs

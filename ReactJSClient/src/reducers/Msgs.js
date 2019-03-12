var Msgs = function(state = {}, action) {
   console.log("Msgs reducing action " + action.type);
   switch(action.type) {
   case 'UPDATE_MSGS':
         return action.msgs
   default:
      return state;
   }
}
export default Msgs

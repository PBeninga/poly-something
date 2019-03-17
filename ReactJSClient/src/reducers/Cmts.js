var Cmts = function(state = {}, action) {
   console.log("Cmts reducing action " + action.type);
   switch(action.type) {
   case 'UPDATE_CMTS':
      return action.cmts;
   default:
      return state;
   }
}
export default Cmts

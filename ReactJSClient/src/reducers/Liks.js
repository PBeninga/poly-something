var Liks = function(state = {}, action) {
   console.log("Liks reducing action " + action.type);
   switch(action.type) {
   case 'UPDATE_LIKS':
      return action.liks;
   case 'GET_LIKS':
      return action.liks;
   default:
      return state;
   }
}

export default Liks


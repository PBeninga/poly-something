var Liks = function(state = [], action) {
   console.log("Liks reducing action " + action.type);
   switch(action.type) {
   case 'UPDATE_LIKS':
      return action.liks;
   case 'GET_LIK':
      return action.lik;
   default:
      return state;
   }
}

export default Liks

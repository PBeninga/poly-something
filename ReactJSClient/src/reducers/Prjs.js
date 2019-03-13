var Prjs =  function(state = [], action) {
   console.log("Prjs reducing action " + action.type);

   switch (action.type) {
      case 'UPDATE_PRJS': // Replace previous cnvs
         console.log("Updating: " + JSON.stringify(action))
         return action.prjs;
      case 'UPDATE_PRJ':
         /* Example of wrongness
        state.forEach(val => {
           if (val.id == action.data.cnvId)
              val.title = action.data.title;
        });
        return state;*/
        console.log(action)
         return state.map(val => val.id !== action.data.id ?
            val : Object.assign({}, val, { title: action.data.title }));
      case 'ADD_PRJ':
         return state.concat([action.prj]);

      default:
         return state;
   }
}

export default Prjs;

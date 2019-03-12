var Cnvs =  function(state = [], action) {
   console.log("Cnvs reducing action " + action.type);

   switch (action.type) {
      case 'UPDATE_CNVS': // Replace previous cnvs
         console.log("Updating: " + JSON.stringify(action))
         return action.cnvs;
      case 'UPDATE_CNV':
         /* Example of wrongness
        state.forEach(val => {
           if (val.id == action.data.cnvId)
              val.title = action.data.title;
        });
        return state;*/
        console.log(action)
         return state.map(val => val.id !== action.data.id ?
            val : Object.assign({}, val, { title: action.data.title }));
      case 'ADD_CNV':
         return state.concat([action.cnv]);

      default:
         return state;
   }
}
export default Cnvs

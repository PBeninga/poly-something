// Orderly interface to the REST server, providing:
// 1. Standard URL base
// 2. Standard headers to manage CORS and content type
// 3. Guarantee that 4xx and 5xx results are returned as
//    rejected promises, with a payload comprising an
//    array of user-readable strings describing the error.
// 4. All successful post operations return promises that
//    resolve to a JS object representing the newly added
//    entity (all fields, not just those in the post body)
// 5. Signin and signout operations that retain relevant
//    cookie data.  Successful signin returns promise 
//    resolving to newly signed in user.

const baseURL = "http://localhost:3001/REST/";
const headers = new Headers();
var cookie;

headers.set('Content-Type', 'application/JSON');

const reqConf = {
    headers: headers,
    credentials: 'include',

}
var fetchWithHandling = function(url, params){
    return fetch(url, {
        method: params.method,
        body: params.body,
        ...reqConf
    }).catch(() => {
        throw new Error("Server Connect Error")
    })
    .then(response => {
        if(response.status !== 200)
            return response.text().then(data => {
                if(data === "")
                    response.jsonBody = []
                else
                    response.jsonBody = JSON.parse(data);
                return response
            })
        else 
            return response
    }).then(response => {
        if (response.status !== 200){     
            var body = response.jsonBody
            var errBody = [];
            for(var i = 0; i < body.length; i++){
                errBody.push(errorTranslate(body[i].tag))
            }
            throw new Error(errBody)
        }
        return response
    });
}
// Helper functions for the comon request types, automatically
// adding verb, headers, and error management.
export function post(endpoint, body) {
    return fetchWithHandling(baseURL + endpoint, {
        method: 'POST',
        body: JSON.stringify(body),
        ...reqConf
    })
}

export function put(endpoint, body) {
    return fetchWithHandling(baseURL + endpoint, {
        method: 'PUT',
        body: JSON.stringify(body),
        ...reqConf
    });
}

export function get(endpoint) {
    return fetchWithHandling(baseURL + endpoint, {
        method: 'GET',
        ...reqConf
    });
}

export function del(endpoint) {
    return fetchWithHandling(baseURL + endpoint, {
        method: 'DELETE',
        ...reqConf
    });
}

// Functions for performing the api requests

/**
 * Sign a user into the service, returning a promise of the 
 * user data
 * @param {{email: string, password: string}} cred
 */
export function signIn(cred) {
   return post("Ssns", cred)
      .then(response => {
         console.log(response.headers.get("Location"))
         let location = response.headers.get("Location").split('/');
         cookie = location[location.length - 1];
         return get("Ssns/" + cookie)
      })
      .then(response => {return response.json()})   // ..json() returns a Promise!
      .then(rsp => get('Prss/' + rsp.prsId))
      .then(userResponse => userResponse.json())
      .then(rsp => rsp[0]);
}

/**
 * @returns {Promise} result of the sign out request
 */
export function signOut() {
   return del("Ssns/" + cookie);
}
export function deletePrj(id){
   return del(`Prjs/${id}`)
}

/**
 * Register a user
 * @param {Object} user
 * @returns {Promise resolving to new user}
 */
export function postPrs(user) {
   return post("Prss", user)
}

export function getCmts(id){
   return get(`Cmts/${id}`)
   .then(rsp => rsp.json());
}

export function postCmt(prjId, msg){
   return post(`Cmts/${prjId}`,{content:msg})
}

/**
 * @returns {Promise} json parsed data
 */
export function getPrjs(page, selectedTags, userId){
    var limit = 12;
    var catagories = selectedTags !== [] ? "&categories="+selectedTags.join("|") : "";
    return get("Prjs" +"?limit="+(limit+1)+catagories+
        "&offset="+page*limit+(userId ? "&owner="+userId : ""))
    .then((res) => res.json())
}
export function getPrj(id) {
   return get(`Prjs/${id}`)
   .then(rsp => rsp.json());
}

export function putPrj(id, body) {
   console.log(id + " " + JSON.stringify(body))
   return put(`Prjs/${id}`, body)
}

export function postPrj(body) {
    return post('Prjs', body).then(rsp => {
      let location = rsp.headers.get("Location").split('/');
      return get(`Prjs/${location[location.length-1]}`);
   })
   .then(rsp => rsp.json());
}

export function getLik(id) {
   return get(`Liks/${id}`)
   .then(rsp => rsp.json());
}

export function addLik(id) {
   return post(`Liks/${id}`);
}

export function removeLik(id) {
   return del(`Liks/${id}`);
}

const errMap = {
    en: {
        missingField: 'Field missing from request: ',
        badValue: 'Field has bad value: ',
        notFound: 'Entity not present in DB',
        badLogin: 'Email/password combination invalid',
        dupEmail: 'Email duplicates an existing email',
        noTerms: 'Acceptance of terms is required',
        forbiddenRole: 'Role specified is not permitted.',
        noOldPwd: 'Change of password requires an old password',
        oldPwdMismatch: 'Old password that was provided is incorrect.',
        dupTitle: 'Conversation title duplicates an existing one',
        dupEnrollment: 'Duplicate enrollment',
        forbiddenField: 'Field in body not allowed.',
        queryFailed: 'Query failed (server problem).'
    },
    es: {
        missingField: '[ES] Field missing from request: ',
        badValue: '[ES] Field has bad value: ',
        notFound: '[ES] Entity not present in DB',
        badLogin: '[ES] Email/password combination invalid',
        dupEmail: '[ES] Email duplicates an existing email',
        noTerms: '[ES] Acceptance of terms is required',
        forbiddenRole: '[ES] Role specified is not permitted.',
        noOldPwd: '[ES] Change of password requires an old password',
        oldPwdMismatch: '[ES] Old password that was provided is incorrect.',
        dupTitle: '[ES] Conversation title duplicates an existing one',
        dupEnrollment: '[ES] Duplicate enrollment',
        forbiddenField: '[ES] Field in body not allowed.',
        queryFailed: '[ES] Query failed (server problem).'
    },
    swe: {
        missingField: 'Ett fält saknas: ',
        badValue: 'Fält har dåligt värde: ',
        notFound: 'Entitet saknas i DB',
        badLogin: 'Email/lösenord kombination ogilltig',
        dupEmail: 'Email duplicerar en existerande email',
        noTerms: 'Villkoren måste accepteras',
        forbiddenRole: 'Angiven roll förjuden',
        noOldPwd: 'Tidiagre lösenord krav för att updatera lösenordet',
        oldPwdMismatch: 'Tidigare lösenord felaktigt',
        dupTitle: 'Konversationstitel duplicerar tidigare existerande titel',
        dupEnrollment: 'Duplicerad inskrivning',
        forbiddenField: 'Förbjudet fält i meddelandekroppen',
        queryFailed: 'Förfrågan misslyckades (server problem).'
    }
}

/**
 * @param {string} errTag
 * @param {string} lang
 */
export function errorTranslate(errTag, lang = 'en') {
    return errMap[lang][errTag] || 'Unknown Error!';
}

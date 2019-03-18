import React, { Component } from 'react';
import {ConfDialog} from '../index';
import {
  FormGroup, ControlLabel, FormControl, HelpBlock,
  Checkbox, Button, Alert
} from 'react-bootstrap';

import './Register.css';

// Functional component label plus control w/optional help message
function FieldGroup({id, label, help, ...props }) {
   return (
       <FormGroup controlId={id}>
          <ControlLabel>{label}</ControlLabel>
          <FormControl {...props} />
          {help && <HelpBlock>{help}</HelpBlock>}
       </FormGroup>
   );
}

class Register extends Component {
   constructor(props) {
      super(props);
      this.state = {
         handle: '',
         email: '',
         password: '',
         passwordTwo: '',
         role: 0
      }
      this.handleChange = this.handleChange.bind(this);
   }

   submit() {
      let { // Make a copy of the relevant values in current state
         handle,
         email,
         password,
         role
      } = this.state;

      const user = {
         handle,
         email,
         password,
         role
      };

      this.props.register(user, () => {this.props.history.push("/signin")});
   }

   handleChange(ev) {
      let newState = {};

      switch (ev.target.type) {
      case 'checkbox':
         newState[ev.target.id] = ev.target.checked;
         break;
      default:
         newState[ev.target.id] = ev.target.value;
         if(ev.target.value !== ""){
            newState[ev.target.id +"BLUE"] = true
         }else{
            newState[ev.target.id+"BLUE"] = false
         }
      }

      this.setState(newState);
   }

   formValid() {
      let s = this.state;
      return s.email && s.handle && s.password && s.password === s.passwordTwo
   }

   render() {
     return (
        <div className="container">
           <form>
              <FieldGroup id="handle" type="text" label="Handle"
               placeholder="Enter user handle" value={this.state.handle}
               onChange={this.handleChange}
               className = {this.state["handleBLUE"] ? "highlighted" : ""}
               />
              
              <FieldGroup id="email" type="email" label="Email Address"
               placeholder="Enter email" value={this.state.email}
               onChange={this.handleChange} required={true}
               className = {this.state["emailBLUE"] ? "highlighted" : ""}
               />

              <FieldGroup id="password" type="password" label="Password"
               value={this.state.password}
               onChange={this.handleChange} required={true}
               />

              <FieldGroup id="passwordTwo" type="password" label="Repeat Password"
               value={this.state.passwordTwo}
               onChange={this.handleChange} required={true}
               help="Repeat your password"
              />
           </form>

           {this.state.password !== this.state.passwordTwo ?
            <Alert bsStyle="warning">
               Passwords don't match
            </Alert> : ''}

           <Button bsStyle="primary" onClick={() => this.submit()}
            disabled={!this.formValid()}>
              Submit
           </Button>

           {/*<ConfDialog
              show={this.state.offerSignIn}
              title="Registration Success"
              body={`Would you like to log in as ${this.state.email}?`}
              buttons={['YES', 'NO']}
              onClose={answer => {
                 this.setState({offerSignIn: false});
                 if (answer === 'YES') {
                    this.props.signIn(
                     {email: this.state.email, password: this.state.password},
                     () => this.props.history.push("/"));
                 }
              }}
            />*/}
        </div>
      )
   }
}

export default Register;

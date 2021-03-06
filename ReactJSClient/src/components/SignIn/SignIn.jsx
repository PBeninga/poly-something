import React, { Component } from 'react';
import { Form, FormGroup, Col, FormControl, Button, ControlLabel} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './SignIn.css';

class SignIn extends Component {
   constructor(props) {
      super(props);

      // Current login state
      this.state = {
         email: 'admin@aol.net',
         password: 'password'
      }

      // bind 'this' to the correct context
      this.handleChange = this.handleChange.bind(this);
      this.signIn = this.signIn.bind(this);
      this.margin = 8
   }

   // Call redux actionCreator signin via props.
   signIn(event) {
      this.props.signIn(this.state, () => this.props.history.push("/"));
      event.preventDefault()
   }

   // Continually update state as letters typed. Rerenders, but no DOM change!
   handleChange(event) {
      var newState = {}
      console.log(event.target.value)
      if(event.target.value !== ""){
         newState[event.target.name] = true
      }else{
         newState[event.target.name] = false
      }
      newState[event.target.name] = event.target.value;
      console.log(newState)
      this.setState(newState);
   }

   render() {
      console.log("Rendering Signin");
      return (
         <div>
         <section className="container">
            <Col smOffset={2}>
               <h1>Sign in</h1>
            </Col>
            <Form horizontal>
               <FormGroup controlId="formHorizontalEmail">
                  <Col componentClass={ControlLabel} sm={2}>
                     Email
                  </Col>
                  <Col sm={this.margin}>
                     <FormControl
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={this.state.email}
                      onChange={this.handleChange}
                      className = {this.state["email"] ? "highlighted" : ""}
                      />
                  </Col>
               </FormGroup>
               <FormGroup controlId="formHorizontalPassword">
                  <Col componentClass={ControlLabel} sm={2}>
                     Password
                  </Col>
                  <Col sm={this.margin}>
                     <FormControl
                      type="password"
                      name="password"
                      placeholder="Password"
                      value={this.state.password}
                      onChange={this.handleChange}
                      className = {this.state["password"] ? "highlighted" : ""}
                     />
                  </Col>
               </FormGroup>
               <FormGroup>
                  <Col smOffset={2} sm={this.margin}>
                     <Button type="submit" onClick={this.signIn}>
                        Sign in
                     </Button>
                 </Col>
               </FormGroup>
            </Form>
         </section>
         <div className="container toReg">
         <Link to="/register">
            Don't have an account? Click Here to Register
         </Link>
         </div>
         </div>
      )
   }
}

export default SignIn;

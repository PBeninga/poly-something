import React, { Component } from 'react';
import { Register, SignIn, PrjOverview, PrjDetail, ConfDialog } from '../index'
import { Route, Redirect, Switch, Link } from 'react-router-dom';
import { Navbar, Nav, NavItem, ListGroup, ListGroupItem, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import './Main.css';
import ErrorModal from './ErrorModal'; 
class Main extends Component {
   
   signedIn() {
      return Object.keys(this.props.Prss).length !== 0; // Nonempty Prss obj
   }
   modalDismiss(){
      this.props.clearErrors()
   }

   // Function component to generate a Route tag with a render method 
   // conditional on login.  Params {conditional: Cmp to render if signed in}

   render() {
      console.log(this.props)
      let showModal = this.props.Errs.message
      let modal = <ErrorModal showModal={showModal} message={this.props.Errs.message} onDismiss={this.props.clearErrors} ></ErrorModal>;
      console.log("Redrawing main");
      return (

         <div>
            <div className="container header">
                  <img src="/PolySomethingTitleBtn.png"
                      className="titleImage"
                      onClick={() => this.props.history.push("/")} />
                  {this.signedIn() ? 
                     <div className="pull-right signBtn">
                     <Button bsStyle="primary" onClick={() => this.props.signOut()}>Sign Out</Button>
                     </div>
                     :
                     <div className="pull-right signBtn">
                     <Button bsStyle="primary" onClick={() => this.props.history.push("/signin")}>
                     Sign In/Register</Button>
                     </div>}
            </div>


            {/*Alternate pages beneath navbar, based on current route*/}
            <Switch>
               <Route exact path='/'
                  render={() => <PrjOverview {...this.props} />} />
               <Route path='/PrjDetail' 
                  render={() => <PrjDetail {...this.props} />} />
               <Route path='/signin' render={() => <SignIn {...this.props} />} />
               <Route path='/register'
                render={() => <Register {...this.props} />} />
            </Switch>

           {modal}
         </div>
      )
   }
}

export default Main

import React, { Component } from 'react';
import { Register, SignIn, PrjOverview, PrjDetail, ConfDialog } from '../index'
import { Route, Redirect, Switch, Link } from 'react-router-dom';
import { Navbar, Nav, NavItem, ListGroup, ListGroupItem, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import './Main.css';
import ErrorModal from './ErrorModal'; 

var ProtectedRoute = ({component: Cmp, path, ...rest }) => {
   return (<Route path={path} render={(props) => {
      return Object.keys(rest.Prss).length !== 0 ?
      <Cmp {...rest}/> : <Redirect to='/allPrjs'/>;}}/>);
   };
   
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
            <div className="container">
            <Navbar>
                  <Navbar.Toggle />
                  {this.signedIn() ?
                     <Navbar.Text key={1}>
                        {`Logged in as: ${this.props.Prss.email}`}
                     </Navbar.Text>
                     :
                     ''
                  }
                  <Navbar.Collapse>
                     <Nav>
                        {this.signedIn() ?
                           [
                              <LinkContainer key={"all"} to="/allPrjs">
                                 <NavItem>PolySomething</NavItem>
                              </LinkContainer>
                           ]
                           :
                           [
                              <LinkContainer key={"all"} to="/allPrjs">
                                 <NavItem>PolySomething</NavItem>
                              </LinkContainer>
                           ]
                        }
                     </Nav>
                  </Navbar.Collapse>
                  {this.signedIn() ? 
                     <div className="pull-right">
                     <Button bsStyle="primary" >Sign Out</Button>
                     </div>
                     :
                     <div className="pull-right">
                     <Button bsStyle="primary" onClick={() => this.props.history.push("/signin")}>
                     Sign In/Register</Button>
                     </div>}
                  </Navbar>
            </div>


            {/*Alternate pages beneath navbar, based on current route*/}
            <Switch>
               <Route exact path='/'

                  component={() => <Redirect to="/signin" /> } /> {/*old code*/}

                 render={() => <PrjOverview {...this.props} />} />
               <Route path='/signin' render={() => <SignIn {...this.props} />} />
               <Route path='/register'
                render={() => <Register {...this.props} />} />
               <Route path='/allPrjs' component={PrjOverview}
                {...this.props}/>
               <ProtectedRoute path='/newPrj' component={PrjDetail}
                {...this.props} />
               <ProtectedRoute path='/myPrjs' component={PrjOverview}
                userOnly="true" {...this.props}/>
               <ProtectedRoute path='/PrjDetail' component={PrjDetail}
                userOnly="true" {...this.props}/>}
               <ProtectedRoute path='/newPrj' component={PrjDetail}
                userOnly="true" {...this.props} />
               />
             
            </Switch>

           {modal}
         </div>
      )
   }
}

export default Main

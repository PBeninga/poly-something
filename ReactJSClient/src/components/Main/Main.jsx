import React,  { Component } from 'react';
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
{/*<<<<<<< HEAD
            <div className="container header">
                  <img src={require("../../images/PolySomethingTitleBtn.png")}
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
                  </div>}*/}

            <div>
               <Navbar>
                  <Navbar.Brand href="/">
                     <LinkContainer key={0} to="/">
                        <img width="125" className="img-responsive" src = "/logo.png" alt="logo"/>
                     </LinkContainer>
                  </Navbar.Brand>
                  <Navbar.Toggle />
                  {this.signedIn() ?
                     <Navbar.Text key={1}>
                        {`Logged in as: ${this.props.Prss.firstName}
                         ${this.props.Prss.lastName}`}
                     </Navbar.Text>
                     :
                     ''
                  }
                  <Navbar.Collapse>
                     <Nav>
                        {this.signedIn() ?
                           [
                              <LinkContainer key={"all"} to="/allPrjs">
                                 <NavItem>All Projects</NavItem>
                              </LinkContainer>,
                              <LinkContainer key={"my"} to="/myPrjs">
                                 <NavItem>My Projects</NavItem>
                              </LinkContainer>
                           ]
                           :
                           [  
                              <LinkContainer key={0} to="/signin">
                                 <NavItem>Sign In</NavItem>
                              </LinkContainer>,
                              <LinkContainer key={1} to="/register">
                                 <NavItem>
                                    Register
                               </NavItem>
                              </LinkContainer>,
                           ]
                        }
                     </Nav>
                     {this.signedIn() ?
                        <Nav pullRight>
                           <NavItem eventKey={1}
                            onClick={() => this.props.signOut()}>
                              Sign out
                           </NavItem>
                        </Nav>
                        :
                        ''
                     }
                  </Navbar.Collapse>
               </Navbar>
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

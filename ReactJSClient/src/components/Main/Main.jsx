import React, { Component } from 'react';
import { Register, SignIn, PrjOverview, PrjDetail, ConfDialog } from '../index'
import { Route, Redirect, Switch } from 'react-router-dom';
import { Navbar, Nav, NavItem, ListGroup, ListGroupItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import './Main.css';
import ErrorModal from './ErrorModal'; 

var ProtectedRoute = ({component: Cmp, path, ...rest }) => {
   return (<Route path={path} render={(props) => {
      return Object.keys(rest.Prss).length !== 0 ?
      <Cmp {...rest}/> : <Redirect to='/signin'/>;}}/>);
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
            <div>
               <Navbar>
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
                  component={() => this.props.Prss ? <Redirect to="/allPrjs" /> : <Redirect to="/signin" />} />
               <Route path='/signin' render={() => <SignIn {...this.props} />} />
               <Route path='/register'
                render={() => <Register {...this.props} />} />
               <Route path='/allPrjs' component={PrjOverview}
                {...this.props}/>
               <ProtectedRoute path='/myPrjs' component={PrjOverview}
                userOnly="true" {...this.props}/>
                <ProtectedRoute path='/PrjDetail' component={PrjDetail}
                userOnly="true" {...this.props}/>}
               />
             
            </Switch>

           {modal}
         </div>
      )
   }
}

export default Main

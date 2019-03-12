import React, { Component } from 'react';
import {
   Modal, Button, FormControl, ControlLabel, FormGroup, HelpBlock,
Alert } from 'react-bootstrap';

export default class ErrorModal extends Component {
   constructor(props) {
      super(props);
      this.state = {
         message: (this.props.message)
      }
   }

   close = (result) => {
      this.props.onDismiss && this.props.onDismiss({
         status: result,
         title: this.state.cnvTitle
      });
   }

   render() {

      return (
         <Modal show={this.props.showModal ? true : false} onHide={() => this.close("Cancel")}>
            <Modal.Header closeButton>
               <Modal.Title>{"Error Notice"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
               <Alert bsStyle="danger">
                  {this.props.message}
               </Alert>
            </Modal.Body>
            <Modal.Footer>
               <Button onClick={() => this.close("Ok")}>Ok</Button>
               <Button onClick={() => this.close("Cancel")}>Cancel</Button>
            </Modal.Footer>
         </Modal>)
   }
}
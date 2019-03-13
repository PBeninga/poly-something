import React, { Component } from 'react';
import {
   Modal, Button, FormControl, ControlLabel, FormGroup, HelpBlock
} from 'react-bootstrap';

export default class CmtModal extends Component {
   constructor(props) {
      super(props);
      this.state = {
         prjTitle: (this.props.prj && this.props.prj.title) || "",
      }
   }

   close = (result) => {
      console.log("props: "+JSON.stringify(this.props))
      this.props.onDismiss && this.props.onDismiss({
         status: result,
         title: this.state.prjTitle,
         id: this.props.prjId
      });
   }

   getValidationState = () => {
      if (this.state.prjTitle) {
         return null;
      }
      return "warning";
   }

   handleChange = (e) => {
      this.setState({ prjTitle: e.target.value });
   }

   componentWillReceiveProps = (nextProps) => {
      if (nextProps.showModal) {
         this.setState({ prjTitle: (nextProps.prj && nextProps.prj.title) || "" })
      }
   }

   render() {
      return (
         <Modal show={this.props.showModal} onHide={() => this.close("Cancel")}>
            <Modal.Header closeButton>
               <Modal.Title>{this.props.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
               <form onSubmit={(e) =>
                  e.preventDefault() || this.state.prjTitle.length ?
                     this.close("Ok") : this.close("Cancel")}>
                  <FormGroup controlId="formBasicText"
                   validationState={this.getValidationState()}
                  >
                     <ControlLabel>Comment</ControlLabel>
                     <FormControl
                        type="text"
                        componentClass = "textarea"
                        value={this.state.prjTitle}
                        placeholder="Enter text"
                        onChange={this.handleChange}
                     />
                     <FormControl.Feedback />
                     <HelpBlock>Comment Cannot be can not be empty.</HelpBlock>
                  </FormGroup>
               </form>
            </Modal.Body>
            <Modal.Footer>
               <Button onClick={() => this.close("Ok")}>Ok</Button>
               <Button onClick={() => this.close("Cancel")}>Cancel</Button>
            </Modal.Footer>
         </Modal>)
   }
}
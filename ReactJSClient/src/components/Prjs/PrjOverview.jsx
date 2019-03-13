import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { ListGroup, ListGroupItem, Col, Row, Button, Glyphicon } from 'react-bootstrap';
import PrjModal from './PrjModal';
import { ConfDialog } from '../index';
import { delPrj} from '../../api';
import './PrjOverview.css';

export default class PrjOverview extends Component {
   constructor(props) {
      super(props);
      this.props.updatePrjs();
      this.state = {
         showModal: false,
         showConfirmation: false,
      }
      this.openModal = this.openModal.bind(this)
      this.callEditPrj = this.callEditPrj.bind(this)
   }

   // Open a model with a |prj| (optional)]
   callEditPrj = (prj) =>{
      this.setState({editPrj:true});
      this.openModal(prj);
   }
   openModal = (prj) => {
      const newState = { showModal: true };

      if (prj)
         newState.prj = prj;
      this.setState(newState);
   }

   modalDismiss = (result) => {
      console.log(result)
      if (result.status === "Ok") {
         if (this.state.editPrj)
            this.modPrj(result);
         else
            this.newPrj(result);
      }
      this.setState({ showModal: false, editPrj: null });
   }

   modPrj(result) {
      console.log(result)
      this.props.modPrj(result.id, result.title);
   }

   newPrj(result) {
      this.props.addPrj({title: result.title, ownerId:this.props.Prss.id}, (() => this.props.updatePrjs()));
   }

   openConfirmation = (prj) => {
      this.setState({delPrj: prj, showConfirmation: true })
   }

   closeConfirmation = (res) => {
      this.state.showConfirmation = false;
   }

   render() {
      var prjItems = [];

      this.props.Prjs.forEach(prj => {
         if (!this.props.userOnly || this.props.Prss.id === prj.ownerId)
            prjItems.push(<PrjItem
               key={prj.id}
               prj={prj}
               showControls={prj.ownerId === this.props.Prss.id}
               onDelete={() => this.openConfirmation(prj)}
               onEdit={() => this.callEditPrj(prj)} />);
      });

      return (
         <section className="container">
            <h1>Prj Overview</h1>
            <ListGroup>
               {prjItems}
            </ListGroup>
            <Button bsStyle="primary" onClick={this.openModal}>
               New Conversation
            </Button>
            {/* Modal for creating and change prj */}
            <PrjModal
               showModal={this.state.showModal}
               title={this.state.editPrj ? "Edit title" : "New Project"}
               prj={this.state.editPrj}
               prjId={this.state.editPrj ? this.state.prj.id : null}
               onDismiss={this.modalDismiss} />
            <ConfDialog
               show={this.state.showConfirmation}
               title="Delete confirmation"
               body={`Would you like to delete ${this.state.delPrj ? this.state.delPrj.title : "Woah how did you do that?"}`}
               buttons={['YES', 'NO']}
               onClose={answer => {
                  this.setState({showConfirmation:false});
                  if (answer === 'YES') {
                     this.props.delPrj(this.state.delPrj.id, (() => this.props.updatePrjs()));
                  }
               }}
            />
         </section>
      )
   }
}

// A Prj list item
const PrjItem = function (props) {
   console.log("HERE:"+JSON.stringify(props))
   return (
      <ListGroupItem>
         <Row>
            <Col sm={4}><Link to={"/PrjDetail/" + props.prj.id}>{props.prj.title}</Link></Col>
            <Col sm={4}>{props.prj.lastMessage ? new Intl.DateTimeFormat('us',
               {
                  year: "numeric", month: "short", day: "numeric",
                  hour: "2-digit", minute: "2-digit", second: "2-digit"
               })
               .format(props.prj.lastMessage) : "N/A"}</Col>
            {props.showControls ?
               <div className="pull-right">
                  <Button bsSize="small" onClick={props.onDelete}><Glyphicon glyph="trash" /></Button>
                  <Button bsSize="small" onClick={props.onEdit}><Glyphicon glyph="edit" /></Button>
               </div>
               : ''}
         </Row>
      </ListGroupItem>
   )
}

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { ListGroup, ListGroupItem, Col, Row, Button, Glyphicon } from 'react-bootstrap';
import CnvModal from './CnvModal';
import { ConfDialog } from '../index';
import { delCnv} from '../../api';
import './CnvOverview.css';

export default class CnvOverview extends Component {
   constructor(props) {
      super(props);
      this.props.updateCnvs();
      this.state = {
         showModal: false,
         showConfirmation: false,
      }
      this.openModal = this.openModal.bind(this)
      this.callEditCnv = this.callEditCnv.bind(this)
   }

   // Open a model with a |cnv| (optional)]
   callEditCnv = (cnv) =>{
      this.setState({editCnv:true})
      this.openModal(cnv)
   }
   openModal = (cnv) => {
      const newState = { showModal: true };

      if (cnv)
         newState.cnv = cnv;
      this.setState(newState);
   }

   modalDismiss = (result) => {
      console.log(result)
      if (result.status === "Ok") {
         if (this.state.editCnv)
            this.modCnv(result);
         else
            this.newCnv(result);
      }
      this.setState({ showModal: false, editCnv: null });
   }

   modCnv(result) {
      console.log(result)
      this.props.modCnv(result.id, result.title);
   }

   newCnv(result) {
      this.props.addCnv({title: result.title, ownerId:this.props.Prss.id}, (() => this.props.updateCnvs()));
   }

   openConfirmation = (cnv) => {
      this.setState({delCnv: cnv, showConfirmation: true })
   }

   closeConfirmation = (res) => {
      this.state.showConfirmation = false;
   }

   render() {
      var cnvItems = [];

      this.props.Cnvs.forEach(cnv => {
         if (!this.props.userOnly || this.props.Prss.id === cnv.ownerId)
            cnvItems.push(<CnvItem
               key={cnv.id}
               cnv={cnv}
               showControls={cnv.ownerId === this.props.Prss.id}
               onDelete={() => this.openConfirmation(cnv)}
               onEdit={() => this.callEditCnv(cnv)} />);
      });

      return (
         <section className="container">
            <h1>Cnv Overview</h1>
            <ListGroup>
               {cnvItems}
            </ListGroup>
            <Button bsStyle="primary" onClick={this.openModal}>
               New Conversation
            </Button>
            {/* Modal for creating and change cnv */}
            <CnvModal
               showModal={this.state.showModal}
               title={this.state.editCnv ? "Edit title" : "New Conversation"}
               cnv={this.state.editCnv}
               cnvId={this.state.editCnv ? this.state.cnv.id : null}
               onDismiss={this.modalDismiss} />
            <ConfDialog
               show={this.state.showConfirmation}
               title="Delete confirmation"
               body={`Would you like to delete ${this.state.delCnv ? this.state.delCnv.title : "Woah how did you do that?"}`}
               buttons={['YES', 'NO']}
               onClose={answer => {
                  this.setState({showConfirmation:false});
                  if (answer === 'YES') {
                     this.props.delCnv(this.state.delCnv.id, (() => this.props.updateCnvs()));
                  }
               }}
            />
         </section>
      )
   }
}

// A Cnv list item
const CnvItem = function (props) {
   console.log("HERE:"+JSON.stringify(props))
   return (
      <ListGroupItem>
         <Row>
            <Col sm={4}><Link to={"/CnvDetail/" + props.cnv.id}>{props.cnv.title}</Link></Col>
            <Col sm={4}>{props.cnv.lastMessage ? new Intl.DateTimeFormat('us',
               {
                  year: "numeric", month: "short", day: "numeric",
                  hour: "2-digit", minute: "2-digit", second: "2-digit"
               })
               .format(props.cnv.lastMessage) : "N/A"}</Col>
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

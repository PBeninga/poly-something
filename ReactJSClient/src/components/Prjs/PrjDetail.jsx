import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { ListGroup, ListGroupItem, Col, Row, Button, Glyphicon } from 'react-bootstrap';
import CmtModal from './CmtModal';
import './PrjOverview.css';

export default class PrjDetail extends Component {
   constructor(props) {
      super(props);
      this.props.updatePrjs();
      var prjId = parseInt(window.location.pathname.split("/")[2]);
      var title = "PRJ TITLE";

      console.log(this.props.Prjs);

      for(var prj in this.props.Prjs){
         console.log(this.props.Prjs[prj].id + " : " + prjId)
         if(this.props.Prjs[prj].id === prjId){
            title = this.props.Prjs[prj].title;
         }
      }
      this.props.getCmts(prjId);
      this.state = {
         title,
         prjId,
         showModal: false,
         showConfirmation: false,
      }
      this.openModal = this.openModal.bind(this)
   }
   openModal = (prj) => {
      const newState = { showModal: true };
      this.setState(newState);
   }

   modalDismiss = (result) => {
      console.log(result)
      if (result.status === "Ok") {
         this.props.newCmt(this.state.prjId, result.title);
      }
      this.setState({ showModal: false});
   }

   render() {
      var prjItems = [];
      if(this.props.Cmts.forEach){
         this.props.Cmts.forEach(cmt => {
               prjItems.push(<PrjItem
                  key={cmt.id}
                  cmt={cmt}
                  prj={this.state.prjId}
                  showControls={false}
                  onDelete={() => this.openConfirmation(cmt)}
                  onEdit={() => this.callEditPrj(cmt)} />);
         });
      }

      return (
         <section className="container">
            <h1>{this.state.title}</h1>
            <ListGroup>
               {prjItems}
            </ListGroup>
            <Button bsStyle="primary" onClick={this.openModal}>
               New Comment
            </Button>
            {/* Modal for creating and change prj */}
            <CmtModal
               showModal={this.state.showModal}
               title={"New Message"}
               prjId={this.state.prjId}
               onDismiss={this.modalDismiss} />
         </section>
      )
   }
}

// A Prj list item
const PrjItem = function (props) {
   return (
      <ListGroupItem>
         <Row>
            <Col sm={4}>{props.cmt.email}</Col>
            <Col sm={4}>{props.cmt.whenMade ? new Intl.DateTimeFormat('us',
               {
                  year: "numeric", month: "short", day: "numeric",
                  hour: "2-digit", minute: "2-digit", second: "2-digit"
               })
               .format(props.cmt.whenMade) : "N/A"}</Col>
         </Row>
         <Row><Col sm={4}>{props.cmt.content}</Col></Row>
      </ListGroupItem>
   )
}

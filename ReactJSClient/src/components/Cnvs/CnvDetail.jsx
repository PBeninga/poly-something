import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { ListGroup, ListGroupItem, Col, Row, Button, Glyphicon } from 'react-bootstrap';
import MsgModal from './MsgModal';
import './CnvOverview.css';
export default class CnvDetail extends Component {
   constructor(props) {
      super(props);
      this.props.updateCnvs();
      var cnvId = parseInt(window.location.pathname.split("/")[2])
      var title = "CNV TITLE"
      console.log(this.props.Cnvs)
      for(var cnv in this.props.Cnvs){
         console.log(this.props.Cnvs[cnv].id + " : " + cnvId)
         if(this.props.Cnvs[cnv].id === cnvId){
            title = this.props.Cnvs[cnv].title
         }
      }
      this.props.getMsgs(cnvId)
      this.state = {
         title:title,
         cnvId:cnvId,
         showModal: false,
         showConfirmation: false,
      }
      this.openModal = this.openModal.bind(this)
   }
   openModal = (cnv) => {
      const newState = { showModal: true };
      this.setState(newState);
   }

   modalDismiss = (result) => {
      console.log(result)
      if (result.status === "Ok") {
         this.props.newMsg(this.state.cnvId, result.title);
      }
      this.setState({ showModal: false});
   }

   render() {
      var cnvItems = [];
      if(this.props.Msgs.forEach){
         this.props.Msgs.forEach(msg => {
               cnvItems.push(<CnvItem
                  key={msg.id}
                  msg={msg}
                  cnv={this.state.cnvId}
                  showControls={false}
                  onDelete={() => this.openConfirmation(msg)}
                  onEdit={() => this.callEditCnv(msg)} />);
         });
    }

      return (
         <section className="container">
            <h1>{this.state.title}</h1>
            <ListGroup>
               {cnvItems}
            </ListGroup>
            <Button bsStyle="primary" onClick={this.openModal}>
               New Message
            </Button>
            {/* Modal for creating and change cnv */}
            <MsgModal
               showModal={this.state.showModal}
               title={"New Message"}
               cnvId={this.state.cnvId}
               onDismiss={this.modalDismiss} />
         </section>
      )
   }
}

// A Cnv list item
const CnvItem = function (props) {
   return (
      <ListGroupItem>
         <Row>
            <Col sm={4}>{props.msg.email}</Col>
            <Col sm={4}>{props.msg.whenMade ? new Intl.DateTimeFormat('us',
               {
                  year: "numeric", month: "short", day: "numeric",
                  hour: "2-digit", minute: "2-digit", second: "2-digit"
               })
               .format(props.msg.whenMade) : "N/A"}</Col>
         </Row>
         <Row><Col sm={4}>{props.msg.content}</Col></Row>
      </ListGroupItem>
   )
}

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { ListGroup, ListGroupItem, Col, Row, Button, Form,
   Alert, ButtonGroup, Glyphicon } from 'react-bootstrap';
import * as Flexbox from 'react-flexbox-grid'
import CmtModal from './CmtModal';
import './PrjOverview.css';
import './PrjDetail.css';

export default class PrjDetail extends Component {
   constructor(props) {
      super(props);
      var prjId = parseInt(window.location.pathname.split("/")[2]);

      this.state = {
         showModal: false,
         showConfirmation: false
      }

      this.props.getPrj(prjId);
      this.props.getCmts(prjId);

      this.openModal = this.openModal.bind(this)
   }

   openModal = (prj) => {
      const newState = { showModal: true };
      this.setState(newState);
   }

   modalDismiss = (result, prj) => {
      console.log(result)
      if (result.status === "Ok") {
         this.props.newCmt(prj.id, result.title);
      }
      this.setState({ showModal: false});
   }

   like = (prj) => {

   }

   render() {
      if (this.props.Prjs.length > 1)
         return null;
      
      var prj = this.props.Prjs[0];

      var prjItems = [];
      if(this.props.Cmts.forEach){
         this.props.Cmts.forEach(cmt => {
               prjItems.push(<PrjItem
                  key={cmt.id}
                  cmt={cmt}
                  prj={prj}
                  showControls={false}
                  onDelete={() => this.openConfirmation(cmt)}
                  onEdit={() => this.callEditPrj(cmt)} />);
         });
      }

      return (
         <section className="container">
            <Flexbox.Grid fluid>
               <Flexbox.Row>
                  <Flexbox.Col>
                     <img src={ require('../../images/Project.png') } className="project-image"/>
                  </Flexbox.Col>
                  <Flexbox.Col xs={6}>
                     <Flexbox.Row>
                        <h1>{prj.title}</h1>
                     </Flexbox.Row>
                     <Flexbox.Row>
                        <span className="project-detail">Category:</span>
                        {prj.category}
                     </Flexbox.Row>
                     <Flexbox.Row>
                        <span className="project-detail">Date posted:</span>
                        {new Intl.DateTimeFormat('us',
                        {
                           year: "numeric", month: "short", day: "numeric",
                           hour: "2-digit", minute: "2-digit", second: "2-digit"
                        })
                        .format(prj.timePosted)}
                     </Flexbox.Row>
                     {prj.contributors ?
                     <Flexbox.Row>
                        <span className="project-detail">By:</span>
                        {prj.contributors}
                     </Flexbox.Row> : '' }
                  </Flexbox.Col>
               </Flexbox.Row>
            </Flexbox.Grid>
            <hr/>
            <h3>Description</h3>
            <p>
               {prj.content}
            </p>
            <hr/>
            <ButtonGroup className="button-group">
               <Button bsStyle="primary" className="button">
                  {`Like (${prj.numLikes})`}
               </Button>
               <Button bsStyle="primary" className="button" onClick={this.openModal}>
                  Leave a Comment
               </Button>
            </ButtonGroup>
            <ListGroup>
               {prjItems}
            </ListGroup>
            {/* Modal for creating and change prj */}
            <CmtModal
               showModal={this.state.showModal}
               title={"New Message"}
               prjId={prj.id}
               onDismiss={(result) => this.modalDismiss(result, prj)} />
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

import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { ListGroup, ListGroupItem, Col, Row, Button, Form,
   Alert, ButtonGroup, FormControl, Glyphicon } from 'react-bootstrap';
import Select from 'react-select';
import * as Flexbox from 'react-flexbox-grid'
import CmtModal from './CmtModal';
import './PrjOverview.css';
import './PrjDetail.css';
import { clearErrors } from '../../actions/actionCreators';

var maxTitleLength = 15;

export default class PrjDetail extends Component {
   constructor(props) {
      super(props);

      var path = window.location.pathname.split("/");
      var projectExists = path.length === 3;

      if (projectExists) {
         var prjId = parseInt(window.location.pathname.split("/")[2]);
         this.props.getPrj(prjId, (id) => {
            var shouldErr = true;
            this.props.Prjs.forEach((prj) => {
               if(prj.id === id){
                  shouldErr = false;
               }
            })
            if(shouldErr)
               throw new Error();
         });
         this.props.getCmts(prjId);
         this.props.getLik(prjId);
      } else {
         this.props.clearPrjs();
      }

      this.state = {
         showModal: false,
         showConfirmation: false,
         editing: !projectExists,
         thumbnailError: false,
         defaultThumbnail: '/Project.png'
      }

      this.openModal = this.openModal.bind(this);
      this.toggleEdit = this.toggleEdit.bind(this);
   }

   openModal = (prj) => {
      const newState = { showModal: true };
      this.setState(newState);
   }

   signedIn() {
      return Object.keys(this.props.Prss).length !== 0; // Nonempty Prss obj
   }

   modalDismiss = (result, prj) => {
      console.log(result)
      if (result.status === "Ok") {
         this.props.newCmt(prj.id, result.title);
      }
      this.setState({ showModal: false});
   }

   toggleLike = (prj) => {
      if (this.props.Liks.length === 0) {
         this.props.addLik(prj.id);
      } else {
         this.props.removeLik(prj.id);
      }
   }

   toggleEdit = (prj) => {
      if (this.state.editing) {
         let {
            title,
            contributors,
            category,
            content,
            thumbnail
         } = this.state;

         const body = {
            title,
            contributors,
            category,
            content,
            thumbnail: thumbnail || '/Project.png'
         };

         if (prj.id) {
            this.props.modPrj(prj.id, body, () =>
             this.setState({thumbnailError: false}));
         } else {
            this.props.addPrj(body, () => {
               var prjId = this.props.Prjs[0].id;
               this.props.history.push(`/PrjDetail/${prjId}`);
               this.props.getCmts(prjId);
               this.props.getLik(prjId);
            });
         }

         this.setState({editing: false});
      } else {
         this.setState({...prj, editing: true});
      }
   }

   createEditField = (fieldName, displayContent, editType) => {
      return (
       <EditField
         editing={this.state.editing}
         editValue={this.state[fieldName]}
         displayContent={displayContent}
         editType={editType}
         handleChange={value => {
            var newState = {};

            if (fieldName === "title" && value.length > maxTitleLength)
               value = value.substring(0, maxTitleLength);
            newState[fieldName] = value;
            this.setState(newState);
       }}/>);
   }

   render() {
      if (this.props.Prjs.length > 1 && !this.state.editing)
         return null;
      
      var prj = this.props.Prjs[0] || {
         // Create default values if we're making a new project
         title: "",
         category: "",
         contributors: "",
         content: "",
         thumbnail: ""
      };

      var prjItems = [];
      if(this.props.Cmts.forEach){
         this.props.Cmts.forEach(cmt => {
            prjItems.push(
             <PrjItem
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
                     <img src={this.state.thumbnailError ?
                      this.state.defaultThumbnail :
                      prj.thumbnail || this.state.defaultThumbnail}
                      className="project-image"
                      onError={() => this.setState({thumbnailError: true})} />
                     {this.state.editing ?
                     <div>
                        <span className="project-detail">Thumbnail URL:</span>
                     </div>
                     : ''}
                     {this.createEditField("thumbnail", '')}
                  </Flexbox.Col>
                  <Flexbox.Col xs={6} >
                     <Flexbox.Row>
                        {this.state.editing ?
                        <span className="project-detail">Title:</span>
                        : ''}
                        {this.createEditField("title", <h1>{prj.title}</h1>)}
                     </Flexbox.Row>
                     {prj.contributors || this.state.editing ?
                     <Flexbox.Row>
                        <span className="project-detail">By:</span>
                        {this.createEditField("contributors", prj.contributors)}
                     </Flexbox.Row> : '' }
                     <Flexbox.Row>
                        <span className="project-detail">Category:</span>
                        {this.createEditField("category", prj.category,
                         "category")}
                     </Flexbox.Row>
                     {this.state.editing ? '' :
                     <Flexbox.Row>
                        <span className="project-detail">Date posted:</span>
                        {new Intl.DateTimeFormat('us',
                        {
                           year: "numeric", month: "short", day: "numeric",
                           hour: "2-digit", minute: "2-digit", second: "2-digit"
                        })
                        .format(prj.timePosted)}
                     </Flexbox.Row>}
                  </Flexbox.Col>
                  {this.props.Prss.id === prj.ownerId ||
                   prj.ownerId === undefined ?
                  <Flexbox.Col xs className="edit-button">
                     <Button bsStyle="primary" onClick={() =>
                      this.toggleEdit(prj)}
                             disabled={this.state.editing &&
                              !(this.state.title &&
                              this.state.category && this.state.contributors &&
                              this.state.content)}>
                        {this.state.editing ? "Save" : "Edit"}
                     </Button>
                  </Flexbox.Col>
                  : '' }
               </Flexbox.Row>
            </Flexbox.Grid>
            <hr/>
            <h3>Description</h3>
            {this.createEditField("content", <div className="content">
               {prj.content}
            </div>, "multiline")}
            {this.state.editing ? '' :
            <div>
               <hr/>
               <ButtonGroup className="button-group">
                  <Button bsStyle="primary" onClick={this.signedIn() ? () =>
                   this.toggleLike(prj) : () => this.props.history.push("/signin")}>
                     {`${this.props.Liks.length && this.signedIn() ? "Unlike" :
                      "Like"} (${prj.numLikes})`}
                  </Button>
                  <Button bsStyle="primary" onClick={this.signedIn() ? this.openModal :
                  () => {this.props.history.push("/signin")}}>
                     Leave a Comment
                  </Button>
               </ButtonGroup>
               <ListGroup>
                  {prjItems}
               </ListGroup>
               <CmtModal
                  showModal={this.state.showModal}
                  title={"New Comment"}
                  prjId={prj.id}
                  onDismiss={(result) => {
                     this.modalDismiss(result, prj);
                  }} />
            </div>}
         </section>
      )
   }
}

// A Prj list item
const PrjItem = function (props) {
   return (
      <ListGroupItem>
         <Row>
            <Col sm={4}>{props.cmt.handle}</Col>
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

const EditField = function(props) {
   var editView;

   if (props.editing) {
      switch (props.editType) {
         case "multiline":
            editView = <FormControl
               componentClass="textarea"
               value={props.editValue}
               onChange={e => props.handleChange(e.target.value)}
            />
            break;
         case "category":
            let categories = ["Art", "Community", "Miscellaneous",
             "Music", "Programming", "Writing"]

            let options = categories.map(c => {
               return {value: c, label: c };
            });

            let selected = options.filter(x =>
             x.value === props.editValue)[0];

            editView =
            <div style={{float: "left", width: "200px"}}>
               <Select options={options}
                       value={selected}
                       onChange={item => props.handleChange(item.value)}/>
            </div>
            break;
         default:
            editView = <FormControl
               type="text"
               value={props.editValue}
               onChange={e => props.handleChange(e.target.value)}
            />
            break;
      }
   }

   return (
      <div>{ props.editing ? editView : props.displayContent }</div>
   );
}

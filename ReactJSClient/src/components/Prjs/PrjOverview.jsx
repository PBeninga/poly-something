import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { ListGroup, ListGroupItem, Col, Row, Button, Glyphicon, ButtonToolbar } from 'react-bootstrap';
import PrjModal from './PrjModal';
import { ConfDialog } from '../index';
import { delPrj} from '../../api';
import './PrjOverview.css';

export default class PrjOverview extends Component {
   constructor(props) {
      super(props);
      console.log(this.props)
      this.state = {
         showModal: false,
         showConfirmation: false,
         tags : ["Art", "Community", "Miscellaneous", "Music", "Programming", "Writing"],
         page: 0,
         selectedTags: []
      }
      props.updatePrjs(this.state.page, this.state.selectedTags);
      this.openModal = this.openModal.bind(this)
      this.callEditPrj = this.callEditPrj.bind(this)
      this.handleFilter = this.handleFilter.bind(this)
      this.pageChange = this.pageChange.bind(this)
   }
   componentDidUpdate = (prevProps, prevState, snapshot) => {
      console.log()
      if(prevState.selectedTags !== this.state.selectedTags){
         this.props.updatePrjs(this.state.page, this.state.selectedTags);
      }
   }
   pageChange = (delta) =>{
      var newState = {}
      newState.page = this.state.page += delta
      this.setState(newState)
      this.props.updatePrjs(this.state.page, this.state.selectedTags);
   } 
   // Open a model with a |prj| (optional)]
   callEditPrj = (prj) =>{
      this.setState({editPrj:true});
      this.openModal(prj);
   }
   handleFilter = (e) =>{
      var newState = {}
      var target = e.target
      console.log(e.target)
      console.log(this.setState)
      if(target.checked){
         newState.selectedTags = this.state.selectedTags.concat([target.name])
      }else{
         var i = this.state.selectedTags.indexOf(target.name);
         console.log(i)
         var newArr = this.state.selectedTags.slice();
         var index = newArr.indexOf(target.name);
         if (index !== -1) newArr.splice(index, 1);
         newState.selectedTags = newArr
      }
      this.setState(newState)
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
      //this.state.showConfirmation = false;
   }

   render() {
      var prjItems = [];
      console.log(this.state)

      this.props.Prjs.forEach(prj => {
         prjItems.push(<PrjItem
            key={prj.id}
            prj={prj}
            showControls={prj.ownerId === this.props.Prss.id}
            onDelete={() => this.openConfirmation(prj)}
            onEdit={() => this.callEditPrj(prj)} />);
      });

      return (
         <section>
            <h1>Prj Overview</h1>
            <div className="grid-container">
               <div className="side-menu"><PrjMenu handleFilter={(e) => this.handleFilter(e)}
                                                   checked={this.state.selectedTags} 
                                                   tags={this.state.tags}/></div>
               <div className="grid-content inner-grid-container">
                  {prjItems}
               </div> 
               <div className="grid-footer">
                     <Button variant="primary" className={this.state.page === 0 ? "hide" : ""} onClick={() => this.pageChange(-1)}>Previous Page</Button>
                     <Button onClick={() => this.pageChange(1)} className={this.props.Prjs.length < 16 ? "hide" : ""} variant="primary">Next Page</Button>
               </div>
             </div>
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
const PrjMenu = function (props) {
   console.log("HERE:"+JSON.stringify(props))
   var tags = [];
   for(var i = 0; i < props.tags.length; i++){
      tags.push(<div className="text-attrs" key={i}><Row><input

      name= {props.tags[i]}
      checked={props.checked.includes(props.tags[i])}
      onChange={props.handleFilter}
      type="checkbox" /> {props.tags[i]}</Row></div>)
   }
   return (<div>
               <div className="catHeader">Filter by category</div>
               <div>{tags}</div>
               <Link to={"/PrjDetail"}>
               <Button bsStyle="primary" className="toDetailBtn" bsSize="small">
                  Upload a New Project
               </Button>
               </Link>
            </div>)
}
// A Prj list item
const PrjItem = function (props) {
   return (<div className="grid-item">
            <img className="img-responsive center" 
               src={props.prj.thumbnail}
               alt="logo"
               width="100"/>
            <Link to={"/PrjDetail/" + props.prj.id}>{props.prj.title}</Link> 
           </div>)
      // <ListGroupItem>
      //    <Row>
      //       <Col sm={4}><Link to={"/PrjDetail/" + props.prj.id}>{props.prj.title}</Link></Col>
      //       <Col sm={4}>{props.prj.lastMessage ? new Intl.DateTimeFormat('us',
      //          {
      //             year: "numeric", month: "short", day: "numeric",
      //             hour: "2-digit", minute: "2-digit", second: "2-digit"
      //          })
      //          .format(props.prj.lastMessage) : "N/A"}</Col>
      //       {props.showControls ?
      //          <div className="pull-right">
      //             <Button bsSize="small" onClick={props.onDelete}><Glyphicon glyph="trash" /></Button>
      //             <Button bsSize="small" onClick={props.onEdit}><Glyphicon glyph="edit" /></Button>
      //          </div>
      //          : ''}
      //    </Row>
      // </ListGroupItem>
}

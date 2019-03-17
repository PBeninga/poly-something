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
      console.log(this.props)
      this.state = {
         showModal: false,
         showConfirmation: false,
         tags : ["music", "art", "programming", "charity"],
         page: 0,
         selectedTags: []
      }
      props.updatePrjs(this.state.page, this.state.selectedTags);
      this.openModal = this.openModal.bind(this)
      this.callEditPrj = this.callEditPrj.bind(this)
      this.handleFilter = this.handleFilter.bind(this)
   }
   componentDidUpdate = (prevProps, prevState, snapshot) => {
      if(prevState.selectedTags !== this.state.selectedTags || 
         this.state.page !== prevState.page){
         console.log("LOADING!!!!!!!!!!!!!!!!!")
         this.props.updatePrjs(this.state.page, this.state.selectedTags);
      }
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
               <div className="grid-footer">Footer</div>
             </div>
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
   return (<div>{tags}</div>)
}
// A Prj list item
const PrjItem = function (props) {
   console.log("HERE:"+JSON.stringify(props))
   return (<div className="grid-item">
            <img className="img-responsive center" 
               src="https://www.popsci.com/g00/3_c-7x78x78x78.qpqtdj.dpn_/c-7NPSFQIFVT25x24iuuqtx3ax2fx2fx78x78x78.qpqtdj.dpnx2ftjuftx2fqpqtdj.dpnx2fgjmftx2ftuzmftx2f436_2y_x2fqvcmjdx2fit-3127-24-b-mbshf_x78fc.kqhx3fjuplx3dw65dCAP2x26gdx3d61x2c61x26j21d.nbslx3djnbhf_$/$/$/$/$/$/$/$"
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

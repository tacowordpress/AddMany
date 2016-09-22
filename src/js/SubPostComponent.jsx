import React from 'react';
import FieldsSubPostComponent from './FieldsSubPostComponent.jsx';

export default class SubPostComponent extends React.Component {

  componentDidMount(){
    jQuery('tr.' + this.props.parentComponent.props.fieldName)
      .find('.addmany-actual-values')
      .sortable(this.getSortableConfig());
  }

  render() {
    const { store } = this.context;
    let order = this.props.parentComponent.getOrder(this.props.postId);
    let postReferenceId = null;

    if(this.props.postReferenceInfo != null) {
      if(typeof this.props.postReferenceInfo.postId != 'undefined')  {
        postReferenceId = this.props.postReferenceInfo.postId;
      }
    }

    return (
      <li
        className="subpost-component addmany-result postbox"
        order={order}
        data-subpost-id={this.props.postId}
        data-post-reference-id={postReferenceId}
        key={this.props.postId} >

        <table>
          <FieldsSubPostComponent
            postReferenceInfo={this.props.postReferenceInfo}
            fields={this.props.fieldsConfig}
            subpostId={this.props.postId}
            isAddBySearch={this.props.isAddBySearch}
            order={order} />
        </table>

        <button
          className="btn-addmany-delete button"
          onClick={this.removeRow.bind(this)}
          ><span className="dashicons dashicons-no"></span>
        </button>

        <button
          onClick={this.moveItemOrderUp.bind(this)}
          className="addmany-btn-order-up">
          <span className="dashicons dashicons-arrow-up-alt"></span>
        </button>

        <button
          onClick={this.moveItemOrderDown.bind(this)}
          className="addmany-btn-order-down">
          <span className="dashicons dashicons-arrow-down-alt"></span>
        </button>
      </li>
    );
  }


  moveItemOrderUp(e) {
    e.preventDefault();
    const { store } = this.context;
    const state = store.getState();
    let subposts = state.subposts.slice(0);
    let reOrdered = [];
    let parentComponent = this.props.parentComponent;
    let order = parentComponent.getOrder(this.props.postId);
    if(order === 0) {
      return;
    }
    // offset order of all subposts
    subposts.forEach((s) => {
      let sOrder = parentComponent.getOrder(s.postId);
      if(sOrder === order) {
        reOrdered.push(
          Object.assign({}, s, { order: sOrder - 1 })
        );
      } else {
        reOrdered.push(
          Object.assign({}, s, { order: sOrder + 1 })
        );
      }
    });

    reOrdered.sort((a, b) =>{
      return a.order > b.order
    });

    store.dispatch({
      type: 'UPDATE_ORDERING',
      subposts: reOrdered
    });
  }


  moveItemOrderDown(e) {
    e.preventDefault();
    const { store } = this.context;
    const state = store.getState();
    let subposts = state.subposts.slice(0);
    let reOrdered = [];
    let parentComponent = this.props.parentComponent;
    let order = parentComponent.getOrder(this.props.postId);
    if(order === subposts.length -1) {
      return;
    }
    // offset order of all subposts
    subposts.forEach((s) => {
      let sOrder = parentComponent.getOrder(s.postId);
      if(sOrder === order) {
        reOrdered.push(
          Object.assign({}, s, { order: sOrder + 1 })
        );
      } else {
        reOrdered.push(
          Object.assign({}, s, { order: sOrder - 1 })
        );
      }
    });

    reOrdered.sort((a, b) =>{
      return a.order > b.order
    });

    store.dispatch({
      type: 'UPDATE_ORDERING',
      subposts: reOrdered
    });
  }

  removeRow(e) {
    e.preventDefault();
    let self = this;
    const { store } = this.context;
    const state = store.getState();
    let subposts = state.subposts;
    let new_subposts_array = [];

    subposts.forEach(function(o){
      if(self.props.postId === o.postId) {
        return;
      }
      new_subposts_array.push(o);
    });
    // remove subpost
    store.dispatch({
      type: 'REMOVE_SUBPOST',
      subposts: new_subposts_array
    });
    // update order
    this.props.parentComponent.forceUpdateOrder();
    this.updateDeletedValues(self.props.postId);
  }

  updateDeletedValues(id) {
    const { store } = this.context;
    const state = store.getState();
    let removedSubpostIds = state.removedSubpostIds.slice(0);
    removedSubpostIds.push(id)
    store.dispatch({
      type: 'UPDATE_REMOVED',
      subpostIds: removedSubpostIds
    })
  }

  getSortableConfig(){
    let self = this;
    let $ = jQuery;
    const { store } = this.context;
    const { subposts } = store.getState();
    let fieldName = self.props.parentComponent.props.fieldName;
    let $domActualValues = $('tr.' + fieldName + ' .addmany-actual-values');

    return {
      revert: 100,
      start: function(e, ui) {

        $domActualValues.find('li').each(function(i) {
          $(this).find('.wysiwyg').each(function () {
            $(this).hide();
            tinyMCE.execCommand('mceRemoveEditor', false, $(this).attr('id'));
          });
        });
      },
      stop: function(e, ui) {
        let newArrayOfSubposts = [];
        $domActualValues.find('li').each(function(i) {
          let $this = $(this);
          subposts.forEach(function(s) {
            if(s.postId === $this.data('subpostId')) {
              newArrayOfSubposts.push(Object.assign({}, s, { order: i }));
            }
          });
          $(this).find('.wysiwyg').each(function () {
            $(this).show();
            tinyMCE.execCommand('mceAddEditor', true, $(this).attr('id'));
          });
        });
        store.dispatch({
          type: 'UPDATE_ORDERING',
          subposts: newArrayOfSubposts
        });
      }
    };
  }
}

SubPostComponent.contextTypes = { store: React.PropTypes.object };
SubPostComponent.defaultProps = { order: null };

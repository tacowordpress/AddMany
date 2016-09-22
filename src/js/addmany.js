import React from 'react';
import ReactDOM from 'react-dom';
import AddManyComponent from './AddMany.jsx';
import { createStore } from 'redux';
import expect from 'expect';
import { Provider } from 'react-redux'
import { connect } from 'react-redux'

const reducer = (state = {}, action) => {
  switch(action.type) {
    case 'INIT':
      return Object.assign({}, state, {
        fieldName: action.fieldName,
        subposts: [],
        currentVariation: action.currentVariation,
        removedSubpostIds: [],
        searchResultPosts: [],
        searchButtonText: 'Show all',
      });
    case 'UPDATE_VARIATION':
      return Object.assign({}, state, {
        currentVariation: action.variation,
      });
    case 'ADD_SUBPOST':
      return Object.assign({}, state, {
        subposts: action.subposts
      });
    case 'REMOVE_SUBPOST':
      return Object.assign({}, state, {
        subposts: action.subposts,
      });
    case 'UPDATE_ORDERING':
      return Object.assign({}, state, {
        subposts: action.subposts,
      });
    case 'UPDATE_REMOVED':
      return Object.assign({}, state, {
        removedSubpostIds: action.subpostIds,
      });
    case 'UPDATE_SEARCH_RESULTS':
      return Object.assign({}, state, {
        searchResultPosts: action.searchResultPosts,
        loadingClass: action.loadingClass,
        resultsMessage: action.resultsMessage
      });
    case 'SET_KEYWORDS':
      return Object.assign({}, state, {
        keywords: action.keywords,
        searchButtonText: action.searchButtonText
      });
    case 'SET_SEARCH_BUTTON_TEXT':
      return Object.assign({}, state, {
        searchButtonText: action.searchButtonText,
      });
    case 'SET_LOADING_STATE':
      return Object.assign({}, state, {
        loadingClass: action.loadingClass,
        resultsMessage: action.resultsMessage
      });
    default:
      return state;
  }
}

const AddManyComponentWithStore = connect(state => state)(AddManyComponent);

(function($){
  let $elements = $('.addmany');
  if(!$elements.length) return;
  $elements.each(function(){
    let fieldDefinitions = window.field_definitions[$(this).attr('name')];

    ReactDOM.render(
      <Provider store={createStore(reducer)}>
        <AddManyComponentWithStore
          dbValue={$(this).val()}
          submitURL={AJAXSubmit.ajaxurl}
          parentPostId={$('#post_ID').val()}
          domElement={$(this).parent()}
          fieldDefinitions={window.field_definitions}
          currentVariation='default_variation'
          fieldName={$(this).attr('name')}
          isAddBySearch={typeof fieldDefinitions.is_addbysearch !== 'undefined'}
          classMethod={(typeof fieldDefinitions.class_method !== 'undefined' ) ? fieldDefinitions.class_method : null}
          />
      </Provider>,
      $(this).parent()[0]
    );
  });
})(jQuery);

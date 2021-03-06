<?php

class SubPost extends \Taco\Post {
  final public function getFields() {
    return array(
      'field_assigned_to' => array('text'),
      'fields_variation' => array('type' => 'text'),
      'order' => array('type' => 'hidden'),
      'post_reference_id' => array('type' => 'hidden')
    );
  }
  public function getPostTypeConfig() {
    return [
      'public' => false,
      'show_in_menu' => false,
      'publicly_queryable' => false,
      'show_in_admin_bar' => false
    ];
  }
  public function getHierarchical() {
    return false;
  }
}

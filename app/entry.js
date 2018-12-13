'use strict';
import $ from 'jquery';
var global = Function('return this;')();
global.jQuery = $;

var btnAccountEdit = $('.btn-status-add');
btnAccountEdit.on('click', ()=>{
  const statusName = $('input[name="user_status_name"]').val();
  $.ajax({
    method:'PUT',
    url: '/user/status',
    data: {statusName: statusName}
  }).done(()=>{
    $('input[name="user_status_name"]').val('');
  });
});

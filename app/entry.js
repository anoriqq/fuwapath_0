'use strict';
import $ from 'jquery';
var global = Function('return this;')();
global.jQuery = $;
import Tabulator from 'tabulator-tables';

$('#status-add-button').click(()=>{
  const statusCode = $('#status-code-form').val();
  const statusSub = $('#status-sub-form').val();
  $.post('/event',
    {statusCode: statusCode, statusSub: statusSub},
    (data)=>{
      console.log(data);
    });
});

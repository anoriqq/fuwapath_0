'use strict';
import $ from 'jquery';

$('#status-add-button').click(()=>{
  const statusCodeForm = $('#status-code-form');
  const statusSubForm = $('#status-sub-form');
  const statusCode = statusCodeForm.val();
  const statusSub = statusSubForm.val();
  $.post('/event',
    {statusCode: statusCode, statusSub: statusSub},
    (data)=>{
      console.log(data);
      statusCodeForm.selectedIndex = 0;
      statusSubForm.selectedIndex = 0;
    });
});

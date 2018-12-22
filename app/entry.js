'use strict';
import $ from 'jquery';
var global = Function('return this;')();
global.jQuery = $;

$('.btn-status-add').on('click', ()=>{
  const statusName = $('input[name="user_status_name"]').val();
  $.ajax({
    method:'PUT',
    url: '/user/common-status',
    data: {statusName: statusName}
  }).done(()=>{
    $('input[name="user_status_name"]').val('');
    updateAjaxList();
  });
});

function updateAjaxList(){
  $.ajax({
    method: 'GET',
    url: '/user/common-status'
  }).then(data=>{
    $('.ajax-list').empty();
    for(let i=0;i<data.length;i++){
      $('.ajax-list').append(`<li><p>${data[i].status_name}<button type="button" class="btn-delete-status" data-status-code="${data[i].status_code}">削除</button></p></li>`);
    }
    $('.btn-delete-status').each((i, e)=>{
      const btn = $(e);
      btn.click(()=>{
        const statusCode = btn.data('status-code');
        $.ajax({
          method: 'POST',
          url: '/user/common-status/delete',
          data: {
            statusCode: statusCode
          }
        }).then(()=>{
          updateAjaxList();
        });
      });
    });
  });
}

var ajaxList = $('.ajax-list');
if(ajaxList.length){
  updateAjaxList();
}

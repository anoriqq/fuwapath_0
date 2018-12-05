'use strict';
import $ from 'jquery';
var global = Function('return this;')();
global.jQuery = $;
import Tabulator from 'tabulator-tables';
import moment from 'moment-timezone';
moment().tz('Asia/Tokyo');

$('#status-add-button').click(() => {
  const statusCode = $('#status-code-form').val();
  const statusSub = $('#status-sub-form').val();
  $.post('/event', { statusCode: statusCode, statusSub: statusSub }, data => {
    table.setData();
  });
});

var table_columns = [
  {
    title: 'タイムスタンプ',
    field: 'timestamp',
    sorter: 'datetime',
    sorterParams: { format: 'YYYY-MM-DD hh:mm:ss' },
    formatter: 'datetime',
    formatterParams: {
      outputFormat: 'llll:ss',
      invalidPlaceholder: '(invalid date)'
    }
  },
  { title: 'ステータス', field: 'status.status_name', align: 'center' }
];

var table = new Tabulator('#log-table', {
  columns: table_columns,
  ajaxURL: 'http://localhost:8000/event/get',
  layout: 'fitColumns',
  placeholder: 'ログがありません'
});

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Created by gperry2 on 03/14/2017.
 */

var cc_retrieve_view = function () {
  function cc_retrieve_view(args) {
    _classCallCheck(this, cc_retrieve_view);

    // url of rest api data source
    this.url = args.url;
    //dom object to inject table
    this.target = args.target;
    //json object with key value pairs:  [ {'field':'updated','label':'Submission Date'}]
    //display a footer row as well?
    this.addFooter = args.addFooter;
    this.addFilter = args.addFilter;
    this.addScroll = args.addScroll;
    this.columnDefs = args.columnDefs;
    this.dateFormat = args.dateFormat;
    this.sortOrder = args.sortOrder;
    this.defaultSortOrder = args.defaultSortOrder;
    this.dom_table;
    this.dt;
  }
  //function to generate a unique id for the table


  _createClass(cc_retrieve_view, [{
    key: 'uniqueId',
    value: function uniqueId(length) {
      var id = Math.floor(Math.random() * 26) + Date.now();
      return id.toString().substring(length);
    }
    //function to return the column titles

  }, {
    key: 'getColumns',
    value: function getColumns() {
      var listHTML = "";
      $.each(this.columnDefs, function (i, item) {
        listHTML += '<th></th>';
      });
      return listHTML;
    }
  }, {
    key: 'getColumnSortOrder',
    value: function getColumnSortOrder() {
      var arrSortOrder = [];
      $.each(this.columnDefs, function (i, item) {
        //console.log(cc_retrieve_view.defaultSortOrder)
        if (item.data != null) {
          arrSortOrder.push(new Array(i, item.sortOrder ? item.sortOrder : this.defaultSortOrder));
        }
      });
      return arrSortOrder;
    }
  }, {
    key: 'getTable',
    value: function getTable() {
      return this.dom_table;
    }
    // Main method to generate table

  }, {
    key: 'render',
    value: function render() {
      var _this = this;
      var unid = this.uniqueId(4);
      var cols = this.getColumns();
      var listHTML = '<table style="width:100%;" id="' + unid + '" >';
      listHTML += '<thead><tr>' + cols + '</tr></thead>';
      listHTML += '<tbody></tbody>';
      listHTML += this.addFooter ? '<tfoot><tr>' + cols + '</tr></tfoot>' : '';
      listHTML += '</table>';
      var dateFormat = this.dateFormat;
      this.target.empty().html(listHTML);
      this.dt = $("#" + unid).DataTable({
      //  'search': { 'caseInsensitive': true },
      //  'scrollX': _this.addScroll, // USED FOR HPRIZONTAL SCROLL BAR
        'bAutoWidth': _this.addScroll,
        order: this.getColumnSortOrder(),
      //  dom: "<'row'<'col-sm-3'i><'col-sm-3'l><'col-sm-6'p>>" + "<'row'<'col-sm-12'tr>>" + "<'row'<'hidden'B><'col-sm-7'f>>",
        dom: "<'row'<'col-sm-3'i><'col-sm-3'l><'col-sm-6'p>>" + "<'row'<'table-responsive'<'col-sm-12'tr>>>" + "<'row'<'hidden'B><'col-sm-7'f>>",
        buttons: ['pdfHtml5', 'csvHtml5', 'copyHtml5', 'excelHtml5'],
        'deferRender': true,
        'ajax': {
          'url': this.url,
          'dataSrc': function dataSrc(json) {
            //retrieve api buries the submission data in the payload object.
            //we want the payload in the main object so we use jquery extent to merge.
            var return_data = new Array();
            //let dateFormat = 'YYYY/MM/DD';
            $.each(json, function (i, row) {
              row.updated = moment(row.updated).format(dateFormat);
              row.created = moment(row.created).format(dateFormat);
              return_data.push($.extend({}, row, JSON.parse(row.payload)));
            });
            return return_data;
          }
        },
        createdRow: function createdRow(row, data, dataIndex) {
          $(row).attr('data-id', data.id);
        },
        "columnDefs": this.columnDefs,
        initComplete: function initComplete() {
          if (_this.addFilter) {
            this.api().columns().every(function () {
              var column = this;
              if (this.index() > 0) {
                var select = $('<select aria-label="Filter for column: ' + _this.columnDefs[this.index()].title + '"><option value=""></option></select>')
                  .appendTo($(column.footer()).empty().html("<span class='sr-only'>" + _this.columnDefs[this.index()].title + "</span>"))
                  .on('change', function () {
                    let val = $(this).val();
                    column
                      .search('"' + val + '"')
                      .draw();
                  });

                let options = new Array();
                column.data().each(function (d) {
                  if ($.isArray(d)) {
                    jQuery.each(d, function (index, item) {
                      options.push('<option value="' + item + '">' + item + '</option>');
                    })
                  } else {
                    options.push('<option value="' + d + '">' + d + '</option>')
                  }
                });

                $.each(jQuery.unique(options).sort(), function (index, item) {
                  select.append(item);
                });
              } else {
                $(column.footer()).empty().html("<span class='sr-only'>" + "Open Document" + "</span>")
              } // end of if (this.index() > 0) {
              column.draw();
            }
            );
            /*     if (_this.addScroll) {
                   this.api().columns().every(function () {
                     var column = this;
                     this.draw();
                   });
                 } // end of if (_this.addScroll) {*/
          }
        }
      });
      this.dom_table = $("#" + unid);
      return this.dt;
    }
  }]);

  return cc_retrieve_view;
}();
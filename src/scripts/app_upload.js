'use strict';

/**
 * Created by gperry2 on 03/22/2017.
 */

function updateAttachmentStatus(DZ, bin_id, repo, status) {
  // console.log('updateAttachmentStatus',bin_id, repo, status);
  var deleteURL = config.api.post + 'binUtils/' + config.default_repo + '/' + bin_id + '/' + status + '?sid=' + getCookie(config.default_repo + '.sid');
  $.get(deleteURL, function (response) {
    if (status == 'delete') {
      $('#' + bin_id).remove();
      DZ.existingUploads = $.grep(DZ.existingUploads, function (e) {
        return e.bin_id != bin_id;
      });

      var form_id = DZ.options.form_id;
      processForm('updateAttachments', form_id, repo);
    }
  }).fail(function () {
    console.log('failed');
  });
}
function processUploads(DZ, repo, sync) {
  // console.log('processUploads',DZ.options.dz_id, repo, sync)
  var uploadFiles = DZ.existingUploads ? DZ.existingUploads : new Array();
  var _files = DZ.getFilesWithStatus(Dropzone.SUCCESS);
  //console.log(DZ.options.dz_id,'uploadFiles',uploadFiles)
  //console.log(DZ.options.dz_id,'_files',_files)
  var syncFiles = sync;
  if (_files.length == 0) {
    //  console.log('No Files Attached');
  } else {
    $.each(_files, function (i, row) {
      var json = JSON.parse(row.xhr.response);
      json.dz = DZ.options.dz_id;
      json.name = row.name;
      json.type = row.type;
      json.size = row.size;
      json.bin_id = json.BIN_ID[0];
      delete json.BIN_ID;
      uploadFiles.push(json);
      syncFiles ? updateAttachmentStatus(DZ, json.bin_id, repo, 'keep') : '';
    });
  }
  return uploadFiles;
}
function showUploads(DZ, id, data, repo, allowDelete, showTable) {
  /*
   function: showUploads
   parameters:
   id (target):  the id of the element to render the uploaded file attachments table
   data:         serialized json returned from the event repo (the payload)
   repo:         the event repo name that will be used to use in the delete url.
   allowDelete:  display the delete button?
   showTable:    display the uploaded file table.
   */
  var thisDZ = DZ;
  var _uploads = '<table width=\'100%\' class="table-condensed table-responsive"><thead><tr><th>Name</th><th>Size</th><th>Actions</th></tr></thead><tbody>';
  thisDZ.existingUploads = data[id];
  //thisDZ.emit("addedFile", data[id]);
  $.each(data[id], function (i, row) {
    var getURL = config.httpHost.app[httpHost] + config.api.upload + repo + '/' + row.bin_id + '?sid=' + getCookie(config.default_repo + '.sid');
    var getLink = '<button onclick="event.preventDefault();window.open(\'' + getURL + '\')"><span class="glyphicon glyphicon-download"></span></button>';
    var deleteLink = '<button class="removeUpload" data-id="' + i + '" data-bin="' + row.bin_id + '" ><span class="glyphicon glyphicon-trash"></span></button>';
    var buttons = getLink;
    var caption = row.name;
    buttons += allowDelete ? deleteLink : '';
    _uploads += '<tr id="' + row.bin_id + '"><td>' + row.name + '</td><td>' + row.size + '</td><td>' + buttons + '</td></tr>';

    //make the thumbnails clickable to view file
    thisDZ.on("addedfile", function (file) {
      file.getURL = getURL;
      file.caption = caption;
      file.previewElement.addEventListener("click", function () {
        window.open(file.getURL);
      });
      //file._captionLabel = Dropzone.createElement("<p>" + file.caption + "</p>")
      //file.previewElement.appendChild(file._captionLabel);
    });
    thisDZ.emit("addedfile", row);
    //add the thumbnail to the dropzone for all files already on the server
    thisDZ.emit("thumbnail", row, getDefaultThumbnail(row.type));
    thisDZ.createThumbnailFromUrl(row, getURL);
    //set the uploaded file to completed and set the max files for this dropzone.
    thisDZ.emit("complete", row);
    thisDZ.options.maxFiles = thisDZ.options.maxFiles - 1;
  });

  _uploads += '</tbody></table>';
  showTable ? $('#' + id).html(_uploads) : "";

  thisDZ.on("removedfile", function (file) {
    updateAttachmentStatus(thisDZ, file.bin_id, repo, 'delete');
  });
  $(".removeUpload").on('click', function () {
    event.preventDefault(); updateAttachmentStatus(thisDZ, $(this).attr('data-bin'), repo, 'delete', $(this).attr('data-id'));
  });
}
function getDefaultThumbnail(stringType) {
  var thumb = "";
  if (typeof stringType == 'undefined') {
    thumb = "img/default.png";
  } else {
    var type = stringType.indexOf("/") > -1 ? stringType.split("/")[1] : stringType;
    switch (type) {
      case "jpeg":
      case "mpeg":
      case "png":
      case "image":
        thumb = "img/imageicon.png";
        break;
      case "mp3":
      case "mp4":
      case "wma":
        thumb = "img/audio.png";
        break;
      case "doc":
        thumb = "img/word.png";
        break;
      case "msword":
        thumb = "img/word.png";
        break;
      case "ppt":
        thumb = "img/ppt.png";
        break;
      case "xsl":
      case "xslx":
      case "csv":
        thumb = "img/excelFile.png";
        break;
      case "pdf":
        thumb = "img/pdf.png";
        break;
      default:
        thumb = "img/default.png";
    }
  }
  return thumb;
}
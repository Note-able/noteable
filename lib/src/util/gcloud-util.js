// Copyright 2015-2016, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

var gcloud = require('google-cloud');
var path = require('path');

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

module.exports = function (gcloudConfig, cloudStorageBucket) {

  var storage = gcloud.storage(gcloudConfig);
  var bucket = storage.bucket(cloudStorageBucket);

  function sendUploadToGCS(extension, buffer, next) {
    var gcsname = '' + Date.now() + guid() + extension;

    if (gcsname.length >= 101) {
      gcsname = gcsname.substring(gcsname.length - 100);
    }

    var file = bucket.file(gcsname);
    return new Promise(function (resolve, reject) {
      var stream = file.createWriteStream();

      stream.on('error', function (err) {
        reject({ error: err });
      });

      stream.on('finish', function () {
        resolve({ cloudStorageObject: gcsname, cloudStoragePublicUrl: getPublicUrl(gcsname) });
      });

      stream.end(buffer);
    });
  }

  function getPublicUrl(filename) {
    return 'https://storage.googleapis.com/' + cloudStorageBucket + '/' + filename;
  }

  return {
    getPublicUrl: getPublicUrl,
    sendUploadToGCS: sendUploadToGCS
  };
};
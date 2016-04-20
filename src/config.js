'use strict';

const config = module.exports = {
  port: process.env.PORT || 8080,
  dataBackend: 'datastore',
  gcloud: {
    projectId: process.env.GCLOUD_PROJECT || 'jovial-welder-128202',
    keyFilename: '../../Noteable-b17f41e4f608.json'
  },
  cloudAudioStorageBucket: 'user-audio-files-staging',
  cloudImageStorageBucket: 'user-image-files-staging',
  connectionString: process.env.DATABASE_URL || `postgres://bxujcozubyosgb:m1rgVoS1lEpdCZVRos6uWZVouU@ec2-54-235-146-58.compute-1.amazonaws.com:5432/d42dnjskegivlt?ssl=true`
};

const projectId = config.gcloud.projectId;

if (!projectId || projectId === 'your-project-id') {
  throw new Error('You must set the GCLOUD_PROJECT env var or add your ' +
    'project id to config.js!');
}
import path from 'path';

const config = {
  port: process.env.PORT || 8080,
  dataBackend: 'datastore',
  apiUrl: 'http://noteable.me/api/v1',
  mysqlConnection: {
    host: '104.236.157.202',
    user: 'noteable_test',
    database: 'noteable_test',
    password: 'jamsesh_tester',
    multipleStatements: true,
    namedPlaceholders: true,
  },
  gcloud: {
    projectId: process.env.GCLOUD_PROJECT || 'jovial-welder-128202',
    keyFilename: path.resolve(__dirname, '../Noteable-e4d2cea40c15.json'),
  },
  cloudAudioStorageBucket: 'noteable-audio-storage',
  cloudImageStorageBucket: 'user-image-files-staging',
  connectionString: process.env.DATABASE_URL || 'postgres://bxujcozubyosgb:m1rgVoS1lEpdCZVRos6uWZVouU@ec2-54-235-146-58.compute-1.amazonaws.com:5432/d42dnjskegivlt?ssl=true',
};

export default config;

const projectId = config.gcloud.projectId;

if (!projectId || projectId === 'your-project-id') {
  throw new Error('You must set the GCLOUD_PROJECT env var or add your ' +
    'project id to config.js!');
}

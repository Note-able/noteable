# jamsesh
jam wit me

## Requirements
* Install Node
* Install Docker
* Install mongodb
  * For windows, follow [these instructions](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/).
  * For mac, follow [these instructions](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/)
* Install git
* Install yarn globally (or just run the relevant npm commands. You choose)

## To run
* Clone git repository by running `git clone https://github.com/note-able/noteable`
* `cd noteable && yarn --ignore-engines` - this will install the necessary dependencies.
* `yarn run mongo` - starts up a local cache for authentication.
* `yarn run start-dev` - starts up a hot webpack dev server. This should rebuild when you make changes to front-end code.
* `yarn run server-dev` - runs the server using babel-node so you can write in es6. 

## Workflow
Don't push to master unless we are shipping a new version. Only push to staging. When we are ready to ship a new version to production we will merge test and staging and then create a new staging branch to push to.

Create new feature branches off of staging and push to those, merge them with staging when complete and ship to staging.

## Building and deploying
Pushing to `origin staging` will kick off a latest build at dockerhub.com/r/sportnak/noteable. Once that build is done, remote into the digital ocean droplet and run `. shipit.sh` to deploy the latest beta.

Pushing to `origin master` will kick off a stable (production) build at the same location. Running `. shipit.sh` will deploy the most recent stable build to production.

If there are certificate issues, make sure that the nginx.conf on the digital ocean droplet matches the local-nginx.conf. Also try debugging the nginx-gen definition in the docker-compose file.

## Tips and tricks
If the hot reloading is requiring you to update a bunch of things you can save the state in local storage. Just change the key here.

```
componentDidMount() {
    window.onbeforeunload = () => this.saveState();
    this.setState(JSON.parse(window.localStorage.getItem('events') || '{}'))
  }

  componentWillUnmount() {
    this.saveState();
  }

  saveState() {
    window.localStorage.setItem('events', JSON.stringify(this.state));
  }
```

https://3.basecamp.com/3163131/buckets/179912/messages/63519103

### SSL

http://stackoverflow.com/questions/21397809/create-a-trusted-self-signed-ssl-cert-for-localhost-for-use-with-express-node
Serving Node js over https requires constructing a server with the https module (in express 4)
Generate a cert with this method http://www.akadia.com/services/ssh_test_certificate.html
It can be configured to serve on both http and https if you use the http module.

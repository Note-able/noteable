# jamsesh
jam wit me

## To run
Clone git repository
navigate to directory and run `npm install`
modify your hostfile to have localhost changed to local.jamsesh.com (you can just add another field for 127.0.0.1)
run `npm run start-dev`
from here on if you have any style changes or changes to public info you can just run `npm run styles` and then `npm run start` to shortcut the bundling.


##Workflow
Don't push to master unless we are shipping a new version. Only push to staging. When we are ready to ship a new version to production we will merge test and staging and then create a new staging branch to push to.

Create new feature branches off of staging and push to those, merge them with staging when complete and ship to staging.

##Building and deploying
You should be on the staging branch, pull the existing staging branch and resolve any merge conflicts and then verify that it works, run the docker build commands, and push your docker build out to [docker-username]/staging. Then you should remote in to the digital ocean droplet, and stop the existing [username]/staging container start your recently pushed build.

Eventually we will have two separate droplets running each one, but for now we can just use separate containers.

##Tips and tricks
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

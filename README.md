Threejs-learning
================

This repository is made for us to learn threejs and angularjs. The future of Website is right here.

Setup environment

To run our example in local environment, we need node.js, Git, bower, Grunt. (Ruby compass is recommended if you want to use Sass)

If you already have everything, first go to the directory and run

npm install

It will get all node modules we need to run our example. Although not every module is actually needed, we put it there just
for future preparation.


After this, go to frontend directory, and run

bower install

This will get all libraries and plugins we need to run our application.


And last, after we have everything, go to the Threejs-learning directory and run

grunt serve

or grunt serve --force (if you don't have Ruby compass)

Wait for a few seconds and our application will show in your browser in port 8000.
Every time you make some change in the code, just save it and go to browser, refresh the page and you will see the change.

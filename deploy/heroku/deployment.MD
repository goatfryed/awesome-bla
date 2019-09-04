# Deployment


## backend
Run [backend.sh](backend.sh) to build, push and release the backend at https://awesome-bla-api.herokuapp.com/.

#### thoughts
While heroku has in theory really good support for java applications in general and spring boot applications exspecially,
this only works if heroku is connected to a git repository from where it can build the application and setup their dynos
by themself.
In our couse, the repository isn't just the backend, so we need to manga the backend as a separate application and deploy
it as a docker container. This requires some  custom configuration. Sadly, it's not possible to just tell heroku to setup
the env vars as if it was a spring boot application (or i didn't find that setting).

#### database connection
Heroku sets up a DATABASE_URL env var, which would be the preferred way to configure the db. But it doesn't map
well to the required jdbc database url, so we need to duplicate that data and manually update it, if heroku would change
the database url.
Also, jdbc database urls can't contain username and password, so this must be provided separately.

#### memory consumption
Run [frontend.sh](frontend.sh) to build, push and release the frontend at https://awesome-bla.herokuapp.com/.

The dyno has strict memory restrictions that the jvm needs to know about. Therefore, the container command passes the
$JAVA_OPTS env var to the jvm were we can configure custom java options.
Heroku lists recommanded options at
[adjusting environment for a dyno size](https://devcenter.heroku.com/articles/java-support#adjusting-environment-for-a-dyno-size)
Currently, we're working with ```-XX:+UnlockExperimentalVMOptions -XX:+UseCGroupMemoryLimitForHeap```. This should let
the jvm figure out the restrictions on its own.

## frontend
Okay, this time, we're trying something a little bit different. We're actually building completely in our docker image
We're using two steps indicated by a second from. The first step gets all our dependencies except for the node_modules
(see [.dockerignore](../../frontend/.dockerignore)), installs and builds the app. It's possible to configure the url to the backend
via ``--build-arg BACKEND_PATH=https:\\my-crazy-backend.net``

The container itself is a nginx installation that simply serves our static pages. Note, nginx needs to
configure the port to listen on at boot time, not at build time.
The server tries to serve the requested file or will fallback to the index.html in which case react takes over.

* See [heroku-docker-nginx-example](https://github.com/rjoonas/heroku-docker-nginx-example) for more on the nginx setup.
* See [Create React App + Docker - multi-stage build example](https://medium.com/@shakyShane/lets-talk-about-docker-artifacts-27454560384f)
for the suggestion of multi stage docker builds
* See [Adding custom environment variables](https://create-react-app.dev/docs/adding-custom-environment-variables) to understand
how the build process of our frontend can be configured via appropriate environment variables. Not that this must be done at
build, not at serve time.

Note, that the recommended nginx.conf isn't used currently, because it overrides all defaults and - for example - doesn't load the mime types.
While we could configure it properly, the default config seems fine anyway.
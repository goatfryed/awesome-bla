# Awesome Bucket List
[Awesome Bucket List Application](https://awesome-bla.herokuapp.com)

## Zu beachten:
- Zusatzfeauture: Mobile friendly 

## Frontend
### React Hooks
Hooks are a new addition in React 16.8. They let you use state and other React features without writing a class.
-- https://reactjs.org/docs/hooks-intro.html

We are making some usage of react hooks in our frontend components. Obviously, because it's the latest trendy stuff,
but also, because it allows a smooth transition from plain function render components to incremental complexity.
It supports the mvp approach nicely, because we can start writing a simple functional component to render some stateless ui,
at hook by hook a little bit of complexity and then, when the complexity increased enough, we can easily refactor to class components.

The [useState](https://reactjs.org/docs/hooks-state.html) hook allows to add a little bit of state between renders of components.
The initial value is only considered on first render.

The [useEffect](https://reactjs.org/docs/hooks-effect.html) hook allows to add life cycle methods.
In many ways, it's much better than the life cycle hooks of ClassComponents, because firstly, it runs
on mount and update likewise. More than not, we have to duplicate the functionality in both cases.
It's also possible to bind these lifecycle methods to dependencies and only trigger on change of these,
which makes it much more easy to manage different life cycle actions on different changes.
Lastly, once can return a cleanup function, if required.

### 401 and other exception handling in frontend
So here's the deal: You have a couple of pages requesting a couple of things on the backend and no user permissions.
Now your PO want's you to add user permissions to all these pages. How do you handle it?
Well, firstly, you add the domain logic in the backend.

Our backend knows based on the authenticated user what he's allow to see and do.
If he isn't allowed to do it, we send a 401 error response. Now, in the frontend - happy flows -, we try
to lead users only through parts he's allowed to see. But what about someone else sends him a link and he
has insufficient permission?

To handle these cases, we'd need to properly handle 401 at every page that could result in a 401. That's the
appropriate way to do it. Surely, we didn't do that. Nobody got time for that. So we wrapped the application
in a UnauthorizedHandler. This component adds a special handler to every fetch request. If the fetch request returns
and the endpoint hasn't set a special flag ("i'm modern and clever and take care of my own 401-shit"), the UnauthorizedHandler
redirects to our generic 401 page.
Also, if a little bit smarter component throws an [ApiError](./frontend/src/api.js) caused by a 401 response inside a render flow, the
UnauthorizedHandler will redirect to 401 as well.

**For developers** please note that api exceptions resulting in the hacky-ish UnauthorizedHandler to intercept
will issue a console warning and open an error overlay, because the promise chain didn't catch.
We can't gracefully catch that error, because we don't know the specific page requirements in our generic hack.
If you see it, you should probably fix that component to implement a custom exception handling and provide
the ``{alwaysThrow: true}`` configuration. A generic, but graceful in component handling could be ``setState( () => throw new ApiError(response));``
to let the UnauthorizedHandler catch the 401 exception as god intended and not do the devils hack.


## Deployment
Zum deployment auf https://awesome-bla.herokuapp.com, siehe [deployment.MD](./deploy/heroku/deployment.MD)

## Dev Umgebung
Zum Starten des Backends muss zunächst die Datenbank verfügbar sein.
Unter windows sind Lese- und Schreibzugriffe auf geteilte Directories über Docker stark verlangsamt, weshalb das postgres
Image kein klassisches, gemountetes Filesystem unter Windows zulässt.
Um dennoch zwischen Entwicklunsschritten persistente Daten zu haben, benutzen wir hier named-volumes.
Dazu einmalig ``docker volumes create bucket-list-data``. Um die Datenbank komplett zu erneuern, kann dies mit
``docker volumes rm bucket-list-data`` weggeworfen und neu erstellt werden.

Steht das named volume kann die Entwicklungsumgebung gestartet werden
* ``docker-compose up database`` zum Starten einer lokalen Postgres-Datenbank
* ``cd backend/ && gradlew bootRun`` zum Installieren der Dependencies und Starten des backends
* ``cd frontend/ && npm install && npm start``  zum Installieren der Dependencies und Starten des frontends

### Debug Authentication
Beim Starten der Application kann die Environment Variable `DEBUG_AUTHENTIFICATION=1` gesetzt sein, damit das backend unsignierte Anfragen zulässt.
Dies aktiviert ebenfalls im Frontend ein Test User Login.


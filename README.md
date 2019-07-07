# Awesome Bucket List

## Backend
### Debug Authentication
Beim Starten der Application muss die Environment Variable `DEBUG_AUTHENTIFICATION=1` gesetzt sein, damit das backend unsignierte Anfragen zulässt.

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


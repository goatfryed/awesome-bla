package de.uniks.webengineering2019.bla.authentication;

import de.uniks.webengineering2019.bla.model.User;
import org.springframework.stereotype.Component;
import org.springframework.web.context.annotation.RequestScope;

/**
 * In the lecture, we had a request scoped user object, that was configured by the Authentication filter, setting the values of each user property.
 * Here, we're going with a encapsulated user property so that we don't need to consider setting and updating every user field.
 * Also, it's easier to see in a controller, whether no user context was set and thus t
 */
@Component
@RequestScope
public class UserContext {

    private User user = null;

    public boolean hasUser() {
        return user != null;
    }

    /**
     * @throws UnauthenticatedRequestException if no user was set prior to calling get
     */
    public User getUser() {
        if (!hasUser()) {
            throw new UnauthenticatedRequestException("the request requires a fully authenticated user, but was made anonymous");
        }
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}

package de.uniks.webengineering2019.bla.filters;

import de.uniks.webengineering2019.bla.model.User;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.context.annotation.RequestScope;

@Configuration
public class AuthenticationConfiguration {
    @Bean
    @RequestScope
    public User getUser() {
        return new User();
    }
}
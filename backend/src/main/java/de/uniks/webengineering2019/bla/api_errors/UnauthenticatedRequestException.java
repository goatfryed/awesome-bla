package de.uniks.webengineering2019.bla.api_errors;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.UNAUTHORIZED)
public class UnauthenticatedRequestException extends RuntimeException {

    public UnauthenticatedRequestException(String msg) {
        super(msg);
    }
}

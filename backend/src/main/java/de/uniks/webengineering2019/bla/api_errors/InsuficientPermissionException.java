package de.uniks.webengineering2019.bla.api_errors;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.UNAUTHORIZED)
public class InsuficientPermissionException extends RuntimeException {

    public InsuficientPermissionException(String msg) {
        super(msg);
    }

    public InsuficientPermissionException() {
        super("Sorry, John, I can't let you do that");
    }
}

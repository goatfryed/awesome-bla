package de.uniks.webengineering2019.bla.authentication;

import de.uniks.webengineering2019.bla.service.AuthenticationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin
@RestController
public class AuthenticationController {

    private AuthenticationService authenticationService;
    private final UserContext userContext;

    @Autowired
    public AuthenticationController(
        AuthenticationService authenticationService,
        UserContext userContext
    ) {
        this.authenticationService = authenticationService;
        this.userContext = userContext;
    }

    @GetMapping("/authentication/callback")
    public ResponseEntity<Map<String, String>> getUserInfor(@RequestParam("code") String code) {
        Map<String, String> map = new HashMap<>();

        String jwtToken = authenticationService.retrieveJWTToken(code);
        if (jwtToken == null) {
            ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        map.put("token", jwtToken);
        return ResponseEntity.ok(map);
    }

    @GetMapping("/authentication/url")
    public Map<String, String> getAuthenticationURL() {
        Map<String, String> map = new HashMap<>();
        map.put("url", authenticationService.getAuthenticationURL());
        return map;
    }

    @CrossOrigin
    @PostMapping("/test")
    @GetMapping("/test")
    public ResponseEntity test(){
        return ResponseEntity.ok(userContext.getUserOrThrow().toString());
    }
}

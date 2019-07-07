package de.uniks.webengineering2019.bla.controllers;

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

    @Autowired
    public AuthenticationController(AuthenticationService authenticationService) {
        this.authenticationService = authenticationService;
    }

    @GetMapping("/api/authentication/callback")
    public ResponseEntity<Map<String, String>> getUserInfor(@RequestParam("code") String code) {
        Map<String, String> map = new HashMap<>();

        String jwtToken = authenticationService.retrieveJWTToken(code);
        if (jwtToken == null) {
            ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        map.put("token", jwtToken);
        return ResponseEntity.ok(map);
    }

    @GetMapping("/api/authentication/url")
    public Map<String, String> getAuthenticationURL() {
        Map<String, String> map = new HashMap<>();
        map.put("url", authenticationService.getAuthenticationURL());
        return map;
    }

    @CrossOrigin
    @PostMapping("/api/test")
    public ResponseEntity test(){
        return ResponseEntity.ok("Access granted");
    }
}
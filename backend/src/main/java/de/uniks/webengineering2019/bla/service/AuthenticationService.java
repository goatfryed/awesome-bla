package de.uniks.webengineering2019.bla.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.scribejava.apis.GitHubApi;
import com.github.scribejava.core.builder.ServiceBuilder;
import com.github.scribejava.core.model.OAuth2AccessToken;
import com.github.scribejava.core.model.OAuthRequest;
import com.github.scribejava.core.model.Response;
import com.github.scribejava.core.model.Verb;
import com.github.scribejava.core.oauth.OAuth20Service;
import de.uniks.webengineering2019.bla.model.User;
import de.uniks.webengineering2019.bla.repositories.UserRepository;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import javax.crypto.SecretKey;
import java.io.IOException;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ExecutionException;

@Service
public class AuthenticationService{

    private OAuth20Service service;

    private static final Logger LOG = LoggerFactory.getLogger(AuthenticationService.class);

    @Value("${auth.github.clientid}")
    private String clientid;
    @Value("${auth.github.secret}")
    private String secret;

    @Value("${SECRET_KEY}")
    private String secretKey;

    @Autowired
    private UserRepository userRepository;

    @PostConstruct
    private void init() {
        service = new ServiceBuilder(clientid)
                .apiSecret(secret)
                .build(GitHubApi.instance());
    }

    public String getAuthenticationURL() {
        return service.getAuthorizationUrl();
    }

    public String retrieveJWTToken(String code) {
        OAuth2AccessToken token = getAccessToken(code);
        if (token == null) {
            LOG.error("Accec token os null for code: "+code);
            return null;
        }
        LOG.info("New token is: "+token.getAccessToken()+" with code_ "+code);

        User user = retrieveUserInformation(token);
        if (user == null) {
            LOG.error("Could not retrive User Data");
            return null;
        }
        LOG.info("Retrived userdata are: "+user.toString());

        return createJWT(user);
    }

    private String createJWT(User user) {
        SecretKey key = Keys.hmacShaKeyFor(Base64.getDecoder().decode(secretKey.getBytes()));
        Map<String, Object> claims = new HashMap<>();
        claims.put("id", user.getId());
        claims.put("name", user.getFullName());
        claims.put("sub", user.getUserName());
        return Jwts.builder()
                .addClaims(claims)
                .signWith(key)
                .compact();
    }

    private OAuth2AccessToken getAccessToken(String code) {
        try {
            return service.getAccessToken(code);
        } catch (InterruptedException |ExecutionException|IOException e) {
            LOG.warn("Unable to retrieve access token for code={}", code, e);
            return null;
        }
    }

    private User retrieveUserInformation(OAuth2AccessToken token) {
        Optional<User> oUser = getUserData(token);
        if (!oUser.isPresent()) {
            return null;
        }
        User user = oUser.get();

        // Store user in database (if not already done) to have a full user object including id.
        User u = userRepository.findUserByUserName(user.getUserName());
        if (u == null) {
            u = userRepository.save(user);
        }
        user = u;
        return user;
    }

    private Optional<User> getUserData(OAuth2AccessToken token) {
        User newUser = new User();

        OAuthRequest request = new OAuthRequest(Verb.GET, "https://api.github.com/user");
        service.signRequest(token, request);
        try {
            Response response = service.execute(request);
            String body = response.getBody();
            ObjectMapper mapper = new ObjectMapper();
            Map map = mapper.readValue(body, Map.class);
            newUser.setUserName((String) map.get("login"));
            newUser.setFullName((String) map.get("name"));
            return Optional.of(newUser);
        } catch (InterruptedException | ExecutionException | IOException e) {
            LOG.warn("Unable to retrieve user data for token={}", token.getAccessToken(), e);
            return Optional.empty();
        }
    }
}

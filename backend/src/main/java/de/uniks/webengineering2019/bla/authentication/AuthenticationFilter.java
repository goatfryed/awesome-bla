package de.uniks.webengineering2019.bla.authentication;

import de.uniks.webengineering2019.bla.model.User;
import de.uniks.webengineering2019.bla.repositories.UserRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwt;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.impl.DefaultClaims;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import javax.crypto.SecretKey;
import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Base64;
import java.util.Optional;

@Component
public class AuthenticationFilter implements Filter {
    private static final Logger LOG = LoggerFactory.getLogger(AuthenticationFilter.class);


    private UserContext userContext;

    private UserRepository userRepository;

    @Value("${SECRET_KEY}")
    private String secretKey;

    @Value("${debug.authentication:true}")
    private boolean debugAuthentication;

    @Autowired
    public AuthenticationFilter(
        UserRepository userRepository,
        UserContext userContext
    ) {
        this.userRepository = userRepository;
        this.userContext = userContext;
    }

    @PostConstruct
    public void warn() {
        if (debugAuthentication) {
            LOG.warn("Debug authentication is enabled using debug.authentication = true");
        }
    }

    @Override
    public void doFilter(ServletRequest req, ServletResponse resp, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest httpReq = (HttpServletRequest) req;
        HttpServletResponse httpResp = (HttpServletResponse) resp;

        // If a JWT token is present, use its values to create a user object. Nevertheless, we do not enforce it
        // for all requests (see below).
        boolean valid = parseToken(httpReq);

        // In our case we do not permit any HTTP requests which are POST.
        if (httpReq.getMethod().equals("POST")) {
            if (!valid) {
                LOG.warn("Unauthorized request to {}", ((HttpServletRequest) req).getRequestURI());
                httpResp.setStatus(HttpStatus.UNAUTHORIZED.value());
                return;
            }
        }

        // We allow everything else.
        chain.doFilter(req, resp);
    }

    private boolean parseToken(HttpServletRequest request) {
        Optional<Claims> claims = decodeRequest(request);
        if (claims.isPresent()) {
            Claims c = claims.get();

            User user = new User();
            Object id = c.get("id");
            long properId;
            if (!(id instanceof Number)) {
                properId = Long.parseLong(id.toString());
            } else {
                properId = ((Number) id).longValue();
            }
            user.setId(properId);
            user.setUserName(c.getSubject());
            user.setFullName((String)c.get("name"));

            userContext.setUser(user);

            LOG.info("claimUser={}", user);
            return true;
        }

        return false;
    }

    public Optional<Claims> decodeRequest(HttpServletRequest request) {
        // Use header information from header 'Authorization' to extract user from JWT.
        String authorization = request.getHeader("Authorization");

        int minStringLength = "Bearer ".length();
        if (authorization == null || authorization.length() < minStringLength) {
            return Optional.empty();
        }
        authorization = authorization.substring(minStringLength);

        if (debugAuthentication) {
            return handleDebugAuthentication(authorization);
        }

        SecretKey key = Keys.hmacShaKeyFor(Base64.getDecoder().decode(secretKey.getBytes()));
        try {
            Jwt jwt = Jwts.parser().setSigningKey(key).parseClaimsJws(authorization);
            return Optional.of(((DefaultClaims) jwt.getBody()));
        } catch (JwtException e) {
            LOG.warn("Malformed JWT token submitted: <{}>", authorization);
            return Optional.empty();
        }
    }

    private Optional<Claims> handleDebugAuthentication(String userName) {
        // Parse and create a similar Claims object.
        DefaultClaims claims = new DefaultClaims();
        claims.put("sub", userName);
        claims.put("name", "FN/" + userName);

        User oUser = userRepository.findUserByUserName(userName);
        if (oUser == null) {
            // We have to create the user to have an id (primary key).
            User user = new User();
            user.setFullName("FN/" + userName);
            user.setUserName(userName);
            oUser = userRepository.save(user);
            LOG.info("Cretaed new debug user: " + oUser.getFullName());
        }
        claims.put("id", ""+oUser.getId().intValue());
        LOG.info("Accepted debug user: "+oUser.getFullName());

        return Optional.of(claims);
    }
}
package com.example.authservice.controller;

import com.example.authservice.config.Iconstants;
import com.example.authservice.domain.Clients;
import com.example.authservice.domain.Role;
import com.example.authservice.repository.ClientRepository;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import javax.servlet.ServletException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Controller
public class TokenController {

	@Autowired
	private ClientRepository clientRepository;

	@Autowired
	private BCryptPasswordEncoder bCryptPasswordEncoder;

	@PostMapping("/token")
	public ResponseEntity<?> getToken(@RequestBody Clients login) throws ServletException {

		SimpleDateFormat formatForDateNow = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String jwttoken = "";

		if(login.getUsername().isEmpty() || login.getPassword().isEmpty())
			return new ResponseEntity<String>("Username or password cannot be empty.", HttpStatus.BAD_REQUEST);

		String name = login.getUsername();
		String password = login.getPassword();

		Optional<Clients> clientFromDb = Optional.ofNullable(clientRepository.findByUsername(name));
		if(clientFromDb.isPresent()) {
			if(bCryptPasswordEncoder.matches(password, clientFromDb.get().getPassword())) {
				Map<String, Object> claims = new HashMap<String, Object>();
				claims.put("usr", name);
				claims.put("sub", "Authentication token");
				claims.put("iss", Iconstants.ISSUER);
				if(clientFromDb.get().getRoles().contains(Role.ADMIN)) {
					claims.put("rol", "ADMIN, USER");
				} else {
					claims.put("rol", "USER");
				}
				System.out.println(clientFromDb.get().getRoles().contains(Role.ADMIN));
				claims.put("iat", formatForDateNow.format(new Date()));

				jwttoken = Jwts.builder().setClaims(claims).signWith(SignatureAlgorithm.HS512, Iconstants.SECRET_KEY).compact();
				System.out.println("Returning the following token to the user = "+ jwttoken);
				return new ResponseEntity<>(jwttoken, HttpStatus.OK);
			}
		}
		return new ResponseEntity<String>("Invalid credentials. Please check the username and password.", HttpStatus.UNAUTHORIZED);
	}
}
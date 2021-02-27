package com.example.authservice.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class Securityconfig extends WebSecurityConfigurerAdapter {

	@Bean
	public Jwtauthfilter jwtAuthenticationFilter() {
		return new Jwtauthfilter();
	}

	@Override
	protected void configure(HttpSecurity http) throws Exception {
		http
		.authorizeRequests()
		.antMatchers("/token", "/registration", "/client/**")
		.permitAll()
		.anyRequest()
		.authenticated()
		.and()
		.csrf().disable()
		.addFilterBefore(jwtAuthenticationFilter(), 
				UsernamePasswordAuthenticationFilter.class);
	}
}
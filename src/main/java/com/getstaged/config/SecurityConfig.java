package com.getstaged.config;

import com.getstaged.security.JwtAuthenticationEntryPoint;
import com.getstaged.security.JwtAuthenticationFilter;
import com.getstaged.service.CustomUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.BeanIds;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.*;
import org.springframework.security.crypto.scrypt.SCryptPasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.util.HashMap;
import java.util.Map;


@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(
        securedEnabled = true,
        jsr250Enabled = true,
        prePostEnabled = true
)
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    private static final String[] AUTH_WHITELIST = {
            "/swagger-resources/**",
            "/swagger-ui.html",
            "/v2/api-docs",
            "/webjars/**"
    };

    @Autowired
    CustomUserDetailsService customUserDetailsService;

    @Autowired
    private JwtAuthenticationEntryPoint unauthorizedHandler;

    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {
        return new JwtAuthenticationFilter();
    }

    @Override
    public void configure(AuthenticationManagerBuilder authenticationManagerBuilder) throws Exception {
        authenticationManagerBuilder
                .userDetailsService(customUserDetailsService)
                .passwordEncoder(passwordEncoder());
    }

    @Bean(BeanIds.AUTHENTICATION_MANAGER)
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        String currentId = "bcrypt";

        Map<String, PasswordEncoder> encoders = new HashMap<>();
        encoders.put(currentId, new BCryptPasswordEncoder());
        //encoders.put(currentId, new Pbkdf2PasswordEncoder(PBKDF2_2018_SECRET, PBKDF2_2018_ITERATIONS, PBKDF2_2018_HASH_WIDTH));
        encoders.put("pbkdf2", new Pbkdf2PasswordEncoder());
        encoders.put("scrypt", new SCryptPasswordEncoder());
        encoders.put("noop", NoOpPasswordEncoder.getInstance());

        return new DelegatingPasswordEncoder(currentId, encoders);
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
            .cors()
        .and()
            .csrf()
            .disable()
            .exceptionHandling()
            .authenticationEntryPoint(unauthorizedHandler)
        .and()
            .sessionManagement()
            .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
        .and()
            .authorizeRequests()
            .antMatchers("/",
                    "/favicon.ico",
                    "/**/*.png",
                    "/**/*.gif",
                    "/**/*.svg",
                    "/**/*.jpg",
                    "/**/*.html",
                    "/**/*.css",
                    "/**/*.js")
            .permitAll()
            .antMatchers(AUTH_WHITELIST).permitAll()
            .antMatchers("/api/auth/**").permitAll()
            .antMatchers( "/api/user/checkEmailAvailability", "api/students/checkStudentCvUpload").permitAll()
            .antMatchers(HttpMethod.GET, "/api/offers/**", "/api/users/**", "/api/students/**",
                        "/api/supervisors/**", "/api/monitors/**", "/api/entreprises/offers",
                        "/api/notifications", "/api/coordinator/**").permitAll()
            .antMatchers(HttpMethod.PUT, "/api/offers/validateOffer", "/api/students/assignMonitor",
                        "/api/coordinator/approveApply", "/api/coordinator/refuseApply", "/api/coordinator/blockUser").permitAll()
            .antMatchers(HttpMethod.DELETE, "/api/offers/**").permitAll()
            .antMatchers( "/api/**").permitAll()
            .antMatchers("/api/monitors/students/**").permitAll()
            .anyRequest()
            .authenticated();
               
        http.addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);
    }
}
package com.spring.zidio.configuration;

import java.io.InputStreamReader;
import java.util.Collections;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;

import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.extensions.java6.auth.oauth2.AuthorizationCodeInstalledApp;
import com.google.api.client.extensions.jetty.auth.oauth2.LocalServerReceiver;
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeFlow;
import com.google.api.client.googleapis.auth.oauth2.GoogleClientSecrets;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.client.util.store.FileDataStoreFactory;
import com.google.api.services.calendar.Calendar;
import com.google.api.services.calendar.CalendarScopes;

@Configuration
public class GoogleCalendarConfig {
	
		 private static final String APPLICATION_NAME = "calender";
		    private static final JsonFactory JSON_FACTORY = GsonFactory.getDefaultInstance(); // ✅ Updated here
		    private static final String TOKENS_DIRECTORY_PATH = "tokens";

		    @Bean
		    public Calendar googleCalendar() throws Exception {
		        final NetHttpTransport httpTransport = GoogleNetHttpTransport.newTrustedTransport();

		        GoogleClientSecrets clientSecrets = GoogleClientSecrets.load(
		                JSON_FACTORY,
		                new InputStreamReader(
		                        new ClassPathResource("credentials.json").getInputStream()
		                    )
		                );

		        GoogleAuthorizationCodeFlow flow = new GoogleAuthorizationCodeFlow.Builder(
		                httpTransport,
		                JSON_FACTORY,
		                clientSecrets,
		                Collections.singleton(CalendarScopes.CALENDAR)
		        )
		        .setDataStoreFactory(new FileDataStoreFactory(new java.io.File(TOKENS_DIRECTORY_PATH)))
		        .setAccessType("offline")
		        .build();

		        LocalServerReceiver receiver = new LocalServerReceiver.Builder().setPort(8080).build();
		        Credential credential = new AuthorizationCodeInstalledApp(flow, receiver).authorize("user");

		        return new Calendar.Builder(httpTransport, JSON_FACTORY, credential)
		                .setApplicationName(APPLICATION_NAME)
		                .build();
		    }
}

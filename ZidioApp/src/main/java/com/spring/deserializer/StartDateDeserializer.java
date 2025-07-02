package com.spring.deserializer;

import java.io.IOException;
import java.time.LocalDate;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;

public class StartDateDeserializer extends JsonDeserializer<LocalDate> {
	 @Override
	    public LocalDate deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
	        String value = p.getText();

	        if (value.equalsIgnoreCase("immediately") || value.equalsIgnoreCase("asap")) {
	            return LocalDate.now();  // Current date for "immediately"
	        } else {
	            // Try to parse it as a standard date
	            return LocalDate.parse(value);
	        }
	    }

}

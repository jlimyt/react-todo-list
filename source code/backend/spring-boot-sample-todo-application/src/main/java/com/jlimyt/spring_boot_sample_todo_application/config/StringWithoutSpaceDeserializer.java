package com.jlimyt.spring_boot_sample_todo_application.config;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;

import org.apache.commons.lang3.StringUtils;

import java.io.IOException;

public class StringWithoutSpaceDeserializer extends StdDeserializer<String> {
	private static final long serialVersionUID = -6972065572263950443L;

	protected StringWithoutSpaceDeserializer(Class<String> vc) {
		super(vc);
	}

	@Override
	public String deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
		return StringUtils.trimToNull(p.getText());
	}
}

package com.gluk.z2j.lib;

import java.util.HashMap;
import java.util.Map;

import com.gluk.z2j.api.IEnvironment;

public class Environment implements IEnvironment {
	
	private IEnvironment parent = null;
	private Map<String, String> values = new HashMap<String, String>();
	
	public Environment(IEnvironment parent) {
		this.parent = parent;
	}
	
	public void addValue(String value) {
		String name = String.format("$%d", values.size() + 1);
		values.put(name, value);
	}

	public String getValue(String name) {
		String r = values.get(name);
		if (r != null) {
			return r;
		}
		if (parent != null) {
			return parent.getValue(name);
		}
		return name;
	}
}

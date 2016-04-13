package com.gluk.z2j.loader;

import com.gluk.z2j.api.IParser;

public class ProxyParser implements IParser {
	
	IParser root;
	
	public ProxyParser(IParser parent) {
		this.root = parent;
	}

	public void open() throws Exception {
		root.open();
	}

	public void close() throws Exception {
		root.close();
	}

	public void add(String s) throws Exception {
		root.add(s);
	}
}

package com.gluk.z2j.api.loader;

public interface IDoc {
	void open(String tag) throws Exception;
	boolean close() throws Exception;
	void add(String s) throws Exception; 
}

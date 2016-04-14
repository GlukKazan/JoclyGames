package com.gluk.z2j.api;

public interface IDoc extends ISource {
	void open(String tag) throws Exception;
	boolean close() throws Exception;
	void add(String s) throws Exception; 
}

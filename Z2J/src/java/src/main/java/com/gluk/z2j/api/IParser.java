package com.gluk.z2j.api;

public interface IParser {
	void open() throws Exception;
	void close() throws Exception;
	void add(String s) throws Exception;
}

package com.gluk.z2j.api.loader;

public interface IScaner {
	void scan(char c) throws Exception;
	void setDirectory(String dir);
	void open() throws Exception;
	void close() throws Exception;
}

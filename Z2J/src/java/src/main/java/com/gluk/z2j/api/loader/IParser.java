package com.gluk.z2j.api.loader;

public interface IParser {
	void setDirectory(String dir);
	void open() throws Exception;
	void close() throws Exception;
	void close(boolean isForced) throws Exception;
	void add(String s) throws Exception;
}

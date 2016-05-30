package com.gluk.z2j.api.loader;

import org.w3c.dom.Document;

public interface IParser {
	void setDirectory(String dir);
	void open() throws Exception;
	void close() throws Exception;
	void close(boolean isForced) throws Exception;
	void add(String s) throws Exception;
	Document getDoc() throws Exception;
}

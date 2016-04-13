package com.gluk.z2j.api;

import org.w3c.dom.Node;
import org.w3c.dom.traversal.NodeIterator;

public interface ILibrary {
	String getHead(Node doc) throws Exception;
	NodeIterator getTail(Node doc) throws Exception;
	void add(Node doc) throws Exception;
}

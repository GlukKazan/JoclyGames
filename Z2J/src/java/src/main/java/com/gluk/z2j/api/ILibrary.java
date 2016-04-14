package com.gluk.z2j.api;

import org.w3c.dom.Node;
import org.w3c.dom.traversal.NodeIterator;

public interface ILibrary extends ISource {
	String getHead(Node doc) throws Exception;
	NodeIterator getTail(Node doc) throws Exception;
	void add(Node doc) throws Exception;
	Node getDefault() throws Exception;
	Node getGame() throws Exception;
}

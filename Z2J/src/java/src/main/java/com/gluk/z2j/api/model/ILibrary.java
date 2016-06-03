package com.gluk.z2j.api.model;

import org.w3c.dom.Node;

public interface ILibrary extends ISource {
	Node getGame() throws Exception;
	Node getDefault() throws Exception;
}

package com.gluk.z2j.api.model;

public interface IBoard {
	boolean isDefined(String pos);
	void addPos(String name) throws Exception;
	void delPos(String name) throws Exception;
	void addLink(String name, String from, String to) throws Exception;
	void delLink(String name, String from) throws Exception;
	void addSym(String player, String from, String to) throws Exception;
	void addZone(String name, String player, String pos) throws Exception;
	void addZone(String name, String pos) throws Exception;
}

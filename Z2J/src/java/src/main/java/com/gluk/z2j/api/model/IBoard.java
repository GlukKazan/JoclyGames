package com.gluk.z2j.api.model;

public interface IBoard {
	int  getPosition(String pos);
	int  getDirection(String dir);
	void addPos(String name) throws Exception;
	void delPos(String name) throws Exception;
	void addLink(String name, String from, String to) throws Exception;
	void delLink(String from, String to) throws Exception;
	void delLink(String from) throws Exception;
	void addSym(String player, String from, String to) throws Exception;
	void addZone(String name, String player, String pos) throws Exception;
	void addZone(String name, String pos) throws Exception;
}

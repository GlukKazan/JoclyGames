package com.gluk.z2j.api.model;

import java.util.Collection;

import com.gluk.z2j.api.form.IForm;

public interface IGame {
	Collection<String> getPlayers();
	void addMove(int piece, IForm form, String mode, boolean isDrop) throws Exception;
	int addMode(String mode);
	boolean isPlayer(String name);
	boolean isPosition(String name);
	boolean isDirection(String name);
	boolean isAttribute(String name);
	boolean isMode(String name);
	int getNameIndex(String name);
	boolean checkFlag(int flag);
	void setFlag(int flag, int value);
}

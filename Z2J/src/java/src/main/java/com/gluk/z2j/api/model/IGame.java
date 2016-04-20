package com.gluk.z2j.api.model;

import java.util.Collection;
import java.util.List;

import com.gluk.z2j.api.form.IForm;

public interface IGame {
	Collection<String> getPlayers();
	Integer getNameIndex(String name);
	void addMove(IForm template, List<Integer> params, String mode) throws Exception;
}

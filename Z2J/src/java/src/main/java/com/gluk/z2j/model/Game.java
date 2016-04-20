package com.gluk.z2j.model;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.gluk.z2j.api.form.IForm;
import com.gluk.z2j.api.loader.IDoc;
import com.gluk.z2j.api.model.IGame;
import com.gluk.z2j.api.model.ISource;

public class Game extends AbstractDoc implements IGame {
	
	private final static String GAME_TAG  = "game";
	private final static String BOARD_TAG = "board";

	private AbstractDoc proxy = null;
	private List<ISource> docs = new ArrayList<ISource>();
	private List<String> players = new ArrayList<String>();
	private Map<String, Integer> names = new HashMap<String, Integer>();

	public void open(String tag) throws Exception {
		if (proxy != null) {
			proxy.open(tag);
			return;
		}
		if (tag.equals(BOARD_TAG)) {
			proxy = new Board(this);
			proxy.open(tag);
			return;
		}
		super.open(tag);
	}

	public boolean close() throws Exception {
		if (proxy != null) {
			boolean r = proxy.close(); 
			if (r) {
				docs.add(proxy);
				proxy = null;
			}
			return r;
		}
		return super.close();
	}

	public void add(String s) throws Exception {
		if (proxy != null) {
			proxy.add(s);
		} else {
			super.add(s);
		}
	}

	public void extract(IDoc dest) throws Exception {
		dest.open(GAME_TAG);
		for (ISource d: docs) {
			d.extract(dest);
		}
		super.extract(dest);
		dest.close();
	}

	public Collection<String> getPlayers() {
		return players;
	}

	public Integer getNameIndex(String name) {
		return names.get(name);
	}

	public void addMove(IForm template, List<Integer> params, String mode) throws Exception {
		// TODO:
		
	}
}

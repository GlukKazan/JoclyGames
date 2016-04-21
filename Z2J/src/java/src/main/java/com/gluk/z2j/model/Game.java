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
	private List<String> modes = new ArrayList<String>();
	private List<MoveTemplate> templates = new ArrayList<MoveTemplate>();
	private Map<Integer, List<Move>> moves = new HashMap<Integer, List<Move>>();
	
	private Integer currPiece = 0;
	private int flags;

	public boolean checkFlag(int flag) {
		return (flag & flags) != 0;
	}

	public void setFlag(int flag, int value) {
		if (value != 0) {
			flags |= flag;
		} else {
			flags &= ~flag;
		}
	}

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

	private int addTemplate(MoveTemplate template) {
		for (int i = templates.size() - 1; i >= 0; i--) {
			if (template.isEqual(templates.get(i))) {
				return i;
			}
		}
		templates.add(template);
		return templates.size() - 1;
	}
	
	// TODO: Предварительно составить список всех возможных режимов
	public int addMode(String mode) {
		for (int i = 0; i < modes.size(); i++) {
			if (modes.get(i).equals(mode)) {
				return i;
			}
		}
		modes.add(mode);
		return modes.size() - 1;
	}
	
	public void addMove(IForm form, String mode) throws Exception {
		flags = 0;
		List<Integer> params = new ArrayList<Integer>();
		MoveTemplate template = new MoveTemplate();
		form.generate(template, params, this);
		int tx = addTemplate(template);
		int mx = addMode(mode);
		List<Move> ml = moves.get(currPiece);
		if (ml == null) {
			ml = new ArrayList<Move>();
			moves.put(currPiece, ml);
		}
		ml.add(new Move(tx, params, mx));
	}

	public boolean isPosition(String name) {
		// TODO Auto-generated method stub
		return false;
	}

	public boolean isDirection(String name) {
		// TODO Auto-generated method stub
		return false;
	}

	public int getNameIndex(String name) {
		// TODO Auto-generated method stub
		return 0;
	}
}

package com.gluk.z2j.lib;

import java.util.ArrayList;
import java.util.List;

import com.gluk.z2j.api.IDoc;

public class Game extends AbstractDoc {
	
	private final static String GAME_TAG  = "game";
	private final static String BOARD_TAG = "board";

	private IDoc proxy = null;
	private List<IDoc> docs = new ArrayList<IDoc>(); 

	public void open(String tag) throws Exception {
		if (proxy != null) {
			proxy.open(tag);
			return;
		}
		if (tag.equals(BOARD_TAG)) {
			proxy = new Board();
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
		for (IDoc d: docs) {
			d.extract(dest);
		}
		super.extract(dest);
		dest.close();
	}
}

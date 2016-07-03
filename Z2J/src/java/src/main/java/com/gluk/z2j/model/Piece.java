package com.gluk.z2j.model;

import org.apache.xpath.XPathAPI;
import org.w3c.dom.Node;
import org.w3c.dom.traversal.NodeIterator;

import com.gluk.z2j.api.form.IForm;
import com.gluk.z2j.api.loader.IDoc;
import com.gluk.z2j.api.model.IGame;
import com.gluk.z2j.api.model.IPiece;

public class Piece extends AbstractDoc implements IPiece {

	private final static String NAME_TAG  = "name";
	private final static String MOVES_TAG = "moves";
	private final static String DROPS_TAG = "drops";

	private final static String NAME_XP   = "/piece/name/*[1]";

	private IGame game;
	private int ix;
	
	private MoveParser proxy = null;

	public Piece(IGame game, int ix) {
		this.game = game;
		this.ix = ix;
	}
	
	public Integer getIx() {
		return ix;
	}
	
	public void addMove(IForm form, String mode, boolean isDrop) throws Exception {
		game.addMove(ix, form, mode, isDrop);
	}

	public void open(String tag) throws Exception {
		if (proxy != null) {
			proxy.open(tag);
			return;
		}
		if (tag.equals(MOVES_TAG) || tag.equals(DROPS_TAG)) {
			proxy = new MoveParser(this, game, tag.equals(DROPS_TAG));
			proxy.open(tag);
			return;
		}
		super.open(tag);
	}

	public boolean close() throws Exception {
		if (proxy != null) {
			if (proxy.close()) { 
				proxy = null;
			}
			return false;
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
		NodeIterator nl = XPathAPI.selectNodeIterator(doc, NAME_XP);
		Node n;
		while ((n = nl.nextNode())!= null) {
			dest.open(NAME_TAG); dest.add(n.getLocalName()); dest.close();
		}
	}
}

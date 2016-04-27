package com.gluk.z2j.model;

import org.apache.xpath.XPathAPI;
import org.w3c.dom.Node;
import org.w3c.dom.traversal.NodeIterator;

import com.gluk.z2j.api.form.IForm;
import com.gluk.z2j.api.loader.IDoc;
import com.gluk.z2j.api.model.IGame;
import com.gluk.z2j.api.model.IPiece;

public class Piece extends AbstractDoc implements IPiece {

	private final static String PIECE_TAG = "piece";
	private final static String NAME_TAG  = "name";
	private final static String IX_TAG    = "ix";
	private final static String MOVES_TAG = "moves";
	private final static String DROPS_TAG = "drops";

	private final static String NAME_XP   = "/piece/name/a[1]";

	private IGame game;
	private int ix;
	
	private MoveParser proxy = null;

	public Piece(IGame game, int ix) {
		this.game = game;
		this.ix = ix;
	}
	
	public void addMove(IForm form, String mode) throws Exception {
		game.addMove(ix, form, mode);
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
			boolean r = proxy.close(); 
			if (r) {
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
		dest.open(PIECE_TAG);
		NodeIterator nl = XPathAPI.selectNodeIterator(doc, NAME_XP);
		Node n;
		while ((n = nl.nextNode())!= null) {
			dest.open(NAME_TAG); dest.add(n.getTextContent()); dest.close();
			dest.open(IX_TAG); dest.add(Integer.toString(ix)); dest.close();
		}
		dest.close();
	}
}

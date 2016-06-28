package com.gluk.z2j.model;

import com.gluk.z2j.api.form.IForm;
import com.gluk.z2j.api.form.IMoveParser;
import com.gluk.z2j.api.loader.IDoc;
import com.gluk.z2j.api.model.IGame;
import com.gluk.z2j.api.model.IPiece;
import com.gluk.z2j.form.AForm;
import com.gluk.z2j.form.AndForm;
import com.gluk.z2j.form.ApplyForm;
import com.gluk.z2j.form.IfForm;
import com.gluk.z2j.form.ModeForm;
import com.gluk.z2j.form.OrForm;
import com.gluk.z2j.form.SeqForm;
import com.gluk.z2j.form.WhileForm;

public class MoveParser implements IDoc, IMoveParser {
	
	private final static String MODE_TAG    = "move-type";
	private final static String IF_TAG      = "if";
	private final static String WHILE_TAG   = "while";
	private final static String AND_TAG     = "and";
	private final static String OR_TAG      = "or";
	private final static String FROM_TAG    = "from";
	private final static String L_TAG       = "l";
	private final static String A_TAG       = "a";
	
	private IGame game;
	private IPiece piece;
	private boolean isDrop;
	
	private String mode = "";
	private IForm  form = null;
	private int    deep = 0;
	
	public MoveParser(IPiece piece, IGame game, boolean isDrop) {
		this.piece  = piece;
		this.game   = game;
		this.isDrop = isDrop;
	}
	
	public IPiece getPiece() {
		return piece;
	}
	
	public String getMode() {
		return mode;
	}
	
	public void setMode(String mode) {
		this.mode = mode;
	}
	
	public boolean isNavigation(String name) {
		return game.isDirection(name) || game.isPosition(name);
	}
	
	public IForm createForm(String tag, boolean isTop) throws Exception {
		if (tag.equals(L_TAG)) {
			if (isTop) {
				IForm r = new SeqForm(this);
				if (!isDrop) {
					r.open(FROM_TAG);r.close();
				}
				return r;
			} else {
				return new ApplyForm(this); 
			}
		}
		if (tag.equals(A_TAG)) {
			return new AForm(this);
		}
		if (tag.equals(MODE_TAG)) {
			return new ModeForm(this);
		}
		if (tag.equals(IF_TAG)) {
			return new IfForm(this);
		}
		if (tag.equals(WHILE_TAG)) {
			return new WhileForm(this);
		}
		if (tag.equals(AND_TAG)) {
			return new AndForm(this);
		}
		if (tag.equals(OR_TAG)) {
			return new OrForm(this);
		}
		return new ApplyForm(tag, this);
	}

	public void open(String tag) throws Exception {
		if (deep == 0) {
			deep++;
			return;
		}
		if (form == null) {
			form = createForm(tag, true);
		}
		form.open(tag);
	}

	public boolean close() throws Exception {
		if (form == null) {
			return true;
		}
		if (form.close()) {
			form.addMove(piece, mode);
			form = null;
		}
		return false;
	}

	public void add(String s) throws Exception {
		if (form == null) {
			throw new Exception("Invalid move section");
		}
		form.add(s);
	}
}

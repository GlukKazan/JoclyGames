package com.gluk.z2j.form;

import com.gluk.z2j.api.form.IForm;
import com.gluk.z2j.api.form.IMoveParser;
import com.gluk.z2j.api.model.IPiece;

public abstract class AbstractForm implements IForm {

	protected IMoveParser parser;
	protected IForm form = null;
	
	public AbstractForm(IMoveParser parser) {
		this.parser = parser;
	}
	
	public String getName() throws Exception {
		throw new Exception("Not supported");
	}

	public void setParent(IForm parent) {}
	
	public void addMove(IPiece piece, String mode) throws Exception {
		piece.addMove(this, mode);
	}
	
	public void open(String tag) throws Exception {
		if (form != null) {
			form.open(tag);
		} else {
			form = parser.createForm(tag, false);
			form.setParent(this);
		}
	}
	
	public boolean close() throws Exception {
		if (form == null) {
			return true;
		}
		if (form.close()) {
			form.addToParent(this);
			form = null;
		}
		return false;
	}

	public void add(String s) throws Exception {
		if (form != null) {
			form.add(s);
		}
	}

	public void addToParent(IForm parent) throws Exception {
		parent.addForm(this);
	}
}

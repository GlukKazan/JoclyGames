package com.gluk.z2j.form;

import com.gluk.z2j.api.form.IForm;
import com.gluk.z2j.api.form.IMoveParser;
import com.gluk.z2j.api.model.IPiece;

public abstract class AbstractForm implements IForm {

	protected IMoveParser parser;
	protected IForm form = null;
	protected int deep = 0;
	
	public AbstractForm(IMoveParser parser) {
		this.parser = parser;
	}
	
	public void addMove(IPiece piece, String mode, boolean isDrop) throws Exception {
		piece.addMove(this, mode, isDrop);
	}
	
	public boolean close() throws Exception {
		if (form != null) {
			if (form.close()) {
				addForm(form);
				form = null;
			}
			return false;
		}
		deep--;
		return (deep == 0);
	}

	public void add(String s) throws Exception {
		if (form != null) {
			form.add(s);
		} else {
			throw new Exception("Not supported");
		}
	}

	public void addForm(IForm form) throws Exception {}

	public String getName() throws Exception {
		throw new Exception("Not supported");
	}
}

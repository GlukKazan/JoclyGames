package com.gluk.z2j.form;

import com.gluk.z2j.api.form.IForm;
import com.gluk.z2j.api.form.IMoveParser;

public abstract class AbstractForm implements IForm {

	protected IMoveParser parser;
	protected IForm form = null;
	
	public AbstractForm(IMoveParser parser) {
		this.parser = parser;
	}
	
	public void open(String tag) throws Exception {
		if (form != null) {
			form.open(tag);
		} else {
			form = parser.createForm(tag, false);
		}
	}
	
	public boolean close() throws Exception {
		if (form == null) {
			return true;
		}
		if (form.close()) {
			addForm(form);
			form = null;
		}
		return false;
	}

	public void add(String s) throws Exception {
		int ix = parser.getKnownName(s);
		IForm f;
		if (ix < 0) {
			f = new ApplyForm(s, parser);
		} else {
			f = new ParamForm(ix);
		}
		addForm(f);
	}
}

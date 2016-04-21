package com.gluk.z2j.form;

import com.gluk.z2j.api.form.IForm;
import com.gluk.z2j.api.form.IMoveParser;

public abstract class AbstractForm implements IForm {

	protected IMoveParser parser;
	protected IForm form = null;
	
	public AbstractForm(IMoveParser parser) {
		this.parser = parser;
	}
	
	public String getName() throws Exception {
		throw new Exception("Not supported");
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
		IForm f = new ApplyForm(s, parser);
		addForm(f);
	}
}

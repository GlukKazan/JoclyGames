package com.gluk.z2j.form;

import com.gluk.z2j.api.form.IForm;
import com.gluk.z2j.api.model.IMoveTemplate;

public class ParamForm implements IForm {
	
	private int value;
	
	public ParamForm(int value) {
		this.value = value;
	}

	public void open(String tag) throws Exception {
		throw new Exception("Not supported");
	}

	public boolean close() throws Exception {
		throw new Exception("Not supported");
	}

	public void add(String s) throws Exception {
		throw new Exception("Not supported");
	}

	public void addForm(IForm form) throws Exception {
		throw new Exception("Not supported");
	}

	public void generate(IMoveTemplate template) throws Exception {
		template.addCommand(PARAM_CODE, value);
	}
}

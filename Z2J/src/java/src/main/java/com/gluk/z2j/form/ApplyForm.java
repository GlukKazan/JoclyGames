package com.gluk.z2j.form;

import java.util.ArrayList;
import java.util.List;

import com.gluk.z2j.api.form.IForm;
import com.gluk.z2j.api.form.IMoveParser;
import com.gluk.z2j.api.model.IMoveTemplate;

public class ApplyForm extends AbstractForm {

	private String func;
	private List<IForm> args = new ArrayList<IForm>();
	
	public ApplyForm(String func, IMoveParser parser) {
		super(parser);
		this.func = func;
	}

	public void addForm(IForm form) {
		args.add(form);
	}

	public void generate(IMoveTemplate template) throws Exception {
		// TODO:
		
	}
}

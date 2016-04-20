package com.gluk.z2j.form;

import java.util.ArrayList;
import java.util.List;

import com.gluk.z2j.api.form.IForm;
import com.gluk.z2j.api.form.IMoveParser;
import com.gluk.z2j.api.model.IMoveTemplate;

public class SeqForm extends AbstractForm {
	
	private List<IForm> forms = new ArrayList<IForm>();
	
	public SeqForm(IMoveParser parser) {
		super(parser);
	}

	public void addForm(IForm form) {
		forms.add(form);
	}

	public void generate(IMoveTemplate template) throws Exception {
		for (IForm f: forms) {
			f.generate(template);
		}
	}
}

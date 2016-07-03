package com.gluk.z2j.form;

import java.util.ArrayList;
import java.util.List;

import com.gluk.z2j.api.form.IForm;
import com.gluk.z2j.api.form.IMoveParser;
import com.gluk.z2j.api.model.IGame;
import com.gluk.z2j.api.model.IMoveTemplate;

public class SeqForm extends AbstractForm {
	
	protected List<IForm> forms = new ArrayList<IForm>();
	
	public SeqForm(IMoveParser parser) {
		super(parser);
	}

	public SeqForm(IMoveParser parser, List<IForm> forms) {
		super(parser);
		this.forms = forms;
	}

	public void open(String tag) throws Exception {
		if (deep == 0) {
			deep++;
		} else {
			if (form == null) {
				form = parser.createForm(tag);
			}
			form.open(tag);
		}
	}
	
	public void addForm(IForm form) {
		forms.add(form);
	}

	public void generate(IMoveTemplate template, List<Integer> params, IGame game) throws Exception {
		for (IForm f: forms) {
			f.generate(template, params, game);
		}
	}
}

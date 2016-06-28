package com.gluk.z2j.form;

import java.util.ArrayList;
import java.util.List;

import com.gluk.z2j.api.form.IForm;
import com.gluk.z2j.api.form.IMoveParser;
import com.gluk.z2j.api.model.IGame;
import com.gluk.z2j.api.model.IMoveTemplate;

public class SeqForm extends AbstractForm {
	
	private List<IForm> forms = new ArrayList<IForm>();
	private int deep = 0;
	
	public SeqForm(IMoveParser parser) {
		super(parser);
	}

	public void open(String tag) throws Exception {
		if (deep == 0) {
			deep++;
		} else {
			super.open(tag);
		}
	}
	
	public boolean close() throws Exception {
		if (form == null) {
			deep--;
			return (deep == 0);
		} else {
			if (form.close()) {
				form.addToParent(this);
				form = null;
			}
			return false;
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

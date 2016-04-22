package com.gluk.z2j.form;

import java.util.List;

import com.gluk.z2j.api.form.IForm;
import com.gluk.z2j.api.form.IMoveParser;
import com.gluk.z2j.api.model.IGame;
import com.gluk.z2j.api.model.IMoveTemplate;

public class WhileForm extends AbstractForm {

	private IForm cond = null;
	private IForm body = null;
	
	public WhileForm(IMoveParser parser) {
		super(parser);
	}

	public void addForm(IForm form) throws Exception {
		if (cond == null) {
			cond = form;
			body = new SeqForm(parser);
		} else {
			body.addForm(form);
		}
	}

	public void add(String s) throws Exception {
		if (parser.isNavigation(s) && (cond == null)) {
			throw new Exception("Not supported");
		}
		super.add(s);
	}

	public void generate(IMoveTemplate template, List<Integer> params, IGame game) throws Exception {
		if ((cond == null) || (body == null)) {
			throw new Exception("Internal error");
		}
		int start = template.getOffset();
		cond.generate(template, params, game);
		template.addCommand(ZRF_FUNCTION, ZRF_NOT, "not");
		int from = template.getOffset();
		template.addCommand(ZRF_IF);
		body.generate(template, params, game);
		template.addCommand(ZRF_JUMP, start - template.getOffset(), "");
		template.fixup(from, template.getOffset() - from);
	}
}

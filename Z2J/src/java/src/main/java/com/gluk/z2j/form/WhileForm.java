package com.gluk.z2j.form;

import java.util.List;

import com.gluk.z2j.api.form.IForm;
import com.gluk.z2j.api.form.IMoveParser;
import com.gluk.z2j.api.model.IGame;
import com.gluk.z2j.api.model.IMoveTemplate;

public class WhileForm extends SeqForm {

	private IForm cond = null;
	
	public WhileForm(IMoveParser parser) {
		super(parser);
	}

	public void open(String tag) throws Exception {
		if (deep == 0) {
			deep++;
			return;
		} 
		if (form != null) {
			form.open(tag);
			return;
		}
		if (cond == null) {
			cond = new ApplyForm(tag, parser);
			cond.open(tag);
			form = cond;
			return;
		}
		super.open(tag);
	}

	public void addForm(IForm form) {
		if (form != cond) {
			super.addForm(form);
		}
	}

	public void generate(IMoveTemplate template, List<Integer> params, IGame game, int hint) throws Exception {
		if ((cond == null) || forms.isEmpty()) {
			throw new Exception("Internal error");
		}
		int start = template.getOffset();
		cond.generate(template, params, game, hint);
		template.addCommand(ZRF_FUNCTION, ZRF_NOT, "not", "FUNCTION");
		int from = template.getOffset();
		template.addCommand(ZRF_IF, "IF");
		super.generate(template, params, game, IForm.WHILE_HINT);
		template.addCommand(ZRF_JUMP, start - template.getOffset(), "", "JUMP");
		template.fixup(from, template.getOffset() - from);
	}
}

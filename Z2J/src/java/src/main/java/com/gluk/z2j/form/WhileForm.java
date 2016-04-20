package com.gluk.z2j.form;

import com.gluk.z2j.api.form.IForm;
import com.gluk.z2j.api.form.IMoveParser;
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

	public void generate(IMoveTemplate template) throws Exception {
		if ((cond == null) || (body == null)) {
			throw new Exception("Internal error");
		}
		int start = template.getOffset();
		cond.generate(template);
		template.addCommand(FUN_CODE, NOT_FUN);
		int from = template.getOffset();
		template.addCommand(IF_CODE, 0);
		body.generate(template);
		template.addCommand(JUMP_CODE, start - template.getOffset());
		template.fixup(from, template.getOffset() - from);
	}
}

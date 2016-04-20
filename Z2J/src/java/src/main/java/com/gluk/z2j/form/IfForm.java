package com.gluk.z2j.form;

import java.util.ArrayList;
import java.util.List;

import com.gluk.z2j.api.form.IForm;
import com.gluk.z2j.api.form.IMoveParser;
import com.gluk.z2j.api.model.IMoveTemplate;

public class IfForm extends AbstractForm {
	
	private final static String ELSE_TAG = "else";
	
	private IForm cond = null;
	private List<IForm> body = new ArrayList<IForm>();
	
	private IForm seq = null;

	public IfForm(IMoveParser parser) {
		super(parser);
	}

	public void addForm(IForm form) throws Exception {
		if (cond == null) {
			cond = form;
			seq = new SeqForm(parser);
			body.add(seq);
		} else {
			seq.addForm(form);
		}
	}

	public void add(String s) throws Exception {
		if (cond == null) {
			cond = new ApplyForm(s, parser);
			seq = new SeqForm(parser);
			body.add(seq);
			return;
		}
		if (s.equals(ELSE_TAG)) {
			seq = new SeqForm(parser);
			body.add(seq);
		} else {
			super.add(s);
		}
	}

	public void generate(IMoveTemplate template) throws Exception {
		if ((cond == null) || body.isEmpty() || body.size() > 2) {
			throw new Exception("Internal error");
		}
		cond.generate(template);
		template.addCommand(FUN_CODE, NOT_FUN);
		int from = template.getOffset();
		template.addCommand(IF_CODE, 0);
		body.get(0).generate(template);
		if (body.size() == 1) {
			template.fixup(from, template.getOffset() - from);
		} else {
			int offset = template.getOffset();
			template.addCommand(JUMP_CODE, 0);
			template.fixup(from, template.getOffset() - from);
			body.get(1).generate(template);
			template.fixup(offset, template.getOffset() - offset);
		}
	}
}

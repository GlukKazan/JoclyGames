package com.gluk.z2j.form;

import java.util.ArrayList;
import java.util.List;

import com.gluk.z2j.api.form.IForm;
import com.gluk.z2j.api.form.IMoveParser;
import com.gluk.z2j.api.model.IGame;
import com.gluk.z2j.api.model.IMoveTemplate;

public class IfForm extends SeqForm {
	
	private final static String ELSE_TAG = "else";
	
	private IForm cond = null;
	private List<IForm> body = new ArrayList<IForm>();

	public IfForm(IMoveParser parser) {
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
		if (tag.equals(ELSE_TAG)) {
			body.add(new SeqForm(parser, forms));
			forms = new ArrayList<IForm>();
			deep++;
			form = null;
			return;
		}
		super.open(tag);
	}
	
	public boolean close() throws Exception {
		if (super.close()) {
			body.add(new SeqForm(parser, forms));
			return true;
		}
		return false;
	}

	public void addForm(IForm form) {
		if (form != cond) {
			super.addForm(form);
		}
	}
	
	public void generate(IMoveTemplate template, List<Integer> params, IGame game, int hint) throws Exception {
		if ((cond == null) || body.isEmpty() || body.size() > 2) {
			throw new Exception("Internal error");
		}
		cond.generate(template, params, game, hint);
		template.addCommand(ZRF_FUNCTION, ZRF_NOT, "not", "FUNCTION");
		int from = template.getOffset();
		template.addCommand(ZRF_IF, "IF");
		body.get(0).generate(template, params, game, hint);
		if (body.size() == 1) {
			template.fixup(from, template.getOffset() - from);
		} else {
			int offset = template.getOffset();
			template.addCommand(ZRF_JUMP, "JUMP");
			template.fixup(from, template.getOffset() - from);
			body.get(1).generate(template, params, game, hint);
			template.fixup(offset, template.getOffset() - offset);
		}
	}
}

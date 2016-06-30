package com.gluk.z2j.form;

import java.util.ArrayList;
import java.util.List;

import com.gluk.z2j.api.form.IForm;
import com.gluk.z2j.api.form.IMoveParser;
import com.gluk.z2j.api.model.IGame;
import com.gluk.z2j.api.model.IMoveTemplate;

public class IfForm extends AbstractForm {
	
	private final static String ELSE_TAG = "else";
	
	private IForm cond = null;
	private List<IForm> body = new ArrayList<IForm>();
	
	private IForm seq = null;
	private int deep = 0;

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
	
	public void open(String tag) throws Exception {
		if (tag.equals(ELSE_TAG)) {
			seq = new SeqForm(parser);
			body.add(seq);
			deep++;
		} else {
			super.open(tag);
		}
	}

	public boolean close() throws Exception {
		if (deep > 0) {
			deep--;
			return false;
		}
		return super.close();
	}

	public void generate(IMoveTemplate template, List<Integer> params, IGame game) throws Exception {
		if ((cond == null) || body.isEmpty() || body.size() > 2) {
			throw new Exception("Internal error");
		}
		cond.generate(template, params, game);
		template.addCommand(ZRF_FUNCTION, ZRF_NOT, "not", "FUNCTION");
		int from = template.getOffset();
		template.addCommand(ZRF_IF, "IF");
		body.get(0).generate(template, params, game);
		if (body.size() == 1) {
			template.fixup(from, template.getOffset() - from);
		} else {
			int offset = template.getOffset();
			template.addCommand(ZRF_JUMP, "JUMP");
			template.fixup(from, template.getOffset() - from);
			body.get(1).generate(template, params, game);
			template.fixup(offset, template.getOffset() - offset);
		}
	}
}

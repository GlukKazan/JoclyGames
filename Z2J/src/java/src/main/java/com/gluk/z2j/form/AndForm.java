package com.gluk.z2j.form;

import java.util.ArrayList;
import java.util.List;

import com.gluk.z2j.api.form.IForm;
import com.gluk.z2j.api.form.IMoveParser;
import com.gluk.z2j.api.model.IGame;
import com.gluk.z2j.api.model.IMoveTemplate;

public class AndForm extends AbstractForm {

	private List<IForm> body = new ArrayList<IForm>();

	public AndForm(IMoveParser parser) {
		super(parser);
	}

	public void addForm(IForm form) {
		body.add(form);
	}

	public void add(String s) throws Exception {
		if (parser.isNavigation(s)) {
			throw new Exception("Not supported");
		}
		super.add(s);
	}

	public void generate(IMoveTemplate template, List<Integer> params, IGame game) throws Exception {
		if (body.isEmpty()) {
			throw new Exception("Internal error");
		}
		List<Integer> fixups = new ArrayList<Integer>();
		for (IForm f: body) {
			f.generate(template, params, game);
			template.addCommand(ZRF_FUNCTION, ZRF_NOT, "not");
			fixups.add(template.getOffset());
			template.addCommand(ZRF_IF);
		}
		template.addCommand(ZRF_LITERAL, 1, "true");
		int from = template.getOffset();
		template.addCommand(ZRF_JUMP);
		for (Integer o: fixups) {
			template.fixup(o, template.getOffset() - o);
		}
		template.addCommand(ZRF_LITERAL, 0, "false");
		template.fixup(from, template.getOffset() - from);
	}
}
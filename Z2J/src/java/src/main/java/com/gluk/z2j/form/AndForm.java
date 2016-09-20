package com.gluk.z2j.form;

import java.util.ArrayList;
import java.util.List;

import com.gluk.z2j.api.form.IForm;
import com.gluk.z2j.api.form.IMoveParser;
import com.gluk.z2j.api.model.IGame;
import com.gluk.z2j.api.model.IMoveTemplate;

public class AndForm extends SeqForm {

	public AndForm(IMoveParser parser) {
		super(parser);
	}

	public void generate(IMoveTemplate template, List<Integer> params, IGame game, int hint) throws Exception {
		if (forms.isEmpty()) {
			throw new Exception("Internal error");
		}
		List<Integer> fixups = new ArrayList<Integer>();
		for (IForm f: forms) {
			f.generate(template, params, game, hint);
			template.addCommand(ZRF_FUNCTION, ZRF_NOT, "not", "FUNCTION");
			fixups.add(template.getOffset());
			template.addCommand(ZRF_IF, "IF");
		}
		template.addCommand(ZRF_LITERAL, 1, "true", "LITERAL");
		int from = template.getOffset();
		template.addCommand(ZRF_JUMP, "JUMP");
		for (Integer o: fixups) {
			template.fixup(o, template.getOffset() - o);
		}
		template.addCommand(ZRF_LITERAL, 0, "false", "LITERAL");
		template.fixup(from, template.getOffset() - from);
	}
}

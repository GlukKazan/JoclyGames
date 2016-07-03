package com.gluk.z2j.form;

import java.util.ArrayList;
import java.util.List;

import com.gluk.z2j.api.form.IForm;
import com.gluk.z2j.api.form.IMoveParser;
import com.gluk.z2j.api.model.IGame;
import com.gluk.z2j.api.model.IMoveTemplate;

public class OrForm extends SeqForm  {

	public OrForm(IMoveParser parser) {
		super(parser);
	}

	public void generate(IMoveTemplate template, List<Integer> params, IGame game) throws Exception {
		if (forms.isEmpty()) {
			throw new Exception("Internal error");
		}
		List<Integer> fixups = new ArrayList<Integer>();
		for (IForm f: forms) {
			f.generate(template, params, game);
			fixups.add(template.getOffset());
			template.addCommand(ZRF_IF, "IF");
		}
		template.addCommand(ZRF_LITERAL, 0, "false", "LITERAL");
		int from = template.getOffset();
		template.addCommand(ZRF_JUMP, "JUMP");
		for (Integer o: fixups) {
			template.fixup(o, template.getOffset() - o);
		}
		template.addCommand(ZRF_LITERAL, 1, "true", "LITERAL");
		template.fixup(from, template.getOffset() - from);
	}
}

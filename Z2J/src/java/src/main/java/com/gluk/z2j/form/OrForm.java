package com.gluk.z2j.form;

import java.util.ArrayList;
import java.util.List;

import com.gluk.z2j.api.form.IForm;
import com.gluk.z2j.api.form.IMoveParser;
import com.gluk.z2j.api.model.IMoveTemplate;

public class OrForm extends AbstractForm  {

	private List<IForm> body = new ArrayList<IForm>();

	public OrForm(IMoveParser parser) {
		super(parser);
	}

	public void addForm(IForm form) {
		body.add(form);
	}

	public void generate(IMoveTemplate template) throws Exception {
		if (body.isEmpty()) {
			throw new Exception("Internal error");
		}
		List<Integer> fixups = new ArrayList<Integer>();
		for (IForm f: body) {
			f.generate(template);
			fixups.add(template.getOffset());
			template.addCommand(IF_CODE, 0);
		}
		template.addCommand(LITERAL_CODE, 0);
		int from = template.getOffset();
		template.addCommand(JUMP_CODE, 0);
		for (Integer o: fixups) {
			template.fixup(o, template.getOffset() - o);
		}
		template.addCommand(LITERAL_CODE, 1);
		template.fixup(from, template.getOffset() - from);
	}
}

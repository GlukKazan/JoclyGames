package com.gluk.z2j.form;

import java.util.List;

import com.gluk.z2j.api.form.IForm;
import com.gluk.z2j.api.form.IMoveParser;
import com.gluk.z2j.api.model.IGame;
import com.gluk.z2j.api.model.IMoveTemplate;

public class ModeForm implements IForm {

	IMoveParser parser;
	
	public ModeForm(IMoveParser parser) {
		this.parser = parser;
	}

	public void open(String tag) throws Exception {
		throw new Exception("Not supported");
	}

	public boolean close() throws Exception {
		return true;
	}

	public void add(String s) throws Exception {
		parser.setMode(s);
	}

	public void addForm(IForm form) throws Exception {
		throw new Exception("Not supported");
	}

	public void generate(IMoveTemplate template, List<Integer> params, IGame game) throws Exception {
		throw new Exception("Not supported");
	}

	public String getName() throws Exception {
		throw new Exception("Not supported");
	}
}

package com.gluk.z2j.form;

import java.util.List;

import com.gluk.z2j.api.form.IForm;
import com.gluk.z2j.api.form.IMoveParser;
import com.gluk.z2j.api.model.IGame;
import com.gluk.z2j.api.model.IMoveTemplate;
import com.gluk.z2j.api.model.IPiece;

public class ModeForm implements IForm {

	private IMoveParser parser;
	private int deep = 0;
	
	public ModeForm(IMoveParser parser) {
		this.parser = parser;
	}

	public void open(String tag) throws Exception {
		if (deep > 1) {
			throw new Exception("Not supported");
		}
		if (deep == 1) {
			parser.setMode(tag);
		}
		deep++;
	}

	public boolean close() throws Exception {
		deep--;
		return (deep == 0);
	}

	public void add(String s) throws Exception {
		throw new Exception("Not supported");
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

	public void addMove(IPiece piece, String mode, boolean isDrop) throws Exception {}

	public void setParent(IForm parent) {}

	public void addToParent(IForm parent) throws Exception {}
}

package com.gluk.z2j.form;

import java.util.List;

import com.gluk.z2j.api.form.IForm;
import com.gluk.z2j.api.form.IMoveParser;
import com.gluk.z2j.api.model.IGame;
import com.gluk.z2j.api.model.IMoveTemplate;
import com.gluk.z2j.api.model.IPiece;

public class AForm implements IForm {

	private IForm parent = null;
	
	public AForm(IMoveParser parser) {}
	
	public void setParent(IForm parent) {
		this.parent = parent;
	}

	public void open(String tag) throws Exception {
		throw new Exception("Not supported");
	}

	public boolean close() throws Exception {
		return true;
	}

	public void add(String s) throws Exception {
		if (parent != null) {
			parent.add(s);
		}
	}

	public void addMove(IPiece piece, String mode) throws Exception {}

	public void addForm(IForm form) throws Exception {}

	public void generate(IMoveTemplate template, List<Integer> params, IGame game) throws Exception {}

	public String getName() throws Exception {
		throw new Exception("Not supported");
	}

	public void addToParent(IForm parent) throws Exception {}
}

package com.gluk.z2j.api.form;

import java.util.List;

import com.gluk.z2j.api.loader.IDoc;
import com.gluk.z2j.api.model.IGame;
import com.gluk.z2j.api.model.IMoveTemplate;
import com.gluk.z2j.api.model.IPiece;

public interface IForm extends IDoc, IConst {
	String getName() throws Exception;
	void addMove(IPiece piece, String mode, boolean isDrop) throws Exception;
	void addForm(IForm form) throws Exception;
	void generate(IMoveTemplate template, List<Integer> params, IGame game, int hint) throws Exception;
}

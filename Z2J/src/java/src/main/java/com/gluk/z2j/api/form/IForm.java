package com.gluk.z2j.api.form;

import com.gluk.z2j.api.loader.IDoc;
import com.gluk.z2j.api.model.IMoveTemplate;

public interface IForm extends IDoc {
	
	final static int JUMP_CODE    = 0;
	final static int IF_CODE      = 1;
	final static int FUN_CODE     = 3;
	final static int PARAM_CODE   = 13;
	final static int LITERAL_CODE = 14;
	
	final static int NOT_FUN      = 0;
	
	void addForm(IForm form) throws Exception;
	void generate(IMoveTemplate template) throws Exception;
}

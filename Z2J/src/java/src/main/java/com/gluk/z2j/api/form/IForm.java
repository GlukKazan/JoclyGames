package com.gluk.z2j.api.form;

import java.util.List;

import com.gluk.z2j.api.loader.IDoc;
import com.gluk.z2j.api.model.IGame;
import com.gluk.z2j.api.model.IMoveTemplate;

public interface IForm extends IDoc {
	
	final static int ZRF_JUMP      = 0;
	final static int ZRF_IF        = 1;
	final static int ZRF_FORK      = 2;
	final static int ZRF_FUNCTION  = 3;
	final static int ZRF_IN_ZONE   = 4;
	final static int ZRF_PROMOTE   = 11;
	final static int ZRF_MODE      = 12;
	final static int ZRF_PARAM     = 13;
	final static int ZRF_LITERAL   = 14;
	final static int ZRF_SET_POS   = 16;
	final static int ZRF_NAVIGATE  = 18;
	final static int ZRF_FROM      = 19;
	final static int ZRF_TO        = 20;
	final static int ZRF_END       = 23;
	
	final static int ZRF_NOT       = 0;
	final static int ZRF_IS_EMPTY  = 1;
	final static int ZRF_IS_ENEMY  = 2;
	final static int ZRF_IS_FRIEND = 3;
	final static int ZRF_IS_LAST   = 4;
	final static int ZRF_MARK      = 5;
	final static int ZRF_BACK      = 6;
	final static int ZRF_PUSH      = 7;
	final static int ZRF_POP       = 8;
	
	void addForm(IForm form) throws Exception;
	void generate(IMoveTemplate template, List<Integer> params, IGame game) throws Exception;
	String getName() throws Exception;
}

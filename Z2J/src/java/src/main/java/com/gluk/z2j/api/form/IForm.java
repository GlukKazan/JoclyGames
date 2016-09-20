package com.gluk.z2j.api.form;

import java.util.List;

import com.gluk.z2j.api.loader.IDoc;
import com.gluk.z2j.api.model.IGame;
import com.gluk.z2j.api.model.IMoveTemplate;
import com.gluk.z2j.api.model.IPiece;

public interface IForm extends IDoc {
	
	final static int ZRF_JUMP      = 0;
	final static int ZRF_IF        = 1;
	final static int ZRF_FORK      = 2;
	final static int ZRF_FUNCTION  = 3;
	final static int ZRF_IN_ZONE   = 4;
	final static int ZRF_GET_FLAG  = 5;
	final static int ZRF_SET_FLAG  = 6;
	final static int ZRF_GET_PFLAG = 7;
	final static int ZRF_SET_PFLAG = 8;
	final static int ZRF_GET_ATTR  = 9;
	final static int ZRF_SET_ATTR  = 10;
	final static int ZRF_PROMOTE   = 11;
	final static int ZRF_MODE      = 12;
	final static int ZRF_ON_BOARDD = 13;
	final static int ZRF_ON_BOARDP = 14;
	final static int ZRF_PARAM     = 15;
	final static int ZRF_LITERAL   = 16;
	final static int ZRF_VERIFY    = 20;
	final static int ZRF_SET_POS   = 21;
	final static int ZRF_NAVIGATE  = 22;
	final static int ZRF_OPPOSITE  = 23;
	final static int ZRF_FROM      = 24;
	final static int ZRF_TO        = 25;
	final static int ZRF_CAPTURE   = 26;
	final static int ZRF_FLIP      = 27;
	final static int ZRF_END       = 28;
	
	final static int ZRF_NOT       = 0;
	final static int ZRF_IS_EMPTY  = 1;
	final static int ZRF_IS_ENEMY  = 2;
	final static int ZRF_IS_FRIEND = 3;
	final static int ZRF_IS_LASTF  = 4;
	final static int ZRF_IS_LASTT  = 5;
	final static int ZRF_MARK      = 6;
	final static int ZRF_BACK      = 7;
	final static int ZRF_PUSH      = 8;
	final static int ZRF_POP       = 9;
	
	final static int NO_HINT       = 0;
	final static int WHILE_HINT    = 1;
	final static int LAST_HINT     = 2;
	
	String getName() throws Exception;
	void addMove(IPiece piece, String mode, boolean isDrop) throws Exception;
	void addForm(IForm form) throws Exception;
	void generate(IMoveTemplate template, List<Integer> params, IGame game, int hint) throws Exception;
}

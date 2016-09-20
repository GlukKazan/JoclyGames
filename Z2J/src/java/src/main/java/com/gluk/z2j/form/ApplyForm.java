package com.gluk.z2j.form;

import java.util.List;

import com.gluk.z2j.api.form.IForm;
import com.gluk.z2j.api.form.IMoveParser;
import com.gluk.z2j.api.model.IGame;
import com.gluk.z2j.api.model.IMoveTemplate;

public class ApplyForm extends SeqForm {
	
	private final static String L_TAG      = "z2j-l";
	private final static String A_TAG      = "z2j-a";
	
	private final static String FALSE      = "false";
	private final static String TRUE       = "true";
	private final static String FLAG       = "flag?";
	private final static String NOT_FLAG   = "not-flag?";
	private final static String SET_FLAG   = "set-flag";
	private final static String PFLAG      = "position-flag?";
	private final static String NOT_PFLAG  = "not-position-flag?";
	private final static String SET_PFLAG  = "set-position-flag";
	private final static String SET_ATTR   = "set-attribute";
	private final static String ADD        = "add";
	private final static String ADD_PART   = "add-partial";
	private final static String FROM       = "from";
	private final static String TO         = "to";
	private final static String CASCADE    = "cascade";
	private final static String EMPTY      = "empty?";
	private final static String NOT_EMPTY  = "not-empty?";
	private final static String ENEMY      = "enemy?";
	private final static String NOT_ENEMY  = "not-enemy?";
	private final static String FRIEND     = "friend?";
	private final static String NOT_FRIEND = "not-friend?";
	private final static String LASTF      = "last-from?";
	private final static String NOT_LASTF  = "not-last-from?";
	private final static String LASTT      = "last-to?";
	private final static String NOT_LASTT  = "not-last-to?";
	private final static String MARK       = "mark";
	private final static String BACK       = "back";
	private final static String ZONE       = "in-zone?";
	private final static String NOT_ZONE   = "not-in-zone?";
	private final static String ON_BOARD   = "on-board?";
	private final static String NOT_BOARD  = "not-on-board?";
	private final static String CAPTURE    = "capture";
	private final static String FLIP       = "flip";
	private final static String CHG_OWN    = "change-owner";
	private final static String OPPOSITE   = "opposite";
	private final static String VERIFY     = "verify";
	
	private final static int FROM_FLAG     = 0x01;

	private String func = "";
	
	public ApplyForm(String func, IMoveParser parser) {
		super(parser);
		this.func = func;
	}

	public ApplyForm(IMoveParser parser) {
		super(parser);
	}

	public String getName() throws Exception {
		return func;
	}
	
	public void open(String tag) throws Exception {
		if (deep == 0) {
			deep++;
			return;
		}
		if (form != null) {
			form.open(tag);
			return;
		}
		if (tag.equals(A_TAG)) {
			if (func.equals(L_TAG)) {
				deep++;
			} else {
				form = new ApplyForm(tag, parser);
				form.open("");
			}
			return;
		}
		super.open(tag);
	}

	public void add(String s) throws Exception {
		if (form != null) {
			form.add(s);
		} else {
			func = s;
		}
	}

	public void addForm(IForm form) {
		forms.add(form);
	}
	
	private boolean flags(IMoveTemplate template, List<Integer> params, IGame game) throws Exception {
		if (func.equals(SET_FLAG) || func.equals(SET_PFLAG) || func.equals(SET_ATTR)) {
			if (forms.size() != 2) {
				throw new Exception("Not supported");
			}
			String name = forms.get(0).getName();
			int ix = game.getNameIndex(name);
			forms.get(1).generate(template, params, game, IForm.NO_HINT);
			if (func.equals(SET_FLAG)) {
				template.addCommand(ZRF_SET_FLAG, ix, name, "SET_FLAG");
			}
			if (func.equals(SET_PFLAG)) {
				template.addCommand(ZRF_SET_PFLAG, ix, name, "SET_POS_FLAG");
			}
			if (func.equals(SET_ATTR)) {
				template.addCommand(ZRF_SET_ATTR, ix, name, "SET_POS_ATTR");
			}
			return true;
		}
		if (func.equals(FLAG) || func.equals(NOT_FLAG)) {
			if (forms.size() != 1) {
				throw new Exception("Not supported");
			}
			String name = forms.get(0).getName();
			int ix = game.getNameIndex(name);
			template.addCommand(ZRF_GET_FLAG, ix, name, "FLAG");
			if (func.equals(NOT_FLAG)) {
				template.addCommand(ZRF_FUNCTION, ZRF_NOT, "not", "FUNCTION");
			}
			return true;
		}
		if (func.equals(PFLAG) || func.equals(NOT_PFLAG)) {
			if (forms.isEmpty() || (forms.size() > 2)) {
				throw new Exception("Not supported");
			}
			if (forms.size() == 2) {
				template.addCommand(ZRF_PUSH, "PUSH");
				forms.get(1).generate(template, params, game, IForm.NO_HINT);
			}
			String name = forms.get(0).getName();
			int ix = game.getNameIndex(name);
			template.addCommand(ZRF_GET_PFLAG, ix, name, "POS_FLAG");
			if (func.equals(NOT_PFLAG)) {
				template.addCommand(ZRF_FUNCTION, ZRF_NOT, "not", "FUNCTION");
			}
			if (forms.size() == 2) {
				template.addCommand(ZRF_POP, "POP");
			}
			return true;
		}
		if (func.equals(FALSE)) {
			template.addCommand(ZRF_PARAM, params.size(), "false", "PARAM");
			params.add(0);
			return true;
		}
		if (func.equals(TRUE)) {
			template.addCommand(ZRF_PARAM, params.size(), "true", "PARAM");
			params.add(1);
			return true;
		}
		return false;
	}

	private boolean end(IMoveTemplate template, List<Integer> params, IGame game, int hint) throws Exception {
		if (func.equals(ADD)) {
			int offset = template.getOffset();
			if (hint != IForm.LAST_HINT) {
				template.addCommand(ZRF_FORK, "FORK");
			}
			int o = template.getOffset();
			for (int i = 0; i < forms.size(); i++) {
				if (hint != IForm.LAST_HINT) {
					if (i > 0) {
						template.fixup(o, template.getOffset() - o);
					}
					if (i < forms.size() - 1) {
						o = template.getOffset();
						template.addCommand(ZRF_FORK, "FORK");
					}
				}
				String name = forms.get(i).getName();
				int ix = game.getNameIndex(name);
				if (ix < 0) {
					throw new Exception("Piece [" + name + "] unknown");
				}
				template.addCommand(ZRF_PROMOTE, ix, name, "PROMOTE");
				if (hint != IForm.LAST_HINT) {
					if (i < forms.size() - 1) {
						template.addCommand(ZRF_FUNCTION, ZRF_END, "end", "FUNCTION");
					}
				}
			}
			if (game.checkFlag(FROM_FLAG)) {
				template.addCommand(ZRF_FUNCTION, ZRF_TO, "to", "FUNCTION");
			}
			if (hint != IForm.LAST_HINT) {
				template.addCommand(ZRF_FUNCTION, ZRF_END, "end", "FUNCTION");
				template.fixup(offset, template.getOffset() - offset);
			}
			return true;
		}
		if (func.equals(ADD_PART)) {
			if (forms.isEmpty() || (forms.size() > 2)) {
				throw new Exception("Not supported");
			}
			int offset = template.getOffset();
			if (hint != IForm.LAST_HINT) {
				template.addCommand(ZRF_FORK, "FORK");
			}
			if (forms.size() > 1) {
				String name = forms.get(0).getName();
				int ix = game.getNameIndex(name);
				if (ix < 0) {
					throw new Exception("Piece [" + name + "] unknown");
				}
				template.addCommand(ZRF_PROMOTE, ix, name, "PROMOTE");
				name = forms.get(1).getName();
				ix = game.getNameIndex(name);
				if (ix < 0) {
					throw new Exception("Mode [" + name + "] unknown");
				}
				template.addCommand(ZRF_MODE, ix, name, "MODE");
			} else {
				String name = forms.get(0).getName();
				int ix = game.getNameIndex(name);
				if (ix < 0) {
					throw new Exception("Mode [" + name + "] unknown");
				}
				template.addCommand(ZRF_MODE, ix, name, "MODE");
			}
			if (game.checkFlag(FROM_FLAG)) {
				template.addCommand(ZRF_FUNCTION, ZRF_TO, "to", "FUNCTION");
			}
			if (hint != IForm.LAST_HINT) {
				template.addCommand(ZRF_FUNCTION, ZRF_END, "end", "FUNCTION");
				template.fixup(offset, template.getOffset() - offset);
			}
			return true;
		}
		if (func.equals(FROM)) {
			template.addCommand(ZRF_FUNCTION, ZRF_FROM, "from", "FUNCTION");
			game.setFlag(FROM_FLAG, 1);
			return true;
		}
		if (func.equals(TO)) {
			if (game.checkFlag(FROM_FLAG)) {
				template.addCommand(ZRF_FUNCTION, ZRF_TO, "to", "FUNCTION");
				game.setFlag(FROM_FLAG, 0);
			}
			return true;
		}
		if (func.equals(CASCADE)) {
			if (game.checkFlag(FROM_FLAG)) {
				template.addCommand(ZRF_FUNCTION, ZRF_TO, "to", "FUNCTION");
			}
			template.addCommand(ZRF_FUNCTION, ZRF_FROM, "from", "FUNCTION");
			game.setFlag(FROM_FLAG, 1);
			return true;
		}
		return false;
	}
	
	private boolean navigate(IMoveTemplate template, List<Integer> params, IGame game) throws Exception {
		if (func.equals(ON_BOARD) || func.equals(NOT_BOARD)) {
			if (forms.size() != 1) {
				throw new Exception("Not supported");
			}
			String name = forms.get(0).getName();
			int ix = game.getNameIndex(name);
			if (game.isDirection(name)) {
				template.addCommand(ZRF_ON_BOARDD, ix, "name", "ON_BOARD_DIR");
			} else {
				template.addCommand(ZRF_ON_BOARDP, ix, "name", "ON_BOARD_POS");
			}
			if (func.equals(NOT_BOARD)) {
				template.addCommand(ZRF_FUNCTION, ZRF_NOT, "not", "FUNCTION");
			}
			return true;
		}
		if (func.equals(OPPOSITE)) {
			if (forms.size() != 1) {
				throw new Exception("Not supported");
			}
			String name = forms.get(0).getName();
			int ix = game.getNameIndex(name);
			if (!game.isDirection(name)) {
				throw new Exception("Not direction [" + name + "]");
			}
			template.addCommand(ZRF_PARAM, params.size(), "$" + Integer.toString(params.size() + 1), "PARAM");
			params.add(ix);
			template.addCommand(ZRF_FUNCTION, ZRF_OPPOSITE, "opposite", "FUNCTION");
			template.addCommand(ZRF_FUNCTION, ZRF_NAVIGATE, "navigate", "FUNCTION");
			return true;
		}
		int ix = game.getNameIndex(func);
		if (ix >= 0) {
			if (!forms.isEmpty()) {
				return false;
			}
			if (game.isAttribute(func)) {
				template.addCommand(ZRF_GET_ATTR, ix, func, "ATTR");
				return true;
			}
			template.addCommand(ZRF_PARAM, params.size(), "$" + Integer.toString(params.size() + 1), "PARAM");
			params.add(ix);
			if (game.isDirection(func)) {
				template.addCommand(ZRF_FUNCTION, ZRF_NAVIGATE, "navigate", "FUNCTION");
			}
			if (game.isPosition(func)) {
				template.addCommand(ZRF_FUNCTION, ZRF_SET_POS, "position", "FUNCTION");
			}
			return true;
		}
		return false;
	}
	
	private boolean state(IMoveTemplate template, List<Integer> params, IGame game) throws Exception {
		if (func.equals(EMPTY) || func.equals(NOT_EMPTY) || func.equals(ENEMY) || func.equals(NOT_ENEMY) || 
			func.equals(FRIEND) || func.equals(NOT_FRIEND) || func.equals(LASTF) || func.equals(NOT_LASTF) || 
			func.equals(LASTT) || func.equals(NOT_LASTT) || func.equals(CAPTURE) || func.equals(FLIP) || func.equals(CHG_OWN)) {
			if (forms.size() > 1) {
				throw new Exception("Not supported");
			}
			if (!forms.isEmpty()) {
				template.addCommand(ZRF_PUSH, "PUSH");
				forms.get(0).generate(template, params, game, IForm.NO_HINT);
			}
			if (func.equals(EMPTY) || func.equals(NOT_EMPTY)) {
				template.addCommand(ZRF_FUNCTION, ZRF_IS_EMPTY, "empty?", "FUNCTION");
			}
			if (func.equals(ENEMY) || func.equals(NOT_ENEMY)) {
				template.addCommand(ZRF_FUNCTION, ZRF_IS_ENEMY, "enemy?", "FUNCTION");
			}
			if (func.equals(FRIEND) || func.equals(NOT_FRIEND)) {
				template.addCommand(ZRF_FUNCTION, ZRF_IS_FRIEND, "friend?", "FUNCTION");
			}
			if (func.equals(LASTF) || func.equals(NOT_LASTF)) {
				template.addCommand(ZRF_FUNCTION, ZRF_IS_LASTF, "last-from?", "FUNCTION");
			}
			if (func.equals(LASTT) || func.equals(NOT_LASTT)) {
				template.addCommand(ZRF_FUNCTION, ZRF_IS_LASTT, "last-to?", "FUNCTION");
			}
			if (func.equals(NOT_EMPTY) || func.equals(NOT_ENEMY) || func.equals(NOT_FRIEND) || func.equals(NOT_LASTF) || func.equals(NOT_LASTT)) {
				template.addCommand(ZRF_FUNCTION, ZRF_NOT, "not", "FUNCTION");
			}
			if (func.equals(CAPTURE)) {
				template.addCommand(ZRF_FUNCTION, ZRF_CAPTURE, "capture", "FUNCTION");
			}
			if (func.equals(FLIP) || func.equals(CHG_OWN)) {
				template.addCommand(ZRF_FUNCTION, ZRF_FLIP, "flip", "FUNCTION");
			}
			if (!forms.isEmpty()) {
				template.addCommand(ZRF_POP, "POP");
			}
			return true;
		}
		return false;
	}
	
	private boolean other(IMoveTemplate template, List<Integer> params, IGame game) throws Exception {
		if (func.equals(VERIFY)) {
			for (IForm f: forms) {
				f.generate(template, params, game, IForm.NO_HINT);
			}
			template.addCommand(ZRF_FUNCTION, ZRF_VERIFY, "verify", "FUNCTION");
			return true;
		}
		if (func.equals(MARK)) {
			template.addCommand(ZRF_FUNCTION, ZRF_MARK, "mark", "FUNCTION");
			return true;
		}
		if (func.equals(BACK)) {
			template.addCommand(ZRF_FUNCTION, ZRF_BACK, "back", "FUNCTION");
			return true;
		}
		return false;
	}

	private boolean zone(IMoveTemplate template, List<Integer> params, IGame game) throws Exception {
		if (func.equals(ZONE) || func.equals(NOT_ZONE)) {
			if ((forms.size() > 2) || forms.isEmpty()) {
				throw new Exception("Not supported");
			}
			if (forms.size() == 2) {
				template.addCommand(ZRF_PUSH, "PUSH");
				forms.get(1).generate(template, params, game, IForm.NO_HINT);
			}
			String name = forms.get(0).getName();
			int ix = game.getNameIndex(name);
			if (ix < 0) {
				throw new Exception("Zone [" + name + "] unknown");
			}
			template.addCommand(ZRF_IN_ZONE, ix, name, "IN_ZONE");
			if (func.equals(NOT_ZONE)) {
				template.addCommand(ZRF_FUNCTION, ZRF_NOT, "not", "FUNCTION");
			}
			if (forms.size() == 2) {
				template.addCommand(ZRF_POP, "POP");
			}
			return true;
		}
		return false;
	}
	
	public void generate(IMoveTemplate template, List<Integer> params, IGame game, int hint) throws Exception {
		if (state(template, params, game))     return;
		if (other(template, params, game))     return;
		if (zone(template, params, game))      return;
		if (flags(template, params, game))     return;
		if (end(template, params, game, hint)) return;
		if (navigate(template, params, game))  return;
		throw new Exception("Function [" + func + "] unknown");
	}
}

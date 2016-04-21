package com.gluk.z2j.form;

import java.util.ArrayList;
import java.util.List;

import com.gluk.z2j.api.form.IForm;
import com.gluk.z2j.api.form.IMoveParser;
import com.gluk.z2j.api.model.IGame;
import com.gluk.z2j.api.model.IMoveTemplate;

public class ApplyForm extends AbstractForm {
	
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
	private final static String LAST       = "last-from?";
	private final static String NOT_LAST   = "not-last-from?";
	private final static String MARK       = "mark";
	private final static String BACK       = "back";
	private final static String ZONE       = "in-zone?";
	private final static String NOT_ZONE   = "not-in-zone?";
	
	private final static int FROM_FLAG     = 0x01;

	private String func;
	private List<IForm> args = new ArrayList<IForm>();
	
	public ApplyForm(String func, IMoveParser parser) {
		super(parser);
		this.func = func;
	}

	public void addForm(IForm form) {
		args.add(form);
	}

	public String getName() throws Exception {
		return func;
	}
	
	private boolean end(IMoveTemplate template, List<Integer> params, IGame game) throws Exception {
		if (func.equals(ADD)) {
			int offset = template.getOffset();
			template.addCommand(ZRF_FORK);
			int o = template.getOffset();
			for (int i = 0; i < args.size(); i++) {
				if (i > 0) {
					template.fixup(o, template.getOffset() - o);
				}
				if (i < args.size() - 1) {
					o = template.getOffset();
					template.addCommand(ZRF_FORK);
				}
				String name = args.get(i).getName();
				int ix = game.getNameIndex(name);
				if (ix < 0) {
					throw new Exception("Piece [" + name + "] unknown");
				}
				template.addCommand(ZRF_PROMOTE, ix);
				if (i < args.size() - 1) {
					template.addCommand(ZRF_END);
				}
			}
			if (game.checkFlag(FROM_FLAG)) {
				template.addCommand(ZRF_TO);
			}
			template.addCommand(ZRF_END);
			template.fixup(offset, template.getOffset() - offset);
			return true;
		}
		if (func.equals(ADD_PART)) {
			if (args.isEmpty() || (args.size() > 2)) {
				throw new Exception("Not supported");
			}
			int offset = template.getOffset();
			template.addCommand(ZRF_FORK);
			if (args.size() > 1) {
				String name = args.get(0).getName();
				int ix = game.getNameIndex(name);
				if (ix < 0) {
					throw new Exception("Piece [" + name + "] unknown");
				}
				template.addCommand(ZRF_PROMOTE, ix);
				name = args.get(1).getName();
				ix = game.getNameIndex(name);
				if (ix < 0) {
					throw new Exception("Mode [" + name + "] unknown");
				}
				template.addCommand(ZRF_MODE, ix);
			} else {
				String name = args.get(0).getName();
				int ix = game.getNameIndex(name);
				if (ix < 0) {
					throw new Exception("Mode [" + name + "] unknown");
				}
				template.addCommand(ZRF_MODE, ix);
			}
			if (game.checkFlag(FROM_FLAG)) {
				template.addCommand(ZRF_TO);
			}
			template.addCommand(ZRF_END);
			template.fixup(offset, template.getOffset() - offset);
			return true;
		}
		if (func.equals(FROM)) {
			template.addCommand(ZRF_FROM);
			game.setFlag(FROM_FLAG, 1);
			return true;
		}
		if (func.equals(TO)) {
			if (game.checkFlag(FROM_FLAG)) {
				template.addCommand(ZRF_TO);
				game.setFlag(FROM_FLAG, 0);
			}
			return true;
		}
		if (func.equals(CASCADE)) {
			if (game.checkFlag(FROM_FLAG)) {
				template.addCommand(ZRF_TO);
			}
			template.addCommand(ZRF_FROM);
			game.setFlag(FROM_FLAG, 1);
			return true;
		}
		return false;
	}
	
	private boolean navigate(IMoveTemplate template, List<Integer> params, IGame game) throws Exception {
		int ix = game.getNameIndex(func);
		if (ix >= 0) {
			if (!args.isEmpty()) {
				throw new Exception("Not supported");
			}
			template.addCommand(ZRF_PARAM, ix);
			params.add(ix);
			if (game.isDirection(func) || game.isPosition(func)) {
				if (game.isDirection(func)) {
					template.addCommand(ZRF_NAVIGATE);
				} else {
					template.addCommand(ZRF_SET_POS);
				}
			}
			return true;
		}
		return false;
	}
	
	private boolean state(IMoveTemplate template, List<Integer> params, IGame game) throws Exception {
		if (func.equals(EMPTY) || func.equals(NOT_EMPTY) || func.equals(ENEMY) || func.equals(NOT_ENEMY) || 
			func.equals(FRIEND) || func.equals(NOT_FRIEND) || func.equals(LAST) || func.equals(NOT_LAST)) {
			if (args.size() > 1) {
				throw new Exception("Not supported");
			}
			if (!args.isEmpty()) {
				template.addCommand(ZRF_PUSH);
				args.get(0).generate(template, params, game);
			}
			if (func.equals(EMPTY) || func.equals(NOT_EMPTY)) {
				template.addCommand(ZRF_FUNCTION, ZRF_IS_EMPTY);
			}
			if (func.equals(ENEMY) || func.equals(NOT_ENEMY)) {
				template.addCommand(ZRF_FUNCTION, ZRF_IS_ENEMY);
			}
			if (func.equals(FRIEND) || func.equals(NOT_FRIEND)) {
				template.addCommand(ZRF_FUNCTION, ZRF_IS_FRIEND);
			}
			if (func.equals(LAST) || func.equals(NOT_LAST)) {
				template.addCommand(ZRF_FUNCTION, ZRF_IS_LAST);
			}
			if (func.equals(NOT_EMPTY) || func.equals(NOT_ENEMY) || func.equals(NOT_FRIEND) || func.equals(NOT_LAST)) {
				template.addCommand(ZRF_FUNCTION, ZRF_NOT);
			}
			if (!args.isEmpty()) {
				template.addCommand(ZRF_POP);
			}
			return true;
		}
		return false;
	}
	
	private boolean mark(IMoveTemplate template, List<Integer> params, IGame game) throws Exception {
		if (func.equals(MARK)) {
			template.addCommand(ZRF_FUNCTION, ZRF_MARK);
			return true;
		}
		if (func.equals(BACK)) {
			template.addCommand(ZRF_FUNCTION, ZRF_BACK);
			return true;
		}
		return false;
	}

	private boolean zone(IMoveTemplate template, List<Integer> params, IGame game) throws Exception {
		if (func.equals(ZONE) || func.equals(NOT_ZONE)) {
			if ((args.size() > 2) || args.isEmpty()) {
				throw new Exception("Not supported");
			}
			if (args.size() == 2) {
				template.addCommand(ZRF_PUSH);
				args.get(1).generate(template, params, game);
			}
			int ix = game.getNameIndex(args.get(0).getName());
			if (ix < 0) {
				throw new Exception("Zone [" + args.get(0).getName() + "] unknown");
			}
			template.addCommand(ZRF_IN_ZONE, ix);
			if (func.equals(NOT_ZONE)) {
				template.addCommand(ZRF_FUNCTION, ZRF_NOT);
			}
			if (args.size() == 2) {
				template.addCommand(ZRF_POP);
			}
			return true;
		}
		return false;
	}
	
	public void generate(IMoveTemplate template, List<Integer> params, IGame game) throws Exception {
		if (navigate(template, params, game)) return;
		if (state(template, params, game)) return;
		if (mark(template, params, game)) return;
		if (zone(template, params, game)) return;
		if (end(template, params, game)) return;
		throw new Exception("Function [" + func + "] unknown");
	}
}

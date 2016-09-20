package com.gluk.z2j.model;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.xpath.XPathAPI;
import org.w3c.dom.Node;
import org.w3c.dom.traversal.NodeIterator;

import com.gluk.z2j.api.form.IForm;
import com.gluk.z2j.api.loader.IDoc;
import com.gluk.z2j.api.model.IGame;

public class Game extends AbstractDoc implements IGame {
	
	private final static String    GAME_TAG  = "game";
	private final static String    BOARD_TAG = "board";
	private final static String      POS_TAG = "pos";
	private final static String  PLAYERS_TAG = "players";
	private final static String    PIECE_TAG = "piece";
	private final static String     MODE_TAG = "mode";
	private final static String     NAME_TAG = "name";
	private final static String    PRIOR_TAG = "is_mandatory";
	private final static String    SETUP_TAG = "board-setup";
	private final static String      OFF_TAG = "off";
	private final static String     MOVE_TAG = "move";
	private final static String     DROP_TAG = "drop";
	private final static String TEMPLATE_TAG = "template";
	private final static String    PARAM_TAG = "param";
 	private final static String      CMD_TAG = "c";
 	private final static String        D_TAG = "d";
 	private final static String        I_TAG = "i";
 	private final static String        P_TAG = "p";
 	private final static String        N_TAG = "n";

	private final static String   TITLE_XP   = "/game/title | /game/description";
	private final static String PLAYERS_XP   = "/game/turn-order/*";
	private final static String  PRIORS_XP   = "/game/move-priorities/*";
	private final static String   MODES_XP   = "/game/piece/*/move-type/*";
	private final static String   ATTRS_XP   = "/game/piece/attribute/*[1]";
	private final static String  PIECES_XP   = "/game/piece";
	private final static String   SETUP_XP   = "/game/board-setup/*";
	
	private final static String       A_XP   = "z2j-a";
	private final static String     ALL_XP   = "*";
	
	private AbstractDoc               proxy  = null;
	private Map<String, Integer>    players  = new HashMap<String, Integer>();
	private List<String>              modes  = new ArrayList<String>();
	private List<MoveTemplate>    templates  = new ArrayList<MoveTemplate>();
	private Map<Integer, List<Move>>  moves  = new HashMap<Integer, List<Move>>();
	private Map<String, Integer>      names  = new HashMap<String, Integer>();
	private Map<String, Integer>      attrs  = new HashMap<String, Integer>();
	
	private int flags;
	private int priorities = 0;
	private Board board = null;
	private String name;
	
	public Game(String name) {
		int pos = name.indexOf('.');
		if (pos >= 0) {
			this.name = name.substring(0, pos);
		} else {
			this.name = name;
		}
	}

	private String getValue(Node doc, String xp) throws Exception {
		Node n;
		NodeIterator nl = XPathAPI.selectNodeIterator(doc, xp);
		if ((n = nl.nextNode())!= null) {
			String r = n.getLocalName();
			if (r.equals(A_XP)) {
				r = n.getTextContent();
			}
			return r;
		}
		return "";
	}

	public Collection<String> getPlayers() {
		return players.keySet();
	}

	public boolean isPlayer(String name) {
		return players.containsKey(name);
	}

	public boolean isAttribute(String name) {
		return attrs.containsKey(name);
	}

	public boolean isMode(String name) {
		return modes.contains(name);
	}

	public boolean isPosition(String name) {
		if (board != null) {
			return (board.getPosition(name) >= 0);
		}
		return false;
	}

	public boolean isDirection(String name) {
		if (board != null) {
			return (board.getDirection(name) >= 0);
		}
		return false;
	}

	public int getNameIndex(String name) {
		if (isPosition(name)) {
			return board.getPosition(name);
		}
		if (isDirection(name)) {
			return board.getDirection(name);
		}
		if (isAttribute(name)) {
			return attrs.get(name);
		}
		if (isPlayer(name)) {
			return players.get(name);
		}
		if (isMode(name)) {
			return modes.indexOf(name);
		}
		Integer r = names.get(name);
		if (r == null) {
			r = names.size();
			names.put(name, r);
		}
		return r;
	}

	public boolean checkFlag(int flag) {
		return (flag & flags) != 0;
	}

	public void setFlag(int flag, int value) {
		if (value != 0) {
			flags |= flag;
		} else {
			flags &= ~flag;
		}
	}

	public void open(String tag) throws Exception {
		if (proxy != null) {
			proxy.open(tag);
			return;
		}
		if (tag.equals(BOARD_TAG)) {
			if (board != null) {
				throw new Exception("Board redefined");
			}
			board = new Board(this);
			proxy = board;
			proxy.open(tag);
			return;
		}
		super.open(tag);
	}

	public boolean close() throws Exception {
		if (proxy != null) {
			boolean r = proxy.close(); 
			if (r) {
				proxy = null;
			}
			return false;
		}
		return super.close();
	}

	public void add(String s) throws Exception {
		if (proxy != null) {
			proxy.add(s);
		} else {
			super.add(s);
		}
	}

	private int addTemplate(MoveTemplate template) {
		for (int i = templates.size() - 1; i >= 0; i--) {
			if (template.isEqual(templates.get(i))) {
				return i;
			}
		}
		templates.add(template);
		return templates.size() - 1;
	}
	
	public int addMode(String mode) {
		for (int i = 0; i < modes.size(); i++) {
			if (modes.get(i).equals(mode)) {
				return i;
			}
		}
		modes.add(mode);
		return modes.size() - 1;
	}
	
	public void addMove(int piece, IForm form, String mode, boolean isDrop) throws Exception {
		flags = 0;
		List<Integer> params = new ArrayList<Integer>();
		MoveTemplate template = new MoveTemplate();
		form.generate(template, params, this, IForm.NO_HINT);
		int tx = addTemplate(template);
		int mx = addMode(mode);
		List<Move> ml = moves.get(piece);
		if (ml == null) {
			ml = new ArrayList<Move>();
			moves.put(piece, ml);
		}
		ml.add(new Move(tx, params, mx, isDrop));
	}
	
	private void extractPlayers(IDoc dest) throws Exception {
		dest.open(PLAYERS_TAG);
		NodeIterator nl = XPathAPI.selectNodeIterator(doc, PLAYERS_XP);
		Node n;
		for (int i = 0; (n = nl.nextNode())!= null; i++) {
			if (i > 1) {
				throw new Exception("Not Supported");
			}
			if (i == 0) {
				players.put(n.getLocalName(), 1);
			} else {
				players.put(n.getLocalName(), -1);
			}
			dest.open(NAME_TAG);dest.add(n.getLocalName()); dest.close();
		}
		if (players.size() != 2) {
			throw new Exception("Not Supported");
		}
		dest.close();
	}
	
	private void extractModes(IDoc dest) throws Exception {
		NodeIterator nl = XPathAPI.selectNodeIterator(doc, PRIORS_XP);
		Node n;
		while ((n = nl.nextNode())!= null) {
			addMode(n.getLocalName());
		}
		priorities = modes.size();
		nl = XPathAPI.selectNodeIterator(doc, MODES_XP);
		while ((n = nl.nextNode())!= null) {
			addMode(n.getLocalName());
		}
		for (int i = 0; i < modes.size(); i++) {
			dest.open(MODE_TAG);
			dest.open(NAME_TAG); dest.add(modes.get(i)); dest.close();
			if (i < priorities) {
				dest.open(PRIOR_TAG); dest.close();
			}
			dest.close();
		}
	}
	
	private void extractTiltle(IDoc dest) throws Exception {
		dest.open(NAME_TAG);dest.add(name);dest.close();
		NodeIterator nl = XPathAPI.selectNodeIterator(doc, TITLE_XP);
		Node n;
		while ((n = nl.nextNode())!= null) {
			String value = getValue(n, A_XP);
			dest.open(n.getLocalName());dest.add(value);dest.close();
		}
	}
	
	private void extractSetup(IDoc dest) throws Exception {
		boolean f = false;
		NodeIterator nl = XPathAPI.selectNodeIterator(doc, SETUP_XP);
		Node n;
		while ((n = nl.nextNode())!= null) {
			if (!f) {
				dest.open(SETUP_TAG);
				f = true;
			}
			dest.open(n.getLocalName());
			NodeIterator al = XPathAPI.selectNodeIterator(n, ALL_XP);
			Node a;
			while ((a = al.nextNode())!= null) {
				dest.open(a.getLocalName());
				NodeIterator pl = XPathAPI.selectNodeIterator(a, ALL_XP);
				Node p;
				while ((p = pl.nextNode())!= null) {
					String pos = p.getLocalName();
					if (pos.equals(OFF_TAG)) break;
					dest.open(POS_TAG); dest.add(pos); dest.close();
				}
				dest.close();
			}
			dest.close();
		}
		if (f) {
			dest.close();
		}
	}
	
	private void extractAttrs() throws Exception {
		NodeIterator nl = XPathAPI.selectNodeIterator(doc, ATTRS_XP);
		Node n;
		while ((n = nl.nextNode())!= null) {
			String name = n.getLocalName();
			Integer r = attrs.get(name);
			if (r == null) {
				r = attrs.size();
				attrs.put(name, r);
			}
		}
	}

	private void extractPieces(IDoc dest) throws Exception {
		NodeIterator nl = XPathAPI.selectNodeIterator(doc, PIECES_XP);
		Node n;
		for (int i = 0; (n = nl.nextNode())!= null; i++) {
			Piece p = new Piece(this, i);
			p.open(PIECE_TAG);
			extract(p, n);
			p.close();
			dest.open(PIECE_TAG);
			p.extract(dest);
			List<Move> ml = moves.get(p.getIx());
			if (ml != null) {
				for (Move m: ml) {
					if (m.isDrop()) {
						dest.open(DROP_TAG);
					} else {
						dest.open(MOVE_TAG);
					}
					dest.open(MODE_TAG); dest.add(m.getMode().toString()); dest.close();
					dest.open(TEMPLATE_TAG); dest.add(m.getTemplate().toString()); dest.close();
					for (Integer v: m.getParams()) {
						dest.open(PARAM_TAG); dest.add(v.toString()); dest.close();
					}
					dest.close();
				}
			}
			dest.close();
		}
	}
	
	private void extractTemplates(IDoc dest) throws Exception {
		Integer ix = 0;
		for (MoveTemplate t: templates) {
			dest.open(TEMPLATE_TAG);
			for (Command c: t.getCommands()) {
				dest.open(CMD_TAG);
				dest.open(D_TAG); dest.add(c.getDesc()); dest.close();
				dest.open(I_TAG); dest.add(c.getCode().toString()); dest.close();
				dest.open(P_TAG); dest.add(c.getParam().toString()); dest.close();
				dest.open(N_TAG); dest.add(c.getName()); dest.close();
				dest.close();
			}
			dest.close();
			ix++;
		}
	}
	
	public void extract(IDoc dest) throws Exception {
		dest.open(GAME_TAG);
		if (board == null) {
			throw new Exception("Board undefined");
		}
		extractTiltle(dest);
		extractPlayers(dest);
		board.extract(dest);
		extractModes(dest);
		extractAttrs();
		extractPieces(dest);
		extractTemplates(dest);
		extractSetup(dest);
		dest.close();
	}
}

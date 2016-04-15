package com.gluk.z2j.lib;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.gluk.z2j.api.IBoard;
import com.gluk.z2j.api.IDoc;
import com.gluk.z2j.api.IGame;

public class Board extends AbstractDoc implements IBoard {
	
	private final static String BOARD_TAG  = "board";
	private final static String PLAYER_TAG = "player";
	private final static String POS_TAG    = "pos";
	private final static String NAME_TAG   = "name";
	private final static String DIR_TAG    = "dir";
	private final static String ZONE_TAG   = "zone";
	
	private List<String> posl  = new ArrayList<String>();
	private List<String> dirl  = new ArrayList<String>();
	private List<String> zonel = new ArrayList<String>();
	
	private Map<String, Integer> poss = new HashMap<String, Integer>();
	private Map<String, Integer> dirs = new HashMap<String, Integer>();
	private Map<String, Map<String, String>> links = new HashMap<String, Map<String, String>>();
	private Map<String, Map<String, String>> syms = new HashMap<String, Map<String, String>>();
	private Map<String, Map<String, List<String>>> zones = new HashMap<String, Map<String, List<String>>>();
	
	private IGame game;
	
	public Board(IGame game) {
		this.game = game;
	}
	
	public boolean isDefined(String pos) {
		return poss.containsKey(pos);
	}

	private void extractZones(IDoc dest) throws Exception {
		for (String zone: zonel) {
			dest.open(ZONE_TAG);
			dest.open(NAME_TAG); dest.add(zone); dest.close();
			Map<String, List<String>> players = zones.get(zone);
			if (players != null) {
				for (String player: players.keySet()) {
					dest.open(PLAYER_TAG);
					dest.open(NAME_TAG); dest.add(player); dest.close();
					List<String> l = players.get(player);
					if (l != null) {
						for (String pos: l) {
							if (!poss.containsKey(pos)) {
								throw new Exception("Internal error");
							}
							dest.open(POS_TAG); dest.add(poss.get(pos).toString()); dest.close();
						}
					}
					dest.close();
				}
			}
			dest.close();
		}
	}
	
	public void addZone(String name, String player, String pos)	throws Exception {
		Map<String, List<String>> z = zones.get(name);
		if (z == null) {
			z = new HashMap<String, List<String>>();
			zones.put(name, z);
			zonel.add(name);
		}
		List<String> l = z.get(player);
		if (l == null) {
			l = new ArrayList<String>();
			z.put(player, l);
		}
		if (l.contains(pos)) {
			throw new Exception("Zone [" + name + "] already contains Position [" + pos + "] for Player [" + player + "]");
		}
		l.add(pos);
	}

	public void addZone(String name, String pos) throws Exception {
		for (String player: game.getPlayers()) {
			addZone(name, player, pos);
		}
	}

	private void extractPositions(IDoc dest) throws Exception {
		for (String src: posl) {
			dest.open(POS_TAG);
			dest.open(NAME_TAG); dest.add(src); dest.close();
			if (!poss.containsKey(src)) {
				throw new Exception("Internal error");
			}
			int s = poss.get(src);
			for (String dir: dirl) {
				dest.open(DIR_TAG);
				Map<String, String> l = links.get(src);
				if (l != null) {
					String dst = l.get(dir);
					if (dst != null) {
						if (!poss.containsKey(dst)) {
							throw new Exception("Internal error");
						}
						int delta = poss.get(dst) - s;
						dest.add(Integer.toString(delta));
					}
				}
				dest.close();
			}
			dest.close();
		}
	}
	
	public void addSym(String player, String from, String to) throws Exception {
		Map<String, String> l = syms.get(player);
		if (l == null) {
			l = new HashMap<String, String>();
			syms.put(player, l);
		}
		if (l.containsKey(from)) {
			throw new Exception("Symmetry [" + from + "] for Player [" + player + "] already exists");
		}
		l.put(from, to);
	}
	
	private Integer getOpposite(String name) {
		for (String d: dirs.keySet()) {
			boolean isOpposite = true;
			for (String src: links.keySet()) {
				Map<String, String> l = links.get(src);
				if (l.containsKey(name)) {
					String dst = l.get(name);
					Map<String, String> b = links.get(dst);
					if ((b == null) || !b.containsKey(d) || !b.get(d).equals(src)) {
						isOpposite = false;
						break;
					}
				}
			}
			if (isOpposite) {
				return dirs.get(d);
			}
		}
		return null;
	}
	
	private void extractOpposite(IDoc dest) throws Exception {
		dest.open(PLAYER_TAG);
		dest.open(NAME_TAG);dest.close();
		for (String dir: dirl) {
			Integer o = getOpposite(dir);
			dest.open(DIR_TAG);
			if (o != null) {
				dest.add(o.toString());
			}
			dest.close();
		}
		dest.close();
	}
	
	private void extractSyms(IDoc dest) throws Exception {
		dest.open(PLAYER_TAG);
		for (String player: syms.keySet()) {
			dest.open(NAME_TAG);dest.add(player);dest.close();
			Map<String, String> l = syms.get(player);
			for (String from: dirl) {
				dest.open(DIR_TAG);
				String to = l.get(from);
				if (to != null) {
					Integer n = dirs.get(to);
					if (n == null) {
						throw new Exception("Internal error");
					}
					dest.add(n.toString());
				}
				dest.close();
			}
		}
		dest.close();
	}	

	public void addPos(String name) throws Exception {
		if (poss.containsKey(name)) {
			throw new Exception("Position [" + name + "] already exists");
		}
		Integer n = poss.size();
		poss.put(name, n);
		posl.add(name);
	}

	public void delPos(String name) throws Exception {
		links.remove(name);
		for (Map<String, String> l: links.values()) {
			for (String dir: l.keySet()) {
				String pos = l.get(dir);
				if (pos.equals(name)) {
					l.remove(dir);
					break;
				}
			}
		}
	}

	public void addLink(String name, String from, String to) throws Exception {
		if (!dirs.containsKey(name)) {
			int n = dirs.size();
			dirs.put(name, n);
			dirl.add(name);
		}
		Map<String, String> l = links.get(from);
		if (l == null) {
			l = new HashMap<String, String>();
			links.put(from, l);
		}
		if (l.containsKey(name)) {
			throw new Exception("Link [" + name + "] from Position [" + from + "] already exists");
		}
		l.put(name, to);
	}

	public void delLink(String name, String from) throws Exception {
		Map<String, String> l = links.get(from);
		if (l != null) {
			l.remove(name);
		}
	}
	
	public void extract(IDoc dest) throws Exception {
		dest.open(BOARD_TAG);
		extractOpposite(dest);
		extractSyms(dest);
		extractPositions(dest);
		extractZones(dest);
		dest.close();
	}
}

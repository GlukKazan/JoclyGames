package com.gluk.z2j.model;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.xml.xpath.XPathExpression;

import org.apache.xpath.XPathAPI;
import org.w3c.dom.Node;
import org.w3c.dom.traversal.NodeIterator;

import com.gluk.z2j.api.loader.IDoc;
import com.gluk.z2j.api.model.IBoard;
import com.gluk.z2j.api.model.IGame;

public class Board extends AbstractDoc implements IBoard {
	
	private final static String BOARD_TAG  = "board";
	private final static String GRID_TAG   = "grid";
	private final static String PLAYER_TAG = "player";
	private final static String POS_TAG    = "pos";
	private final static String NAME_TAG   = "name";
	private final static String DIR_TAG    = "dir";
	private final static String ZONE_TAG   = "zone";
	
	private final static String POS_XP     = "/board/positions/a";
	private final static String DUMMY_XP   = "/board/dummy/a";
	private final static String KILL_XP    = "/board/kill-positions/a";
	private final static String LINK_XP    = "/board/links";
	private final static String SYMS_XP    = "/board/symmetry";
	private final static String ZONE_XP    = "/board/zone";
	private final static String HEAD_XP    = "/a[1]";
	private final static String TAIL_XP    = "/*[position()>1]";
	private final static String NAME_XP    = "/name/a";
	private final static String PLAYER_XP  = "/players/a";
	private final static String ZPOS_XP    = "/positions/a";

	private List<String> posl  = new ArrayList<String>();
	private List<String> dirl  = new ArrayList<String>();
	private List<String> zonel = new ArrayList<String>();
	
	private Map<String, Integer> poss = new HashMap<String, Integer>();
	private Map<String, Integer> dirs = new HashMap<String, Integer>();
	private Map<String, Map<String, String>> links = new HashMap<String, Map<String, String>>();
	private Map<String, Map<String, String>> syms = new HashMap<String, Map<String, String>>();
	private Map<String, Map<String, List<String>>> zones = new HashMap<String, Map<String, List<String>>>();
	
	private IGame game;
	private Grid proxy = null;
	private XpeFactory xf = new XpeFactory();
	
	public Board(IGame game) {
		this.game = game;
	}
	
	public int getPosition(String pos) {
		Integer r = poss.get(pos);
		if (r == null) {
			return -1;
		}
		return r;
	}

	public int getDirection(String dir) {
		Integer r = dirs.get(dir);
		if (r == null) {
			return -1;
		}
		return r;
	}

	public void open(String tag) throws Exception {
		if (proxy != null) {
			proxy.open(tag);
			return;
		}
		if (tag.equals(GRID_TAG)) {
			proxy = new Grid(this);
			proxy.open(tag);
			return;
		}
		super.open(tag);
	}

	public boolean close() throws Exception {
		if (proxy != null) {
			boolean r = proxy.close(); 
			if (r) {
				proxy.extract();
				proxy = null;
			}
			return r;
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
					} else {
						dest.add("");
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
	
	private void getPositions() throws Exception {
		NodeIterator nl = XPathAPI.selectNodeIterator(doc, POS_XP);
		Node n;
		while ((n = nl.nextNode())!= null) {
			addPos(n.getTextContent());
		}
		nl = XPathAPI.selectNodeIterator(doc, DUMMY_XP);
		while ((n = nl.nextNode())!= null) {
			addPos(n.getTextContent());
		}
		nl = XPathAPI.selectNodeIterator(doc, KILL_XP);
		while ((n = nl.nextNode())!= null) {
			delPos(n.getTextContent());
		}
	}
	
	private void getLinks() throws Exception {
		NodeIterator nl = XPathAPI.selectNodeIterator(doc, LINK_XP);
		Node n;
		while ((n = nl.nextNode())!= null) {
			XPathExpression xe = xf.getXpe(HEAD_XP);
			String name = xe.evaluate(n);
			NodeIterator tl = XPathAPI.selectNodeIterator(n, TAIL_XP);
			Node t;
			while ((t = tl.nextNode())!= null) {
				String from = t.getLocalName();
				String to = xe.evaluate(t);
				addLink(name, from, to);
			}
		}
		// TODO: unlink
		
	}
	
	private void getSyms() throws Exception {
		NodeIterator nl = XPathAPI.selectNodeIterator(doc, SYMS_XP);
		Node n;
		while ((n = nl.nextNode())!= null) {
			XPathExpression xe = xf.getXpe(HEAD_XP);
			String player = xe.evaluate(n);
			NodeIterator tl = XPathAPI.selectNodeIterator(n, TAIL_XP);
			Node t;
			while ((t = tl.nextNode())!= null) {
				String from = t.getLocalName();
				String to = xe.evaluate(t);
				addSym(player, from, to);
			}
		}
	}
	
	private void getZones() throws Exception {
		NodeIterator nl = XPathAPI.selectNodeIterator(doc, ZONE_XP);
		Node n;
		while ((n = nl.nextNode())!= null) {
			NodeIterator ml = XPathAPI.selectNodeIterator(n, NAME_XP);
			Node m;
			while ((m = ml.nextNode())!= null) {
				String name = m.getTextContent();
				NodeIterator pl = XPathAPI.selectNodeIterator(n, PLAYER_XP);
				Node p;
				while ((p = pl.nextNode())!= null) {
					String player = p.getTextContent();
					NodeIterator zl = XPathAPI.selectNodeIterator(n, ZPOS_XP);
					Node z;
					while ((z = zl.nextNode())!= null) {
						String pos = z.getTextContent();
						addZone(name, player, pos);
					}
				}
			}
		}
	}
	
	public void extract(IDoc dest) throws Exception {
		getPositions();
		getLinks();
		getSyms();
		getZones();
		dest.open(BOARD_TAG);
		extractOpposite(dest);
		extractSyms(dest);
		extractPositions(dest);
		extractZones(dest);
		dest.close();
	}
}

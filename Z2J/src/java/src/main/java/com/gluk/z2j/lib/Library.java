package com.gluk.z2j.lib;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathExpression;
import javax.xml.xpath.XPathFactory;

import org.apache.xpath.XPathAPI;
import org.w3c.dom.Node;
import org.w3c.dom.traversal.NodeIterator;

import com.gluk.z2j.api.IDoc;
import com.gluk.z2j.api.IEnvironment;
import com.gluk.z2j.api.ILibrary;

public class Library implements ILibrary {
	
	private final static String DEFINE_TAG  = "define";
	private final static String GAME_TAG    = "game";
	private final static String VAR_TAG     = "variant";
	private final static String DEFAULT_TAG = "default";
	
	private final static String ATOM_XP     = "/l/a";
	private final static String HEAD_XP     = "/l/a[1]";
	private final static String NAME_XP     = "/l/a[2]";
	private final static String TAIL_XP     = "/l/*[position() > 1]";
	private final static String MACRO_XP    = "/l/*[position() > 2]";
	private final static String NM_XP       = "l[a/text() = \'name\']";

	Map<String, Node> macro = new HashMap<String, Node>();
	List<Node> games = new ArrayList<Node>();
	Map<String, XPathExpression> xpe = new HashMap<String, XPathExpression>();

    private XPathExpression getXpe(String xp) throws Exception {
    	XPathExpression r = xpe.get(xp);
    	if (r == null) {
			XPathFactory xpathFactory = XPathFactory.newInstance();
			XPath xpath = xpathFactory.newXPath();
			r = xpath.compile(HEAD_XP);
			xpe.put(xp, r);
    	}
    	return r;
    }
	
	public String getHead(Node doc) throws Exception {
		return getXpe(HEAD_XP).evaluate(doc);
	}
	
	private String getName(Node doc) throws Exception {
		return getXpe(NAME_XP).evaluate(doc);
	}
	
	public NodeIterator getTail(Node doc) throws Exception {
		return XPathAPI.selectNodeIterator(doc, TAIL_XP);
	}

	public void add(Node doc) throws Exception {
		String t = getHead(doc); 
		if (t.equals(DEFINE_TAG)) {
			macro.put(getName(doc), doc);
			return;
		}
		if (t.equals(GAME_TAG) || t.equals(VAR_TAG)) {
			games.add(doc);
		}
	}

	public Node getDefault() throws Exception {
		for (Node r: games) {
			NodeIterator nl = XPathAPI.selectNodeIterator(r, ATOM_XP);
			Node n;
			while ((n = nl.nextNode())!= null) {
				if (n.getTextContent().equals(DEFAULT_TAG)) {
					return r;
				}
			}
		}
		if (games.size() > 0) {
			return games.get(0);
		}
		throw new Exception("Game not found");
	}

	public Node getGame() throws Exception {
		for (Node r: games) {
			String h = getHead(r);
			if (h.equals(GAME_TAG)) {
				return r;
			}
		}
		throw new Exception("Game not found");
	}
	
	private String getSign(Node doc) throws Exception {
		Node n;
		StringBuffer sb = new StringBuffer();
		sb.append(getHead(doc));
		NodeIterator nl = XPathAPI.selectNodeIterator(doc, NM_XP);
		if ((n = nl.nextNode())!= null) {
			sb.append("/");
			sb.append(getName(n));
		}
		return sb.toString();
	}

	public void extract(Node doc, IDoc dest, IEnvironment env) throws Exception {
		Node n;
		NodeIterator nl;
		String h = getHead(doc);
		Node m = macro.get(h);
		if (m != null) {
			Environment e = new Environment(env);
			nl = XPathAPI.selectNodeIterator(doc, TAIL_XP);
			while ((n = nl.nextNode())!= null) {
				if (n.getLocalName().equals("l")) {
					throw new Exception("Syntax error");
				}
				String s = n.getTextContent();
				e.addValue(env.getValue(s));
			}
			extract(m, dest, e);
			return;
		}
		if (h.equals(DEFINE_TAG)) {
			nl = XPathAPI.selectNodeIterator(doc, MACRO_XP);
		} else {
			nl = XPathAPI.selectNodeIterator(doc, TAIL_XP);
			dest.open(h);
		}
		while ((n = nl.nextNode())!= null) {
			String t = n.getLocalName(); 
			if (t.equals("l")) {
				extract(n, dest, env);
			} else {
				String s = n.getTextContent();
				dest.add(env.getValue(s));
			}
		}
		if (!h.equals(DEFINE_TAG)) {
			dest.close();
		}
	}
	
	public void extract(IDoc dest, Node doc) throws Exception {
		Node n;
		Set<String> nodes = new HashSet<String>();
		String h = getHead(doc);
		NodeIterator nl = XPathAPI.selectNodeIterator(doc, TAIL_XP);
		while ((n = nl.nextNode())!= null) {
			String t = n.getLocalName(); 
			if (!t.equals("l")) {
				throw new Exception("Syntax error");
			}
			String sign = getSign(n);
			nodes.add(sign);
			extract(n, dest, null);
		}
		if (h.equals(VAR_TAG)) {
			Node game = getGame();
			nl = XPathAPI.selectNodeIterator(game, TAIL_XP);
			while ((n = nl.nextNode())!= null) {
				String t = n.getLocalName();
				if (!t.equals("l")) {
					throw new Exception("Syntax error");
				}
				String sign = getSign(n);
				if (!nodes.contains(sign)) {
					extract(n, dest, null);
				}
			}
		}
	}

	public void extract(IDoc dest) throws Exception {
		extract(dest, getDefault());
	}
}

package com.gluk.z2j.loader;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathExpression;
import javax.xml.xpath.XPathFactory;

import org.apache.xpath.XPathAPI;
import org.w3c.dom.Node;
import org.w3c.dom.traversal.NodeIterator;

import com.gluk.z2j.api.ILibrary;

public class Library implements ILibrary {
	
	private final static String DEFINE_TAG = "define";
	private final static String GAME_TAG   = "game";
	private final static String VAR_TAG    = "variant";
	
	private final static String HEAD_XP    = "/l/a[1]";
	private final static String NAME_XP    = "/l/a[2]";
	private final static String TAIL_XP    = "/l/a[position()>1]";

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
	
	public NodeIterator getTail(Node doc) throws Exception {
		return XPathAPI.selectNodeIterator(doc, TAIL_XP);
	}

	public void add(Node doc) throws Exception {
		String t = getHead(doc); 
		if (t.equals(DEFINE_TAG)) {
			macro.put(getXpe(NAME_XP).evaluate(doc), doc);
			return;
		}
		if (t.equals(GAME_TAG) || t.equals(VAR_TAG)) {
			games.add(doc);
		}
	}
}

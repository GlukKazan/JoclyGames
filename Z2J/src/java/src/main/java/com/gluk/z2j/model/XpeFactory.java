package com.gluk.z2j.model;

import java.util.HashMap;
import java.util.Map;

import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathExpression;
import javax.xml.xpath.XPathFactory;

public class XpeFactory {

	Map<String, XPathExpression> xpe = new HashMap<String, XPathExpression>();

	protected XPathExpression getXpe(String xp) throws Exception {
    	XPathExpression r = xpe.get(xp);
    	if (r == null) {
			XPathFactory xpathFactory = XPathFactory.newInstance();
			XPath xpath = xpathFactory.newXPath();
			r = xpath.compile(xp);
			xpe.put(xp, r);
    	}
    	return r;
    }
}

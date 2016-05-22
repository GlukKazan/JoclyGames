package com.gluk.z2j.model;

import java.util.Stack;

import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.transform.Result;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMResult;
import javax.xml.transform.sax.SAXSource;
import javax.xml.transform.sax.SAXTransformerFactory;
import javax.xml.transform.sax.TransformerHandler;

import org.apache.xpath.XPathAPI;
import org.w3c.dom.Node;
import org.w3c.dom.traversal.NodeIterator;
import org.xml.sax.helpers.AttributesImpl;

import com.gluk.z2j.api.loader.IDoc;
import com.gluk.z2j.api.model.ISource;

public abstract class AbstractDoc implements IDoc, ISource {
	
	private final static String ATOM_TAG = "a";

	private final static String ALL_XP   = "/*";
	
	protected Node doc = null;
    protected TransformerHandler handler = null;
    
    private Stack<String> tags = new Stack<String>();
    
    protected void init() throws Exception {
		TransformerFactory tf = TransformerFactory.newInstance();
		if (tf.getFeature(SAXSource.FEATURE) && tf.getFeature(DOMResult.FEATURE)) {
			SAXTransformerFactory stf = (SAXTransformerFactory)tf;
			handler = stf.newTransformerHandler();
			DocumentBuilderFactory df = DocumentBuilderFactory.newInstance();
			doc = df.newDocumentBuilder().newDocument();
			Result out = new DOMResult(doc);
			handler.setResult(out);
		} else {
			throw new Exception("Feature unsupported");
		}
    }

	public void open(String tag) throws Exception {
		if (tags.isEmpty()) {
			init();
			handler.startDocument();
		}
		handler.startElement("", tag, tag, new AttributesImpl());
		tags.push(tag);
	}

	public boolean close() throws Exception {
		if ((handler == null) || (tags.isEmpty())) {
			throw new Exception("Internal error");
		}
		String tag = tags.pop();
		handler.endElement("", tag, tag);
		if (tags.isEmpty()) {
			handler.endDocument();
			handler = null;
			return true;
		}
		return false;
	}

	public void add(String s) throws Exception {
		if (handler == null) {
			throw new Exception("Internal error");
		}
		handler.startElement("", ATOM_TAG, ATOM_TAG, new AttributesImpl());
		handler.characters(s.toCharArray(), 0, s.length());
		handler.endElement("", ATOM_TAG, ATOM_TAG);
	}

	protected void extract(IDoc dest, Node d) throws Exception {
		Node n;
		NodeIterator nl = XPathAPI.selectNodeIterator(d, ALL_XP);
		while ((n = nl.nextNode())!= null) {
			String t = n.getLocalName();
			if (t.equals(ATOM_TAG)) {
				dest.add(n.getTextContent());
			} else {
				extract(dest, n);
			}
		}
	}

	public void extract(IDoc dest) throws Exception {
		Node n;
		NodeIterator nl = XPathAPI.selectNodeIterator(doc, ALL_XP);
		while ((n = nl.nextNode())!= null) {
			String t = n.getLocalName();
			if (t.equals(ATOM_TAG)) {
				dest.add(n.getTextContent());
			} else {
				dest.open(n.getLocalName());
				extract(dest, n);
				dest.close();
			}
		}
	}
}
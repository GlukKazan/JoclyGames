package com.gluk.z2j.app;

import java.io.File;
import java.io.InputStream;

import javax.xml.transform.Result;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.sax.SAXResult;
import javax.xml.transform.sax.SAXSource;
import javax.xml.transform.sax.SAXTransformerFactory;
import javax.xml.transform.sax.TransformerHandler;
import javax.xml.transform.stream.StreamResult;
import javax.xml.transform.stream.StreamSource;

import com.gluk.z2j.model.AbstractDoc;

public class Transformer extends AbstractDoc {

	private String name;
	private String template;
	
	public Transformer(String dir, String name, String template) {
		this.template = template;
		StringBuffer sb = new StringBuffer();
		sb.append(dir);
		sb.append("/");
		int ix = name.lastIndexOf('.');
		if (ix > 0) {
			sb.append(name.substring(0, ix));
		} else {
			sb.append(name);
		}
		sb.append(".js");
		this.name = sb.toString();
	}

	public TransformerHandler getHandler() throws Exception {
		init();
		return handler;
	}

    protected void init() throws Exception {
		TransformerFactory tf = TransformerFactory.newInstance();
		if (tf.getFeature(SAXSource.FEATURE) && tf.getFeature(SAXResult.FEATURE)) {
	        SAXTransformerFactory stf = (SAXTransformerFactory)tf;
	        InputStream t = Serializer.class.getResourceAsStream("/xslt/" + template); 
	        handler = stf.newTransformerHandler(new StreamSource(t));
            Result result = new StreamResult(new File(name));
            handler.setResult(result);
		} else {
			throw new Exception("Feature unsupported");
		}
    }
}

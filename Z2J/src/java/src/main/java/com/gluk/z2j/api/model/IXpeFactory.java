package com.gluk.z2j.api.model;

import javax.xml.xpath.XPathExpression;

public interface IXpeFactory {
	XPathExpression getXpe(String xp) throws Exception;
}

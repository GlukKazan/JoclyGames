package com.gluk.z2j.loader;

import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.Charset;

import com.gluk.z2j.api.IScaner;

public class Loader {
	
	private IScaner scaner;
	
	public Loader(IScaner scaner) {
		this.scaner = scaner;
	}
	
	public void load(String name) throws Exception {
        BufferedReader reader = null;
        try {
            reader = new BufferedReader(
                        new InputStreamReader(
                            new FileInputStream(name), Charset.forName("WINDOWS-1251")));
            String line;
            while ((line = reader.readLine()) != null) {
            	for (Character c: line.toCharArray()) {
            		scaner.scan(c);
            	}
            }
        } catch (IOException e) {
            throw new Exception(e.toString(), e);
        } finally {
            if (reader != null) {
                try {
                    reader.close();
                } catch (IOException e) {
                    throw new Exception(e.toString(), e);
                }
            }
        }
	}
}

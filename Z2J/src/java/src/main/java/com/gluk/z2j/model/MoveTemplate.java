package com.gluk.z2j.model;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import com.gluk.z2j.api.model.IMoveTemplate;

public class MoveTemplate implements IMoveTemplate {
	
	private List<Command> commands = new ArrayList<Command>();
	
	public Collection<Command> getCommands() {
		return commands;
	}

	public int getOffset() {
		return commands.size();
	}

	public void addCommand(int code, int param, String name, String desc) {
		commands.add(new Command(code, param, name, desc));
	}

	public void addCommand(int code, String desc) {
		addCommand(code, 0, "", desc);
	}

	public void fixup(int offset, int param) throws Exception {
		if (offset >= commands.size()) {
			throw new Exception("Invalid offset");
		}
		commands.get(offset).setParam(param);
	}

	public boolean isEqual(MoveTemplate t) {
		if (getOffset() != t.getOffset()) {
			return false;
		}
		for (int i = 0; i < commands.size(); i++) {
			if (!commands.get(i).isEqual(t.commands.get(i))) {
				return false;
			}
		}
		return true;
	}
}

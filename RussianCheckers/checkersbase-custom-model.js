/*
 * Copyright(c) 2013-2016 - jocly.com
 *
 * You are allowed to use and modify this source code as long as it is exclusively for use in the Jocly API. 
 *
 * Original authors: Jocly team
 *
 */
 


(function() {

	var boardWidth,boardHeight,invertNotation=false;
	
	function PosToString(pos) {
		if(!invertNotation) {
			var p1=boardWidth*boardHeight-pos-1;
			var p2=p1%boardWidth;
			return (p1-p2)+boardWidth-p2;
		} else {
			var col=pos%boardWidth;
			var row=(pos-col)/boardWidth;
			return row*boardWidth+boardWidth-col;
		}
	}
	
	Model.Game.checkersPosToString = PosToString;
	
	Model.Game.InitGameInfo = function() {
		// overload to set game feature options
	}
	
	Model.Game.BuildGraphCoord = function() {
		var WIDTH=this.mOptions.width;
		var HEIGHT=this.mOptions.height;
	
		var g=[];
		var coord=[];
		this.g.Graph=g;
		this.g.Coord=coord;
	}
	
	/* Optional method.
	 * Called when the game is created.
	 */
	Model.Game.InitGame = function() {
		var WIDTH=this.mOptions.width;
		var HEIGHT=this.mOptions.height;
		boardWidth=WIDTH;
		boardHeight=HEIGHT;
		invertNotation=this.mOptions.invertNotation || false;
	
		this.g.russianCustom=false;                 
		this.g.compulsoryCatch=true;
		this.g.canStepBack=true;
		this.g.mustMoveForward=false;
		this.g.mustMoveForwardStrict=false;
		this.g.lastRowFreeze=false;	
		this.g.lastRowCrown=false;
		this.g.captureLongestLine=false;
		this.g.noMove="lose";
		this.g.kingCaptureShort=false;
		this.g.kingValue=5;
		this.g.lastRowFactor=0;
		this.g.canCaptureBackward=true;
		this.g.captureInstantRemove=false;
		this.g.longRangeKing=true;
		this.g.drawKvsK=true;
		this.g.drawKvs2K=true;
		this.g.whiteStarts=true;
		this.g.king180deg=false;
		
		if(this.mOptions.variant)
			for(var k in this.mOptions.variant)
				this.g[k]=this.mOptions.variant[k];
		
		this.BuildGraphCoord();
	
		this.zobrist=new JocGame.Zobrist({
			board: {
				type: "array",
				size: this.g.Graph.length,
				values: ["1/0","1/1","-1/0","-1/1"],
			}
		});
	}
	
	/* Optional method.
	 * Called when the game is over.
	 */
	Model.Game.DestroyGame = function() {
	}
	
	View.Game.CheckersDirections = 4;
	View.Game.Checkers2WaysDirections = [ 0,1,1,0 ]; 
	
	// walk through neighbor positions
	Model.Game.CheckersEachDirection = function(pos,fnt) {
		for(var i=0;i<this.CheckersDirections;i++) {
			var npos=this.g.Graph[pos][i];
			if(npos!=null)
				if(fnt(npos,i)==false)
					return;
		}
	}
	
	/* Constructs an instance of the Move object for the game.
	 * args is either an empty object ({}), or contains the data passed to the InitUI parameter.
	 */
	Model.Move.Init = function(args) {
		//JocLog("Move.Init",args);
		this.pos=[];
		for(var i in args.pos)
			this.pos.push(args.pos[i]);
		this.capt=[];
		for(var i in args.capt)
			this.capt.push(args.capt[i]);
	}
	
	/* Optional method.
	 * Copy the given board data to self.
	 * Even if optional, it is better to implement the method for performance reasons. 
	 */
	/*
	Model.Move.CopyFrom = function(aMove) {
		this.row=aMove.row;
		this.col=aMove.col;
	}
	*/
	
	/* Optional method.
	 * Verify move equality. If not defined, comparison is performed from JSON stringification of move objects.
	 */
	/*
	Model.Move.Equals = function(move) {
		return this.fc==move.fc && this.tc==move.tc && this.fr==move.fr && this.tr==move.tr;
	}
	*/
	
	/* Optional method.
	 * Returns a string to represent the move for display to human. If not defined JSON is used.
	 */
	Model.Move.ToString = function() {
		var posses=[PosToString(this.pos[0]),PosToString(this.pos[this.pos.length-1])];
		var sep='-';
		for(var i=1;i<this.capt.length;i++)
			if(this.capt[i]!=null) {
				sep='x';
				if(this.capt.length>3)
					posses.push(PosToString(this.capt[i]));
			}
		return posses.join(sep);
	}
	
	/* Board object constructor.
	 */
	Model.Board.Init = function(aGame) {
		this.zSign=0;
	}
	
	Model.Board.InitialPosition = function(aGame) {
		var WIDTH=aGame.mOptions.width;
		var HEIGHT=aGame.mOptions.height;
		var INITIAL=aGame.mOptions.initial;
		
		this.board=[]; // access pieces by position
		for(var r=0;r<HEIGHT;r++) {
			for(var c=0;c<WIDTH;c++)
				this.board[r*WIDTH+c]=-1;
		}
	
		this.pieces=[]; // access pieces by index
		var index=0;
		if(aGame.mInitial) {
			this.pCount=[0,0];
			this.spCount=[0,0];
			this.kpCount=[0,0];
			for(var i=0;i<aGame.mInitial.pieces.length;i++) {
				var piece=aGame.mInitial.pieces[i];
				this.board[piece.p]=i;
				this.pieces.push({
					s: piece.s, 
					p: piece.p, 
					l: -1, 
					t: piece.t,
					plp: piece.p,  					
				});
				this.zSign=aGame.zobrist.update(this.zSign,"board",piece.s+"/"+piece.t,piece.p);
				var index01=-(piece.s-1)/2;
				this.pCount[index01]++;
				if(piece.t==0)
					this.spCount[index01]++;
				else
					this.kpCount[index01]++;
			}
		} else {
			for(var i in INITIAL.a) {
				var p=INITIAL.a[i];
				var pos=p[0]*WIDTH+p[1];
				var piece={
					s: JocGame.PLAYER_A, // side
					p: pos, // position
					l: -1, // last position for this piece
					t: 0, // piece type
					plp: pos, // last position in move (for piece angle calculation) 
				};
				this.pieces.push(piece);
				this.board[pos]=index++;
				this.zSign=aGame.zobrist.update(this.zSign,"board","1/0",pos);
			}
			for(var i in INITIAL.b) {
				var p=INITIAL.b[i];
				var pos=p[0]*WIDTH+p[1];
				var piece={
					s: JocGame.PLAYER_B, // side
					p: pos, // position
					l: -1, // last position for this piece
					t: 0, // piece type
					plp: pos, // last position in move (for piece angle calculation) 
				};
				this.pieces.push(piece);
				this.board[pos]=index++;
				this.zSign=aGame.zobrist.update(this.zSign,"board","-1/0",pos);
			}
			this.pCount=[INITIAL.a.length,INITIAL.b.length];
			this.spCount=[INITIAL.a.length,INITIAL.b.length];
			this.kpCount=[INITIAL.a.length,INITIAL.b.length];
		}
	}
	
	/* Push into the mMoves array, every possible move
	 */
	Model.Board.GenerateMoves = function(aGame) {
		try {
			this._GenerateMoves(aGame);
		} catch(e) {
			alert("GenerateMoves: "+e);
		}
	}
	
	Model.Board._GenerateMoves = function(aGame) {
		var HEIGHT=aGame.mOptions.height;
		var $this=this;
		function EachPiece(fnt) {
			for(var i in $this.pieces) {
				var piece=$this.pieces[i];
				if(piece && piece.s==$this.mWho)
					fnt(i,piece.p);
			}
		}
		
		
		function catchPieces(pos,poss,capts,dirs,king) {
			while(true) {
				var nextPoss=[];
				var nextCapts=[];
				var nextDirs=[];
				aGame.CheckersEachDirection(pos,function(pos0,dir) {
					var r;
					if(aGame.g.canCaptureBackward==false)
						r=aGame.g.Coord[pos][0];
					var dir0=aGame.Checkers2WaysDirections[dir];

					if (aGame.g.russianCustom==true) {
						if($this.board[pos0]>=0 && $this.pieces[$this.board[pos0]].s==-$this.mWho) {
							var pp=aGame.g.Graph[pos0][dir];
							if (aGame.g.Coord[pp]) {
								var rr=aGame.g.Coord[pp][0];
								var HEIGHT=aGame.mOptions.height;
								if(($this.mWho==JocGame.PLAYER_A && rr==HEIGHT-1) || ($this.mWho==JocGame.PLAYER_B && rr==0)) {
									king=true;
								}
							}
						}
					}

					if(!king) {
						if($this.board[pos0]>=0 && $this.pieces[$this.board[pos0]].s==-$this.mWho) {
							var r0,forward;
							if(aGame.g.canCaptureBackward==false) {
								r0=aGame.g.Coord[pos0][0];
								forward=false;
								if(($this.mWho==JocGame.PLAYER_A && r0>=r) || ($this.mWho==JocGame.PLAYER_B && r0<=r))
										forward=true;
							}
							if(aGame.g.canCaptureBackward || forward==true) {
								var pos1=aGame.g.Graph[pos0][dir];
								if(pos1!=null && ($this.board[pos1]==-1 || pos1==poss[0])) {
									var keep=true;
									for(var i=0;i<dirs.length;i++)
										if((aGame.g.captureInstantRemove && capts[i]==pos0) ||
												(aGame.g.captureInstantRemove==false && capts[i]==pos0 && dirs[i]==dir0)) {
											keep=false;
											break;
										}
									if(keep) {
										nextPoss.push(pos1);
										nextCapts.push(pos0);
										nextDirs.push(dir0);
									}
								}
							}
						}
					} else { // king
						if(aGame.g.longRangeKing)
							while($this.board[pos0]==-1 || 
									(aGame.g.king180deg && pos0!=null && capts.indexOf(pos0)>=0))
								pos0=aGame.g.Graph[pos0][dir];
						if(pos0!=null) {
							if($this.board[pos0]>=0 && $this.pieces[$this.board[pos0]].s==-$this.mWho) {
								var caught=pos0;
								pos0=aGame.g.Graph[pos0][dir];
								if(aGame.g.kingCaptureShort) {
									if($this.board[pos0]==-1 || pos0==poss[0]) {
										var keep=true;
										for(var i=0;i<dirs.length;i++)
											if(!aGame.g.king180deg) {
												if((aGame.g.captureInstantRemove && capts[i]==caught) ||
														(aGame.g.captureInstantRemove==false && capts[i]==caught && 
																dirs[i]==dir0)) {
													keep=false;
													break;
												}
											} else if(capts[i]==caught) {
												keep=false;
												break;												
											}
										if(keep) {
											nextPoss.push(pos0);
											nextCapts.push(caught);
											nextDirs.push(dir0);
										}
										pos0=aGame.g.Graph[pos0][dir];
									}
								} else {
									while($this.board[pos0]==-1 || pos0==poss[0]) {
										var keep=true;
										for(var i=0;i<dirs.length;i++)
											if((aGame.g.captureInstantRemove && capts[i]==caught) ||
													(aGame.g.captureInstantRemove==false && capts[i]==caught && dirs[i]==dir0)) {
												keep=false;
												break;
											}
										if(keep) {
											nextPoss.push(pos0);
											nextCapts.push(caught);
											nextDirs.push(dir0);
										}
										pos0=aGame.g.Graph[pos0][dir];
									}
								}
							}
						}
					}
					return true;
				});
				if(nextPoss.length==0) {
					if(poss.length>1)
						$this.mMoves.push({ pos: poss, capt: capts });
					break;
				}
				
				if(!aGame.g.compulsoryCatch && poss.length>1) {
					var poss1=[];
					for(var i=0;i<poss.length;i++)
						poss1.push(poss[i]);
					var capts1=[];
					for(var i=0;i<capts.length;i++)
						capts1.push(capts[i]);
					$this.mMoves.push({ pos: poss1, capt: capts1 });
				}
				if(nextPoss.length==1) {
					pos=nextPoss[0];
					poss.push(pos);
					capts.push(nextCapts[0]);
					dirs.push(nextDirs[0]);
				} else {
					for(var i=0;i<nextPoss.length;i++) {
						var poss1=[];
						for(var j=0;j<poss.length;j++)
							poss1.push(poss[j]);
						poss1.push(nextPoss[i]);
						var capts1=[];
						for(var j=0;j<capts.length;j++)
							capts1.push(capts[j]);
						capts1.push(nextCapts[i]);
						var dirs1=[];
						for(var j=0;j<dirs.length;j++)
							dirs1.push(dirs[j]);
						dirs1.push(nextDirs[i]);
						catchPieces(nextPoss[i],poss1,capts1,dirs1,king);
					}
					break;
				}
			}
		}
		EachPiece(function(index,pos) {
			if($this.pieces[index].t==0) 
				catchPieces(pos,[pos],[null],[null],false);
			else if($this.pieces[index].t==1)
				catchPieces(pos,[pos],[null],[null],true);
		});
		if(aGame.g.compulsoryCatch==false || this.mMoves.length==0)
			EachPiece(function(index,pos) {
				var r;
				if($this.pieces[index].t==0) {
					if(aGame.g.mustMoveForward || aGame.g.mustMoveForwardStrict || aGame.lastRowFreeze)
						r=aGame.g.Coord[pos][0];
					aGame.CheckersEachDirection(pos,function(pos0,dir) {
						var r0,forward,lastRow;
						if(aGame.g.mustMoveForwardStrict) {
							r0=aGame.g.Coord[pos0][0];
							forward=false;
							if(($this.mWho==JocGame.PLAYER_A && r0>r) || ($this.mWho==JocGame.PLAYER_B && r0<r))
									forward=true;
						} else if(aGame.g.mustMoveForward) {
							r0=aGame.g.Coord[pos0][0];
							forward=true;
							if(($this.mWho==JocGame.PLAYER_A && r0<r) || ($this.mWho==JocGame.PLAYER_B && r0>r))
									forward=false;
						}
						if(aGame.g.lastRowFreeze) {
							lastRow=false;
							if(($this.mWho==JocGame.PLAYER_A && r==HEIGHT-1) || ($this.mWho==JocGame.PLAYER_B && r==0))
								lastRow=true;
						}
						if($this.board[pos0]==-1 && (aGame.g.canStepBack || pos0!=$this.pieces[index].l) && 
								((aGame.g.mustMoveForward==false && aGame.g.mustMoveForwardStrict==false) || forward==true) &&
								(aGame.g.lastRowFreeze==false || lastRow==false))
							$this.mMoves.push({ pos: [ pos, pos0 ], capt: [ null, null ] });
						return true;
					});
				} else if($this.pieces[index].t==1) {
					aGame.CheckersEachDirection(pos,function(pos0,dir) {
						if(aGame.g.longRangeKing) {
							while($this.board[pos0]==-1) {
								$this.mMoves.push({ pos: [ pos, pos0 ], capt: [ null, null ] });
								pos0=aGame.g.Graph[pos0][dir];
							}
						} else {
							if($this.board[pos0]==-1) {
								$this.mMoves.push({ pos: [ pos, pos0 ], capt: [ null, null ] });
								pos0=aGame.g.Graph[pos0][dir];
							}
						}
						return true;
					});
				}
			});
		if(this.mMoves.length==0) {
			switch(aGame.g.noMove) {
			case "count":
				this.mFinished=true;
				if(this.pCount[0]<this.pCount[1])
					this.mWinner=JocGame.PLAYER_B;
				else if(this.pCount[1]<this.pCount[0])
					this.mWinner=JocGame.PLAYER_A;
				else
					this.mWinner=JocGame.DRAW;
				break;
			case "lose":
				this.mFinished=true;
				this.mWinner=-this.mWho;
				break;
			default:
				this.mFinished=true;
				this.mWinner=JocGame.DRAW;
				break;
			}
		}
		
		if(aGame.g.captureLongestLine) {
			var moves0=this.mMoves;
			var moves1=[];
			var bestLength=0;
			for(var i in moves0) {
				var move=moves0[i];
				if(move.pos.length==bestLength)
					moves1.push(move);
				else if(move.pos.length>bestLength) {
					moves1=[move];
					bestLength=move.pos.length;
				}
			}
			this.mMoves=moves1;
		}
	}
	
	/* Optional method.
	 */
	/*
	Model.Board.QuickEvaluate = function(aGame) {
		return this.EvaluateChessBoard(aGame);
	}
	*/
	
	/* The Evaluate method must:
	 * - detects whether the game is finished by setting mFinished to true, and determine the winner by assigning
	 * mWinner (to JocGame.PLAYER_A, JocGame.PLAYER_B, JocGame.DRAW).
	 * - calculate mEvaluation to indicate apparent advantage to PLAYER_A (higher positive evaluation) or to
	 * PLAYER_B (lower negative evaluation)
	 * Parameters:
	 * - aFinishOnly: it is safe to ignore this parameter value, but for better performance, the mEvaluation setting
	 * can be skipped if aFinishOnly is true (function caller is only interested if the game is finished).
	 * - aTopLevel: it is safe to ignore this parameter value. For convenience, if true, there is no performance involved 
	 * so it is safe to make additional calculation and storing data, for instance to simplify the display of the last move.
	 */
	Model.Board.Evaluate = function(aGame,aFinishOnly,aTopLevel) {
		if(aGame.mOptions.preventRepeat && aGame.GetRepeatOccurence(this)>2) {
			this.mFinished=true;
			this.mWinner=JocGame.DRAW;
			return;
		}
		if(aGame.g.drawKvsK && this.spCount[0]==0 && this.spCount[1]==0 && this.kpCount[0]==1 && this.kpCount[1]==1) {
			this.mFinished=true;
			this.mWinner=JocGame.DRAW;
			return;
		}
		if(aGame.g.drawKvs2K && this.spCount[0]==0 && this.spCount[1]==0 && this.kpCount[0]+this.kpCount[1]==3 &&
				(this.kpCount[0]==1 || this.kpCount[0]==2)) {
			this.mFinished=true;
			this.mWinner=JocGame.DRAW;
			return;
		}
	
		if(this.pCount[1]==0) {
			this.mFinished=true;
			this.mWinner=JocGame.PLAYER_A;
			return;
		}
		if(this.pCount[0]==0) {
			this.mFinished=true;
			this.mWinner=JocGame.PLAYER_B;
			return;
		}
		
		this.mEvaluation=(this.spCount[0]-this.spCount[1])*10
			+(this.kpCount[0]-this.kpCount[1])*10*aGame.g.kingValue
			+this.pCount[0]/this.pCount[1]-this.pCount[1]/this.pCount[0];
		if(aGame.g.lastRowFactor!=0) {
			var HEIGHT=aGame.mOptions.height;
			var rowSumA=0;
			var rowSumB=0;
			for(var i in this.pieces) {
				var piece=this.pieces[i];
				if(piece && piece.t==0) {
					if(this.mWho==JocGame.PLAYER_A)
						rowSumA+=aGame.g.Coord[piece.p][0];
					else
						rowSumB+=HEIGHT-1-aGame.g.Coord[piece.p][0];
				}
			}
			this.mEvaluation += (rowSumA-rowSumB) * aGame.g.lastRowFactor;
		}
	
		//JocLog("Evaluation",this.mEvaluation,this.pCount);
	}
	
	/* 
	 * Copy the given board data to self.
	 * Even if optional, it is better to implement the method for performance reasons. 
	 */
	
	Model.Board.CopyFrom = function(aBoard) {
		this.board=[];
		for(var i=0;i<aBoard.board.length;i++)
			this.board[i]=aBoard.board[i];
		this.pieces=[];
		for(var i=0;i<aBoard.pieces.length;i++) {
			var p=aBoard.pieces[i];
			if(p==null)
				this.pieces[i]=null;
			else
				this.pieces[i]={
					s: p.s,
					p: p.p,
					l: p.l,
					t: p.t,
					plp: p.plp, 
				};
		}
		this.pCount=[aBoard.pCount[0],aBoard.pCount[1]];
		this.spCount=[aBoard.spCount[0],aBoard.spCount[1]];
		this.kpCount=[aBoard.kpCount[0],aBoard.kpCount[1]];
		this.mWho=aBoard.mWho;
		this.zSign=aBoard.zSign;
	}
	
	/* Modify the current board instance to apply the move.
	 */
	Model.Board.ApplyMove = function(aGame,move) {

		var pieceCrowned=false;

		var WIDTH=aGame.mOptions.width;
		var HEIGHT=aGame.mOptions.height;
		var pos0=move.pos[0];
		var pIndex=this.board[pos0];
		var piece=this.pieces[pIndex];
		var player=piece.s;
		piece.l=pos0;
		var toBeRemoved={};
		this.zSign=aGame.zobrist.update(this.zSign,"board",piece.s+"/"+piece.t,piece.p);
		for(var i=1;i<move.pos.length;i++) {
			var pos=move.pos[i];
			this.board[piece.p]=-1;
			piece.p=pos;

			if (aGame.g.russianCustom==true) {
				var r=aGame.g.Coord[pos][0];
				if((player==JocGame.PLAYER_A && r==HEIGHT-1) || (player==JocGame.PLAYER_B && r==0)) {
					pieceCrowned=true;
				}
			}

			this.board[pos]=pIndex;
			var caught=move.capt[i];
			if(caught!=null) {
				if(this.board[caught]>=0)
					toBeRemoved[this.board[caught]]=true;
				this.board[caught]=-1;
			}
			pos0=pos;
		}
		this.zSign=aGame.zobrist.update(this.zSign,"board",piece.s+"/"+piece.t,pos);
		var plp=move.capt[move.capt.length-1]
		piece.plp=plp?plp:move.pos[move.pos.length-2];
		for(var index in toBeRemoved) {
			var piece0=this.pieces[index];
			var other=(1-piece0.s)/2;
			this.pCount[other]--;
			switch(piece0.t) {
			case 0: this.spCount[other]--; break;
			case 1: this.kpCount[other]--; break;
			}
			this.zSign=aGame.zobrist.update(this.zSign,"board",piece0.s+"/"+piece0.t,piece0.p);
			this.pieces[index]=null;
		}
		if(aGame.g.lastRowCrown && this.pieces[pIndex].t==0) {
			var r=aGame.g.Coord[move.pos[move.pos.length-1]][0];
			if(pieceCrowned || (player==JocGame.PLAYER_A && r==HEIGHT-1) || (player==JocGame.PLAYER_B && r==0)) {
				var piece0=this.pieces[pIndex];
				piece0.t=1;
				var self=(1-player)/2;
				this.spCount[self]--;
				this.kpCount[self]++;
				this.zSign=aGame.zobrist.update(this.zSign,"board",piece0.s+"/0",piece0.p);
				this.zSign=aGame.zobrist.update(this.zSign,"board",piece0.s+"/1",piece0.p);
			}
		}
	}
		
	Model.Board.IsValidMove = function(aGame,move) {
		return true;
	}
	
	Model.Board.GetSignature = function() {
		return this.zSign;
	}
	
	Model.Game.Import = function(format,data) {
		var turn=1, pieces=[];
		var boardSize=this.mOptions.width*this.mOptions.height;
		var boardWidth=this.mOptions.width;
		function AddPiece(side,type,pos) {
			pos=boardSize-pos;
			var posCol=pos%boardWidth;
			pos=pos-posCol+boardWidth-posCol-1;
			pieces.push({
				s: side,
				p: pos, 
				l: -1, 
				t: type,
				plp: pos,  
			});
		}

		if(format=='pjn') {
			var result={
				status: false,
				error: 'parse',
			}
			var parts=data.split(':');
			turn=parts[0]=='W'?1:-1;
			for(var i=1;i<parts.length;i++) {
				if(parts[i].length==0)
					continue;
				var color=parts[i].substr(0,1)=='W'?1:-1;
				var parts2=parts[i].substr(1).split(',');
				for(var j=0;j<parts2.length;j++) {
					var p=parts2[j];
					var type=0;
					if(p.substr(0,1)=='K') {
						type=1;
						p=p.substr(1);
					}
					var m=/^([0-9]+)-([0-9]+)$/.exec(p);
					if(m)
						for(var pos=parseInt(m[1]);pos<=parseInt(m[2]);pos++)
							AddPiece(color,type,pos);
					else
						AddPiece(color,type,parseInt(p));
				}
			}
			pieces.sort(function(p1,p2) {
				return p2.s-p1.s;
			});
			return {
				status: true,
				initial: {
					pieces: pieces,
					turn: turn,
				}
			}
		}
		return {
			status: false,
			error: 'unsupported',
		}
	}
	
	var SuperGetBestMatchingMove = JocGame.prototype.GetBestMatchingMove;
	
	Model.Game.GetBestMatchingMove = function(moveStr,candidateMoves) {
		var prettyMoves=[];
		candidateMoves.forEach(function(m) {
			prettyMoves.push(m.ToString());
		});
		moveStr=moveStr.replace(/0([1-9])/g,"$1");
		var dbm=/^([0-9]+)[\-x]([0-9]+)([\-x][0-9]+)*$/.exec(moveStr);
		if(dbm) {
			var re=new RegExp('^'+dbm[1]+'[\-x]'+dbm[2]+'([\-x][0-9]+)*$');
			//console.log("re",re.toString())
			var bestMatchesMap={};
			candidateMoves.forEach(function(candidate,index) {
				if(re.test(prettyMoves[index])) {
					var key=prettyMoves[index];
					var m=/^([0-9]+)x([0-9]+)x([0-9]+(x[0-9]+)*)/.exec(key);
					if(m) {
						var arr=m[3].split('x');
						arr.sort(function(p1,p2) {
							return parseInt(p1)-parseInt(p2);
						});
						key=m[1]+"x"+m[2]+"x"+arr.join("x");
					}
					bestMatchesMap[key]=candidate;
				}
			});
			var bestMatches=[];
			for(var i in bestMatchesMap)
				bestMatches.push(bestMatchesMap[i]);
			if(bestMatches.length>0)
				candidateMoves=bestMatches;
		}
		return SuperGetBestMatchingMove.call(this,moveStr,candidateMoves);
	}

	Model.Board.ExportBoardState = function(aGame) {
		//debugger;
		var colors={};
		var fenParts=[];
		this.pieces.forEach(function(piece) {
			if(piece && piece.p!=null) {
				var color=piece.s==1?'W':'B';
				if(colors[color]===undefined)
					colors[color]={};
				var abbrev=piece.t==1?'K':'';
				if(colors[color][abbrev]===undefined)
					colors[color][abbrev]={
						group: piece.t==0,
						pos: [],
					}
				colors[color][abbrev].pos.push(parseInt(PosToString(piece.p)));
			}
		});
		for(var color in colors) {
			var fenColorParts=[];
			for(var abbrev in colors[color]) {
				var pieceType=colors[color][abbrev];
				if(pieceType.group) {
					pieceType.pos.sort(function(pos1,pos2) {
						return parseInt(pos1)-parseInt(pos2);
					});
					var last=-2, end=-1, start=-1;
					pieceType.pos.forEach(function(pos) {
						if(parseInt(pos)==last+1) {
							end=pos;
						} else {
							if(end>=0) {
								fenColorParts.push(abbrev+start+"-"+end);
								end=-1;
							} else {
								if(start>=0)
									fenColorParts.push(abbrev+start);
							}
							start=pos;
						}
						last=parseInt(pos);
					});
					if(end>=0)
						fenColorParts.push(abbrev+start+"-"+end);
					else if(start>=0)
						fenColorParts.push(abbrev+start);
				} else 
					pieceType.pos.forEach(function(pos) {
						fenColorParts.push(abbrev+pos);
					});
			}
			fenParts.push(color+fenColorParts.join(","));
		}
		var fen=fenParts.join(":");
		return fen;
	}

})();


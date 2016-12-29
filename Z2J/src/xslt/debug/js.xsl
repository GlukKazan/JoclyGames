<?xml version="1.0"?> 

<xsl:stylesheet 
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
  version="1.0">

  <xsl:output method="text" encoding="utf-8"/>
  <xsl:template match="/game">ZRF = {
    JUMP:          0,
    IF:            1,
    FORK:          2,
    FUNCTION:      3,
    IN_ZONE:       4,
    FLAG:          5,
    SET_FLAG:      6,
    POS_FLAG:      7,
    SET_POS_FLAG:  8,
    ATTR:          9,
    SET_ATTR:      10,
    PROMOTE:       11,
    MODE:          12,
    ON_BOARD_DIR:  13,
    ON_BOARD_POS:  14,
    PARAM:         15,
    LITERAL:       16,
    VERIFY:        20
};

Model.Game.BuildDesign = function(design) {<xsl:call-template name="apply-options"/><xsl:text>
</xsl:text><xsl:call-template name="apply-directions"/><xsl:text>
</xsl:text><xsl:call-template name="apply-players"/><xsl:text>
</xsl:text><xsl:call-template name="apply-positions"/><xsl:text>
</xsl:text><xsl:call-template name="apply-zones"/>
<xsl:for-each select="/game/template">
  <xsl:variable name="ix" select="position() - 1"/>
  <xsl:for-each select="c"><xsl:if test="position()=1"><xsl:text>
</xsl:text></xsl:if>
    design.addCommand(<xsl:value-of select="$ix"/>, ZRF.<xsl:value-of select="d"/>,	<xsl:value-of select="p"/>);<xsl:if test="n/text()">	// <xsl:value-of select="n"/>
</xsl:if>
</xsl:for-each>
</xsl:for-each><xsl:text>
</xsl:text><xsl:for-each select="/game/mode[is_mandatory]">
    design.addPriority(<xsl:value-of select="position() - 1"/>);			// <xsl:value-of select="name"/>
</xsl:for-each>
<xsl:for-each select="/game/piece">
    <xsl:variable name="ix" select="position() - 1"/>

    design.addPiece("<xsl:value-of select="name"/>", <xsl:value-of select="$ix"/>);<xsl:for-each select="drop">
    design.addDrop(<xsl:value-of select="$ix"/>, <xsl:value-of select="template"/>, [<xsl:call-template name="apply-params"/>], <xsl:value-of select="mode"/>);</xsl:for-each>
    <xsl:for-each select="move">
    design.addMove(<xsl:value-of select="$ix"/>, <xsl:value-of select="template"/>, [<xsl:call-template name="apply-params"/>], <xsl:value-of select="mode"/>);</xsl:for-each>
</xsl:for-each>
}
</xsl:template>

<xsl:template name="apply-options">
  <xsl:for-each select="option">
    design.checkVersion("<xsl:value-of select="name"/>", "<xsl:value-of select="value"/>");</xsl:for-each>
</xsl:template>

<xsl:template name="apply-directions">
  <xsl:for-each select="board/dir/name">
    design.addDirection("<xsl:value-of select="text()"/>");</xsl:for-each>
</xsl:template>

<xsl:template name="apply-players">
  <xsl:variable name="player" select="/game/players/name[2]/text()"/>
  <xsl:for-each select="board/player">
    design.addPlayer(<xsl:choose>
    <xsl:when test="name = $player">JocGame.PLAYER_B</xsl:when>
    <xsl:otherwise>0</xsl:otherwise>
    </xsl:choose>, [<xsl:call-template name="apply-dirs"/>]);</xsl:for-each>
</xsl:template>

<xsl:template name="apply-positions">
  <xsl:for-each select="board/pos">
    design.addPosition("<xsl:value-of select="name"/>", [<xsl:call-template name="apply-dirs"/>]);</xsl:for-each>
</xsl:template>

<xsl:template name="apply-dirs">
  <xsl:for-each select="dir">
    <xsl:choose>
       <xsl:when test="position() > 1">, </xsl:when>
    </xsl:choose>
    <xsl:choose>
       <xsl:when test="text()"><xsl:value-of select="text()"/></xsl:when>
       <xsl:otherwise>null</xsl:otherwise>
    </xsl:choose>
  </xsl:for-each>
</xsl:template>

<xsl:template name="apply-params">
  <xsl:for-each select="param">
    <xsl:choose>
       <xsl:when test="position() > 1">, </xsl:when>
    </xsl:choose>
    <xsl:value-of select="text()"/>
  </xsl:for-each>
</xsl:template>

<xsl:template name="apply-zones">
  <xsl:for-each select="board/zone">
    <xsl:call-template name="apply-zone-players">
       <xsl:with-param name="zone-name" select="name"/>
    </xsl:call-template>
  </xsl:for-each>
</xsl:template>

<xsl:template name="apply-zone-players">
  <xsl:param name="zone-name"/>
  <xsl:variable name="player" select="/game/players/name[1]/text()"/>
  <xsl:for-each select="player">
    design.addZone("<xsl:value-of select="$zone-name"/>", <xsl:choose>
  <xsl:when test="name = $player">JocGame.PLAYER_A</xsl:when>
  <xsl:otherwise>JocGame.PLAYER_B</xsl:otherwise>
</xsl:choose>, [<xsl:call-template name="apply-pos"/>]);</xsl:for-each>
</xsl:template>

<xsl:template name="apply-pos">
  <xsl:for-each select="pos">
    <xsl:choose>
       <xsl:when test="position() > 1">, </xsl:when>
    </xsl:choose><xsl:value-of select="text()"/>
  </xsl:for-each>
</xsl:template>

</xsl:stylesheet>

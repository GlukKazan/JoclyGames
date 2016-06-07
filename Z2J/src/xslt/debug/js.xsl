<?xml version="1.0"?> 

<xsl:stylesheet 
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
  version="1.0">

  <xsl:output method="text" encoding="utf-8"/>
  <xsl:template match="/game">Model.Game.BuildDesign = function(design) {<xsl:call-template name="apply-directions"/>
  <xsl:call-template name="apply-players"/>
  <xsl:call-template name="apply-positions"/>
  <xsl:call-template name="apply-zones"/>
}
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

<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0" 
                xmlns:html="http://www.w3.org/TR/REC-html40"
                xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
                xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
                xmlns:xhtml="http://www.w3.org/1999/xhtml"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <title>XML Sitemap - Shivaprasad V</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <style type="text/css">
          :root {
            --bg-color: #f8fafc;
            --text-color: #334155;
            --link-color: #2563eb;
            --table-header-bg: #1e293b;
            --table-header-text: #f8fafc;
            --table-border: #e2e8f0;
            --table-row-hover: #f1f5f9;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background-color: var(--bg-color);
            color: var(--text-color);
            margin: 0;
            padding: 40px 20px;
          }
          .container {
            max-width: 1200px;
            margin: 0 auto;
            background: #ffffff;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          }
          h1 {
            margin-top: 0;
            color: #0f172a;
          }
          p.desc {
            color: #64748b;
            font-size: 0.95rem;
            margin-bottom: 25px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 0.9rem;
          }
          th {
            background-color: var(--table-header-bg);
            color: var(--table-header-text);
            text-align: left;
            padding: 12px 15px;
            font-weight: 600;
          }
          th:first-child { border-top-left-radius: 6px; }
          th:last-child { border-top-right-radius: 6px; }
          td {
            padding: 12px 15px;
            border-bottom: 1px solid var(--table-border);
          }
          tr:last-child td { border-bottom: none; }
          tr:hover td {
            background-color: var(--table-row-hover);
          }
          a {
            color: var(--link-color);
            text-decoration: none;
            word-break: break-all;
          }
          a:hover {
            text-decoration: underline;
          }
          .badge {
            background: #e2e8f0;
            padding: 3px 6px;
            border-radius: 4px;
            font-size: 0.8rem;
            font-weight: bold;
            color: #475569;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Website XML Sitemap</h1>
          <p class="desc">
            This is a stylized view of the raw XML sitemap. It contains <strong><xsl:value-of select="count(sitemap:urlset/sitemap:url)"/></strong> URLs.<br/>
            Search engines will still read this as standard XML data.
          </p>
          
          <table>
            <thead>
              <tr>
                <th>Page URL</th>
                <th>Priority</th>
                <th>Change Frequency</th>
                <th>Last Modified</th>
              </tr>
            </thead>
            <tbody>
              <xsl:for-each select="sitemap:urlset/sitemap:url">
                <tr>
                  <td>
                    <a href="{sitemap:loc}"><xsl:value-of select="sitemap:loc"/></a>
                  </td>
                  <td>
                    <xsl:if test="sitemap:priority">
                      <span class="badge"><xsl:value-of select="sitemap:priority"/></span>
                    </xsl:if>
                  </td>
                  <td style="text-transform: capitalize;">
                    <xsl:value-of select="sitemap:changefreq"/>
                  </td>
                  <td>
                    <xsl:value-of select="sitemap:lastmod"/>
                  </td>
                </tr>
              </xsl:for-each>
            </tbody>
          </table>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
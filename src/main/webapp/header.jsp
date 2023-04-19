<%
//Jos kirjautumista ei ole tapahtunut lähetetään käyttäjä kirjautumissivulle
if(session.getAttribute("kayttaja")==null){		
	response.sendRedirect("index.jsp");	
	return;
}
//Estet��n Back-napin toiminta uloskirjautumisen j�lkeen
response.setHeader("Cache-Control", "no-cache");
response.setHeader("Cache-Control", "no-store");
response.setHeader("Pragma", "no-cache");
response.setDateHeader("Expires", 0);
%>
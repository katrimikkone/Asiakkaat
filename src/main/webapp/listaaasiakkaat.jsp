<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="ISO-8859-1">
<script src="scripts/main.js"></script>
<link rel="stylesheet" href="scripts/styles.css">

<title>Asiakkaat</title>
</head>
<body>
	<!-- tämä sivu on fronttia! -->
	<table id="listaus">
		<thead>
			<tr>
				<th>Hakusana:</th>
				<th colspan="2"><input type="text" id="hakusana"></th>
				<th><input type="button" value="Hae" id="hakunappi"
					onclick="haeAsiakkaat()"></th>
			</tr>
			<tr>
				<th>Etunimi</th>
				<th>Sukunimi</th>
				<th>Puhelin</th>
				<th>Sähköposti</th>
			</tr>
		</thead>
		<tbody id="tbody">
		</tbody>
	</table>

	<script>
		haeAsiakkaat();
	</script>
</body>
</html>
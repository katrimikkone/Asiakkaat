function haeAsiakkaat(){
	let url = "asiakkaat?hakusana=" +document.getElementById("hakusana").value; //kutsuu asiakkaat backendiä ja valittää hakusanan
	let requestOptions = {
		method: "GET",
		headers: {"Content-Type": "application/x-www-form-urlencoded"}
	};
		fetch(url, requestOptions)
		.then(response => response.json()) //muutetaan vastausteksi JSON-objektiksi lista
		.then(response => printItems(response))
		.catch(errorText => console.error("Fetch failed: " + errorText));
		
}

function printItems(respObjList){
	let htmlStr="";
	for(let item of respObjList){//kokoelmaloop
		htmlStr+="<tr id='rivi_"+item.asiakas_id+"'>";
		htmlStr+="<td>"+item.etunimi+"</td>";
		htmlStr+="<td>"+item.sukunimi+"</td>";
		htmlStr+="<td>"+item.puhelin+"</td>";
		htmlStr+="<td>"+item.sposti+"</td>";
		htmlStr+="</tr>";
	}
	document.getElementById("tbody").innerHTML= htmlStr;
}
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
		htmlStr+="<td><a href='muutaasiakas.jsp?id="+item.asiakas_id+"'>Muuta</a>&nbsp;";    
		htmlStr+="<span class='poista' onclick=varmistaPoisto("+item.asiakas_id+",'"+encodeURI(item.etunimi + " " +item.sukunimi)+"')>Poista</span></td>"; 	
		htmlStr+="</tr>";
	}
	document.getElementById("tbody").innerHTML= htmlStr;
}

function lisaaTiedot(){ //tämä lähettää tiedot back endiin, kutsutaan post metodia ja välitetään kutsun mukana asiakkaan tiedot json stringinä
	let formData = serialize_form(document.lomake);//luetaan tiedot lomakkeelta json string muotoon
	//console.log(formData);
	let url = "asiakkaat"; //kutsutaan backend asiakkaat apia
	let requestOptions = {
		method: "POST", //lisätään asiakas
		headers: {"Content-Type": "application/json; charset=UTF-8"},
		body: formData //tämä välitetään
	};
	fetch(url, requestOptions) //tiedot välitetään ja otetaan vastaan
	.then(response => response.json())//muutetaan vastausteksti json objektiksi
	.then(responseObj => { //<-- JSON objekti
		if(responseObj.response==0) {
			document.getElementById("ilmo").innerHTML = "Asiakkaan lisäys epäonnistui.";
		}else if(responseObj.response==1){
			document.getElementById("ilmo").innerHTML = "Asiakkaan lisäys onnistui.";
			document.lomake.reset(); //tyhjennetään auton lisäämisen lomake
		}
		setTimeout(function() { document.getElementById("ilmo").innerHTML=""; }, 3000);
	})
	.catch(errorText => console.error("Fetch failed: " + errorText));
}

//Poistetaan asiakas kutsumalla backin DELETE-metodia ja välittämällä sille poistettavan asiakkaan id
function poistaAsiakas(asiakas_id, nimi){
	let url = "asiakkaat?asiakas_id=" + asiakas_id;    
    let requestOptions = {
        method: "DELETE"             
    };    
    fetch(url, requestOptions)
    .then(response => response.json())//Muutetaan vastausteksti JSON-objektiksi
   	.then(responseObj => {	
   		//console.log(responseObj);
   		if(responseObj.response==0){
			alert("Asiakkaan poisto epäonnistui.");	        	
        }else if(responseObj.response==1){ 
			document.getElementById("rivi_"+asiakas_id).style.backgroundColor="red";
			alert("Asiakkaan " + decodeURI(nimi) +" poisto onnistui."); //decodeURI() muutetaan enkoodatut merkit takaisin normaaliksi kirjoitukseksi
			haeAsiakkaat();        	
		}
   	})
   	.catch(errorText => console.error("Fetch failed: " + errorText));
}

function haeAsiakas() {		
    let url = "asiakkaat?id=" + requestURLParam("id"); //requestURLParam() on funktio, jolla voidaan hakea urlista arvo avaimen perusteella. Löytyy main.js -tiedostosta 	
	//console.log(url);
    let requestOptions = {
        method: "GET",
        headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" }       
    };    
    fetch(url, requestOptions)
    .then(response => response.json())//Muutetaan vastausteksti JSON-objektiksi
   	.then(response => {
   		//console.log(response);
   		document.getElementById("asiakas_id").value=response.asiakas_id;
   		document.getElementById("etunimi").value=response.etunimi;
   		document.getElementById("sukunimi").value=response.sukunimi;
   		document.getElementById("puhelin").value=response.puhelin;
   		document.getElementById("sposti").value=response.sposti;
   	}) 
   	.catch(errorText => console.error("Fetch failed: " + errorText));
}

function paivitaTiedot(){
	let formData = serialize_form(document.lomake); //Haetaan tiedot lomakkeelta ja muutetaan JSON-stringiksi
	//formData=encodeURI(formData);
	console.log(formData);
	let url = "asiakkaat";    
    let requestOptions = {
        method: "PUT", //Lisätään asiakas
        headers: { "Content-Type": "application/json; charset=UTF-8" },  //charset=UTF-8 hoitaa skandinaaviset merkit oikein backendiin
    	body: formData
    };    
    fetch(url, requestOptions)
    .then(response => response.json())//Muutetaan vastausteksti JSON-objektiksi
   	.then(responseObj => {	
   		//console.log(responseObj);
   		if(responseObj.response==0){
   			document.getElementById("ilmo").innerHTML = "Asiakkaan päivitys epäonnistui.";	
        }else if(responseObj.response==1){ 
        	document.getElementById("ilmo").innerHTML = "Asiakkaan päivitys onnistui.";
			document.lomake.reset(); //Tyhjennetään lisäämisen lomake		        	
		}
		setTimeout(function(){ document.getElementById("ilmo").innerHTML=""; }, 3000);
   	})
   	.catch(errorText => console.error("Fetch failed: " + errorText));
}


/*
function haeAsiakas() {		
    let url = "asiakkaat?id=" +requestURLParam("id"); //requestURLParam() on funktio, jolla voidaan hakea urlista arvo avaimen perusteella. Löytyy main.js -tiedostosta 	
	console.log(url);
    let requestOptions = {
        method: "GET",
        headers: { "Content-Type":"application/x-www-form-urlencoded; charset=UTF-8" }       
    };    
    fetch(url, requestOptions)
    .then(response => response.json())//Muutetaan vastausteksti JSON-objektiksi
   	.then(response => {
   		console.log(response);
   		document.getElementById("id").value=response.id;
   		document.getElementById("etunimi").value=response.etunimi;
   		document.getElementById("sukunimi").value=response.sukunimi;
   		document.getElementById("puhelin").value=response.puhelin;
   		document.getElementById("sposti").value=response.sposti;  		
   	}) 
   	.catch(errorText => console.error("Fetch failed: " + errorText));
}

function paivitaTiedot(){
	let formData = serialize_form(lomake);//luetaan tiedot lomakkeelta json string muotoon
	console.log("formdata: "+formData); //id undefine???
	let url = "asiakkaat"; //kutsutaan backend asiakkaat apia lähetetään muutettava asiakas
	let requestOptions = {
		method: "PUT", //muutetaan asiakas
		headers: {"Content-Type": "application/json; charset=UTF-8"},
		body: formData //tämä välitetään 
	};
	fetch(url, requestOptions) //tiedot välitetään ja otetaan vastaan
	.then(response => response.json())//muutetaan vastausteksti json objektiksi
	.then(responseObj => { //<-- JSON objekti
		if(responseObj.response==0) {
			document.getElementById("ilmo").innerHTML = "Asiakkaan muutos epäonnistui.";
		}else if(responseObj.response==1){
			document.getElementById("ilmo").innerHTML = "Asiakkaan muutos onnistui.";
			document.lomake.reset(); //tyhjennetään asiakkaan muuttamisen lomake
		}
		//setTimeout(function() { document.getElementById("ilmo").innerHTML=""; }, 3000);
	})
	.catch(errorText => console.error("Fetch failed: " + errorText));
}*/
	
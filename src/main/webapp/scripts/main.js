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
		htmlStr+="<td><span class='poista' onclick=varmistaPoisto("+item.asiakas_id+",'"+encodeURI(item.etunimi)+"'+'" +encodeURI(item.sukunimi)+"')>Poista</span></td>"; 	
		htmlStr+="</tr>";
	}
	document.getElementById("tbody").innerHTML= htmlStr;
}

function tutkiJaLisaa(){
	if(tutkiTiedot()){
		lisaaTiedot();
	}
}

function tutkiTiedot(){
	let ilmo="";
	let etunimi = document.getElementById("etunimi").value;
	let sukunimi = document.getElementById("sukunimi").value;
	let puhelin = document.getElementById("puhelin").value;
	let sposti = document.getElementById("sposti").value;
	
	let etunimiRGEX=/^[[A-ZÅÄÖa-zåäö-]/;
	let sukunimiRGEX=/^[[A-ZÅÄÖa-zåäö-]/;
	let puhelinRGEX=/^[0-9]/;
	
	let etunimiresult=etunimiRGEX.test(etunimi);
	let sukunimiresult=sukunimiRGEX.test(sukunimi);
	let puhelinresult=puhelinRGEX.test(puhelin);
	let spostiresult=tarkistaSposti(sposti);
	
	if(!etunimiresult){
		ilmo="Etunimi ei kelpaa!";
		document.getElementById("etunimi").focus();
	}if(!sukunimiresult){
		ilmo="Sukunimi ei kelpaa!";
		document.getElementById("sukunimi").focus();
	}if(!puhelinresult){
		ilmo="Puhelinnumero ei kelpaa!";
		document.getElementById("puhelin").focus();
	}if(!spostiresult){
		ilmo="Sähköposti ei kelpaa!";
		document.getElementById("sposti").focus();
	}
	if(ilmo!="") {
		document.getElementById("ilmo").innerHTML=ilmo;
		setTimeout(function() { document.getElementById("ilmo").innerHTML=""; }, 3000);
		return false;
	}else {
		document.getElementById("etunimi").value=siivoa(document.getElementById("etunimi").value);
		document.getElementById("sukunimi").value=siivoa(document.getElementById("sukunimi").value);
		document.getElementById("puhelin").value=siivoa(document.getElementById("puhelin").value);
		document.getElementById("sposti").value=siivoa(document.getElementById("sposti").value);
		return true;
	}
	
}


function tarkistaSposti(sposti) {
 if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(sposti)){
    return true;
  }
    return false;
}


//XSS-hyökkäysten estämiseksi 
function siivoa(teksti){
	teksti=teksti.replace(/</g, "");//&lt;
	teksti=teksti.replace(/>/g, "");//&gt;
	teksti=teksti.replace(/'/g, "''");//&apos;
	return teksti;
}


function lisaaTiedot(){ //tämä lähettää tiedot back endiin, kutsutaan post metodia ja välitetään kutsun mukana asiakkaan tiedot json stringinä
	let formData = serialize_form(document.lomake);//luetaan tiedot lomakkeelta json string muotoon
	//console.log(formData);
	let url = "asiakkaat"; //kutsutaan backend asiakkaat apia
	let requestOptions = {
		method: "POST", //lisätään asiakas
		headers: {"Content-Type": "application/json"},
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

function serialize_form(form){
	return JSON.stringify(
		Array.from(new FormData(form).entries())
			.reduce((m, [ key, value]) => Object.assign(m, { [key]: value }), {})
	);
}

function varmistaPoisto(id, etunimi, sukunimi){
	if(confirm("Poista asiakas "+ decodeURI(etunimi)+ "  "+ decodeURI(sukunimi)+"?")){ //decodeURI() muutetaan enkoodatut merkit takaisin normaaliksi kirjoitukseksi
		poistaAsiakas(id, encodeURI(etunimi), encodeURI(sukunimi));
	}
}

//Poistetaan auto kutsumalla backin DELETE-metodia ja välittämällä sille poistettavan auton id
function poistaAsiakas(id, etunimi, sukunimi){
	let url = "asiakkaat?id=" + id;  //idn arvo tule parametrissa
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
			document.getElementById("rivi_"+id).style.backgroundColor="red";
			alert("Asiakkaan "+ decodeURI(etunimi) + " " + decodeURI(sukunimi)+ " poisto onnistui."); //decodeURI() muutetaan enkoodatut merkit takaisin normaaliksi kirjoitukseksi
			haeAsiakkaat();        	
		}
   	})
   	.catch(errorText => console.error("Fetch failed: " + errorText));
}	


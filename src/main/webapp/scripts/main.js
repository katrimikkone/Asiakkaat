
function tutkiJaPaivita(){
	if(tutkiTiedot()){
		paivitaTiedot();
	}
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
	teksti=teksti.replace(/;/g, "");//&#59;
	teksti=teksti.replace(/'/g, "''");//&apos;
	return teksti;
}



function serialize_form(form){
	return JSON.stringify(
		Array.from(new FormData(form).entries())
			.reduce((m, [ key, value]) => Object.assign(m, { [key]: value }), {})
	);
}

//funktio arvon lukemiseen urlista avaimen perusteella
function requestURLParam(sParam){
    let sPageURL = window.location.search.substring(1);
    let sURLVariables = sPageURL.split("&");
    for (let i = 0; i < sURLVariables.length; i++){
        let sParameterName = sURLVariables[i].split("=");
        if(sParameterName[0] == sParam){
            return sParameterName[1];
        }
    }
}


function varmistaPoisto(asiakas_id, nimi){
	if(confirm("Poista asiakas " + decodeURI(nimi) +"?")){ //decodeURI() muutetaan enkoodatut merkit takaisin normaaliksi kirjoitukseksi
		poistaAsiakas(asiakas_id, nimi);
	}
}



function asetaFocus(target){
	document.getElementById(target).focus();
}

function tutkiKey(event, target) {
	if(event.keyCode==13){//13=Enter
		if(target=="listaa"){
			haeAsiakkaat();
		}else if(target="lisaa") {
			tutkiJaLisaa();
		}else if(target="paivita") {
			tutkiJaPaivita();
		}
	}else if(event.keyCode==113){
		document.location="listaaasiakkaat.jsp";
	}
}



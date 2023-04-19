package test;

import static org.junit.jupiter.api.Assertions.*;

import java.util.ArrayList;

import org.junit.jupiter.api.MethodOrderer.OrderAnnotation;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import model.Asiakas;
import model.dao.Dao;

@TestMethodOrder(OrderAnnotation.class)
class JUnitTestaaAsiakkaat {

	@Test
	@Order(1)
	public void testPoistaKaikkiAsiakkaat() {
		Dao dao = new Dao();
		dao.removeAllItems("Nimda");
		ArrayList<Asiakas> asiakkaat = dao.getAllItems();
		assertEquals(0, asiakkaat.size());		
	}
	
	@Test
	@Order(2)
	public void testLisaaAsiakkaat() { // ei mee läpi
		Dao dao = new Dao();
		Asiakas asiakas_1 = new Asiakas(1,"Martti", "Mähönen", "050123456", "mm@mail.fi");
		Asiakas asiakas_2 = new Asiakas(2,  "Kerttu", "Aalto", "045612389", "ka@mail.fi");
		Asiakas asiakas_3 = new Asiakas(3,"Taiju", "Laine", "041234657", "tl@mail.fi");
		Asiakas asiakas_4 = new Asiakas(4,"Saija", "Meri", "0509876541", "sm@mail.fi");
		assertEquals(true, dao.addItem(asiakas_1)); //tai assertTrue(dao.addItem(auto_1));	
		assertEquals(true, dao.addItem(asiakas_2));
		assertEquals(true, dao.addItem(asiakas_3));
		assertEquals(true, dao.addItem(asiakas_4)); 	
		assertEquals(4, dao.getAllItems().size());	
	}
	
	@Test
	@Order(3)
	public void testMuutaAsiakas() {
		Dao dao = new Dao();		
		ArrayList<Asiakas>asiakkaat = dao.getAllItems("Martti");		
		asiakkaat.get(0).setEtunimi("Marttina");	//haetaan yksi asiakas ja asetetaan etunimi	
		dao.changeItem(asiakkaat.get(0)); //muutetaan
		asiakkaat = dao.getAllItems("Marttina");
		assertEquals("Marttina", asiakkaat.get(0).getEtunimi());
		assertEquals("Mähönen", asiakkaat.get(0).getSukunimi());
		assertEquals("050123456", asiakkaat.get(0).getPuhelin());
		assertEquals("mm@mail.fi", asiakkaat.get(0).getSposti());		
		
	}
	@Test
	@Order(4) 
	public void testPoistaAsiakas() {
		//Poistetaan se auto, jonka rekisterinumero on A-1
		Dao dao = new Dao();
		ArrayList<Asiakas> asiakkaat = dao.getAllItems("1");
		dao.removeItem(asiakkaat.get(0).getAsiakas_id());
		assertEquals(0, dao.getAllItems("1").size());					
	}
	
	@Test
	@Order(5) 
	public void testHaeOlematonAsiakas() {
		//Haetaan asiakas,jonka id on -1
		Dao dao = new Dao();
		assertNull(dao.getItem(-1));
	}
	

}

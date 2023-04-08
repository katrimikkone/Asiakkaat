package control;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.stream.Collectors;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;

import model.Asiakas;
import model.dao.Dao;

@WebServlet("/asiakkaat/*")
public class Asiakkaat extends HttpServlet {
	private static final long serialVersionUID = 1L;
 
    public Asiakkaat() {
       System.out.println("Asiakkaat.Asiakkaat()");
       
    }

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		System.out.println("Asiakkaat.doGet()");
		String hakusana = request.getParameter("hakusana");
		Dao dao = new Dao();
		ArrayList<Asiakas> asiakkaat;
		String strJSON ="";

		if(hakusana!=null) {
			if(!hakusana.equals("")) {//jos hakusana ei ole tyhjä
				asiakkaat = dao.getAllItems(hakusana);
			}else {
				asiakkaat = dao.getAllItems();
			}
			strJSON = new Gson().toJson(asiakkaat); //muuttaa haun json string objektiksi, ei selaimeen
		}

		response.setContentType("application/json; charset=UTF-8");
		PrintWriter out = response.getWriter(); //json -> selaimeen
		out.println(strJSON); //tämä backend minkä frontti lukee
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		System.out.println("Asiakkaat.doPost()");
		String strJSONInput = request.getReader().lines().collect(Collectors.joining());
		Asiakas asiakas = new Gson().fromJson(strJSONInput, Asiakas.class);//Gson generoi auton Asiakas modelin perusteella niiden tietojen mukaan mitä strJSONInputssa on
		//System.out.println(asiakas);
		Dao dao = new Dao();
		response.setContentType("application/json; charset=UTF-8");
		PrintWriter out = response.getWriter();
		if(dao.addItem(asiakas)) {
			out.println("{\"response\":1}");
		}else {
			out.println("{\"response\":0}");
		}
	}

	protected void doPut(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		System.out.println("Asiakkaat.doPut()");
	}
	//Tietojen poistaminen
	protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		System.out.println("Asiakkaat.doDelete()");
		int id = Integer.parseInt(request.getParameter("id"));//tämä id tulee kutsun mukana merkkimuodossa, siksi parseroidaan
		Dao dao = new Dao();
		response.setContentType("application/json; charset=UTF-8");
		PrintWriter out = response.getWriter();
		if(dao.removeItem(id)) {
			out.println("{\"response\":1}"); //onnistui
		}else {
			out.println("{\"response\":0}"); //epäonnistui
		}
	}

}

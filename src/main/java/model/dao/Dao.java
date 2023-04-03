package model.dao;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;

import model.Asiakas;

public class Dao {
	private Connection con = null;
	private ResultSet rs = null;
	private PreparedStatement stmtPrep =null;
	private String sql;
	private String db = "Myynti.sqlite";
	
	private Connection yhdista() {
		Connection con = null;
		String path = System.getProperty("catalina.base");
		path = path.substring(0, path.indexOf(".metadata")).replace("\\", "/"); // Eclipsessa
		//System.out.println(path); //T�st� n�et mihin kansioon laitat tietokanta-tiedostosi
		// path += "/webapps/"; //Tuotannossa. Laita tietokanta webapps-kansioon
		String url = "jdbc:sqlite:" + path + db;
		try {
			Class.forName("org.sqlite.JDBC");
			con = DriverManager.getConnection(url);
			System.out.println("Yhteys avattu.");
		} catch (Exception e) {
			System.out.println("Yhteyden avaus ep�onnistui.");
			e.printStackTrace();
		}
		return con;
	}

	private void sulje() {		
		if (stmtPrep != null) {
			try {
				stmtPrep.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
		if (rs != null) {
			try {
				rs.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
		if (con != null) {
			try {
				con.close();
				System.out.println("Yhteys suljettu.");
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
	}
	
	public ArrayList<Asiakas> getAllItems() {
		ArrayList<Asiakas> asiakkaat = new ArrayList<Asiakas>();
		sql = "SELECT * FROM asiakkaat ORDER BY asiakas_id DESC";
		try {
			con = yhdista();
			if(con!=null) {
				stmtPrep = con.prepareStatement(sql);//kyselyn valmistelu
				rs=stmtPrep.executeQuery(); //ajo
				if(rs!=null) { //jos kysely onnistui
					while(rs.next()) {
						Asiakas asiakas = new Asiakas();
						asiakas.setAsiakas_id(rs.getInt(1));
						asiakas.setEtunimi(rs.getString(2));
						asiakas.setSukunimi(rs.getString(3));
						asiakas.setPuhelin(rs.getString(4));
						asiakas.setSposti(rs.getString(5));
						asiakkaat.add(asiakas);
					}
				}
			}
		}catch(Exception e) {
			e.printStackTrace();
		}finally {
			sulje();
		}
		return asiakkaat;
		
	}
	
	public ArrayList<Asiakas> getAllItems(String searchStr){
		ArrayList<Asiakas> asiakkaat = new ArrayList<Asiakas>();
		sql= "SELECT * FROM asiakkaat WHERE etunimi LIKE ? OR sukunimi LIKE ? OR puhelin LIKE ? OR sposti LIKE ? ORDER BY sukunimi";
		try {
			con=yhdista();
			if(con!=null) {
				stmtPrep=con.prepareStatement(sql);
				stmtPrep.setString(1,"%" + searchStr + "%");
				stmtPrep.setString(2,"%" + searchStr + "%");
				stmtPrep.setString(3,"%" + searchStr + "%");
				stmtPrep.setString(4,"%" + searchStr + "%");
				rs=stmtPrep.executeQuery();
				if(rs!=null) {
					while(rs.next()) {
						Asiakas a = new Asiakas();
						a.setAsiakas_id(rs.getInt(1));
						a.setEtunimi(rs.getString(2));
						a.setSukunimi(rs.getString(3));
						a.setPuhelin(rs.getString(4));
						a.setSposti(rs.getString(5));
						asiakkaat.add(a);
						
					}
				}
			}
		}catch(Exception e) {
			e.printStackTrace();
		}finally {
			sulje();
		}
		return asiakkaat;
	}
}


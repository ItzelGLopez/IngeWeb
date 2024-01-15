import {conn} from '../../db.js';

export async function getAllUsers(){
  const strSql = 'SELECT * FROM Proyecto.Usuario;';    
  const [result] = await conn.query(strSql);  // callback
  return result;
}

export async function getUserById(username){  
  const strSql = 'SELECT * FROM Proyecto.Usuario WHERE username = ?';   
  const [result] = await conn.query(strSql,[username]);      
  return result;
}

export async function getUserByEmail(useremail){  
  const strSql = 'SELECT * FROM Proyecto.Usuario WHERE useremail = ?';   
  const [result] = await conn.query(strSql,[useremail]);      
  return result;
}

export async function registerUser(username, useremail, userpasswd, userquestion, useranswer, userposition) {
  try {
    const strSql = 'INSERT INTO Proyecto.Usuario (username, useremail, userpasswd, userquestion, useranswer, userposition) VALUES (?, ?, ?, ?, ?, ?)';
    const [result] = await conn.query(strSql, [username,useremail, userpasswd, userquestion, useranswer, userposition]);
    return result;
  } catch (error) {
    throw error;
  }
}

export async function modifica( useremail, userpasswd) {
  try {
    const strSql = 'UPDATE Proyecto.Usuario SET userpasswd = ? WHERE useremail = ?';
    const [result] = await conn.query(strSql, [userpasswd, useremail]);
    return result;
  } catch (error) {
    throw error;
  }
}

export async function pregunta( useremail) {
  try {
    const strSql = 'SELECT userquestion FROM Proyecto.Usuario WHERE useremail = ?';
    const [result] = await conn.query(strSql, [useremail]);
    return result[0] ? result[0].userquestion : null;
  } catch (error) {
    throw error;
  }
}

export async function nusuario( useremail) {
  try {
    const strSql = 'SELECT username FROM Proyecto.Usuario WHERE useremail = ?';
    const [result] = await conn.query(strSql, [useremail]);
    return result[0] ? result[0].username : null;
  } catch (error) {
    throw error;
  }
}


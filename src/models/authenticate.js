
import HttpStatus from 'http-status-codes'
import ip from 'ip'
import bcrypt from 'bcrypt'
import validator from 'validator'
import jwt from 'jsonwebtoken'
import moment from 'moment'

import logger from '../config/winston'
import { Database } from '../config/db'
let conn = new Database()

/**
 * Returns jwt token if valid email and password is provided
 *
 * @param {object} req
 * @param {object} res
 * @returns {*}
 */
const Authenticate = (req, res) => {

  const { email, password } = req.body

  // // validate input
  if (validator.isEmpty(email)) {
    res.status(HttpStatus.UNAUTHORIZED).json({
      error: true,
      message: 'Email is required.'
    })
  }
  if (!validator.isEmail(email)) {
    res.status(HttpStatus.UNAUTHORIZED).json({
      error: true,
      message: 'Email must be valid.'
    })
  }
  else if (validator.isEmpty(password)) {
    res.status(HttpStatus.UNAUTHORIZED).json({
      error: true,
      message: 'Password is required.'
    })
  }
  else {
    let user
    conn.query(`SELECT * FROM users WHERE email = ? LIMIT 1`, email)
      .then( rows => {
        if (rows.length){
          let dbPass = rows[0].password
          let passMatch = bcrypt.compareSync(password, dbPass)
          if (passMatch) {
            user = rows[0]

            // Set last login date
            let login_date = moment().format('YYYY-MM-DD HH:mm:ss')
            return conn.query(`UPDATE users SET last_login = ? WHERE id = ?`, [login_date, user.id])
          }
          else {
            throw 'Incorrect email or password.'
          }
        }
        else {
          throw 'Incorrect email or password.'
        }
      })
      .then( rows => {
        // If last login date updated
        if (rows.affectedRows === 1) {
          // Return token
          const token = jwt.sign({
            uid: user.id,
            email: user.email,
            access_level: user.access_level
          }, process.env.TOKEN_SECRET_KEY)

          logger.info('user-login', {
            ip: ip.address(),
            email: user.email,
            message: 'Login success.'
          })
          res.json({token})
        }
        else {
          throw 'Can\'t update user.'
        }
      })
      .catch( err => {
        let status = err.sqlMessage ? HttpStatus.INTERNAL_SERVER_ERROR : HttpStatus.UNAUTHORIZED
        let msg = err.sqlMessage ? err.sqlMessage : err

        logger.error('user-login', {
          ip: ip.address(),
          message: msg
        })

        res.status(status).json({
          error: true,
          message: msg
        })
      })

  }


}

export default Authenticate

const common = require("../../../../utilities/common");
const database = require("../../../../config/database");
const response_code = require("../../../../utilities/response-error-code");
const {default: localizify} = require('localizify');
const { t } = require("localizify");
const jwt = require('jsonwebtoken');
let bcrypt = require("bcrypt");
const moment = require("moment");

class AdminModel {
    async login_admin(request_data) {
        try {
           const emailExists = await common.checkEmailAdmin(request_data.email_id);
           
                           if (!emailExists) {
                               return {
                                   code: response_code.OPERATION_FAILED,
                                   message: t('invalid_email'), 
                                   data: null 
                               }; 
                           }
                            const checkLoginQuery = `SELECT * FROM tbl_admin WHERE email_id = ? AND is_login = 1`;
                            const [loginCheckResult] = await database.query(checkLoginQuery, [request_data.email_id]);
                            if (loginCheckResult.length > 0) {
                                return {
                                    code: response_code.OPERATION_FAILED,
                                    message: t('user_already_logged_in'),
                                    data: null
                                };
                            }
           
                           let sql = `email_id = '${request_data.email_id}' and is_deleted = 0`;
                           let userDetails = await common.getAdmin(sql)
                           if (!userDetails) {
                               return {
                                   code: response_code.OPERATION_FAILED,
                                   message: t('user_not_found'),
                                   data: null
                               };
                           }
                           
                       if (bcrypt.compareSync(request_data.password_, userDetails.password_)) {
                           if (userDetails.is_active == 1) {
                   
                               const user_token = jwt.sign(
                                   { id: userDetails.admin_id },
                                   process.env.JWT_SECRET,

                                   { expiresIn: '1d' }
                               );
                               
                               let updateData = {
                                   last_login: moment().utc().format('YYYY-MM-DD HH:mm:ss'),
                                   is_login: 1
                               };
           
                               
                               await common.updateAdminData(userDetails.admin_id, updateData);
                               let userInfo = await common.getUserInfo(userDetails.admin_id);
                            
                               const responseData = {
                                   userInfo: userInfo,
                                   user_token: user_token
                               };
                               return {
                                   code: response_code.SUCCESS,
                                   message:  t('text_login_success'),
                                   data: responseData
                               };
                   
                           } else {
                               return {
                                   code: response_code.INACTIVE_ACCOUNT,
                                   message:  t('text_invalid_password'),
                                   data: null
                               };
                           }
                       } else {
                           return {
                               code: response_code.OPERATION_FAILED,
                               message: 'text_invalid_password',
                               data: null
                           };
                       }
                       
        } catch (error) {
            console.error("Login error:", error);
            return {
                code: response_code.OPERATION_FAILED,
                message: error.sqlMessage || error.message
            };
        }
    }

    async canViewProgress(id) {
        try{
            const user_id = id
            const userQuery = `SELECT hs.habit_id,hs.current_streak,hs.longest_streak,hs.last_completed,h.name,h.goal_type , h.created_at,
	        hl.date,hl.status,h.name,h.goal_type , h.created_at
            FROM tbl_habits h
            INNER JOIN tbl_habit_streaks hs ON hs.habit_id = h.habit_id
            inner join tbl_habit_logs hl on hl.habit_id = h.habit_id 
            WHERE h.user_id = ?`;
            const [userResult] = await database.query(userQuery, [user_id]);
            const data = userResult.map((row) => {
                return {
                    habit_id: row.habit_id,
                    current_streak: row.current_streak,
                    longest_streak: row.longest_streak,
                    last_completed: row.last_completed,
                    name: row.name,
                    goal_type: row.goal_type,
                    created_at: row.created_at,
                    date: row.date,
                    status: row.status
                };
            });
            if (userResult.length > 0) {
               return {
                    code: response_code.SUCCESS,
                    message: t('user_data_found'),
                    data: data
                };
            } else {
                return {
                    code: response_code.OPERATION_FAILED,
                    message: t('user_not_found'),
                    data: null
                };
            }
        }catch(error){
            console.error("Error in canViewProgress:", error);
            return {
                code: response_code.OPERATION_FAILED,
                message: error.sqlMessage || error.message
            }; 
            
        }
    }
 
    async getAllUsers(){
        try {
            const userQuery = `SELECT user_id,full_name,email_id FROM tbl_user`;
            const [userResult] = await database.query(userQuery);
            if (userResult.length > 0) {

                const data = userResult.map((row) => {
                    return {
                        user_id: row.user_id,
                        full_name: row.full_name,
                        email_id: row.email_id
                    };
                });
                return {
                    code: response_code.SUCCESS,
                    message: t('user_data_found'),
                    data: data
                };
            } else {
                return null;
            }
        } catch (error) {
            console.error("Error in getUserInfo:", error);
            return null;
        }
    }

    


}
    
    
    



module.exports = new AdminModel();
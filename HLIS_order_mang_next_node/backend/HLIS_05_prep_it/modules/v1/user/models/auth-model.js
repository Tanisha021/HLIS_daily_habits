const common = require("../../../../utilities/common");
const database = require("../../../../config/database");
const response_code = require("../../../../utilities/response-error-code");
const { default: localizify } = require('localizify');
const { t } = require("localizify");
const moment = require("moment");
const jwt = require('jsonwebtoken');
let bcrypt = require("bcrypt");
class UserModel {

    async signUp(request_data) {
        try {
            const checkEmailUnique = await common.checkEmail(request_data.email_id);
            if (checkEmailUnique) {
                const signUpData = {
                    full_name: request_data.full_name,
                    email_id: request_data.email_id,
                    password_: bcrypt.hashSync(request_data.password_, 10),
                };


                const sql = "INSERT INTO tbl_user SET ?";
                const [data] = await database.query(sql, [signUpData]);

                if (!data.insertId) {
                    return {
                        code: response_code.OPERATION_FAILED,
                        message: t('user_registration_failed'),
                        data: null
                    };
                }

                const user_id = data.insertId;
                const user_token = jwt.sign(
                    { id: user_id },
                    process.env.JWT_SECRET,
                    { expiresIn: '1d' }
                )

                const userInfo = await common.getUserInfo(user_id);
                console.log("userInfo", userInfo);

                if (!userInfo) {
                    return {
                        code: response_code.OPERATION_FAILED,
                        message: t('user_info_failed'),
                        data: null
                    };
                }

                const responseData = {
                    userInfo: userInfo,
                    user_token: user_token
                };

                return {
                    code: response_code.SUCCESS,
                    message: "Signup successfully",
                    data: responseData
                };
            } else {
                return {
                    code: response_code.OPERATION_FAILED,
                    message: t('email_already_exists'),
                    data: null
                };
            }


        } catch (error) {
            console.error("Error in signUp:", error);
            return {
                code: response_code.OPERATION_FAILED,
                message: t('some_error_occurred'),
                data: error.message
            };
        }
    }

    async login(request_data) {
        try {
            const emailExists = await common.checkEmail(request_data.email_id);

            if (emailExists) {
                return {
                    code: response_code.OPERATION_FAILED,
                    message: t('invalid_email'),
                    data: null
                };
            } else {
                const is_login = await common.check_user_login(request_data.email_id);
                if (is_login) {
                    return {
                        code: response_code.OPERATION_FAILED,
                        message: t('already_login'),
                        data: null
                    }
                }


                let sql = `email_id = '${request_data.email_id}' and is_deleted = 0`;
                let userDetails = await common.getUser(sql)
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
                            { id: userDetails.user_id },
                            process.env.JWT_SECRET,
                            { expiresIn: '7d' }
                        );

                        console.log("user_token", user_token);

                        let updateData = {
                            last_login: moment().utc().format('YYYY-MM-DD HH:mm:ss'),
                            is_login: 1
                        };


                        await common.updateUserData(userDetails.user_id, updateData);
                        let userInfo = await common.getUserInfo(userDetails.user_id);

                        const responseData = {
                            userInfo: userInfo,
                            user_token: user_token
                        };
                        console.log("responseData", responseData);
                        return {
                            code: response_code.SUCCESS,
                            message: t('text_login_success'),
                            data: responseData
                        };

                    } else {
                        return {
                            code: response_code.INACTIVE_ACCOUNT,
                            message: t('text_invalid_password'),
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
            }
        }
        catch (error) {
            console.error("Error in login:", error);
            return {
                code: response_code.OPERATION_FAILED,
                message: t('some_error_occurred'),
                data: error.message
            };
        }
    }

    async logout(user_id) {
        try {
            console.log("jabba", user_id);
            const user_data = await common.getUserInfo(user_id);
            console.log("user_data", user_data)
            if (user_data) {
                const [data] = await database.query(`UPDATE tbl_user set is_login = 0 where user_id = ?`, [user_id]);
                if (data.affectedRows > 0) {
                    return {
                        code: response_code.SUCCESS,
                        message: "Logout Success",
                        data: user_id
                    }
                } else {
                    return {
                        code: response_code.OPERATION_FAILED,
                        message: "Failed to Update User Login Status",
                        data: null
                    }
                }
            } else {
                return {
                    code: response_code.NOT_FOUND,
                    message: "User Not Found",
                    data: null
                }
            }

        } catch (error) {
            console.log(error.message);
            return {
                code: response_code.OPERATION_FAILED,
                message: "Internal Server Error",
                data: null
            }
        }
    }

}
module.exports = new UserModel();
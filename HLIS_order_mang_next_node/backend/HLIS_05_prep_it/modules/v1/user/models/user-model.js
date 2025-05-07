const database = require("../../../../config/database");
const { status } = require("../../../../language/en");
const common = require("../../../../utilities/common");
const response_code = require("../../../../utilities/response-error-code");
const { t } = require("localizify");

class UserModel {

    async addHabitType(request_data,user_id) {
        try{
            const data = {
                user_id: user_id,
                name: request_data.name,
            }
            const [result] = await database.query(`INSERT INTO tbl_habit_types SET ?`, [data]);
            if(result.affectedRows > 0){
                return {
                    code: response_code.SUCCESS,
                    message: t('habit_added_successfully'),
                    data: null
                };
            }else{
                return {
                    code: response_code.OPERATION_FAILED,
                    message: t('habit_add_failed'),
                    data: null
                };
            }
        }catch(error) {
            console.log(error);
            return {
                code: response_code.OPERATION_FAILED,
                message: t('some_error_occurred'),
                data: error.message
            };
        }
    }

    async createHabit(request_data, user_id) {
        try{
            const data = {
                user_id: user_id,
                name: request_data.name,
                habit_type_id: request_data.habit_type_id,
                goal_type: request_data.goal_type,
                goal_target: request_data.goal_target
            }
            const [result] = await database.query(`INSERT INTO tbl_habits SET ?`, [data]);
            if(result.affectedRows > 0){

                const habit_id = result.insertId;
                const data={
                    user_id: user_id,
                    habit_id: habit_id,
                    reminder_time: request_data.reminder_time,
                    message: request_data.message
                }
                const [resultData] = await database.query(`INSERT INTO tbl_habit_reminders SET ?`, [data]);
                if(resultData.affectedRows > 0){
                    return {
                        code: response_code.SUCCESS,
                        message: t('reminder_added_successfully'),
                        data: null
                    };
                }



                else{
                    return {
                        code: response_code.OPERATION_FAILED,
                        message: t('reminder_add_failed'),
                        data: null
                    };
                }

            }else{
                return {
                    code: response_code.OPERATION_FAILED,
                    message: t('habit_create_failed'),
                    data: null
                };
            }
        }catch(error) {
            console.log(error);
            return {
                code: response_code.OPERATION_FAILED,
                message: t('some_error_occurred'),
                data: error.message
            };
        }
    }

    async logHabit(request_data, user_id) {
        try{
            const data = {   
                user_id: user_id,
                habit_id: request_data.habit_id,
                status: request_data.status
            }
            if (request_data.date) {
                data.date = request_data.date;
            }
            const [result] = await database.query(`INSERT INTO tbl_habit_logs SET ?`, [data]);
            if(result.affectedRows > 0){
                
                const [streakResult] = await database.query(`SELECT * FROM tbl_habit_streaks WHERE habit_id = ?`, [request_data.habit_id]);
                if(streakResult.length > 0){
                    const streakData = streakResult[0];
                    let current_streak = streakData.current_streak;
                    let longest_streak = streakData.longest_streak;
                    let last_completed = streakData.last_completed;

                    if (request_data.status === 'completed') {
                        const lastCompletedDate = new Date(streakData.last_completed);
                        const newCompletedDate = new Date(request_data.date);
                    
                        const hoursDiff = Math.abs(newCompletedDate - lastCompletedDate) /( 60*60*1000); 
                    
                        if (hoursDiff > 24) {
                            current_streak = 1;
                        } else {
                            current_streak += 1;
                        }
                    
                        if (current_streak > longest_streak) {
                            longest_streak = current_streak;
                        }
                    
                        last_completed = request_data.date;
                    } else {
                        current_streak = 0;
                    }

                    const updateData = {
                        current_streak: current_streak,
                        longest_streak: longest_streak,
                        last_completed: last_completed
                    }
                    await database.query(`UPDATE tbl_habit_streaks SET ? WHERE habit_id = ?`, [updateData, request_data.habit_id]);
                }else{
                    const streakData = {
                        habit_id: request_data.habit_id,
                        current_streak: request_data.status === 'completed' ? 1 : 0,
                        longest_streak: request_data.status === 'completed' ? 1 : 0,
                        last_completed: request_data.status === 'completed' ? request_data.date : null
                    }
                    await database.query(`INSERT INTO tbl_habit_streaks SET ?`, [streakData]);
                }
                
                return {
                    code: response_code.SUCCESS,
                    message: t('habit_logged_successfully'),
                    data: null
                };
            }else{
                return {
                    code: response_code.OPERATION_FAILED,
                    message: t('habit_log_failed'),
                    data: null
                };
            }
        }catch(error) {
            console.log(error);
            return {
                code: response_code.OPERATION_FAILED,
                message: t('some_error_occurred'),
                data: error.message
            };
        }
    }

    async getLogs(user_id){
        try{

            const getLogsQuery = `SELECT hl.date,hl.status,h.name,h.goal_type , h.created_at,h.habit_id,h.habit_type_id,ht.name as habit_type_name
            FROM tbl_habit_types ht
            INNER JOIN tbl_habits h ON ht.habit_type_id = h.habit_type_id
            left JOIN tbl_habit_logs hl ON hl.habit_id = h.habit_id
            WHERE h.user_id = ?`;

            const [result] = await database.query(getLogsQuery, [user_id]);
            if(result.length > 0){
                return {
                    code: response_code.SUCCESS,
                    message: t('logs_fetched_successfully'),
                    data: result
                };
            }else{
                return {
                    code: response_code.NOT_FOUND,
                    message: t('no_logs_found'),
                    data: null
                };
            }

        }catch(error){
            console.log(error);
            return {
                code: response_code.OPERATION_FAILED,
                message: t('some_error_occurred'),
                data: error.message
            }; 
        }
    }

    async getHabitStreaks(user_id){
        try{

            const getStreaksQuery = `SELECT hs.habit_id,hs.current_streak,hs.longest_streak,hs.last_completed,h.name,h.goal_type , h.created_at
            FROM tbl_habit_streaks hs
            INNER JOIN tbl_habits h ON hs.habit_id = h.habit_id
            WHERE h.user_id = ?`;

            const [result] = await database.query(getStreaksQuery, [user_id]);
            if(result.length > 0){
                return {
                    code: response_code.SUCCESS,
                    message: t('streaks_fetched_successfully'),
                    data: result
                };
            }else{
                return {
                    code: response_code.NOT_FOUND,
                    message: t('no_streaks_found'),
                    data: null
                };
            }

        }catch(error){
            console.log(error);
            return {
                code: response_code.OPERATION_FAILED,
                message: t('some_error_occurred'),
                data: error.message
            }; 
        }
    }

    async getSuggestedHabits(user_id) {
    try {
        const getUserHabitTypesQuery = `SELECT habit_type_id FROM tbl_habits WHERE user_id = ?`;
        const [userHabitTypes] = await database.query(getUserHabitTypesQuery, [user_id])

        if (userHabitTypes.length === 0) {
            return {
                code: response_code.NOT_FOUND,
                message: t('no_habits_for_user'),   
                data: []
            }; 
        }
        const habitTypeIds = userHabitTypes.map(habit => habit.habit_type_id);
        const placeholders = habitTypeIds.map(() => '?').join(',')
        console.log("placeholders",placeholders);
        console.log("habituds",habitTypeIds);
        const getSuggestedHabitsQuery = `
        SELECT * 
        FROM tbl_suggested_habits
        WHERE is_active = 1
        AND is_deleted = 0
        AND habit_type_id IN (${placeholders})
      `;
        const [suggestedHabits] = await database.query(getSuggestedHabitsQuery, habitTypeIds);

        if (suggestedHabits.length === 0) {
            return { 
                code: response_code.NO_SUGGESTIONS,
                message: t('no_suggested_habits_for_user'),
                data: []
            };
        }

        return {
            code: response_code.SUCCESS,
            message: t('suggested_habits_found'),
            data: suggestedHabits
        };
    } catch (error) {
        console.log(error);
        return {
            code: response_code.OPERATION_FAILED,
            message: t('some_error_occurred'),
            data: error.message
        };
    }

}

    async getHabitTypes(user_id) {
        try {
            const getHabitTypesQuery = `SELECT name,user_id,habit_type_id FROM tbl_habit_types WHERE is_active = 1 AND is_deleted = 0`;
            const [result] = await database.query(getHabitTypesQuery, [user_id]);
            if (result.length > 0) {
                return {
                    code: response_code.SUCCESS,
                    message: t('habit_types_fetched_successfully'),
                    data: result
                };
            } else {
                return {
                    code: response_code.NOT_FOUND,
                    message: t('no_habit_types_found'),
                    data: null
                };
            }
        } catch (error) {
            console.log(error);
            return {
                code: response_code.OPERATION_FAILED,
                message: t('some_error_occurred'),
                data: error.message
            };
        }
    }

    async getAllReminder(user_id){
        try{
            const selectQuery = `select r.reminder_time ,r.message,h.name,h.goal_type,h.goal_target from tbl_habit_reminders r inner join tbl_habits as h
                on r.habit_id = h.habit_id where r.user_id = ?`;
            const [result] = await database.query(selectQuery, [user_id]); 
           
            const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const filteredResult = result.filter(item => {
                const reminderTime = new Date(item.reminder_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                return reminderTime > currentTime;
            });
            if(filteredResult.length > 0){
                return {
                    code: response_code.SUCCESS,
                    message: t('reminder_fetched_successfully'),
                    data: filteredResult
                };
            }
            else{
                return {
                    code: response_code.NOT_FOUND,
                    message: t('no_reminder_found'),
                    data: null
                };
            }

        }catch(error){
            console.log(error);
            return {
                code: response_code.OPERATION_FAILED,
                message: t('some_error_occurred'),
                data: error.message
            }; 
        }
    }

}
module.exports = new UserModel();

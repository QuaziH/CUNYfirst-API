require('dotenv').config();
const db = require('./db/index');
// const text = require('./text');
const api = require('./cf-api');

db.query(`SELECT DISTINCT institution, term, subject FROM classes`, async (error, response) => {
    if (error){
        return console.error('Error fetching client', error);
    }
    console.log(response);
    for(let i = 0; i < response.rows.length; i++){
        let allClasses = await api.getAllSections(`${response.rows[i].institution}`, `${response.rows[i].term}`, `${response.rows[i].subject}`);
        db.query(`SELECT phone, carrier, class_num FROM classes WHERE institution='${response.rows[i].institution}' AND term='${response.rows[i].term}' AND subject='${response.rows[i].subject}'`, (error, response) => {
            if (error) {
                return console.error('Error fetching client', error);
            }

            for(let j = 0; j < response.rows.length; j++) {
                let status;
                try {
                    status = allClasses[response.rows[j].class_num].Status;
                } catch (err) {
                    //text them that their class might not exist anymore in CUNYfirst
                    //delete
                    // db.query(`DELETE FROM classes WHERE phone='${response.row[j].phone}' AND class_num=${response.row[j].class_num}`, (err, res) => {
                    //     if(err) {
                    //         console.error(`Error deleting from database: ${err}`);
                    //     }
                    // });
                }
                console.log(`${response.rows[j].class_num} ${status}`);
                //
                // if(status === 'Closed') {
                //     //do nothing...?
                // } else if (status === 'Open'){
                //     //text
                //     //delete by class num and phone num
                //     db.query(`DELETE FROM classes WHERE phone='${response.row[j].phone}' AND class_num=${response.row[j].class_num}`, (err, res) => {
                //         if(err) {
                //             console.error(`Error deleting from database: ${err}`);
                //         }
                //     });
                // } else {
                //     //text if status doesn't exist
                //     //delete
                //     //^ might not need this cause of catch
                // }
            }
        });
    }
});
const db = require('./db/index');
// const text = require('./text');
const api = require('./cf-api');

db.query(`SELECT DISTINCT institution, term, subject FROM classes`, async (error, response) => {
    if (error){
        return console.error('Error fetching client', error);
    }
    // console.log(response.rows);
    for(let i = 0; i < response.rows.length; i++){
        let allClasses = await api.getAllSections(`${response.rows[i].institution}`, `${response.rows[i].term}`, `${response.rows[i].subject}`);
        db.query(`SELECT class_num FROM classes WHERE institution='${response.rows[i].institution}' AND term='${response.rows[i].term}' AND subject='${response.rows[i].subject}'`,(error, response) => {
            if (error) {
                return console.error('Error fetching client', error);
            }
            // console.log(response);
            for(let j = 0; j < response.rows.length; j++) {
                let status = allClasses[response.rows[j].class_num].Status;
                console.log(`${response.rows[j].class_num} ${status}`);
                if(status === 'Closed') {
                    //go to the next number
                } else if (status === 'Open'){
                    //text
                    //delete by class num and phone num
                } else {
                    //text if status doesn't exist
                    //delete
                }
            }
        });
    }
});

// db.query("SELECT phone FROM classes WHERE institution='QNS01' AND term='1182' AND subject='CSCI'",(error, response) => {
//     if (error) {
//         return console.error('Error fetching client', error);
//     }
//     console.log(response);
// });
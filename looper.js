const db = require('./db/index');
const text = require('./text');
const api = require('./cf-api');

db.query(`SELECT DISTINCT institution, term, subject FROM classes`, async (error, response) => {
    if (error){
        return console.error('Error fetching client', error);
    }
    // console.log(response);
    for(let i = 0; i < response.rows.length; i++){
        let allClasses = await api.getAllSections(`${response.rows[i].institution}`, `${response.rows[i].term}`, `${response.rows[i].subject}`);
        db.query(`SELECT phone, carrier, topic, class_num FROM classes WHERE institution='${response.rows[i].institution}' AND term='${response.rows[i].term}' AND subject='${response.rows[i].subject}'`, (error, response) => {
            if (error) {
                return console.error('Error fetching client', error);
            }

            for(let j = 0; j < response.rows.length; j++) {
                let status;
                try {
                    status = allClasses[response.rows[j].class_num].Status;
                } catch (e) {
                    //text them that their class might not exist anymore in CUNYfirst
                    //delete
                    if(response.rows[j].carrier === '@tmomail.net' || response.rows[j].carrier === '@mymetropcs.com'){
                        text.emailError(`${response.rows[j].phone}${response.rows[j].carrier}`, `Your class ${response.rows[j].topic}- ${response.rows[j].class_num} does not exist in CUNYfirst anymore`);
                    } else {
                        //twilio
                        text.twilio(`${response.rows[j].phone}`, `Uh oh! \n Your class ${response.rows[j].topic}- ${response.rows[j].class_num} does not exist in CUNYfirst anymore`);
                    }
                    db.query(`DELETE FROM classes WHERE phone='${response.rows[j].phone}' AND class_num=${response.rows[j].class_num}`, (err, res) => {
                        if(err) {
                            console.error(`Error deleting from database: ${err}`);
                        }
                    });
                    continue;
                }

                if(status === 'Closed') {
                    //do nothing...?
                    console.log(`Class is still closed ${response.rows[j].class_num}`);
                } else if (status === 'Open'){
                    //text
                    //delete by class num and phone num
                    if(response.rows[j].carrier === '@tmomail.net' || response.rows[j].carrier === '@mymetropcs.com'){
                        text.emailOpen(`${response.rows[j].phone}${response.rows[j].carrier}`, `Your class ${response.rows[j].topic}- ${response.rows[j].class_num} is now open!`);
                    } else {
                        //twilio
                        text.twilio(`${response.rows[j].phone}`, `Class Opened! \n Your class ${response.rows[j].topic}- ${response.rows[j].class_num} is now open!`);
                    }
                    db.query(`DELETE FROM classes WHERE phone='${response.rows[j].phone}' AND class_num=${response.rows[j].class_num}`, (err, res) => {
                        if(err) {
                            console.error(`Error deleting from database: ${err}`);
                        }
                    });
                }
            }
        });
    }
});
function addToDatabase(classNmbr, topic){
    if (document.querySelector('#institution').value !== '' && document.querySelector('#term').value !== '' && document.querySelector('#subject').value !== '' && document.querySelector('#phone_num').value !== '' && document.querySelector('#carrier').value !== '') {
        fetch(`/add/${document.querySelector('#institution').value}/${document.querySelector('#term').value}/${document.querySelector('#subject').value}/${topic}/${classNmbr}/${document.querySelector('#phone_num').value}/${document.querySelector('#carrier').value}/`).then(() => {
            document.getElementById('confirmation').innerHTML = `Your class has been added. You will be notified shortly.`;
        });
    }
}

function getSpecificCourse(event){
    if (document.querySelector('#institution').value !== '' && document.querySelector('#term').value !== '' && document.querySelector('#subject').value !== '' && document.querySelector('#course_num').value !== '') {
        document.getElementById('loader').style.visibility = "visible";
        fetch(`/subjects/${document.querySelector('#institution').value}/${document.querySelector('#term').value}/${document.querySelector('#subject').value}/${document.querySelector('#course_num').value}/`).then(async (res) => {
            let classes = await res.json();
            document.getElementById('table').style.visibility = "visible";
            document.querySelectorAll("tbody tr").forEach(tr => tr.remove());
            for (let key in classes) {
                if (classes.hasOwnProperty(key)) {
                    document.getElementById('topic').innerHTML = `${Object.keys(classes)[0]}`;
                    for (let secKey in classes[key]) {
                        if (classes[key].hasOwnProperty(secKey)) {
                            let classNmbr = classes[key][secKey].Class;
                            let dayTime = classes[key][secKey]['Days & Time'];
                            let room = classes[key][secKey].Room;
                            let instructor = classes[key][secKey].Instructor;
                            let topic = classes[key][secKey].Topic;
                            document.getElementById("table_body").insertRow(-1).innerHTML = `<td class="classNmbr">${classNmbr}</td>` +
                                `<td>${dayTime}</td>` +
                                `<td>${room}</td>` +
                                `<td>${instructor}</td>` +
                                `<td><button type="button" class="submit_data" onclick='addToDatabase(${classNmbr}, ${topic})'>Submit</button></td>`;
                        }
                    }
                }
            }
            document.getElementById('loader').style.visibility = "hidden";
            document.getElementById('topic').scrollIntoView();
        });
    }
}

function getSubject(event) {
    document.getElementById('subject').options.length = 0;
    $('#subject').append('<option value="">Choose Subject...</option>');

    if (document.querySelector('#institution').value !== '' && document.querySelector('#term').value !== '') {
        document.getElementById('loader').style.visibility = "visible";
        fetch(`/subjects/${document.querySelector('#institution').value}/${document.querySelector('#term').value}`).then(async (res) => {
            let subject = await res.json();
            for(let key in subject){
                if(subject.hasOwnProperty(key)){
                    $('#subject').append($('<option>', {
                        value: subject[key],
                        text : key
                    }));
                }
            }
            document.getElementById('loader').style.visibility = "hidden";
        });
    }
}

/*
    function getInst(event) {
        fetch(`/subjects/`).then(async (res) => {
            let term = await res.json();
            for(let key in term){
                if(term.hasOwnProperty(key)){
                    $('#institution').append($('<option>', {
                        value: term[key],
                        text : key
                    }));
                }
            }
        });

    } //Only use for pulling Institutions

    function getTerm(event) {
        document.getElementById('term').options.length = 0;
        $('#term').append('<option value="">Choose Term...</option>');

        if (document.querySelector('#institution').value !== '') {
            fetch(`/subjects/${document.querySelector('#institution').value}/${document.querySelector('#term').value}/`).then(async (res) => {
                let term = await res.json();
                for(let key in term){
                    if(term.hasOwnProperty(key)){
                        $('#term').append($('<option>', {
                            value: term[key],
                            text : key
                        }));
                    }
                }
            });
        }
    }
*/
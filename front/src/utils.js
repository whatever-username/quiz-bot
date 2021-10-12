function create_UUID() {
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}
function getDefaultTestJSON(type){
    return {
        name:"Тест",
        type: (type==='quiz' ? 'quiz':'poll'),
        questions:[
            getDefaultQuestionJSON(type), getDefaultQuestionJSON(type)
        ]
    }
}
function getDefaultQuestionJSON(type) {
    let answers=[];
    if (type=='quiz'){
        answers=[
            {
                id: create_UUID(),
                text: '',
                correct: true
            },
            {
                id: create_UUID(),
                text: '',
                correct: false
            }
        ]
    }else {
        answers=[
            {
                id: create_UUID(),
                text: ''
            },
            {
                id: create_UUID(),
                text: ''
            }
        ]
    }
    return {
        id: create_UUID(),
        text: "",
        answerComment: "",
        time: 60,
        answers: answers
    };
}

function getDefaultAnswerJSON() {
    return {
        id: create_UUID(),
        text: "Текст ответа",
        correct: false
    };
}

function addTestIds(test) {
    test.questions.forEach(q => {
        q.id = create_UUID()
        q.answers.map(a => {
            a.id = create_UUID()
        })
    })
    return test;
}

function trimTestIds(test) {
    test.questions.map(q => {
        delete q.id;
        q.answers.map(a => {
            delete a.id;
        })
    })
    return test;
}
function randomIntFromInterval(min, max) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min)
}

export default {
    randomIntFromInterval,
    create_UUID,
    getDefaultQuestionJSON,
    getDefaultAnswerJSON,
    getDefaultTestJSON,
    trimTestIds,
    addTestIds
}
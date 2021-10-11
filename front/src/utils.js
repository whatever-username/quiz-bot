function create_UUID() {
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}
function getDefaultTestJSON(){
    return {
        name:"Тест",
        questions:[
            getDefaultQuestionJSON(), getDefaultQuestionJSON()
        ]
    }
}
function getDefaultQuestionJSON() {
    return {
        id: create_UUID(),
        text: "",
        answerComment: "",
        time: 60,
        answers: [
            {
                id: create_UUID(),
                text: '',
                correct: true
            },
            {
                id: create_UUID(),
                text: '',
                correct: true
            }
        ]
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

export default {
    create_UUID,
    getDefaultQuestionJSON,
    getDefaultAnswerJSON,
    getDefaultTestJSON,
    trimTestIds,
    addTestIds
}
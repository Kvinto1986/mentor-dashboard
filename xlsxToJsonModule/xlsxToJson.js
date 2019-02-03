const xlsx = require("xlsx");
const fs = require('fs');

function xlsxRead(xlsxPath) {
    const xlsxList = xlsx.readFile(xlsxPath);
    const sheet_name_list = xlsxList.SheetNames;
    return xlsx.utils.sheet_to_json(xlsxList.Sheets[sheet_name_list[0]])
}

function jsonConstructor() {
    const pairsPatch = "xlsxFiles/Mentor-students pairs.xlsx";
    const scorePatch = "xlsxFiles/Mentor score.xlsx";
    const tasksPatch = "xlsxFiles/Tasks.xlsx";

    const pairsArr = xlsxRead(pairsPatch);
    const scoreArr = xlsxRead(scorePatch);
    const tasksArr = xlsxRead(tasksPatch);

    const studentTasksArr = tasksArr.map(function (elem) {
        const elemToObj = {
            task: elem.task,
            taskLink: elem.link,
            status: elem.Status,
        };
        return elemToObj
    });


    const uniqueMentorsArr = [];
    for (let i = 0; i < pairsArr.length; i++) {
        if (!uniqueMentorsArr.includes(pairsArr[i].interviewer)) {
            uniqueMentorsArr.push(pairsArr[i].interviewer)
        }
    }

    const dashboardArr = uniqueMentorsArr.map(function (elem) {
        const elemToObj = {
            mentorName: elem
        };
        return elemToObj
    });

    for (let i = 0; i < dashboardArr.length; i++) {
        dashboardArr[i].students = [];
        for (let j = 0; j < pairsArr.length; j++) {
            if (dashboardArr[i].mentorName === pairsArr[j].interviewer) {
                dashboardArr[i].students.push(pairsArr[j]['student github'])
            }
        }
    }

    for (let i = 0; i < dashboardArr.length; i++) {
        for (let j = 0; j < scoreArr.length; j++) {
            if (dashboardArr[i].students.includes(
                scoreArr[j]['Ссылка на GitHub студента в формате: https://github.com/nickname'].substring(19).toLowerCase())
                && scoreArr[j]['Таск'] !== "RS Activist") {
                dashboardArr[i].mentorGitName = scoreArr[j]['Ссылка на GitHub ментора в формате: https://github.com/nickname'].substring(19).toLowerCase();
                dashboardArr[i].mentorGitLink = scoreArr[j]['Ссылка на GitHub ментора в формате: https://github.com/nickname']
                break
            }
        }
    }

    for (let i = 0; i < dashboardArr.length; i++) {
        dashboardArr[i].students = dashboardArr[i].students.map(function (elem) {
            const elemToObj = {
                studentName: elem,
                studentGit: "https://github.com/" + elem,
                studentTasks: []
            };
            return elemToObj
        })
    }


    for (let i = 0; i < dashboardArr.length; i++) {
        for (let j = 0; j < dashboardArr[i].students.length; j++) {
            const name = new RegExp(dashboardArr[i].students[j].studentName);
            for (let k = 0; k < scoreArr.length; k++) {
                const str = scoreArr[k]["Ссылка на GitHub студента в формате: https://github.com/nickname"].toLowerCase();
                let bool = name.test(str);
                if (bool === true) {
                    const markObj = {};
                    markObj.task = scoreArr[k]["Таск"];
                    markObj.mark = scoreArr[k]["Оценка"];
                    dashboardArr[i].students[j].studentTasks.push(markObj);
                }

            }

        }
    }

    dashboardArr.unshift(studentTasksArr)
    fs.writeFileSync('test.json', JSON.stringify(dashboardArr));

}

jsonConstructor();




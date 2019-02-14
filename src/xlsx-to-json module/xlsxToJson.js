const xlsx = require("xlsx");
const fs = require('fs');

(function jsonConstructor() {
    const pairsPatch = "src/xlsx-to-json module/xlsxFiles/Mentor-students pairs.xlsx";
    const mentorsInfoPatch = "src/xlsx-to-json module/xlsxFiles/Mentors info.xlsx";
    const scorePatch = "src/xlsx-to-json module/xlsxFiles/Mentor score.xlsx";
    const tasksPatch = "src/xlsx-to-json module/xlsxFiles/Tasks.xlsx";

    const mentorsInfoArr = xlsxRead(mentorsInfoPatch);
    const pairsArr = xlsxRead(pairsPatch);
    const scoreArr = xlsxRead(scorePatch);
    const tasksArr = xlsxRead(tasksPatch);

    function xlsxRead(xlsxPath) {
        const xlsxList = xlsx.readFile(xlsxPath);
        const sheet_name_list = xlsxList.SheetNames;
        return xlsx.utils.sheet_to_json(xlsxList.Sheets[sheet_name_list[0]])
    };


    const studentsTasksArr = tasksArr.map(function (elem) {
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
        for (let j = 0; j < mentorsInfoArr.length; j++) {
            if (dashboardArr[i].mentorName === mentorsInfoArr[j].Name + ' ' + mentorsInfoArr[j].Surname) {
                dashboardArr[i].mentorGitName = mentorsInfoArr[j].GitHub.substring(19);
                dashboardArr[i].mentorGitLink = mentorsInfoArr[j].GitHub;
            }
        }
    }

    for (let i = 0; i < dashboardArr.length; i++) {
        dashboardArr[i].students = [];
        for (let j = 0; j < pairsArr.length; j++) {
            if (dashboardArr[i].mentorName === pairsArr[j].interviewer) {
                dashboardArr[i].students.push(pairsArr[j]['student github'])
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
                    dashboardArr[i].students[j].studentTasks.push(scoreArr[k]["Таск"]);
                }
            }
        }
    }

    dashboardArr.unshift(studentsTasksArr);

    fs.writeFileSync('src/xlsx-to-json module/mentorsDashboard.json', JSON.stringify(dashboardArr));

})();




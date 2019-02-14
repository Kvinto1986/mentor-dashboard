import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import xlsx from './xlsx-to-json module/mentorsDashboard'
const assert = require('assert');

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<App/>, div);
    ReactDOM.unmountComponentAtNode(div);
});

it('json file correctness', () => {
    const findMentor = xlsx.filter(function (elem) {
        if (elem.mentorGitName === "DenisBun")
        return elem
    });
    assert.deepEqual(findMentor[0], {
        mentorName: "Dzianis Bunchanka",
        mentorGitName: "DenisBun",
        mentorGitLink: "https://github.com/DenisBun",
        students: [
            {
                studentName: "kvinto1986",
                studentGit: "https://github.com/kvinto1986",
                studentTasks: [
                    "Code Jam \"CV\"",
                    "Code Jam \"CoreJS\"",
                    "Markup #1",
                    "Code Jam \"DOM, DOM Events\"",
                    "YouTube",
                    "Presentation",
                    "Code Jam \"Scoreboard\""
                ]
            },
            {
                studentName: "maksimaliakhnovich",
                studentGit: "https://github.com/maksimaliakhnovich",
                studentTasks: [
                    "Markup #1",
                    "Code Jam \"CV\"",
                    "Code Jam \"CoreJS\"",
                    "Code Jam \"DOM, DOM Events\"",
                    "YouTube",
                    "Presentation",
                    "Code Jam \"Scoreboard\""
                ]
            },
            {
                studentName: "superorange",
                studentGit: "https://github.com/superorange",
                studentTasks: []
            },
            {
                studentName: "yauheni23",
                studentGit: "https://github.com/yauheni23",
                studentTasks: [
                    "Code Jam \"CV\"",
                    "Code Jam \"CoreJS\"",
                    "Markup #1",
                    "Code Jam \"DOM, DOM Events\"",
                    "YouTube"
                ]
            }
        ]
    });

});

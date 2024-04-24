import fs from 'fs';
import axios from 'axios';

async function getTopContributors(owner, repo) {
    const { data } = await axios.get(`https://api.github.com/repos/${owner}/${repo}/contributors`);
    return data.slice(0, 10).map(contributor => ({
        login: contributor.login,
        contributions: contributor.contributions
    }));
}

async function getCommits(owner, repo) {
    let page = 1;
    let commits = [];
    let hasNextPage = true;

    while (hasNextPage) {
        const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/commits?page=${page}&per_page=100`);
        commits = commits.concat(response.data);
        hasNextPage = response.headers.link && response.headers.link.includes('rel="next"');
        page++;
    }

    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const thisMonthCommits = commits.filter(commit => {
        const commitDate = new Date(commit.commit.author.date);
        return commitDate >= oneMonthAgo;
    });

    const contributors = {};

    thisMonthCommits.forEach(commit => {
        const authorLogin = commit.author ? commit.author.login : commit.commit.author.name;
        if (contributors[authorLogin]) {
            contributors[authorLogin]++;
        } else {
            contributors[authorLogin] = 1;
        }
    });

    const sortedContributors = Object.entries(contributors).sort((a, b) => b[1] - a[1]);

    return sortedContributors.slice(0, 10).map(([login, contributions]) => ({ login, contributions }));
}

async function updateReadme(repos) {
    for (const repo of repos) {
        const contributors = await getTopContributors(repo.owner, repo.name);
        contributors.unshift({ login: repo.name, contributions: 0 }); // Add repo to the top contributors
        const contributorsThisMonth = await getCommits(repo.owner, repo.name);
        console.log(contributors);
        console.log(contributorsThisMonth);
        const readme = fs.readFileSync('README.md', 'utf8');
        let updatedReadme = readme; // Declare and initialize the 'updatedReadme' variable
        const topContributorsSectionRegex = new RegExp(`## Top Contributors - ${repo.name}\\n\\n([^#]+)`);
        const thisMonthContributorsSectionRegex = new RegExp(`## This Month's Most Active Contributors - ${repo.name}\\n\\n([^#]+)`);

        updatedReadme = updatedReadme.replace(topContributorsSectionRegex, `## Top Contributors - ${repo.name}\n\n${contributors.map((contributor, index) => `${index + 1}. [${contributor.login}](https://github.com/${contributor.login}) - ${contributor.contributions} commits`).join('\n')}\n`);
        updatedReadme = updatedReadme.replace(thisMonthContributorsSectionRegex, `## This Month's Most Active Contributors - ${repo.name}\n\n${contributorsThisMonth.map((contributors, index) => `${index + 1}. [${contributors.login}](https://github.com/${contributors.login}) - ${contributors.contributions} commits`).join('\n')}\n`);

        fs.writeFileSync('README.md', updatedReadme);
    }
}

const repos = [
    { owner: 'AndrewGrizhenkov', name: 'copilot-metrics-viewer' },
    { owner: 'facebook', name: 'react' },
    // { owner: 'facebook', name: 'pandas-dev' }
];

updateReadme(repos);
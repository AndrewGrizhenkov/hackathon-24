import fs from 'fs';
import axios from 'axios';

async function getTopContributors(repo) {
    // Search for the repository
    const searchResponse = await axios.get(`https://api.github.com/search/repositories?q=${repo}`);
    if (searchResponse.data.items.length === 0) {
        throw new Error(`Repository ${repo} not found`);
    }

    // Get the owner from the first search result
    const owner = searchResponse.data.items[0].owner.login;

    // Get the contributors
    const { data } = await axios.get(`https://api.github.com/repos/${owner}/${repo}/contributors`);
    return data.slice(0, 10).map(contributor => ({
        login: contributor.login,
        contributions: contributor.contributions
    }));
}

async function getCommits(repo) {
    let page = 1;
    let commits = [];
    let hasNextPage = true;

    // Search for the repository
    const searchResponse = await axios.get(`https://api.github.com/search/repositories?q=${repo}`);
    if (searchResponse.data.items.length === 0) {
        throw new Error(`Repository ${repo} not found`);
    }

    // Get the owner from the first search result
    const owner = searchResponse.data.items[0].owner.login;


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

async function updateReadme(repo) {
    const contributors = await getTopContributors(repo);
    const contributorsThisMonth = await getCommits(repo);
    const readme = fs.readFileSync('README.md', 'utf8');
    let updatedReadme = readme.replace(/## Top Contributors\n\n([^#]+)/, `## Top Contributors\n\n${contributors.map(contributor => `1. [${contributor.login}](https://github.com/${contributor.login}) - ${contributor.contributions} commits`).join('\n')}\n`);
    updatedReadme = readme.replace(/## This Month's Most Active Contributors\n\n([^#]+)/, `## This Month's Most Active Contributors\n\n${contributorsThisMonth.map(contributor => `1. [${contributor.login}](https://github.com/${contributor.login}) - ${contributor.contributions} commits`).join('\n')}\n`);
    fs.writeFileSync('README.md', updatedReadme);
}

updateReadme( 'react-multi-select.git');
import requests
import sys
import os
import json
from datetime import datetime, timedelta


def get_most_active_contributors(owner_repo: dict):
    token = os.environ["YOUR_TOKEN"]
    headers = {
        "Accept": "application/vnd.github+json",
        "Authorization": f"Bearer {token}",
        "X-GitHub-Api-Version": "2022-11-28"
    }

    params = {
    }

    repo_contributors = dict()
    for owner, repo in owner_repo.items():
        url = f"https://api.github.com/repos/{owner}/{repo}/contributors"

        try:
            response = requests.get(url, headers=headers, params=params)
            response.raise_for_status()  # Raise an exception for 4xx or 5xx status codes
            repo_contributors[repo] = response.json()
        except requests.RequestException as e:
            return "Error sending HTTP request:" + str(e)
    return json.dumps(repo_contributors)


def get_most_active_repos(owner_repo: dict):
    token = os.environ["YOUR_TOKEN"]
    headers = {
        "Accept": "application/vnd.github+json",
        "Authorization": f"Bearer {token}",
        "X-GitHub-Api-Version": "2022-11-28"
    }

    repo_active_score = dict()
    for owner, repo in owner_repo.items():
        get_pr_url = f"https://api.github.com/repos/{owner}/{repo}/pulls"

        params = {
            "state": "open"
        }

        open_pr_number: int
        try:
            response = requests.get(get_pr_url, headers=headers, params=params)
            response.raise_for_status()  # Raise an exception for 4xx or 5xx status codes
            open_pr_number = len(response.json().get('items', []))
        except requests.RequestException as e:
            return "Error sending HTTP request:" + str(e)

        get_commit_url = f"https://api.github.com/repos/{owner}/{repo}/commits"

        one_month_ago = datetime.now() - timedelta(days=30)
        since = one_month_ago.strftime("%Y-%m-%dT%H:%M:%SZ")

        params = {
            "since": f"{since}"
        }

        commit_number_past_month: int
        try:
            response = requests.get(get_commit_url, headers=headers, params=params)
            response.raise_for_status()  # Raise an exception for 4xx or 5xx status codes
            commit_number_past_month = len(response.json().get('items', []))
        except requests.RequestException as e:
            return "Error sending HTTP request:" + str(e)

        repo_active_score[repo] = open_pr_number + commit_number_past_month

        return json.dumps(repo_active_score)


owners = sys.argv[1]
repos = sys.argv[2]

owner_repo = dict()

for i in range(len(owners)):
    owner_repo[owners[i]] = repos[i]

output = get_most_active_contributors(owner_repo)
output1 = get_most_active_repos(owner_repo)

output = "Some output"  # Replace "Some output" with the actual output you want to write

with open('README.md', 'w') as f:
    f.write(output)
    f.write(output1)

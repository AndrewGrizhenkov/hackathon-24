import requests
import sys
import os
import json
from datetime import datetime, timedelta

<<<<<<< HEAD
=======
data_folder_path = "data"


>>>>>>> refs/remotes/origin/main
def get_most_active_contributors(owner_repo: dict):
    file_name = "most_active_contributors.json"

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
<<<<<<< HEAD
            return "Error sending HTTP request:" + str(e)
    return repo_contributors
=======
            print("Error sending HTTP request:", e)

    # Write the JSON string to the file
    with open(os.path.join(data_folder_path, file_name), "w") as json_file:
        json_file.write(json.dumps(repo_contributors))
>>>>>>> refs/remotes/origin/main


def get_most_active_repos(owner_repo: dict):
    file_name = "most_active_repos.json"

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
            print("Error sending HTTP request:", e)

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
            print("Error sending HTTP request:", e)

        repo_active_score[repo] = open_pr_number + commit_number_past_month

<<<<<<< HEAD
    return repo_active_score
=======
    # Write the JSON string to the file
    with open(os.path.join(data_folder_path, file_name), "w") as json_file:
        json_file.write(json.dumps(repo_active_score))
>>>>>>> refs/remotes/origin/main


owners = sys.argv[1].split(",")
repos = sys.argv[2].split(",")

owner_repo = dict()

for i in range(len(owners)):
    owner_repo[owners[i]] = repos[i]

<<<<<<< HEAD
contributors = get_most_active_contributors(owner_repo)
active_repos = get_most_active_repos(owner_repo)

# Generate the top contributors list as a Markdown string
top_contributors_md = "\n".join(
    f"1. [{contributor['login']}](https://github.com/{contributor['login']}) - {contributor['contributions']} commits"
    for contributor in top_contributors
)

# Read the existing README
with open('README.md', 'r') as f:
    readme = f.read()

# Replace the Top Contributors section
updated_readme = re.sub(
    r'## Top Contributors\n\n([^#]+)',
    f'## Top Contributors\n\n{top_contributors_md}\n',
    readme
)

# Write the updated README
with open('README.md', 'w') as f:
    f.write(updated_readme)
=======
get_most_active_contributors(owner_repo)
get_most_active_repos(owner_repo)

# output = get_most_active_contributors(owner_repo)
# output1 = get_most_active_repos(owner_repo)

# output = "Some output"  # Replace "Some output" with the actual output you want to write
#
# with open('README.md', 'w') as f:
#     f.write(output)
#     f.write(output1)
>>>>>>> refs/remotes/origin/main

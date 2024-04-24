import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import RepoRow from "../RepoRow";

import repoData from "../../../data/most_active_repos.json";

function RepoTable({ reposData = [] }) {
  const repoList = Object.entries(repoData)
    .map((repoEntry) => {
      return {
        name: repoEntry[0],
        commits: repoEntry[1][1]["commit_last_month"],
        PRs: repoEntry[1][0]["open_pr"],
      };
    })
    .sort((a, b) => {
      return b.commits - a.commits;
    });

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Repo name</TableCell>
            <TableCell align="right"># of commits</TableCell>
            <TableCell align="right"># of PRs</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {repoList.map((row) => (
            <RepoRow row={row} key={row.name} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default RepoTable;

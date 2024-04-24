import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import RepoRow from "../RepoRow";

function RepoTable({ reposData = [] }) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Repo name</TableCell>
            <TableCell align="right">Stars</TableCell>
            <TableCell align="right"># of commits</TableCell>
            <TableCell align="right"># of PRs</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {reposData.map((row) => (
            <RepoRow row={row} key={row.name} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default RepoTable;

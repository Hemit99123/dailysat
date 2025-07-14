import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const HomePage: React.FC = () => {
  return (
    <div className="md:w-3/5 sm:w-4/5 w-[90%]  mx-auto">
      <Table className="w-full rounded-lg">
        <TableCaption id="leaderboard-caption">
          This is a list of the highest scores on DailySAT. Scores are
          determined by subtracting your incorrect from your correct answers.
        </TableCaption>
        <TableHeader className="rounded-lg">
          <TableRow className="bg-[#1E1F1F] hover:bg-[#1E1F1F] text-white">
            <TableHead className="text-white">Username</TableHead>
            <TableHead className="text-white">Score</TableHead>
            <TableHead className="text-white">League</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="max-w-[200px] overflow-hidden">
              Asgat
            </TableCell>
            <TableCell>Paid</TableCell>
            <TableCell>Credit Card</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default HomePage;

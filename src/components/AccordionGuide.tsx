// "use client";
import React from "react";
import {
  Container,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LinkIcon from "@mui/icons-material/Link";
// import { useUser } from "../contexts/UserContext";

function AccordionGuide() {
  // const { user } = useUser();
  // const [expanded, setExpanded] = useState(false);

  // useEffect(() => {
  //   setExpanded(!user.isConnected);
  // }, [user.isConnected]);
  return (
    <div>
      <Container maxWidth="sm" className="pt-20">
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography variant="h5" sx={{ fontSize: "h6.fontSize" }}>
              Guide to This Site
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <ul className="list-disc list-outside ml-4">
              <li className="mb-1">
                Users must connect their own wallets to participate (currently
                only supports CROSSMARK).
              </li>
              <li className="mb-1">Each vote consumes 1 XRP.</li>
              <li className="mb-1">
                To participate, you need to install the{" "}
                <a
                  href="https://crossmark.io/"
                  target="_blank"
                  className="text-blue-600 hover:underline"
                >
                  CROSSMARK
                </a>
                <LinkIcon /> browser extension and set up a wallet.
              </li>
              <li className="mb-1">
                Each voting period lasts for one week, starting from 0:00 UTC on
                Sunday.
              </li>
              <li className="mb-1">Voting closes at 23:50 UTC on Saturday.</li>
              <li className="mb-1">
                90% of the XRP accumulated in the owner's account during the
                week is distributed among the users who won (balance / number of
                winners).
              </li>
              <li className="mb-1">
                Each draw randomly selects ten 6-digit numbers as the winning
                numbers.
              </li>
              <li className="mb-1">
                Transactions matching the voting number within the period are
                filtered, and Check transactions are sent to the sender's
                address.
              </li>
              <li className="mb-1">
                Winners are requested to click the CLAIM button in Claim Checks
                to receive their prize (using XRPL's Check feature).
              </li>
              <li className="mb-1">
                The deadline for claiming checks is one year from the time of
                receipt.
              </li>
              <li className="mb-1">
                If there are no winners, the prize is carried over to the next
                week.
              </li>
            </ul>
          </AccordionDetails>
        </Accordion>
      </Container>
    </div>
  );
}

export default AccordionGuide;
